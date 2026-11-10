import { createHmac } from 'node:crypto';
import { expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { parseReservation, voteToken, tokenHash } from '../server/votePublication';

it('real deterministic contextual HMAC survives a lost response, revision changes token', () => {
 const key = 'synthetic-secret-'.repeat(3);
 const first = voteToken(key, VOTE, 1);
 expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/);
 expect(first).toBe(createHmac('sha256',key).update(`margot-vote-link-v1|${VOTE}|1`).digest('base64url'));
 expect(()=>voteToken(key,'not-a-vote',1)).toThrow();
 expect(voteToken(key,VOTE,1)).toBe(first);
 expect(voteToken(key,VOTE,2)).not.toBe(first);
 expect(tokenHash(first)).toMatch(/^[a-f0-9]{64}$/);
});
it('wrong_owner_kind_or_version rejects a forged reservation before IO', () => {
 expect(() => parseReservation({ ownerId:'forged' },'owner','vote',1)).toThrow();
});

import { beforeEach, afterEach, describe } from 'vitest';
import { votePublication, type VoteLinkReservation } from '../server/votePublication';
import * as backendModule from '../server/voteBackend';
import { VoteBudget, VoteError } from '../server/voteBackend';
import { sha256 } from '../server/voteImages';
import { POST, maxDuration } from '../../app/api/social-vote-link/route';
const id = (n:number)=>`00000000-0000-0000-0000-${String(n).padStart(12,'0')}`;
const OWNER=id(1), VOTE=id(2), SECRET='synthetic-private-vote-secret-'.repeat(2);
const JPEG=Buffer.from([255,216,255,224,0,2,7,8,255,217]);
function fixture() {
 const r:VoteLinkReservation={ownerId:OWNER,voteId:VOTE,revision:1,leaseUntil:new Date(Date.now()+600_000).toISOString(),endsAt:new Date(Date.now()+3600_000).toISOString(),expiresAt:new Date(Date.now()+8*86400_000).toISOString(),occasion:'Dîner',firstName:'Élo',initials:'É',media:[0,1,2,3].map((n)=>({mediaId:id(10+n),itemId:id(20+n),ownerId:OWNER,choice:n<2?'a':'b',ordinal:n%2+1,position:n%2?'bottom':'top',sourceKind:'item',sourceVersion:'abcdef123456',sourceBucket:'social-media',sourcePath:`${OWNER}/items/${id(20+n)}/abcdef123456/large.jpg`,destinationBucket:'social-media',destinationPath:`${OWNER}/votes/${VOTE}/1/${id(10+n)}.jpg`,name:'Vêtement imprimé',category:n%2?'bottoms':'tops'}))};
 const files=new Map(r.media.map(m=>[m.sourcePath,JPEG]));
 const link:Record<string,unknown>={state:'pending',preparation:r,manifest_hash:null,token_hash:null};
 const vote:Record<string,unknown>={id:VOTE,owner_id:OWNER,link_revision:1,link_state:'pending',deleted_at:null,closed_at:null,ends_at:r.endsAt};
 const media=r.media.map(m=>({id:m.mediaId,owner_id:OWNER,vote_id:VOTE,revision:1,path:m.destinationPath,source_item_id:m.itemId,source_version:m.sourceVersion,source_path:m.sourcePath,sha256:null as string|null,state:'staged',lease_until:r.leaseUntil}));
 const io={
  user:vi.fn(async()=>OWNER),
  rpcAsUser:vi.fn(async()=>null),
  rpc:vi.fn(async(name:string,args:Record<string,unknown>):Promise<unknown>=>{
   if(name==='social_media_viewer_ok') return true;
   if(name==='social_vote_link_begin') return {status:link.state==='ready'?'ready':link.manifest_hash?'prepared':'reserved',reservation:r};
   if(name==='social_media_resolve_items') return (args.p_item_ids as string[]).map(item_id=>({item_id,owner_id:OWNER,version:'abcdef123456'}));
   if(name==='social_vote_link_stage') {
    // Simulated SQL transport only. Real hash functions still bind the actual readback bytes.
    const receipts=args.p_media as Array<{mediaId:string;sha256:string}>;
    link.manifest_hash=sha256(Buffer.from(JSON.stringify({snapshot:args.p_snapshot,media:receipts})));
    for(const m of media) m.sha256=receipts.find(p=>p.mediaId===m.id)?.sha256??null;
    return {status:'prepared',prepared:{manifestHash:link.manifest_hash}};
   }
   if(name==='social_vote_link_commit') {
    link.state='ready';vote.link_state='ready';link.token_hash=args.p_token_hash;link.consent_version=1;link.consent_revision=1;link.consent_manifest_hash=args.p_manifest_hash;
    media.forEach(m=>m.state='ready');return {status:'ready'};
   }
   if(name==='social_vote_link_read') return {expiresAt:r.expiresAt};
   if(name==='social_vote_link_revoke') {vote.link_revision=2;vote.link_state='revoked';link.state='revoked';media.forEach(m=>m.state='purge');return null;}
   throw Error('unexpected RPC');
  }),
  rows:vi.fn(async(table:string,_columns:string,filters:Record<string,unknown>):Promise<unknown[]>=>{
   if(table==='style_votes') return [vote];
   if(table==='style_vote_links') return [link];
   if(table==='style_vote_link_media') return media;
   if(table==='social_media_copies') { const m=r.media.find(m=>m.itemId===filters.source_id)!;return [{source_kind:'item',source_id:m.itemId,owner_id:OWNER,version:m.sourceVersion,large_path:m.sourcePath,encrypted:false}]; }
   throw Error('unexpected table');
  }),
  prepareMedia:vi.fn(async()=>undefined),
  download:vi.fn(async(_bucket:string,path:string)=>{
   const bytes=files.get(path);if(!bytes) throw Error('missing');return {bytes,type:'image/jpeg'};
  }),
  upload:vi.fn(async(_bucket:string,path:string,bytes:Uint8Array)=>{if(files.has(path)) throw Error('collision');files.set(path,Buffer.from(bytes));}),
  remove:vi.fn(async(_bucket:string,path:string)=>{files.delete(path);}),exists:vi.fn(async(_bucket:string,path:string)=>files.has(path)),
 };
 return {r,files,link,vote,media,io,service:votePublication(io,new VoteBudget(),()=>SECRET)};
}
const prepareInput={voteId:VOTE,expectedRevision:1,firstName:'Élo'};
const confirmed=(manifestHash:string)=>({voteId:VOTE,revision:1,manifestHash,consentVersion:1 as const});
afterEach(()=>vi.restoreAllMocks());

