/** Opt-in isolated SQL-runner contract. Real RPCs/rows and SDK; Auth, Storage and PostgREST wire are substituted. */
import { execFile as execFileCallback, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { setTimeout as delay } from 'node:timers/promises';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
vi.mock('server-only',()=>({}));
import * as backend from '../server/voteBackend';
import { votePublication, VOTE_ORIGIN } from '../server/votePublication';
import { POST as prepareRoute } from '../../app/api/social-vote-link/route';
import { POST as deviceRoute } from '../../app/(vote)/v/[token]/device/route';
import { POST as ballotRoute } from '../../app/(vote)/v/[token]/ballot/route';
const execFile=promisify(execFileCallback), JPEG=Buffer.from([255,216,255,224,0,2,7,8,255,217]);
const SECRET='local-contract-signing-secret-'.repeat(2);
const literal=(v:unknown):string=>v===null?'NULL':typeof v==='number'||typeof v==='boolean'?String(v):`'${(typeof v==='object'?JSON.stringify(v):String(v)).replaceAll("'","''")}'${typeof v==='object'?'::jsonb':''}`;
let owner:string;
async function sql(statement:string,role='service_role'):Promise<string>{
 const {stdout}=await execFile('psql',['-X','-q','-At','-v','ON_ERROR_STOP=1','-c',`BEGIN; SET LOCAL statement_timeout='35s'; SET LOCAL application_name='vote_final_contract'; SET LOCAL request.jwt.claim.role=${literal(role)}; SET LOCAL request.jwt.claim.sub=${literal(owner??'')}; ${statement}; COMMIT;`]);
 return stdout.trim();
}
async function rpc(name:string,args:Record<string,unknown>):Promise<unknown>{
 const call=`${name}(${Object.entries(args).map(([k,v])=>`${k} => ${k==='p_item_ids'?`ARRAY[${(v as string[]).map(literal).join(',')}]::uuid[]`:literal(v)}`).join(',')})`;
 return JSON.parse(await sql(name==='social_media_resolve_items'?`SELECT coalesce(jsonb_agg(x),'[]') FROM ${call} x`:`SELECT coalesce(to_jsonb(${call}),'null'::jsonb)`));
}
async function fixture(){
 await sql('DELETE FROM social_vote_web_limits');
 const vote=JSON.parse(await sql(`SELECT social_create_vote(gen_random_uuid(),'Final contract',(SELECT options FROM social_vote_web_test_fixture),true)`,'authenticated')).id as string;
 const files=new Map<string,Buffer>();
 for(const row of JSON.parse(await sql(`SELECT jsonb_agg(jsonb_build_object('path',large_path)) FROM social_media_copies WHERE owner_id=${literal(owner)}`))) files.set(row.path,JPEG);
 const io:backend.VoteBackend={
  user:vi.fn(async()=>owner),rpcAsUser:vi.fn(async()=>null),rpc,
  rows:async(table,columns,filters,limit)=>JSON.parse(await sql(`SELECT coalesce(jsonb_agg(x),'[]') FROM (SELECT ${columns} FROM ${table} WHERE ${Object.entries(filters).map(([k,v])=>`${k}=${literal(v)}`).join(' AND ')} LIMIT ${limit}) x`)),
  download:vi.fn(async(_bucket,path)=>{const bytes=files.get(path);if(!bytes)throw new backend.VoteError('pending_media');return {bytes,type:'image/jpeg'};}),
  upload:vi.fn(async(_bucket,path,bytes)=>{expect(files.has(path)).toBe(false);files.set(path,Buffer.from(bytes));}),
  remove:vi.fn(async(_bucket,path)=>{files.delete(path);}),exists:vi.fn(async(_bucket,path)=>files.has(path)),prepareMedia:vi.fn(async()=>{throw Error('unexpected derivation');}),
 };
 const service=votePublication(io,new backend.VoteBudget(),()=>SECRET);
 const input={voteId:vote,expectedRevision:1,firstName:'Éva'};
 const prepared=await service.prepare('synthetic-jwt',input);
 const published=await service.publish('synthetic-jwt',{voteId:vote,revision:1,manifestHash:prepared.manifestHash,consentVersion:1});
 const token=published.url.split('/').at(-1)!;
 return {vote,io,service,input,prepared,published,token};
}
const request=(token:string,path:string,init:RequestInit={})=>new Request(`${VOTE_ORIGIN}/v/${token}/${path}`,{...init,headers:{origin:VOTE_ORIGIN,'x-vercel-forwarded-for':'192.0.2.183',...init.headers}});
function wireRpc(staleWindow?:'minute'|'day'|'month'){
 const errors:string[]=[];
 const wire=vi.spyOn(globalThis,'fetch').mockImplementation(async(url,init)=>{
  const name=new URL(String(url)).pathname.split('/').at(-1)!;
  expect(['social_vote_web_access','social_vote_web_cast']).toContain(name);
  const args=JSON.parse(String(init?.body));
  if(staleWindow) args.p_keys[staleWindow].bucket-=1;
  try {return Response.json(await rpc(name,args));}
  catch(error){
   const message=(error as {stderr:string}).stderr.match(/ERROR:\s+([^\n]+)/)?.[1];
   if(!message)throw error;
   errors.push(message);
   return Response.json({code:'P0001',message,details:null,hint:null},{status:400});
  }
 });
 return {wire,errors};
}
describe.skipIf(process.env.VOTE_SQL_CONTRACT!=='1')('isolated live SQL to server contracts',()=>{
 beforeAll(async()=>{
  expect(process.env.PGHOST).toBe('127.0.0.1');expect(process.env.PGDATABASE).toBe('social_vote_web');
  owner=await sql('SELECT owner_id FROM social_vote_web_test_fixture');
  // Existing fixture copies get the canonical path expected by the server parser.
  await sql(`UPDATE social_media_copies SET large_path=owner_id::text||'/items/'||source_id::text||'/'||version||'/large.jpg' WHERE source_kind='item'`);
 });
 afterEach(()=>{vi.restoreAllMocks();vi.unstubAllEnvs();});
 it.each(['explicit','natural'])('real ready RPC resumes through prepare HTTP after %s end',async(mode)=>{
  const f=await fixture();
  if(mode==='explicit')await sql(`SELECT social_close_vote(${literal(f.vote)})`,'authenticated');
  else await sql(`UPDATE style_votes SET created_at=clock_timestamp()-interval '2 days',ends_at=clock_timestamp()-interval '1 day' WHERE id=${literal(f.vote)}`);
  const before=await sql(`SELECT to_jsonb(l) FROM style_vote_links l WHERE vote_id=${literal(f.vote)} AND revision=1`);
  const create=vi.spyOn(backend,'voteBackend').mockReturnValue(f.io);
  const result=await prepareRoute(new Request(`${VOTE_ORIGIN}/api/social-vote-link`,{method:'POST',headers:{authorization:'Bearer synthetic-jwt','content-type':'application/json'},body:JSON.stringify({action:'prepare',...f.input})}));
  expect(result.status).toBe(200);expect(await result.json()).toEqual(f.prepared);expect(create).toHaveBeenCalled();
  expect(f.io.upload).toHaveBeenCalledTimes(4);
  expect(await sql(`SELECT to_jsonb(l) FROM style_vote_links l WHERE vote_id=${literal(f.vote)} AND revision=1`)).toBe(before);
  const current=await f.service.publish('synthetic-jwt',{voteId:f.vote,revision:1,manifestHash:f.prepared.manifestHash,consentVersion:1});
  expect(current.url).toBe(f.published.url);
  expect(Date.parse(current.expiresAt)).toBeLessThanOrEqual(Date.parse(f.published.expiresAt));
  await sql(`DELETE FROM style_votes WHERE id=${literal(f.vote)}`);
 });
 it('stale minute/day/month RPC errors propagate through actual SDK to retryable HTTP503 with no counters',async()=>{
  const f=await fixture(),context={params:Promise.resolve({token:f.token})};
  vi.stubEnv('VERCEL','1');vi.stubEnv('SOCIAL_VOTE_COOKIE_SECRET',SECRET);vi.stubEnv('SOCIAL_VOTE_IP_SECRET',SECRET);
  const create=vi.spyOn(backend,'voteBackend').mockReturnValue(f.io);
  const first=await deviceRoute(request(f.token,'device',{method:'POST'}),context);
  expect(first.status).toBe(200);const cookie=first.headers.get('set-cookie')!.split(';')[0];
  create.mockRestore();
  vi.stubEnv('SUPABASE_URL','http://127.0.0.1:50021');vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','synthetic-local-key');
  for(const window of ['minute','day','month'] as const){
   await sql('DELETE FROM social_vote_web_limits');
   const {wire,errors}=wireRpc(window);
   try{
    const device=await deviceRoute(request(f.token,'device',{method:'POST'}),context);
    expect(device.status).toBe(503);expect(await device.json()).toEqual({error:'service_unavailable'});
    const ballot=await ballotRoute(request(f.token,'ballot',{method:'POST',headers:{cookie,'content-type':'application/json'},body:JSON.stringify({choice:'a'})}),context);
    expect(ballot.status).toBe(503);expect(await ballot.json()).toEqual({error:'service_unavailable'});
    expect(errors).toEqual(['social_invalid_input','social_invalid_input']);
    expect(await sql('SELECT count(*) FROM social_vote_web_limits')).toBe('0');
    expect(await sql(`SELECT count(*) FROM style_vote_ballots WHERE vote_id=${literal(f.vote)}`)).toBe('0');
   }finally{wire.mockRestore();}
  }
  const {wire}=wireRpc();
  try{
   const invalid=await ballotRoute(request(f.token,'ballot',{method:'POST',headers:{cookie,'content-type':'application/json'},body:JSON.stringify({choice:'bad'})}),context);
   expect(invalid.status).toBe(400);
   expect((await deviceRoute(request('Z'.repeat(43),'device',{method:'POST'}),{params:Promise.resolve({token:'Z'.repeat(43)})})).status).toBe(404);
   await sql(`SELECT social_vote_link_revoke(${literal(owner)},${literal(f.vote)},1)`);
   expect((await deviceRoute(request(f.token,'device',{method:'POST'}),context)).status).toBe(404);
  }finally{wire.mockRestore();await sql(`DELETE FROM style_votes WHERE id=${literal(f.vote)}`);}
 });
 it('a real minute rollover while waiting on a quota lock raises the same error before writes',async()=>{
  const f=await fixture();vi.stubEnv('VERCEL','1');vi.stubEnv('SOCIAL_VOTE_COOKIE_SECRET',SECRET);vi.stubEnv('SOCIAL_VOTE_IP_SECRET',SECRET);
  vi.stubEnv('SUPABASE_URL','http://127.0.0.1:50021');vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','synthetic-local-key');
  await sql('DELETE FROM social_vote_web_limits');
  // Start in the last 5s so the real RPC stays within its existing 10s budget.
  await delay((55_000-Date.now()%60_000+60_000)%60_000);
  const {wire,errors}=wireRpc();
  const holder=spawn('psql',['-X','-q','-At','-v','ON_ERROR_STOP=1'],{env:process.env});
  let holderOutput='';const holderReady=new Promise<void>((resolve,reject)=>{holder.stdout.on('data',chunk=>{holderOutput+=String(chunk);if(holderOutput.includes('holder-ready'))resolve();});holder.once('error',reject);holder.once('exit',code=>{if(code)reject(Error('holder failed'));});});
  // The exact key is observed from the route's real request, then its first SQL call is held.
  const realFetch=wire.getMockImplementation()!;
  let lockedResolve:()=>void;const locked=new Promise<void>(resolve=>{lockedResolve=resolve;});
  wire.mockImplementation(async(url,init)=>{
   const args=JSON.parse(String(init?.body));const hash=args.p_keys.minute.hash;
   holder.stdin.write(`SELECT pg_advisory_lock(hashtext('social_vote_web_limit'),hashtext('cast:ip:minute:'||${literal(hash)})); SELECT 'holder-ready';\n`);
   await holderReady;lockedResolve();return realFetch(url,init);
  });
  try{
   const result=deviceRoute(request(f.token,'device',{method:'POST'}),{params:Promise.resolve({token:f.token})});await locked;
   let waiting=false;
   for(let n=0;n<50;n++){
    waiting=await sql("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE application_name='vote_final_contract' AND wait_event_type='Lock')")==='t';
    if(waiting)break;await delay(20);
   }
   expect(waiting).toBe(true);
   await delay(60_000-Date.now()%60_000+100);
   holder.stdin.end("SELECT pg_advisory_unlock_all();\n\\q\n");
   const response=await result;expect(response.status).toBe(503);expect(errors).toEqual(['social_invalid_input']);
   expect(await sql('SELECT count(*) FROM social_vote_web_limits')).toBe('0');
  }finally{holder.stdin.destroy();holder.kill();wire.mockRestore();await sql(`DELETE FROM style_votes WHERE id=${literal(f.vote)}`);}
 },90_000);
});
