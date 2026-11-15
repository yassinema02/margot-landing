import 'server-only';
import { createHmac, createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { HASH, UUID, VoteBackend, VoteBudget, VoteError, record, sameHash, signingSecret, voteBackend } from './voteBackend';
import { copyVoteImages, readVoteImage, sha256, jpegResponse } from './voteImages';

export type ReservedMedia = { mediaId:string;choice:'a'|'b';ordinal:number;position:string;itemId:string;ownerId:string;sourceKind:'item';sourceVersion:string;sourceBucket:'social-media';sourcePath:string;destinationBucket:'social-media';destinationPath:string;name:string|null;category:string|null };
export type VoteLinkReservation = {voteId:string;ownerId:string;revision:number;leaseUntil:string;occasion:string;firstName:string;initials:string;endsAt:string;expiresAt:string;media:ReservedMedia[]};
export type PreparedOption = {choice:'a'|'b';pieces:Array<{mediaId:string;name:string|null;category:string|null}>};
export type PreparedVoteLink = {state:'prepared';revision:number;manifestHash:string;occasion:string;firstName:string;initials:string;options:[PreparedOption,PreparedOption]};
export type ReadyVoteLink = {state:'ready';url:string;revision:number;expiresAt:string};
export const VOTE_ORIGIN = 'https://www.margotwardrobe.com';
export function voteToken(secret:string,vote:string,revision:number): string {
 validVoteInput(vote,revision);
 return createHmac('sha256',secret).update(`margot-vote-link-v1|${vote}|${revision}`).digest('base64url');
}
export function tokenHash(token:string): string { return createHash('sha256').update(token).digest('hex'); }
const date = (value:unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value));
function text(value:unknown,max:number): value is string { return typeof value === 'string' && Array.from(value).length > 0 && Array.from(value).length <= max; }
function nullableText(value:unknown): value is string|null { return value === null || typeof value === 'string'; }
export function validVoteInput(vote:string,revision:number): void {
 if (typeof vote !== 'string' || !UUID.test(vote) || !Number.isSafeInteger(revision) || revision < 1 || revision > 2147483647) throw new VoteError('invalid');
}
export function parseReservation(value:unknown,owner:string,vote:string,revision:number): VoteLinkReservation {
 const r = record(value);
 if (r.ownerId !== owner || r.voteId !== vote || r.revision !== revision || !date(r.leaseUntil) || !date(r.endsAt) || !date(r.expiresAt) || !text(r.occasion,120) || !text(r.firstName,40) || !text(r.initials,4) || !Array.isArray(r.media) || r.media.length < 4 || r.media.length > 18) throw new VoteError('unavailable');
 const ids = new Set<string>();
 for (const choice of ['a','b']) {
  const pieces = r.media.filter(m => record(m).choice === choice);
  if (pieces.length < 2 || pieces.length > 9) throw new VoteError('unavailable');
  for (const [index,value] of pieces.entries()) {
   const m = record(value);
   if (typeof m.mediaId !== 'string' || !UUID.test(m.mediaId) || ids.has(m.mediaId) || typeof m.itemId !== 'string' || !UUID.test(m.itemId) || m.ordinal !== index+1 || !['top','bottom','shoes','accessory','outerwear','dress'].includes(String(m.position)) || m.ownerId !== owner || m.sourceKind !== 'item' || typeof m.sourceVersion !== 'string' || !/^[a-f0-9]{12}$/.test(m.sourceVersion) || m.sourceBucket !== 'social-media' || m.destinationBucket !== 'social-media' || typeof m.sourcePath !== 'string' || !m.sourcePath.startsWith(`${owner}/items/`) || m.sourcePath.includes('..') || /[?#\\]/.test(m.sourcePath) || m.destinationPath !== `${owner}/votes/${vote}/${revision}/${m.mediaId}.jpg` || !nullableText(m.name) || !nullableText(m.category)) throw new VoteError('unavailable');
   ids.add(m.mediaId);
  }
 }
 if (ids.size !== r.media.length) throw new VoteError('unavailable');
 return r as unknown as VoteLinkReservation;
}
function snapshot(r:VoteLinkReservation) {
 return {version:1,occasion:r.occasion,firstName:r.firstName,initials:r.initials,options:['a','b'].map(choice=>({choice,pieces:r.media.filter(m=>m.choice===choice).map(m=>({media_id:m.mediaId,name:m.name,category:m.category}))}))};
}
function prepared(r:VoteLinkReservation,hash:string): PreparedVoteLink {
 return {state:'prepared',revision:r.revision,manifestHash:hash,occasion:r.occasion,firstName:r.firstName,initials:r.initials,options:['a','b'].map(choice=>({choice,pieces:r.media.filter(m=>m.choice===choice).map(m=>({mediaId:m.mediaId,name:m.name,category:m.category}))})) as [PreparedOption,PreparedOption]};
}
function accept(data:unknown,expected:string): Record<string,unknown> {
 const row = record(data);
 if (row.status === expected) return row;
 if (row.status === 'limited' && Number.isSafeInteger(row.retryAfter) && Number(row.retryAfter)>0) throw new VoteError('limited',Number(row.retryAfter));
 if (['social_text_rejected','invalid','conflict','closed','selection_changed','unavailable'].includes(String(row.status))) throw new VoteError(row.status as 'invalid');
 throw new VoteError('unavailable');
}

type Sources = Record<string,unknown>[];
type Authority = {reservation:VoteLinkReservation;link:Record<string,unknown>;media:Record<string,unknown>[];sources:Sources|null};
type Unreserved = {status:'unreserved';sources:Sources};
function sourceRows(value:unknown,uid:string): Sources {
 if (!Array.isArray(value) || value.length<4 || value.length>18) throw new VoteError('selection_changed');
 const rows=value.map(record);
 for(const choice of ['a','b']) {
  const pieces=rows.filter(x=>x.choice===choice);
  if(pieces.length<2||pieces.length>9) throw new VoteError('selection_changed');
  pieces.forEach((m,i)=>{
   if(m.ordinal!==i+1 || m.ownerId!==uid || m.sourceKind!=='item' || m.sourceBucket!=='social-media' || m.admissible!==true || typeof m.itemId!=='string' || !UUID.test(m.itemId) || typeof m.sourceVersion!=='string' || !/^[a-f0-9]{12}$/.test(m.sourceVersion) ||
    (m.sourcePath!==null && (typeof m.sourcePath!=='string'||!m.sourcePath.startsWith(`${uid}/items/`)||m.sourcePath.includes('..')||/[?#\\]/.test(m.sourcePath)))) throw new VoteError('selection_changed');
  });
 }
 if(rows.some(m=>m.choice!=='a'&&m.choice!=='b')) throw new VoteError('selection_changed');
 return rows;
}
function sameSources(before:Sources,after:Sources,allowMissing=false) {
 if(before.length!==after.length || before.some((m,i)=>!isDeepStrictEqual(allowMissing&&m.sourcePath===null?{...m,sourcePath:after[i].sourcePath}:m,after[i]))) throw new VoteError('selection_changed');
}
async function settled<T>(operations:Promise<T>[]):Promise<T[]> {
 const results=await Promise.allSettled(operations);
 for(const result of results) if(result.status==='rejected') throw result.reason;
 return results.map(result=>(result as PromiseFulfilledResult<T>).value);
}
export function votePublication(backend:VoteBackend,budget = new VoteBudget(),secret:()=>string = signingSecret) {
 async function owner(token:string): Promise<string> {
  if (!token || token.length > 8192 || /\s/.test(token)) throw new VoteError('unauthorized');
  return budget.run(signal=>backend.user(token,signal));
 }
 const rpc = (name:string,args:Record<string,unknown>)=>budget.run(signal=>backend.rpc(name,args,signal));
 async function projection(uid:string,vote:string,revision:number):Promise<Authority|Unreserved> {
  const data=record(await rpc('social_vote_link_preparation_state',{p_owner:uid,p_vote:vote,p_revision:revision}));
  if(data.status==='unreserved') {
   if(data.ownerId!==uid||data.voteId!==vote||data.revision!==revision||!date(data.endsAt)||budget.now()>=Date.parse(data.endsAt)) throw new VoteError('conflict');
   return {status:'unreserved',sources:structuredClone(sourceRows(data.sources,uid))};
  }
  if(!['reserved','prepared','ready'].includes(String(data.status))) accept(data,'reserved');
  const reservation=parseReservation(data.reservation,uid,vote,revision),link=record(data.link);
  if(!Array.isArray(data.media)) throw new VoteError('conflict');
  const media=data.media.map(record);
  if(link.state!==(data.status==='ready'?'ready':'pending') || media.length!==reservation.media.length || new Set(media.map(m=>m.id)).size!==media.length) throw new VoteError('conflict');
  budget.leaseUntil=link.state==='pending'?Date.parse(reservation.leaseUntil):undefined;
  for(const m of reservation.media) {
   const row=media.find(row=>row.id===m.mediaId);
   if(!row || row.owner_id!==uid || row.vote_id!==vote || row.revision!==revision || row.path!==m.destinationPath || row.source_item_id!==m.itemId || row.source_version!==m.sourceVersion || row.source_path!==m.sourcePath || row.state!==(link.state==='ready'?'ready':'staged') || !date(row.lease_until)) throw new VoteError('conflict');
   if(link.state==='pending') budget.leaseUntil=Math.min(budget.leaseUntil??Infinity,Date.parse(row.lease_until));
  }
  const sources=link.state==='ready'?null:sourceRows(data.sources,uid);
  if(sources) sameSources(reservation.media.map(({mediaId: _id,destinationBucket: _bucket,destinationPath: _path,...m})=>({...m,admissible:true})),sources);
  if(budget.signal?.aborted||budget.now()>=budget.deadline||(budget.leaseUntil!==undefined&&budget.now()>=budget.leaseUntil-5000)) throw new VoteError('pending');
  return structuredClone({reservation,link,media,sources});
 }
 async function state(token:string,uid:string,vote:string,revision:number):Promise<Authority|Unreserved> {
  if(await owner(token)!==uid) throw new VoteError('unauthorized');
  return projection(uid,vote,revision);
 }
 async function authority(token:string,uid:string,vote:string,revision:number):Promise<Authority> {
  const result=await state(token,uid,vote,revision);
  if('status' in result) throw new VoteError('conflict');
  return result;
 }
 function sameAuthority(before:Authority,after:Authority) {
  if(!isDeepStrictEqual(before.reservation,after.reservation)) throw new VoteError('selection_changed');
  if(before.link.manifest_hash!==null && !sameHash(after.link.manifest_hash,String(before.link.manifest_hash))) throw new VoteError('conflict');
 }
 async function verifiedCopies(token:string,uid:string,vote:string,revision:number,initial:Authority) {
  let current=initial;
  const receipts:Array<{mediaId:string;sha256:string}>=[];
  for(let i=0;i<initial.reservation.media.length;i+=2) {
   const batch=initial.reservation.media.slice(i,i+2);
   const hashes=batch.map(m=>{
    const hash=current.media.find(row=>row.id===m.mediaId)?.sha256;
    if(typeof hash!=='string'||!HASH.test(hash)) throw new VoteError('conflict');
    return hash;
   });
   const bytes=await settled(batch.map((m,j)=>readVoteImage(backend,budget,m.destinationBucket,m.destinationPath,hashes[j])));
   current=await authority(token,uid,vote,revision);sameAuthority(initial,current);
   batch.forEach((m,j)=>{
    if(!sameHash(current.media.find(row=>row.id===m.mediaId)?.sha256,hashes[j])) throw new VoteError('conflict');
    receipts.push({mediaId:m.mediaId,sha256:sha256(bytes[j])});
   });
  }
  return receipts;
 }
 return {
  async prepare(token:string,input:{voteId:string;expectedRevision:number;firstName:string}):Promise<PreparedVoteLink> {
   validVoteInput(input.voteId,input.expectedRevision);
   if (!text(input.firstName,40) || input.firstName !== input.firstName.trim()) throw new VoteError('invalid');
   const uid = await owner(token);
   const beginArgs={p_owner:uid,p_vote:input.voteId,p_expected_revision:input.expectedRevision,p_first_name:input.firstName};
   let begin=record(await rpc('social_vote_link_begin',beginArgs));
   if(!['reserved','prepared','ready','pending_media'].includes(String(begin.status))) accept(begin,'reserved');
   let current=await state(token,uid,input.voteId,input.expectedRevision);
   let warms=0;
   const pending=(phase:'sources'|'copies',completed:number,total:number)=>new VoteError('pending_media',undefined,{phase,completed,total});
   const warm=async(ids:string[],sources:Sources)=>{
    if(warms>=3) return false;
    warms++;
    const results=await budget.run(signal=>backend.prepareMedia(token,uid,[...new Set(ids)],signal));
    // Never use F's status as authority. Discarded signed URLs never enter this service.
    const after=await state(token,uid,input.voteId,input.expectedRevision);
    if(!after.sources) throw new VoteError('conflict');
    sameSources(sources,after.sources,true);
    if(!Array.isArray(results)||results.length!==new Set(ids).size||new Set(results.map(x=>x.itemId)).size!==results.length||results.some(x=>!ids.includes(x.itemId)||!['ready','pending','unavailable'].includes(x.state))) throw new VoteError('unavailable');
    if(results.some(x=>x.state==='unavailable')) throw new VoteError('media_unavailable');
    if(results.some(x=>x.version!==sources.find(m=>m.itemId===x.itemId)?.sourceVersion)) throw new VoteError('selection_changed');
    current=after;return true;
   };
   if(begin.status==='pending_media') {
    if(begin.voteId!==input.voteId||begin.revision!==input.expectedRevision||!Array.isArray(begin.missingItemIds)||!begin.missingItemIds.length||begin.missingItemIds.length>18||begin.missingItemIds.some(id=>typeof id!=='string'||!UUID.test(id))) throw new VoteError('unavailable');
    let frozen=current.sources;
    if(!frozen) throw new VoteError('conflict');
    while('status' in current) {
     const missing=current.sources.filter(m=>m.sourcePath===null);
     if(!missing.length) break;
     if(!await warm(missing.map(m=>String(m.itemId)),frozen)) throw pending('sources',current.sources.length-missing.length,current.sources.length);
     if(!current.sources) throw new VoteError('conflict');
     frozen=current.sources;
    }
    if('status' in current) {
     // All sources ready: only this second admission can reserve. Never begin per photo.
     begin=record(await rpc('social_vote_link_begin',beginArgs));
     current=await state(token,uid,input.voteId,input.expectedRevision);
     if(current.sources) sameSources(frozen,current.sources,true);
    } else {
     // Another admitted request may already have reserved while warming.
     begin={status:'reserved',reservation:current.reservation};
    }
   }
   if(!['reserved','prepared','ready'].includes(String(begin.status))) accept(begin,'reserved');
   if('status' in current) throw new VoteError('conflict');
   const initial=current; const r=initial.reservation;
   const check=async()=>{
    const next=await authority(token,uid,input.voteId,input.expectedRevision);sameAuthority(initial,next);current=next;return next;
   };
   if(r.firstName!==input.firstName) throw new VoteError('selection_changed');
   if(begin.status==='reserved'&&!isDeepStrictEqual(parseReservation(begin.reservation,uid,input.voteId,input.expectedRevision),r)) throw new VoteError('conflict');
   if(initial.link.manifest_hash!==null) {
    if(typeof initial.link.manifest_hash!=='string'||!HASH.test(initial.link.manifest_hash)) throw new VoteError('unavailable');
    await verifiedCopies(token,uid,input.voteId,input.expectedRevision,initial);
    return prepared(r,initial.link.manifest_hash);
   }
   const receipts:Array<{mediaId:string;sha256:string}>=[];
   for(let i=0;i<r.media.length;i+=2) {
    const batch=r.media.slice(i,i+2);
    let bytes:Uint8Array[];
    for(;;) {
     const reads=await Promise.allSettled(batch.map(m=>readVoteImage(backend,budget,m.sourceBucket,m.sourcePath)));
     const missing=batch.filter((_,j)=>reads[j].status==='rejected'&&(reads[j] as PromiseRejectedResult).reason instanceof VoteError&&(reads[j] as PromiseRejectedResult).reason.code==='pending_media');
     const other=reads.find(x=>x.status==='rejected'&&(!(x.reason instanceof VoteError)||x.reason.code!=='pending_media'));
     if(other?.status==='rejected') throw other.reason;
     if(!missing.length) {bytes=reads.map(x=>(x as PromiseFulfilledResult<Uint8Array>).value);break;}
     const before=await check();
     if(!before.sources||!await warm(missing.map(m=>m.itemId),before.sources)) throw pending('copies',receipts.length,r.media.length);
     if('status' in current) throw new VoteError('conflict');
     sameAuthority(initial,current);
    }
    receipts.push(...await copyVoteImages(backend,budget,batch,bytes,check));
   }
   // Last post-readback authority is also the pre-stage gate: no intervening await.
   const staged=accept(await rpc('social_vote_link_stage',{p_owner:uid,p_vote:input.voteId,p_revision:r.revision,p_snapshot:snapshot(r),p_media:receipts}),'prepared');
   const final=await check();const hash=record(staged.prepared).manifestHash;
   if(typeof hash!=='string'||!sameHash(final.link.manifest_hash,hash)) throw new VoteError('conflict');
   return prepared(r,hash);
  },
  async publish(token:string,input:{voteId:string;revision:number;manifestHash:string;consentVersion:1}):Promise<ReadyVoteLink> {
   validVoteInput(input.voteId,input.revision);
   if (input.consentVersion !== 1 || typeof input.manifestHash !== 'string' || !HASH.test(input.manifestHash)) throw new VoteError('invalid');
   const uid = await owner(token); const check = ()=>authority(token,uid,input.voteId,input.revision);
   const current = await check();
   if (!sameHash(current.link.manifest_hash,input.manifestHash)) throw new VoteError('conflict');
   await verifiedCopies(token,uid,input.voteId,input.revision,current);
   const tokenValue = voteToken(secret(),input.voteId,input.revision); const hash = tokenHash(tokenValue);
   try {
    accept(await rpc('social_vote_link_commit',{p_owner:uid,p_vote:input.voteId,p_revision:input.revision,p_token_hash:hash,p_manifest_hash:input.manifestHash,p_consent_version:1}),'ready');
   } catch (error) {
    // A failed response may follow a committed transaction. Read before any decision; never delete here.
    const after = await check();
    if (after.link.state !== 'ready' || !sameHash(after.link.token_hash,hash)) throw error;
   }
   const final = await check();
   if (final.link.state !== 'ready' || !sameHash(final.link.token_hash,hash) || !sameHash(final.link.manifest_hash,input.manifestHash) || final.link.consent_version !== 1 || final.link.consent_revision !== input.revision || !sameHash(final.link.consent_manifest_hash,input.manifestHash)) throw new VoteError('conflict');
   const publicRead = record(await rpc('social_vote_link_read',{p_token_hash:hash}));
   if (!date(publicRead.expiresAt)) throw new VoteError('unavailable');
   await check();
   return {state:'ready',revision:input.revision,expiresAt:publicRead.expiresAt,url:`${VOTE_ORIGIN}/v/${tokenValue}`};
  },
  async preview(token:string,input:{voteId:string;revision:number;manifestHash:string;mediaId:string}):Promise<Response> {
   validVoteInput(input.voteId,input.revision);
   if (!HASH.test(input.manifestHash) || !UUID.test(input.mediaId)) throw new VoteError('invalid');
   const uid = await owner(token); const check = ()=>authority(token,uid,input.voteId,input.revision);
   const current = await projection(uid,input.voteId,input.revision);
   if('status' in current) throw new VoteError('conflict');
   if (!sameHash(current.link.manifest_hash,input.manifestHash)) throw new VoteError('conflict');
   const m = current.reservation.media.find(m=>m.mediaId===input.mediaId); const row = current.media.find(m=>m.id===input.mediaId);
   if (!m || !row || typeof row.sha256 !== 'string' || !HASH.test(row.sha256)) throw new VoteError('unavailable');
   const bytes = await readVoteImage(backend,budget,m.destinationBucket,m.destinationPath,row.sha256);
   const final = await check();
   if (!sameHash(final.link.manifest_hash,input.manifestHash) || !sameHash(final.media.find(m=>m.id===input.mediaId)?.sha256,row.sha256)) throw new VoteError('conflict');
   return jpegResponse(bytes);
  },
  async revoke(token:string,input:{voteId:string;expectedRevision:number}):Promise<void> {
   validVoteInput(input.voteId,input.expectedRevision); const uid = await owner(token);
   const read = async()=>{
    const rows = await budget.run(signal=>backend.rows('style_votes','id,owner_id,link_revision,link_state,deleted_at',{id:input.voteId,owner_id:uid},1,signal));
    const row = record(rows[0]);
    if (row.id !== input.voteId || row.owner_id !== uid || row.deleted_at !== null) throw new VoteError('unavailable');
    return row;
   };
   const before = await read();
   if (before.link_state !== 'revoked' && before.link_revision !== input.expectedRevision) throw new VoteError('conflict');
   await rpc('social_vote_link_revoke',{p_owner:uid,p_vote:input.voteId,p_expected_revision:input.expectedRevision});
   if (await owner(token) !== uid) throw new VoteError('unauthorized');
   if ((await read()).link_state !== 'revoked') throw new VoteError('conflict');
  },
 };
}
export function prepareVoteLink(token:string,input:{voteId:string;expectedRevision:number;firstName:string}) { return votePublication(voteBackend()).prepare(token,input); }
export function publishVoteLink(token:string,input:{voteId:string;revision:number;manifestHash:string;consentVersion:1}) { return votePublication(voteBackend()).publish(token,input); }
export function revokeVoteLink(token:string,input:{voteId:string;expectedRevision:number}) { return votePublication(voteBackend()).revoke(token,input); }