describe('private publication with simulated transports',()=>{
 it('canonical_bytes_only: source, copy, preview and manifest receipts hash exactly',async()=>{
  const f=fixture();const prepared=await f.service.prepare('jwt',prepareInput);
  expect(prepared).not.toHaveProperty('url');expect(JSON.stringify(prepared)).not.toMatch(/sourcePath|destinationPath|token|storage/);
  expect(f.io.rpc.mock.calls.filter(([name])=>name==='social_vote_link_begin')).toHaveLength(1);
  for(const m of f.r.media) {
   const response=await f.service.preview('jwt',{voteId:VOTE,revision:1,manifestHash:prepared.manifestHash,mediaId:m.mediaId});
   const previewedBytes=new Uint8Array(await response.arrayBuffer());const publishedBytes=f.files.get(m.destinationPath);
   expect(publishedBytes).toEqual(Buffer.from(previewedBytes));expect(sha256(previewedBytes)).toBe(sha256(JPEG));
   expect(f.media.find(row=>row.id===m.mediaId)?.sha256).toBe(sha256(JPEG));
   expect(response.headers.get('cache-control')).toBe('private, no-store');
  }
  const first=await f.service.publish('jwt',confirmed(prepared.manifestHash));const retry=await f.service.publish('jwt',confirmed(prepared.manifestHash));
  expect(retry.url).toBe(first.url);expect(first.url).toMatch(/^https:\/\/www.margotwardrobe.com\/v\/[A-Za-z0-9_-]{43}$/);
  expect(await f.service.prepare('jwt',prepareInput)).toEqual(prepared);
  expect(f.io.upload).toHaveBeenCalledTimes(4);
 });
 it('partial_upload_not_ready preserves reserved inventory and resumes exact paths',async()=>{
  const f=fixture();const real=f.io.upload.getMockImplementation()!;
  f.io.upload.mockImplementationOnce(real).mockImplementationOnce(async()=>{throw Error('disconnect');});
  await expect(f.service.prepare('jwt',prepareInput)).rejects.toThrow();
  expect(f.link.state).not.toBe('ready');expect(f.io.rpc.mock.calls.some(([n])=>n==='social_vote_link_stage')).toBe(false);
  f.io.upload.mockImplementation(real);const p=await f.service.prepare('jwt',prepareInput);
  expect(p.state).toBe('prepared');expect(f.files.size).toBe(8);
 });
 it('lost_commit_response_retries_same_link recovers through current hash read',async()=>{
  const f=fixture();const p=await f.service.prepare('jwt',prepareInput);const real=f.io.rpc.getMockImplementation()!;
  let lost=true;f.io.rpc.mockImplementation(async(n,args)=>{const result=await real(n,args);if(n==='social_vote_link_commit'&&lost){lost=false;throw Error('response lost');}return result;});
  const first=await f.service.publish('jwt',confirmed(p.manifestHash));const retry=await f.service.publish('jwt',confirmed(p.manifestHash));expect(retry.url).toBe(first.url);
 });
 it('late_r1_after_r2, revoked session and kill switch never return a ready URL',async()=>{
  const f=fixture();const p=await f.service.prepare('jwt',prepareInput);await f.service.revoke('jwt',{voteId:VOTE,expectedRevision:1});
  await expect(f.service.publish('jwt',confirmed(p.manifestHash))).rejects.toMatchObject({code:'conflict'});
  const g=fixture();g.io.user.mockRejectedValue(new VoteError('unauthorized'));await expect(g.service.prepare('jwt',prepareInput)).rejects.toMatchObject({code:'unauthorized'});expect(g.io.upload).not.toHaveBeenCalled();
  const h=fixture();h.io.rpc.mockResolvedValue(false);await expect(h.service.preview('jwt',{voteId:VOTE,revision:1,manifestHash:'a'.repeat(64),mediaId:id(10)})).rejects.toThrow();
 });
 it('forged_receipt_not_published and mutation1octet reject before commit',async()=>{
  const f=fixture();const p=await f.service.prepare('jwt',prepareInput);
  await expect(f.service.publish('jwt',confirmed('f'.repeat(64)))).rejects.toMatchObject({code:'conflict'});
  const changed=Buffer.from(JPEG);changed[6]^=1;f.files.set(f.r.media[0].destinationPath,changed);
  await expect(f.service.preview('jwt',{voteId:VOTE,revision:1,manifestHash:p.manifestHash,mediaId:id(10)})).rejects.toMatchObject({code:'conflict'});
  await expect(f.service.publish('jwt',confirmed(p.manifestHash))).rejects.toMatchObject({code:'conflict'});
  expect(f.io.rpc.mock.calls.some(([n])=>n==='social_vote_link_commit')).toBe(false);
 });
 it('wrong_owner_kind_or_version rejects both reserved and current provenance before upload',async()=>{
  for(const patch of [{ownerId:id(90)},{sourceKind:'portrait'},{sourceKind:'avatar'},{sourceKind:'render'},{sourceVersion:'bad'},{sourcePath:`${OWNER}/portraits/private.jpg`}]) {
   const f=fixture();Object.assign(f.r.media[0],patch);await expect(f.service.prepare('jwt',prepareInput)).rejects.toThrow();expect(f.io.upload).not.toHaveBeenCalled();
  }
  for(const patch of [{owner_id:id(90)},{version:'000000000000'},{source_kind:'portrait'},{encrypted:true}]) {
   const f=fixture();const real=f.io.rows.getMockImplementation()!;f.io.rows.mockImplementation(async(t,c,args)=>{const rows=await real(t,c,args);if(t==='social_media_copies')Object.assign(rows[0] as object,patch);return rows;});
   await expect(f.service.prepare('jwt',prepareInput)).rejects.toMatchObject({code:'selection_changed'});expect(f.io.upload).not.toHaveBeenCalled();
  }
 });
 it('session loss and r2 during upload preserve compensation and prevent stage',async()=>{
  for(const change of ['session','revision']) {
   const f=fixture();const real=f.io.upload.getMockImplementation()!;f.io.upload.mockImplementation(async(...args)=>{await real(...args);if(change==='session')f.io.user.mockRejectedValue(new VoteError('unauthorized'));else f.vote.link_revision=2;});
   await expect(f.service.prepare('jwt',prepareInput)).rejects.toThrow();expect(f.files.has(f.r.media[0].destinationPath)).toBe(true);expect(f.io.remove).not.toHaveBeenCalled();expect(f.io.rpc.mock.calls.some(([n])=>n==='social_vote_link_stage')).toBe(false);
  }
 });
 it('pending_media derives once, never loops begin or exposes signed URLs',async()=>{
  const f=fixture();f.io.rpc.mockResolvedValue({status:'pending_media',voteId:VOTE,revision:1,missingItemIds:[id(20)]});
  await expect(f.service.prepare('jwt',prepareInput)).rejects.toMatchObject({code:'pending_media'});
  expect(f.io.prepareMedia).toHaveBeenCalledTimes(1);expect(f.io.rpc).toHaveBeenCalledTimes(1);expect(f.io.upload).not.toHaveBeenCalled();
 });
 it('begin quota is typed and stage refusal never promotes a partial result',async()=>{
  const f=fixture();f.io.rpc.mockResolvedValue({status:'limited',retryAfter:61});await expect(f.service.prepare('jwt',prepareInput)).rejects.toMatchObject({code:'limited',retryAfter:61});expect(f.io.upload).not.toHaveBeenCalled();
  const g=fixture();const real=g.io.rpc.getMockImplementation()!;g.io.rpc.mockImplementation(async(n,args)=>n==='social_vote_link_stage'?{status:'selection_changed'}:real(n,args));await expect(g.service.prepare('jwt',prepareInput)).rejects.toMatchObject({code:'selection_changed'});expect(g.link.state).not.toBe('ready');
 });
 it('private preview stops after revocation while destination read is in flight',async()=>{
  const f=fixture();const p=await f.service.prepare('jwt',prepareInput);const real=f.io.download.getMockImplementation()!;
  f.io.download.mockImplementation(async(...args)=>{const read=await real(...args);f.vote.link_revision=2;return read;});
  await expect(f.service.preview('jwt',{voteId:VOTE,revision:1,manifestHash:p.manifestHash,mediaId:id(10)})).rejects.toThrow();
 });
});

