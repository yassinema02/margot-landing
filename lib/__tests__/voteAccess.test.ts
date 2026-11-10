import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('server-only',()=>({}));
import { readPublicVote, voteAccess } from '../server/voteAccess';
import { VoteBudget, VoteError, type VoteBackend } from '../server/voteBackend';
import { sha256 } from '../server/voteImages';
import { tokenHash, VOTE_ORIGIN } from '../server/votePublication';
const TOKEN='A'.repeat(43),COOKIE='__Secure-margot_vote_device',KEY='synthetic-cookie-secret-'.repeat(2),IPKEY='synthetic-ip-secret-'.repeat(2);
const id=(n:number)=>`00000000-0000-0000-0000-${String(n).padStart(12,'0')}`;
const NOW=Date.parse('2026-11-10T12:34:56Z'),OWNER=id(1),VOTE=id(2),MEDIA=id(10);
const JPEG=Buffer.from([255,216,255,224,0,2,7,8,255,217]);
function req(path='',init:RequestInit={}):Request {
 return new Request(`${VOTE_ORIGIN}/v/${TOKEN}${path}`,{...init,headers:{'x-vercel-forwarded-for':'192.0.2.20',origin:VOTE_ORIGIN,...init.headers}});
}
function snapshot() {return {version:1,occasion:'Dîner',firstName:'Élo',initials:'É',endsAt:new Date(NOW+86400000).toISOString(),expiresAt:new Date(NOW+8*86400000).toISOString(),closed:false,options:['a','b'].map((choice,n)=>({choice,pieces:[0,1].map(m=>({media_id:id(10+2*n+m),name:'Chemise',category:'tops'}))}))};}
function fixture() {
 const s=snapshot();const row:{status:string;snapshot:unknown;my_choice:unknown}={status:'ok',snapshot:s,my_choice:null};
 const link={vote_id:VOTE,revision:1,state:'ready',token_hash:tokenHash(TOKEN)};
 const media={id:MEDIA,owner_id:OWNER,vote_id:VOTE,revision:1,path:`${OWNER}/votes/${VOTE}/1/${MEDIA}.jpg`,sha256:sha256(JPEG),state:'ready'};
 const io={rpc:vi.fn(async(name:string,_args:Record<string,unknown>):Promise<unknown>=>name==='social_vote_web_access'?row:name==='social_vote_link_read'?s:{status:'ok',choice:'b',closed:false}),rows:vi.fn(async(table:string,_columns:string,_filters:Record<string,unknown>,_limit:number):Promise<unknown[]>=>table==='style_vote_links'?[link]:[media]),download:vi.fn(async()=>({bytes:JPEG,type:'image/jpeg'})),user:vi.fn(),rpcAsUser:vi.fn(),prepareMedia:vi.fn(),upload:vi.fn(),remove:vi.fn(),exists:vi.fn()};
 return {s,row,link,media,io,service:voteAccess(io as VoteBackend,new VoteBudget(NOW,undefined,()=>NOW))};
}
async function device(f:ReturnType<typeof fixture>) {
 const first=await f.service.device(TOKEN,req('/device',{method:'POST'}));
 expect(first.status).toBe(200);return first.headers.get('set-cookie')!.split(';')[0];
}
const json=(cookie:string,body:unknown={choice:'b'})=>req('/ballot',{method:'POST',headers:{cookie,'content-type':'application/json'},body:JSON.stringify(body)});
beforeEach(()=>{
 vi.stubEnv('SOCIAL_VOTE_COOKIE_SECRET',KEY);vi.stubEnv('SOCIAL_VOTE_IP_SECRET',IPKEY);
 // Private local harness: simulate the trusted Vercel boundary with a reserved
 // documentation IP. There is no product switch for accepting local XFF.
 vi.stubEnv('VERCEL','1');
});
afterEach(()=>{vi.unstubAllEnvs();vi.restoreAllMocks();vi.useRealTimers();});
it('malformed_token_no_db including trailing newline and 42/44 chars',async()=>{
 const f=fixture();for(const t of ['bad','A'.repeat(42),'A'.repeat(44),TOKEN+'\n','.'.repeat(43)]) {
  expect(await f.service.read(t,req())).toEqual({status:'unavailable'});
  expect((await f.service.device(t,req('/device',{method:'POST'}))).status).toBe(404);
  expect(await readPublicVote(t,req())).toEqual({status:'unavailable'});
 }
 expect(f.io.rpc).not.toHaveBeenCalled();
});
it('same_device_retry_and_cookie_denial requires roundtrip and preserves exact device HMAC',async()=>{
 const f=fixture();const blockedCookie=await f.service.cast(TOKEN,json(''));
 expect(blockedCookie.status).toBe(409);expect(await blockedCookie.json()).toEqual({error:'cookie_required'});expect(blockedCookie.headers.has('set-cookie')).toBe(false);expect(f.io.rpc).not.toHaveBeenCalled();
 const cookie=await device(f);
 const confirmed=await f.service.device(TOKEN,req('/device',{method:'POST',headers:{cookie}}));
 expect(await confirmed.json()).toEqual({status:'ok',confirmed:true});expect(confirmed.headers.has('set-cookie')).toBe(false);
 for(let n=0;n<2;n++)expect((await f.service.cast(TOKEN,json(cookie))).status).toBe(200);
 const casts=f.io.rpc.mock.calls.filter(([name])=>name==='social_vote_web_cast');expect(casts).toHaveLength(2);
 const nonce=cookie.split('=')[1].split('.')[0];const expected=createHmac('sha256',KEY).update(`margot-vote-device-v1|${nonce}`).digest('hex');
 expect(casts[0][1].p_device_hash).toBe(expected);expect(casts[1][1].p_device_hash).toBe(expected);
 expect(f.io.rpc.mock.calls.filter(([name,args])=>name==='social_vote_web_access'&&args.p_action==='cast')).toHaveLength(2);
 expect(JSON.stringify(casts)).not.toContain(nonce);expect(JSON.stringify(casts)).not.toContain('192.0.2.20');
});
it('cookie attributes remain production secure and server reads never set a cookie',async()=>{
 const f=fixture();const response=await f.service.device(TOKEN,req('/device',{method:'POST'}));
 expect(response.headers.get('set-cookie')).toMatch(/^__Secure-margot_vote_device=[A-Za-z0-9_-]{43}\.[a-f0-9]{64}; HttpOnly; Secure; SameSite=Lax; Path=\/v; Max-Age=691200$/);
 expect(await response.json()).toEqual({status:'ok',confirmed:false});
 const read=await f.service.read(TOKEN,req());expect(read.status).toBe('ok');expect(read).not.toHaveProperty('set-cookie');
});
it('forged_cookie_and_origin denies forged ballot and only device replaces it',async()=>{
 const f=fixture(),good=await device(f),forged=good.slice(0,-1)+(good.endsWith('a')?'b':'a');
 expect((await f.service.cast(TOKEN,json(forged))).status).toBe(409);
 const replacement=await f.service.device(TOKEN,req('/device',{method:'POST',headers:{cookie:forged}}));
 expect(replacement.headers.get('set-cookie')).not.toBeNull();expect(await replacement.json()).toEqual({status:'ok',confirmed:false});
 for(const origin of ['https://evil.example','null','https://www.margotwardrobe.com.evil.example','']) {
  expect((await f.service.cast(TOKEN,req('/ballot',{method:'POST',headers:{origin,cookie:good}}))).status).toBe(403);
  expect((await f.service.device(TOKEN,req('/device',{method:'POST',headers:{origin}}))).status).toBe(403);
 }
 expect(f.io.rpc.mock.calls.filter(([n])=>n==='social_vote_web_cast')).toHaveLength(0);
});
it('duplicate and malformed cookie identities are not trusted',async()=>{
 const f=fixture(),cookie=await device(f);
 for(const value of [cookie+'; '+cookie,`${COOKIE}=bad`,`${COOKIE}=${'A'.repeat(43)}.${'0'.repeat(64)}`])expect((await f.service.cast(TOKEN,json(value))).status).toBe(409);
});
it('own choice adapter projects only documentary snapshot, no private fields',async()=>{
 const f=fixture();f.row.my_choice='b';Object.assign(f.s,{ownerId:OWNER,counts:{a:900},guest_name:'Secret'});Object.assign(f.s.options[0].pieces[0],{path:'private/path',sha256:'secret'});
 const ownResult=await f.service.read(TOKEN,req());expect(ownResult.status).toBe('ok');if(ownResult.status!=='ok')throw Error('expected ok');
 expect(ownResult.myChoice).toBe('b');expect(ownResult.snapshot.options[0].pieces[0].imageUrl).toBe(`${VOTE_ORIGIN}/v/${TOKEN}/media/${MEDIA}`);
 expect(JSON.stringify(ownResult)).not.toMatch(/ownerId|counts|guest_name|private\/path|sha256|media_id/);
});
it('limited exact union, absent/revoked indifference and closed readable until exact expiry',async()=>{
 const f=fixture();Object.assign(f.row,{status:'limited',retryAfter:60});
 expect(await f.service.read(TOKEN,req())).toEqual({status:'limited',retryAfter:60});
 const limited=await f.service.device(TOKEN,req('/device',{method:'POST'}));expect(limited.status).toBe(429);expect(limited.headers.get('retry-after')).toBe('60');
 for(const status of ['invalid','unavailable']) {f.row.status=status;expect(await f.service.read(TOKEN,req())).toEqual({status:'unavailable'});}
 f.row.status='ok';f.s.closed=true;expect((await f.service.read(TOKEN,req())).status).toBe('ok');
 f.s.expiresAt=new Date(NOW).toISOString();expect(await f.service.read(TOKEN,req())).toEqual({status:'unavailable'});
});
it('quota_backend_down fails503 without any8a fallback or new cookie',async()=>{
 const f=fixture();f.io.rpc.mockRejectedValue(Error('upstream bearer secret'));
 expect(await f.service.read(TOKEN,req())).toEqual({status:'service_unavailable'});
 const quotaFailure=await f.service.device(TOKEN,req('/device',{method:'POST'}));expect(quotaFailure.status).toBe(503);expect(await quotaFailure.json()).toEqual({error:'service_unavailable'});expect(quotaFailure.headers.has('set-cookie')).toBe(false);
 expect(f.io.rpc.mock.calls.every(([n])=>n==='social_vote_web_access')).toBe(true);
});
it('invalid DTO, missing own choice and broken configuration stay503',async()=>{
 for(const patch of [{status:'limited',retryAfter:0},{status:'limited',retryAfter:1.5},{status:'mystery'},{status:'ok',my_choice:undefined},{status:'ok',my_choice:'c'},{status:'ok',snapshot:{version:1}}]) {
  const f=fixture();Object.assign(f.row,patch);expect(await f.service.read(TOKEN,req())).toEqual({status:'service_unavailable'});
 }
 const f=fixture();vi.stubEnv('SOCIAL_VOTE_COOKIE_SECRET','short');expect(await f.service.read(TOKEN,req())).toEqual({status:'service_unavailable'});expect(f.io.rpc).not.toHaveBeenCalled();
});
it('proxy refuses unknown/multiple/untrusted IP and arbitrary XFF',async()=>{
 const f=fixture();for(const ip of ['', 'unknown','192.0.2.1, 192.0.2.2','192.0.2.1:443','2001:db8::1%zone'])expect(await f.service.read(TOKEN,req('',{headers:{'x-vercel-forwarded-for':ip,'x-forwarded-for':'192.0.2.20'}}))).toEqual({status:'service_unavailable'});
 vi.stubEnv('VERCEL','');expect(await f.service.read(TOKEN,req())).toEqual({status:'service_unavailable'});expect(f.io.rpc).not.toHaveBeenCalled();
});
it('IP HMAC binds UTC minute/day/month and normalizes IPv6 aliases',async()=>{
 const f=fixture();await f.service.read(TOKEN,req());
 const keys=f.io.rpc.mock.calls[0][1].p_keys as Record<string,{bucket:number;hash:string}>;
 const buckets={minute:Math.floor(NOW/60000)*60,day:Date.parse('2026-11-10T00:00:00Z')/1000,month:Date.parse('2026-11-01T00:00:00Z')/1000};
 for(const [w,bucket] of Object.entries(buckets))expect(keys[w]).toEqual({bucket,hash:createHmac('sha256',IPKEY).update(`margot-vote-ip-v1|${w}|${bucket}|192.0.2.20`).digest('hex')});
 await f.service.read(TOKEN,req('',{headers:{'x-vercel-forwarded-for':'::ffff:192.0.2.20'}}));expect(f.io.rpc.mock.calls[1][1].p_keys).toEqual(keys);
 await f.service.read(TOKEN,req('',{headers:{'x-vercel-forwarded-for':'2001:db8::1'}}));await f.service.read(TOKEN,req('',{headers:{'x-vercel-forwarded-for':'2001:0db8:0:0:0:0:0:1'}}));expect(f.io.rpc.mock.calls[2][1].p_keys).toEqual(f.io.rpc.mock.calls[3][1].p_keys);
});
it('body counts actual UTF8 bytes, ignores Content-Length and enforces2048',async()=>{
 const f=fixture(),cookie=await device(f);
 const request=req('/ballot',{method:'POST',headers:{cookie,'content-type':'application/json','content-length':'1'},body:JSON.stringify({choice:'b',reason:'é'.repeat(1100)})});
 expect((await f.service.cast(TOKEN,request)).status).toBe(413);
 const exact=JSON.stringify({choice:'b'})+' '.repeat(2048-JSON.stringify({choice:'b'}).length);expect((await f.service.cast(TOKEN,req('/ballot',{method:'POST',headers:{cookie,'content-type':'application/json'},body:exact}))).status).toBe(200);
 for(const body of ['{','[]','null'])expect((await f.service.cast(TOKEN,req('/ballot',{method:'POST',headers:{cookie,'content-type':'application/json'},body}))).status).toBe(400);
 expect((await f.service.cast(TOKEN,json(cookie,{choice:'b',ownerId:OWNER}))).status).toBe(400);
});
it('ballot errors and successful payload remain precise and allowlisted',async()=>{
 const f=fixture(),cookie=await device(f);const real=f.io.rpc.getMockImplementation()!;
 for(const [status,code] of [['closed',409],['invalid',400],['unavailable',404],['limited',429],['unexpected',503]] as const) {
  f.io.rpc.mockImplementation(async(n,args)=>n==='social_vote_web_cast'?{status,retryAfter:60}:real(n,args));const res=await f.service.cast(TOKEN,json(cookie));expect(res.status).toBe(code);expect(res.headers.get('cache-control')).toContain('no-store');
 }
 f.io.rpc.mockImplementation(real);const res=await f.service.cast(TOKEN,json(cookie,{choice:'b',firstName:'Élo',reason:'Une coupe simple'}));expect(await res.json()).toEqual({status:'ok',choice:'b',closed:false});
 expect(f.io.rpc.mock.calls.at(-1)![1]).toMatchObject({p_first_name:'Élo',p_reason:'Une coupe simple'});
});
it('expired_media_and_og uses same read denial, no bytes after revoke or exact expiration',async()=>{
 for(const kind of ['revoked','expired','removed-media']) {
  const f=fixture();const real=f.io.rpc.getMockImplementation()!;
  f.io.rpc.mockImplementation(async(n,args)=>{
   if(n!=='social_vote_link_read')return real(n,args);
   if(kind==='revoked')return null;
   if(kind==='expired')return {...f.s,expiresAt:new Date(NOW).toISOString()};
   return {...f.s,options:f.s.options.map(o=>({...o,pieces:o.pieces.map(p=>({...p,media_id:id(Number(p.media_id.slice(-2))+50)}))}))};
  });
  const expiredImage=await f.service.media(TOKEN,MEDIA,req('/media/'+MEDIA));expect(expiredImage.status).toBe(404);expect(expiredImage.headers.get('content-type')).toContain('application/json');expect(f.io.download).toHaveBeenCalledTimes(1);
 }
});
it('media inventory and SHA exact; final authority after download; no URL/private fallback',async()=>{
 const f=fixture();const res=await f.service.media(TOKEN,MEDIA,req());expect(res.status).toBe(200);expect(Buffer.from(await res.arrayBuffer())).toEqual(JPEG);
 expect(res.headers.get('cache-control')).toContain('no-store');expect(res.headers.get('referrer-policy')).toBe('no-referrer');expect(res.headers.get('x-robots-tag')).toBe('noindex, nofollow');expect(res.headers.get('content-length')).toBe(String(JPEG.length));
 expect(f.io.rows.mock.calls[0]).toEqual(['style_vote_links','vote_id,revision,state,token_hash',{token_hash:tokenHash(TOKEN),state:'ready'},1,expect.any(AbortSignal)]);
 expect(f.io.download.mock.invocationCallOrder[0]).toBeLessThan(f.io.rpc.mock.invocationCallOrder.at(-1)!);
 expect(f.io.download.mock.calls[0]).toEqual(['social-media',f.media.path,expect.any(AbortSignal)]);
});
it('unknown media and forged path do not download, mutated/missing JPEG returns404',async()=>{
 const f=fixture();expect((await f.service.media(TOKEN,id(99),req())).status).toBe(404);expect(f.io.rows).not.toHaveBeenCalled();
 f.media.path='https://evil.example/private.jpg';expect((await f.service.media(TOKEN,MEDIA,req())).status).toBe(503);expect(f.io.download).not.toHaveBeenCalled();
 for(const kind of ['hash','mime','missing','oversize']) {
  const g=fixture();if(kind==='missing')g.io.download.mockRejectedValue(new VoteError('pending_media'));
  else if(kind==='mime')g.io.download.mockResolvedValue({bytes:JPEG,type:'text/plain'});
  else if(kind==='oversize')g.io.download.mockResolvedValue({bytes:Buffer.alloc(5242881),type:'image/jpeg'});
  else {const bytes=Buffer.from(JPEG);bytes[6]^=1;g.io.download.mockResolvedValue({bytes,type:'image/jpeg'});}
  expect((await g.service.media(TOKEN,MEDIA,req())).status).toBe(404);
 }
});
it('no quota or I/O gets a fresh50s budget after slow earlier operations',async()=>{
 let now=NOW;const f=fixture();const service=voteAccess(f.io as VoteBackend,new VoteBudget(NOW,undefined,()=>now));
 f.io.download.mockImplementation(async()=>{now=NOW+50000;return {bytes:JPEG,type:'image/jpeg'};});
 expect((await service.media(TOKEN,MEDIA,req())).status).toBe(503);expect(f.io.rpc.mock.calls.some(([n])=>n==='social_vote_link_read')).toBe(false);
});
it('media transport errors and malformed postdownload authority503, no technical text',async()=>{
 const f=fixture();f.io.download.mockRejectedValue(Error('private authorization header'));const res=await f.service.media(TOKEN,MEDIA,req());expect(res.status).toBe(503);expect(await res.text()).not.toContain('authorization');
 const g=fixture();g.io.rpc.mockResolvedValueOnce(g.row).mockResolvedValueOnce({});expect((await g.service.media(TOKEN,MEDIA,req())).status).toBe(503);
});

