import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import { HASH, UUID, VoteBackend, VoteBudget, VoteError, record, sameHash, voteBackend } from './voteBackend';
import { jpegResponse, readVoteImage } from './voteImages';
import { VOTE_ORIGIN, tokenHash } from './votePublication';

export type PublicVoteSnapshot = {
 version:1;occasion:string;firstName:string;initials:string;endsAt:string;expiresAt:string;closed:boolean;
 options:[PublicVoteOption,PublicVoteOption];
};
type PublicVoteOption = {choice:'a'|'b';pieces:Array<{name:string|null;category:string|null;imageUrl:string}>};
export type PublicVoteReadResult =
 | {status:'ok';snapshot:PublicVoteSnapshot;myChoice:'a'|'b'|null}
 | {status:'unavailable'} | {status:'limited';retryAfter:number} | {status:'service_unavailable'};
const TOKEN = /^[A-Za-z0-9_-]{43}$/;
const COOKIE = '__Secure-margot_vote_device';
const HEADERS = {'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
type FailureCode = 'unavailable'|'limited'|'service_unavailable'|'forbidden'|'cookie_required'|'invalid'|'too_large'|'closed'|'method_not_allowed';
class PublicFailure extends Error {
 constructor(readonly code:FailureCode,readonly retryAfter?:number) { super(code); }
}
function response(body:unknown,status=200,extra:Record<string,string>={}): Response {
 return Response.json(body,{status,headers:{...HEADERS,...extra}});
}
function failure(error:unknown): Response {
 const safe = error instanceof PublicFailure ? error : new PublicFailure('service_unavailable');
 const statuses = {unavailable:404,limited:429,service_unavailable:503,forbidden:403,cookie_required:409,invalid:400,too_large:413,closed:409,method_not_allowed:405};
 return response({error:safe.code},statuses[safe.code],safe.retryAfter?{'Retry-After':String(safe.retryAfter)}:{});
}
function validToken(token:string) { if (typeof token!=='string' || token.length!==43 || !TOKEN.test(token)) throw new PublicFailure('unavailable'); }
function secret(name:'SOCIAL_VOTE_COOKIE_SECRET'|'SOCIAL_VOTE_IP_SECRET'): string {
 const value = process.env[name];
 if (!value || Buffer.byteLength(value)<32) throw new PublicFailure('service_unavailable');
 return value;
}
function hmac(key:string,message:string) { return createHmac('sha256',key).update(message).digest('hex'); }
function signature(nonce:string,key:string) { return hmac(key,`margot-vote-cookie-v1|${nonce}`); }
function cookieNonce(request:Request,key:string): string|null {
 const cookies = (request.headers.get('cookie')??'').split(';').map(s=>s.trim()).filter(s=>s.startsWith(`${COOKIE}=`));
 if (cookies.length!==1) return null;
 const value = cookies[0].slice(COOKIE.length+1); const parts=value.split('.');
 if (parts.length!==2 || !TOKEN.test(parts[0]) || !HASH.test(parts[1]) || Buffer.from(parts[0],'base64url').toString('base64url')!==parts[0]) return null;
 return timingSafeEqual(Buffer.from(parts[1],'hex'),Buffer.from(signature(parts[0],key),'hex')) ? parts[0] : null;
}
function deviceHash(nonce:string|null,key:string) { return nonce===null?null:hmac(key,`margot-vote-device-v1|${nonce}`); }
function trustedIp(request:Request): string {
 // The platform must rewrite this header. Local tests explicitly simulate this
 // boundary; neither NODE_ENV nor arbitrary forwarded headers enables it.
 if (process.env.VERCEL!=='1') throw new PublicFailure('service_unavailable');
 const raw=request.headers.get('x-vercel-forwarded-for');
 if (!raw || raw.includes(',') || raw.includes('%') || !isIP(raw)) throw new PublicFailure('service_unavailable');
 if (isIP(raw)===4) return raw;
 const normalized=new URL(`http://[${raw}]/`).hostname.slice(1,-1);
 const mapped=/^::ffff:([a-f0-9]{1,4}):([a-f0-9]{1,4})$/.exec(normalized);
 if (!mapped) return normalized;
 const a=parseInt(mapped[1],16),b=parseInt(mapped[2],16);
 return `${a>>>8}.${a&255}.${b>>>8}.${b&255}`;
}
function quotaKeys(request:Request,now:number) {
 const ip=trustedIp(request),key=secret('SOCIAL_VOTE_IP_SECRET'); const d=new Date(now);
 const buckets={minute:Math.floor(now/60000)*60,day:Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())/1000,month:Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1)/1000};
 return Object.fromEntries(Object.entries(buckets).map(([window,bucket])=>[window,{bucket,hash:hmac(key,`margot-vote-ip-v1|${window}|${bucket}|${ip}`)}]));
}
function mutation(request:Request) {
 if (request.method!=='POST') throw new PublicFailure('method_not_allowed');
 if (request.headers.get('origin')!==VOTE_ORIGIN || new URL(request.url).origin!==VOTE_ORIGIN) throw new PublicFailure('forbidden');
}
function text(value:unknown,max:number): value is string { return typeof value==='string' && Array.from(value).length<=max; }
function timestamp(value:unknown): value is string { return typeof value==='string' && Number.isFinite(Date.parse(value)); }
/** Projection only: never forward SQL's object or any inventory metadata. */
function snapshotOf(value:unknown,token:string,now:number): {snapshot:PublicVoteSnapshot;media:Set<string>} {
 const s=record(value);
 if (s.version!==1 || !text(s.occasion,120) || !s.occasion || !text(s.firstName,40) || !s.firstName || !text(s.initials,4) || !s.initials || !timestamp(s.endsAt) || !timestamp(s.expiresAt) || typeof s.closed!=='boolean' || !Array.isArray(s.options) || s.options.length!==2) throw new VoteError('unavailable');
 if (now>=Date.parse(s.expiresAt)) throw new PublicFailure('unavailable');
 const media=new Set<string>();
 const options=s.options.map((value,index)=>{
  const o=record(value);
  if (o.choice!==['a','b'][index] || !Array.isArray(o.pieces) || o.pieces.length<2 || o.pieces.length>9) throw new VoteError('unavailable');
  const pieces=o.pieces.map(value=>{
   const p=record(value);
   if (typeof p.media_id!=='string' || p.media_id.length!==36 || !UUID.test(p.media_id) || media.has(p.media_id) || !(p.name===null || text(p.name,500)) || !(p.category===null || text(p.category,500))) throw new VoteError('unavailable');
   media.add(p.media_id);
   return {name:p.name as string|null,category:p.category as string|null,imageUrl:`${VOTE_ORIGIN}/v/${token}/media/${p.media_id}`};
  });
  return {choice:o.choice as 'a'|'b',pieces};
 }) as [PublicVoteOption,PublicVoteOption];
 return {snapshot:{version:1,occasion:s.occasion,firstName:s.firstName,initials:s.initials,endsAt:s.endsAt,expiresAt:s.expiresAt,closed:s.closed,options},media};
}
function sqlFailure(row:Record<string,unknown>) {
 if (row.status==='limited' && Number.isSafeInteger(row.retryAfter) && Number(row.retryAfter)>0) throw new PublicFailure('limited',Number(row.retryAfter));
 if (row.status==='invalid' || row.status==='unavailable') throw new PublicFailure('unavailable');
 throw new PublicFailure('service_unavailable');
}
async function ballotBody(request:Request,budget:VoteBudget):Promise<Record<string,unknown>> {
 if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json' || !request.body) throw new PublicFailure('invalid');
 const reader=request.body.getReader(),chunks:Uint8Array[]=[];let size=0;
 try {
  while (true) {
   const {value,done}=await budget.run(()=>reader.read());if (done) break;
   size+=value.byteLength;if(size>2048) throw new PublicFailure('too_large');chunks.push(value);
  }
 } catch(error) { void reader.cancel().catch(()=>console.warn('[social-vote] body cancellation pending'));throw error; }
 finally { reader.releaseLock(); }
 try { return record(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks)))); }
 catch { throw new PublicFailure('invalid'); }
}
/** Per-request service, no shared cache or durable device identifier. */
export function voteAccess(backend:VoteBackend,budget=new VoteBudget()) {
 const rpc=(name:string,args:Record<string,unknown>)=>budget.run(signal=>backend.rpc(name,args,signal));
 async function access(token:string,request:Request,action:'read'|'cast') {
  validToken(token);
  const key=secret('SOCIAL_VOTE_COOKIE_SECRET');
  const row=record(await rpc('social_vote_web_access',{p_token_hash:tokenHash(token),p_keys:quotaKeys(request,budget.now()),p_action:action,p_device_hash:deviceHash(cookieNonce(request,key),key)}));
  if(row.status!=='ok') sqlFailure(row);
  if(row.my_choice!==null && row.my_choice!=='a' && row.my_choice!=='b') throw new VoteError('unavailable');
  return {...snapshotOf(row.snapshot,token,budget.now()),myChoice:row.my_choice as 'a'|'b'|null};
 }
 return {
  async read(token:string,request:Request):Promise<PublicVoteReadResult> {
   try { const {snapshot,myChoice}=await access(token,request,'read');return {status:'ok',snapshot,myChoice}; }
   catch(error) {
    if(error instanceof PublicFailure && error.code==='unavailable') return {status:'unavailable'};
    if(error instanceof PublicFailure && error.code==='limited') return {status:'limited',retryAfter:error.retryAfter as number};
    return {status:'service_unavailable'};
   }
  },
  async device(token:string,request:Request):Promise<Response> {
   try {
    validToken(token);mutation(request);
    await access(token,request,'cast');
    const key=secret('SOCIAL_VOTE_COOKIE_SECRET'),existing=cookieNonce(request,key);
    if(existing) return response({status:'ok',confirmed:true});
    const nonce=randomBytes(32).toString('base64url');
    return response({status:'ok',confirmed:false},200,{'Set-Cookie':`${COOKIE}=${nonce}.${signature(nonce,key)}; HttpOnly; Secure; SameSite=Lax; Path=/v; Max-Age=691200`});
   } catch(error) { return failure(error); }
  },
  async cast(token:string,request:Request):Promise<Response> {
   try {
    validToken(token);mutation(request);
    const key=secret('SOCIAL_VOTE_COOKIE_SECRET'),nonce=cookieNonce(request,key);
    if(!nonce) throw new PublicFailure('cookie_required');
    const body=await ballotBody(request,budget);
    if(Object.keys(body).some(k=>!['choice','firstName','reason'].includes(k)) || (body.choice!=='a' && body.choice!=='b') || !(body.firstName===undefined || body.firstName===null || text(body.firstName,40)) || !(body.reason===undefined || body.reason===null || text(body.reason,160))) throw new PublicFailure('invalid');
    const row=record(await rpc('social_vote_web_cast',{p_token_hash:tokenHash(token),p_device_hash:deviceHash(nonce,key),p_choice:body.choice,p_first_name:body.firstName??null,p_reason:body.reason??null,p_keys:quotaKeys(request,budget.now())}));
    if(row.status==='closed') throw new PublicFailure('closed');
    if(row.status==='invalid') throw new PublicFailure('invalid');
    if(row.status!=='ok') sqlFailure(row);
    if(row.choice!==body.choice || row.closed!==false) throw new VoteError('unavailable');
    return response({status:'ok',choice:row.choice,closed:false});
   } catch(error) { return failure(error); }
  },
  async media(token:string,mediaId:string,request:Request):Promise<Response> {
   try {
    validToken(token);if(mediaId.length!==36 || !UUID.test(mediaId)) throw new PublicFailure('unavailable');
    const initial=await access(token,request,'read');
    if(!initial.media.has(mediaId)) throw new PublicFailure('unavailable');
    const links=await budget.run(signal=>backend.rows('style_vote_links','vote_id,revision,state,token_hash',{token_hash:tokenHash(token),state:'ready'},1,signal));
    if(links.length!==1) throw new PublicFailure('unavailable');
    const link=record(links[0]);
    if(typeof link.vote_id!=='string' || link.vote_id.length!==36 || !UUID.test(link.vote_id) || !Number.isSafeInteger(link.revision) || Number(link.revision)<1 || link.state!=='ready' || !sameHash(link.token_hash,tokenHash(token))) throw new VoteError('unavailable');
    const rows=await budget.run(signal=>backend.rows('style_vote_link_media','id,owner_id,vote_id,revision,path,sha256,state',{id:mediaId,vote_id:link.vote_id,revision:link.revision,state:'ready'},1,signal));
    if(rows.length!==1) throw new PublicFailure('unavailable');
    const m=record(rows[0]);
    if(m.id!==mediaId || m.vote_id!==link.vote_id || m.revision!==link.revision || m.state!=='ready' || typeof m.owner_id!=='string' || m.owner_id.length!==36 || !UUID.test(m.owner_id) || m.path!==`${m.owner_id}/votes/${link.vote_id}/${link.revision}/${mediaId}.jpg` || typeof m.sha256!=='string' || m.sha256.length!==64 || !HASH.test(m.sha256)) throw new VoteError('unavailable');
    let bytes:Uint8Array;
    try { bytes=await readVoteImage(backend,budget,'social-media',m.path as string,m.sha256); }
    catch(error) { if(error instanceof VoteError && ['pending_media','selection_changed','conflict','too_large'].includes(error.code)) throw new PublicFailure('unavailable');throw error; }
    // Same token's authoritative read rechecks revision/account/rollout and
    // effective expiry after the final download, before the first byte.
    const final=await rpc('social_vote_link_read',{p_token_hash:tokenHash(token)});
    if(final===null) throw new PublicFailure('unavailable');
    if(!snapshotOf(final,token,budget.now()).media.has(mediaId)) throw new PublicFailure('unavailable');
    return jpegResponse(bytes);
   } catch(error) { return failure(error); }
  },
 };
}
export async function readPublicVote(token:string,request:Request,budget=new VoteBudget(Date.now(),request.signal)):Promise<PublicVoteReadResult> {
 try { validToken(token);return await voteAccess(voteBackend(),budget).read(token,request); }
 catch(error) { return error instanceof PublicFailure && error.code==='unavailable'?{status:'unavailable'}:{status:'service_unavailable'}; }
}
export async function initializePublicVoteDevice(token:string,request:Request,budget=new VoteBudget(Date.now(),request.signal)):Promise<Response> {
 try { validToken(token);mutation(request);return await voteAccess(voteBackend(),budget).device(token,request); } catch(error) { return failure(error); }
}
export async function castPublicVote(token:string,request:Request,budget=new VoteBudget(Date.now(),request.signal)):Promise<Response> {
 try { validToken(token);mutation(request);return await voteAccess(voteBackend(),budget).cast(token,request); } catch(error) { return failure(error); }
}
export async function readPublicVoteMedia(token:string,mediaId:string,request:Request,budget=new VoteBudget(Date.now(),request.signal)):Promise<Response> {
 try { validToken(token);return await voteAccess(voteBackend(),budget).media(token,mediaId,request); } catch(error) { return failure(error); }
}