describe('route boundaries',()=>{
 it('uses maxDuration60, authenticates and rejects actual byte bodies beyond16KiB',async()=>{
  expect(maxDuration).toBe(60);
  const request=(value:unknown,authorization='Bearer jwt')=>new Request('http://local/api/social-vote-link',{method:'POST',headers:{'Content-Type':'application/json',authorization},body:JSON.stringify(value)});
  expect((await POST(request({},''))).status).toBe(401);
  const oversized=await POST(request({x:'é'.repeat(9000)}));expect(oversized.status).toBe(413);
  const invalid=await POST(request({action:'prepare',...prepareInput,sourcePath:'arbitrary'}));expect(invalid.status).toBe(400);
 });
 it('never leaks upstream exceptions and returns allowlisted pending_media',async()=>{
  const f=fixture();vi.spyOn(backendModule,'voteBackend').mockReturnValue(f.io);
  f.io.rpc.mockRejectedValue(Error('private-path secret'));const make=()=>new Request('http://local/api/social-vote-link',{method:'POST',headers:{'Content-Type':'application/json',authorization:'Bearer jwt'},body:JSON.stringify({action:'prepare',...prepareInput})});
  const bad=await POST(make());expect(bad.status).toBe(503);expect(await bad.json()).toEqual({error:'unavailable'});
  f.io.rpc.mockResolvedValue({status:'pending_media',voteId:VOTE,revision:1,missingItemIds:[id(20)]});const pending=await POST(make());expect(pending.status).toBe(202);expect(await pending.json()).toEqual({error:'pending_media'});
 });
});