it('privileged Storage refusal is operational503, known absence404; neither leaks detail',async()=>{
 for(const [error,status] of [[new VoteError('pending_media'),404],[new VoteError('unavailable'),503]] as const) {
  const f=fixture();f.io.download.mockRejectedValue(error);const res=await f.service.media(TOKEN,MEDIA,req());expect(res.status).toBe(status);expect(await res.json()).toEqual({error:status===404?'unavailable':'service_unavailable'});
 }
});
it('large JPEG is streamed in exact bytes only after final authorization',async()=>{
 const f=fixture(),bytes=Buffer.alloc(4800000,7);JPEG.copy(bytes);bytes[bytes.length-2]=255;bytes[bytes.length-1]=217;
 f.media.sha256=sha256(bytes);f.io.download.mockResolvedValue({bytes,type:'image/jpeg'});
 const res=await f.service.media(TOKEN,MEDIA,req());expect(res.status).toBe(200);const received=new Uint8Array(await res.arrayBuffer());expect(received.length).toBe(4800000);expect(sha256(received)).toBe(f.media.sha256);
});
it('slow body is aborted within10s remote bound without SQL or fresh budget',async()=>{
 vi.useFakeTimers();const f=fixture(),cookie=await device(f);let canceled=false;
 const stream=new ReadableStream<Uint8Array>({pull(){return new Promise(()=>{});},cancel(){canceled=true;}});
 const init={method:'POST',headers:{cookie,'content-type':'application/json'},body:stream,duplex:'half'} as RequestInit;
 const pending=f.service.cast(TOKEN,req('/ballot',init));await vi.advanceTimersByTimeAsync(10001);const res=await pending;expect(res.status).toBe(503);expect(canceled).toBe(true);expect(f.io.rpc.mock.calls.filter(([n])=>n==='social_vote_web_cast')).toHaveLength(0);expect(vi.getTimerCount()).toBe(0);
});