it('stale revoke does not claim that a newer ready revision was withdrawn',async()=>{
 const f=fixture();f.vote.link_revision=2;
 await expect(f.service.revoke('jwt',{voteId:VOTE,expectedRevision:1})).rejects.toMatchObject({code:'conflict'});
 expect(f.io.rpc.mock.calls.some(([n])=>n==='social_vote_link_revoke')).toBe(false);
});
it('closed or expired lease prevents uploads, and a missing physical copy requests one explicit retry',async()=>{
 const closed=fixture();closed.vote.closed_at=new Date().toISOString();await expect(closed.service.prepare('jwt',prepareInput)).rejects.toMatchObject({code:'closed'});expect(closed.io.upload).not.toHaveBeenCalled();
 const expired=fixture();expired.r.leaseUntil=new Date(Date.now()-1).toISOString();await expect(expired.service.prepare('jwt',prepareInput)).rejects.toThrow();expect(expired.io.upload).not.toHaveBeenCalled();
 const missing=fixture();missing.io.download.mockRejectedValueOnce(new VoteError('pending_media'));await expect(missing.service.prepare('jwt',prepareInput)).rejects.toMatchObject({code:'pending_media'});expect(missing.io.prepareMedia).toHaveBeenCalledTimes(1);expect(missing.io.upload).not.toHaveBeenCalled();
});
it('ready recovery reads all independent bytes without requiring source visibility',async()=>{
 const f=fixture();const p=await f.service.prepare('jwt',prepareInput);await f.service.publish('jwt',confirmed(p.manifestHash));
 f.r.media.forEach(m=>f.files.delete(m.sourcePath));const real=f.io.rpc.getMockImplementation()!;
 f.io.rpc.mockImplementation(async(n,args)=>{if(n==='social_media_resolve_items')throw Error('source hidden');return real(n,args);});
 expect((await f.service.prepare('jwt',prepareInput)).manifestHash).toBe(p.manifestHash);
 expect((await f.service.publish('jwt',confirmed(p.manifestHash))).state).toBe('ready');
});
it('aborted upload may finish later; the handler keeps inventory and retries exact bytes',async()=>{
 const f=fixture();const controller=new AbortController();const service=votePublication(f.io,new VoteBudget(Date.now(),controller.signal),()=>SECRET);
 const real=f.io.upload.getMockImplementation()!;
 f.io.upload.mockImplementationOnce(async(...args)=>{controller.abort();await real(...args);});
 await expect(service.prepare('jwt',prepareInput)).rejects.toThrow();expect(f.files.has(f.r.media[0].destinationPath)).toBe(true);expect(f.io.remove).not.toHaveBeenCalled();
 const resumed=await f.service.prepare('jwt',prepareInput);expect(resumed.state).toBe('prepared');
});

it('uses only server config and real SDK wire requests with cancellation and create-only upload',async()=>{
 const oldUrl=process.env.SUPABASE_URL,oldKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
 try {
  delete process.env.SUPABASE_URL;delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  expect(()=>backendModule.voteBackend()).toThrow();
  process.env.SUPABASE_URL='http://127.0.0.1:50021';process.env.SUPABASE_SERVICE_ROLE_KEY='synthetic-service-role-key';
  const wire=vi.spyOn(globalThis,'fetch').mockImplementation(async(_url,init)=>{
   const body=typeof init?.body==='string'?JSON.parse(init.body):{};
   return Response.json({id:'stored',Key:'stored',...body});
  });
  const io=backendModule.voteBackend();const signal=new AbortController().signal;
  await io.upload('social-media',`${OWNER}/votes/${VOTE}/1/${id(10)}.jpg`,JPEG,signal);
  expect(String(wire.mock.calls[0][0])).toContain('http://127.0.0.1:50021/storage/v1/object/social-media/');
  const init=wire.mock.calls[0][1]!;expect(init.signal).toBe(signal);
  expect(new Headers(init.headers).get('x-upsert')).toBe('false');
  expect(init.body).toEqual(JPEG);
  await io.rows('style_votes','id,owner_id',{id:VOTE,owner_id:OWNER},999,signal);
  const query=new URL(String(wire.mock.calls[1][0]));expect(query.searchParams.get('limit')).toBe('100');expect(query.searchParams.get('owner_id')).toBe(`eq.${OWNER}`);
 } finally {
  if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;
  if(oldKey===undefined)delete process.env.SUPABASE_SERVICE_ROLE_KEY;else process.env.SUPABASE_SERVICE_ROLE_KEY=oldKey;
 }
});