it.each([
 {label:'name501 and category1001',name:'x'.repeat(501),category:'y'.repeat(1001)},
 {label:'null metadata',name:null,category:null},
 {label:'empty string metadata',name:'',category:''},
])('published metadata remains readable across read/device/media: $label',async({name,category})=>{
 const f=fixture();Object.assign(f.s.options[0].pieces[0],{name,category});f.row.my_choice='b';
 const read=await f.service.read(TOKEN,req());expect.soft(read.status).toBe('ok');
 if(read.status==='ok') {
  expect(read.myChoice).toBe('b');expect(read.snapshot.options[0].pieces[0]).toEqual({name,category,imageUrl:`${VOTE_ORIGIN}/v/${TOKEN}/media/${MEDIA}`});
 }
 const initialized=await f.service.device(TOKEN,req('/device',{method:'POST'}));expect.soft(initialized.status).toBe(200);
 const image=await f.service.media(TOKEN,MEDIA,req());expect.soft(image.status).toBe(200);
 if(image.status===200)expect(Buffer.from(await image.arrayBuffer())).toEqual(JPEG);
});
it('piece metadata still rejects values other than string or null on all read surfaces',async()=>{
 for(const field of ['name','category'])for(const value of [undefined,0,true,[],{}]) {
  const f=fixture();Object.assign(f.s.options[0].pieces[0],{[field]:value});
  expect(await f.service.read(TOKEN,req())).toEqual({status:'service_unavailable'});
  expect((await f.service.device(TOKEN,req('/device',{method:'POST'}))).status).toBe(503);
  expect((await f.service.media(TOKEN,MEDIA,req())).status).toBe(503);expect(f.io.download).not.toHaveBeenCalled();
 }
});