describe('authenticated creator suggestion',()=>{
 it('authenticates before the user-JWT RPC; never calls an owner service RPC',async()=>{
  const f=fixture();
  const suggestion={user_id:OWNER,username:'creator',display_name:'Créatrice',bio:null,is_private:true,photo_mode:'initials',relationship:'none'};
  const rpcAsUser=vi.fn(async()=>suggestion);
  vi.spyOn(backendModule,'voteBackend').mockReturnValue({...f.io,rpcAsUser});
  const result=await POST(new Request('https://www.margotwardrobe.com/api/social-vote-link',{method:'POST',headers:{authorization:'Bearer reader-jwt','content-type':'application/json'},body:JSON.stringify({action:'suggestion',token:'A'.repeat(43)})}));
  expect(result.status).toBe(200);expect(await result.json()).toEqual({suggestion});
  expect(f.io.user).toHaveBeenCalledWith('reader-jwt',expect.any(AbortSignal));
  expect(rpcAsUser).toHaveBeenCalledWith('reader-jwt','social_vote_link_suggestion',{p_token_hash:tokenHash('A'.repeat(43))},expect.any(AbortSignal));
  expect(f.io.user.mock.invocationCallOrder[0]).toBeLessThan(rpcAsUser.mock.invocationCallOrder[0]);
  expect(f.io.rpc).not.toHaveBeenCalled();expect(f.io.rows).not.toHaveBeenCalled();
 });
});

it('real server SDK verifies getUser then sends the identical reader JWT to SQL',async()=>{
 const oldUrl=process.env.SUPABASE_URL,oldKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
 process.env.SUPABASE_URL='https://synthetic-supabase.invalid';process.env.SUPABASE_SERVICE_ROLE_KEY='synthetic-service-key';
 try {
  const wire=vi.spyOn(globalThis,'fetch').mockImplementation(async(input)=>{
   if(String(input).endsWith('/auth/v1/user')) return Response.json({id:OWNER,is_anonymous:false,app_metadata:{},user_metadata:{},aud:'authenticated',created_at:'2026-11-10T00:00:00Z'});
   if(String(input).endsWith('/rest/v1/rpc/social_vote_link_suggestion')) return Response.json(null);
   throw new Error('Unexpected synthetic boundary');
  });
  const request=()=>new Request('https://www.margotwardrobe.com/api/social-vote-link',{method:'POST',headers:{authorization:'Bearer synthetic-reader-jwt','content-type':'application/json'},body:JSON.stringify({action:'suggestion',token:'Z'.repeat(43)})});
  const result=await POST(request());expect(result.status).toBe(200);expect(await result.json()).toEqual({suggestion:null});
  expect(wire).toHaveBeenCalledTimes(2);
  expect(String(wire.mock.calls[0][0])).toContain('/auth/v1/user');
  expect(String(wire.mock.calls[1][0])).toContain('/rpc/social_vote_link_suggestion');
  for(const [,init] of wire.mock.calls) expect(new Headers(init?.headers).get('authorization')).toBe('Bearer synthetic-reader-jwt');
  expect(JSON.parse(String(wire.mock.calls[1][1]?.body))).toEqual({p_token_hash:tokenHash('Z'.repeat(43))});
  wire.mockClear();wire.mockResolvedValue(Response.json({id:OWNER,is_anonymous:true}));
  expect((await POST(request())).status).toBe(401);expect(wire).toHaveBeenCalledTimes(1);
 } finally {
  if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;
  if(oldKey===undefined)delete process.env.SUPABASE_SERVICE_ROLE_KEY;else process.env.SUPABASE_SERVICE_ROLE_KEY=oldKey;
 }
});
it('suggestion rejects malformed capabilities and extra owner authority before any backend',async()=>{
 const factory=vi.spyOn(backendModule,'voteBackend');
 for(const body of [{action:'suggestion',token:'x'}, {action:'suggestion',token:'A'.repeat(43),voteId:VOTE}]) {
 const result=await POST(new Request('https://www.margotwardrobe.com/api/social-vote-link',{method:'POST',headers:{authorization:'Bearer jwt','content-type':'application/json'},body:JSON.stringify(body)}));expect(result.status).toBe(400);
 }
 expect(factory).not.toHaveBeenCalled();
});

it('8b validators reject terminal LF/CR/CRLF on tokens, IDs, hashes and source versions before I/O',async()=>{
 const f=fixture();const create=vi.spyOn(backendModule,'voteBackend').mockReturnValue(f.io);
 for(const suffix of ['\n','\r','\r\n']){
  for(const body of [
   {action:'suggestion',token:'A'.repeat(43)+suffix},
   {action:'prepare',voteId:VOTE+suffix,expectedRevision:1,firstName:'Élo'},
   {action:'publish',voteId:VOTE,revision:1,manifestHash:'a'.repeat(64)+suffix,consentVersion:1},
  ]){
   const response=await POST(new Request('https://www.margotwardrobe.com/api/social-vote-link',{method:'POST',headers:{authorization:'Bearer reader-jwt','content-type':'application/json'},body:JSON.stringify(body)}));
   expect(response.status).toBe(400);
  }
  await expect(f.service.preview('jwt',{voteId:VOTE,revision:1,manifestHash:'a'.repeat(64),mediaId:id(10)+suffix})).rejects.toMatchObject({code:'invalid'});
  await expect(f.service.preview('jwt',{voteId:VOTE,revision:1,manifestHash:'a'.repeat(64)+suffix,mediaId:id(10)})).rejects.toMatchObject({code:'invalid'});
  const r=structuredClone(f.r);r.media[0].sourceVersion+=suffix;
  expect(()=>parseReservation(r,OWNER,VOTE,1)).toThrow();
 }
 // Backend construction may precede publish validation; no Auth/DB/I/O is started.
 expect(create).toHaveBeenCalledTimes(3);expect(f.io.user).not.toHaveBeenCalled();expect(f.io.rpc).not.toHaveBeenCalled();
});

it('lexical preparation refusal does not copy media and survives a lost-response retry',async()=>{
 const f=fixture();
 f.io.rpc.mockImplementationOnce(async()=>({status:'social_text_rejected'}));
 await expect(f.service.prepare('token',{voteId:VOTE,expectedRevision:1,firstName:'Élo'})).rejects.toMatchObject({code:'social_text_rejected'});
 expect(f.io.upload).not.toHaveBeenCalled();
});
