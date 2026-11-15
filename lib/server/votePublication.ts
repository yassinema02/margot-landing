import 'server-only';
import { createHmac, createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { HASH, UUID, VoteBackend, VoteBudget, VoteError, record, sameHash, signingSecret, voteBackend } from './voteBackend';
import { copyVoteImages, readVoteImage, sha256, jpegResponse, validateJpeg } from './voteImages';

export type ReservedItem = { mediaId:string;choice:'a'|'b';ordinal:number;position:string;itemId:string;ownerId:string;sourceKind:'item';sourceVersion:string;sourceBucket:'social-media';sourcePath:string;destinationBucket:'social-media';destinationPath:string;name:string|null;category:string|null };
export type ReservedRender = {mediaId:string;choice:'a'|'b';ordinal:0;ownerId:string;sourceKind:'vote_render';optionId:string;sourceVersion:string;sourceBucket:'social-media';sourcePath:string;destinationBucket:'social-media';destinationPath:string;renderedOrdinals:number[]};
export type ReservedMedia = ReservedItem|ReservedRender;
export type PreparedVisual = {kind:'pieces'}|{kind:'render';mediaId:string;renderedOrdinals:number[]};

export type VoteLinkReservation = {voteId:string;ownerId:string;revision:number;leaseUntil:string;occasion:string;firstName:string;initials:string;endsAt:string;expiresAt:string;media:ReservedMedia[]};
export type PreparedOption = {choice:'a'|'b';pieces:Array<{mediaId:string;name:string|null;category:string|null}>;visual?:PreparedVisual};
export type PreparedVoteLink = {state:'prepared';revision:number;manifestHash:string;occasion:string;firstName:string;initials:string} & (
 | {snapshotVersion?:never;consentVersion?:never;options:[PreparedOption,PreparedOption]}
 | {snapshotVersion:2;consentVersion:2;options:[PreparedOption & {visual:PreparedVisual},PreparedOption & {visual:PreparedVisual}]}
);
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
export function validOrdinals(value:unknown,count:number):value is number[] {
 return Array.isArray(value)&&value.length>=1&&value.length<=6&&value.every((n,i)=>Number.isInteger(n)&&n>=1&&n<=count&&(i===0||n>value[i-1]));
}
export function parseReservation(value:unknown,owner:string,vote:string,revision:number): VoteLinkReservation {
 const r=record(value);
 if(r.ownerId!==owner||r.voteId!==vote||r.revision!==revision||!date(r.leaseUntil)||!date(r.endsAt)||!date(r.expiresAt)||!text(r.occasion,120)||!text(r.firstName,40)||!text(r.initials,4)||!Array.isArray(r.media)||r.media.length<4||r.media.length>20) throw new VoteError('unavailable');
 const ids=new Set<string>();let order='';
 for(const choice of ['a','b']) {
  const rows=r.media.map(record).filter(m=>m.choice===choice),pieces=rows.filter(m=>m.sourceKind==='item'),renders=rows.filter(m=>m.sourceKind==='vote_render');
  if(pieces.length<2||pieces.length>9||renders.length>1||rows.length!==pieces.length+renders.length) throw new VoteError('unavailable');
  for(const m of rows) {
   if(typeof m.mediaId!=='string'||!UUID.test(m.mediaId)||ids.has(m.mediaId)||m.ownerId!==owner||typeof m.sourceVersion!=='string'||!/^[a-f0-9]{12}$/.test(m.sourceVersion)||m.sourceBucket!=='social-media'||m.destinationBucket!=='social-media') throw new VoteError('unavailable');
   const key=`${choice}${m.ordinal}`;if(key<=order) throw new VoteError('unavailable');order=key;
   if(m.sourceKind==='item') {
    if(typeof m.itemId!=='string'||!UUID.test(m.itemId)||m.ordinal!==pieces.indexOf(m)+1||!['top','bottom','shoes','accessory','outerwear','dress'].includes(String(m.position))||typeof m.sourcePath!=='string'||!m.sourcePath.startsWith(`${owner}/items/`)||m.sourcePath.includes('..')||/[?#\\]/.test(m.sourcePath)||m.destinationPath!==`${owner}/votes/${vote}/${revision}/${m.mediaId}.jpg`||!nullableText(m.name)||!nullableText(m.category)||'optionId' in m||'renderedOrdinals' in m) throw new VoteError('unavailable');
   } else if(m.ordinal!==0||typeof m.optionId!=='string'||!UUID.test(m.optionId)||m.sourcePath!==`${owner}/vote-renders/${m.optionId}/${m.sourceVersion}.enc`||m.destinationPath!==`${owner}/votes/${vote}/${revision}/${m.mediaId}.enc`||!validOrdinals(m.renderedOrdinals,pieces.length)||['itemId','position','name','category'].some(k=>k in m)) throw new VoteError('unavailable');
   ids.add(m.mediaId);
  }
 }
 if(ids.size!==r.media.length || r.media.map(record).some((m,i,rows)=>i>0 && `${rows[i-1].choice}${rows[i-1].ordinal}`>=`${m.choice}${m.ordinal}`)) throw new VoteError('unavailable');
 return r as unknown as VoteLinkReservation;
}
function snapshot(r:VoteLinkReservation) {
 const version=r.media.some(m=>m.sourceKind==='vote_render')?2:1;
 return {version,occasion:r.occasion,firstName:r.firstName,initials:r.initials,options:['a','b'].map(choice=>{
  const render=r.media.find((m):m is ReservedRender=>m.choice===choice&&m.sourceKind==='vote_render');
  return {choice,pieces:r.media.filter((m):m is ReservedItem=>m.choice===choice&&m.sourceKind==='item').map(m=>({media_id:m.mediaId,name:m.name,category:m.category})),
   ...(version===2?{visual:render?{kind:'render',media_id:render.mediaId,rendered_ordinals:render.renderedOrdinals}:{kind:'pieces'}}:{})};
 })};
}
function prepared(r:VoteLinkReservation,hash:string):PreparedVoteLink {
 const s=snapshot(r);
 return {state:'prepared',revision:r.revision,manifestHash:hash,occasion:r.occasion,firstName:r.firstName,initials:r.initials,
  ...(s.version===2?{snapshotVersion:2 as const,consentVersion:2 as const}:{}),
  options:s.options.map(o=>({choice:o.choice,pieces:o.pieces.map(p=>({mediaId:p.media_id,name:p.name,category:p.category})),
   ...(o.visual?{visual:o.visual.kind==='render'?{kind:'render',mediaId:o.visual.media_id,renderedOrdinals:o.visual.rendered_ordinals}:{kind:'pieces'}}:{})})) as [PreparedOption,PreparedOption]} as PreparedVoteLink;
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
 if(!Array.isArray(value)||value.length<4||value.length>20) throw new VoteError('selection_changed');
 const rows=value.map(record);
 for(const choice of ['a','b']) {
  const pieces=rows.filter(m=>m.choice===choice&&m.sourceKind==='item'),renders=rows.filter(m=>m.choice===choice&&m.sourceKind==='vote_render');
  if(pieces.length<2||pieces.length>9||renders.length>1) throw new VoteError('selection_changed');
  pieces.forEach((m,i)=>{if(m.ordinal!==i+1||typeof m.itemId!=='string'||!UUID.test(m.itemId)||(m.sourcePath!==null&&(typeof m.sourcePath!=='string'||!m.sourcePath.startsWith(`${uid}/items/`)||m.sourcePath.includes('..')||/[?#\\]/.test(m.sourcePath)))) throw new VoteError('selection_changed');});
  renders.forEach(m=>{if(m.ordinal!==0||typeof m.optionId!=='string'||!UUID.test(m.optionId)||!validOrdinals(m.renderedOrdinals,pieces.length)||(m.sourcePath!==null&&m.sourcePath!==`${uid}/vote-renders/${m.optionId}/${m.sourceVersion}.enc`)) throw new VoteError('selection_changed');});
 }
 if(rows.some((m,i)=>!['a','b'].includes(String(m.choice))||!['item','vote_render'].includes(String(m.sourceKind))||m.ownerId!==uid||m.sourceBucket!=='social-media'||m.admissible!==true||typeof m.sourceVersion!=='string'||!/^[a-f0-9]{12}$/.test(m.sourceVersion)||i>0&&`${rows[i-1].choice}${rows[i-1].ordinal}`>=`${m.choice}${m.ordinal}`)) throw new VoteError('selection_changed');
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
   if(!row || row.owner_id!==uid || row.vote_id!==vote || row.revision!==revision || row.path!==m.destinationPath || (m.sourceKind==='item'?(row.source_kind!==undefined&&row.source_kind!=='item')||row.source_item_id!==m.itemId||(row.source_option_id!==undefined&&row.source_option_id!==null):row.source_kind!=='vote_render'||row.source_option_id!==m.optionId||row.source_item_id!==null) || row.source_version!==m.sourceVersion || row.source_path!==m.sourcePath || row.state!==(link.state==='ready'?'ready':'staged') || !date(row.lease_until)) throw new VoteError('conflict');
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
 async function readRender(uid:string,vote:string,revision:number,m:ReservedRender,manifestHash:string,expected:string) {
  const data=await budget.run(signal=>backend.voteRender({operation:'preview',ownerId:uid,voteId:vote,revision,mediaId:m.mediaId,manifestHash},signal));
  if(!('bytes' in data)) throw new VoteError('unavailable');
  const bytes=validateJpeg(data.bytes,data.type);if(!sameHash(sha256(bytes),expected)) throw new VoteError('conflict');return bytes;
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
   const bytes=await settled(batch.map((m,j)=>m.sourceKind==='item'?readVoteImage(backend,budget,m.destinationBucket,m.destinationPath,hashes[j]):readRender(uid,vote,revision,m,String(current.link.manifest_hash),hashes[j])));
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
   const warm=async(missing:Sources,sources:Sources)=>{
    const ids=missing.filter(m=>m.sourceKind==='item').map(m=>String(m.itemId));
    if(warms>=3) return false;
    warms++;
    const render=missing.find(m=>m.sourceKind==='vote_render');
    const results=ids.length?await budget.run(signal=>backend.prepareMedia(token,uid,[...new Set(ids)],signal)):[];
    // One F call per attempt, sharing the existing three-attempt budget.
    const renderResult=!ids.length&&render?await budget.run(signal=>backend.prepareVoteRender(token,input.voteId,render.choice as 'a'|'b',signal)):null;
    // Never use F's status as authority. Discarded signed URLs never enter this service.
    const after=await state(token,uid,input.voteId,input.expectedRevision);
    if(!after.sources) throw new VoteError('conflict');
    sameSources(sources,after.sources,true);
    if(!Array.isArray(results)||results.length!==new Set(ids).size||new Set(results.map(x=>x.itemId)).size!==results.length||results.some(x=>!ids.includes(x.itemId)||!['ready','pending','unavailable'].includes(x.state))) throw new VoteError('unavailable');
    if(renderResult?.state==='unavailable') throw new VoteError('render_unavailable');
    if(renderResult?.state==='ready'&&renderResult.version!==render?.sourceVersion) throw new VoteError('selection_changed');
    if(results.some(x=>x.state==='unavailable')) throw new VoteError('media_unavailable');
    if(results.some(x=>x.version!==sources.find(m=>m.itemId===x.itemId)?.sourceVersion)) throw new VoteError('selection_changed');
    current=after;return true;
   };
   if(begin.status==='pending_media') {
    if(begin.voteId!==input.voteId||begin.revision!==input.expectedRevision||!Array.isArray(begin.missingItemIds)||begin.missingItemIds.length>18||begin.missingItemIds.some(id=>typeof id!=='string'||!UUID.test(id))) throw new VoteError('unavailable');
    if(begin.missingRenderChoices!==undefined&&(!Array.isArray(begin.missingRenderChoices)||begin.missingRenderChoices.length>2||begin.missingRenderChoices.some(c=>c!=='a'&&c!=='b'))) throw new VoteError('unavailable');
    let frozen=current.sources;
    if(!frozen) throw new VoteError('conflict');
    while('status' in current) {
     const missing=current.sources.filter(m=>m.sourcePath===null);
     if(!missing.length) break;
     if(!await warm(missing,frozen)) throw pending('sources',current.sources.length-missing.length,current.sources.length);
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
    const items=batch.filter((m):m is ReservedItem=>m.sourceKind==='item');
    const renders=batch.filter((m):m is ReservedRender=>m.sourceKind==='vote_render');
    let bytes:Uint8Array[];
    for(;;) {
     const reads=await Promise.allSettled(items.map(m=>readVoteImage(backend,budget,m.sourceBucket,m.sourcePath)));
     const missing=items.filter((_,j)=>reads[j].status==='rejected'&&(reads[j] as PromiseRejectedResult).reason instanceof VoteError&&(reads[j] as PromiseRejectedResult).reason.code==='pending_media');
     const other=reads.find(x=>x.status==='rejected'&&(!(x.reason instanceof VoteError)||x.reason.code!=='pending_media'));
     if(other?.status==='rejected') throw other.reason;
     if(!missing.length) {bytes=reads.map(x=>(x as PromiseFulfilledResult<Uint8Array>).value);break;}
     const before=await check();
     if(!before.sources||!await warm(missing.map(m=>({...m})),before.sources)) throw pending('copies',receipts.length,r.media.length);
     if('status' in current) throw new VoteError('conflict');
     sameAuthority(initial,current);
    }
    const copies=await settled([
     ...(items.length?[copyVoteImages(backend,budget,items,bytes,check)]:[]),
     ...renders.map(async m=>{
      await check();
      for(;;) {
       try {
        const receipt=await budget.run(signal=>backend.voteRender({operation:'copy',ownerId:uid,voteId:input.voteId,revision:r.revision,mediaId:m.mediaId},signal));
        await check();
        if(!('sha256' in receipt)||receipt.mediaId!==m.mediaId||!HASH.test(receipt.sha256)) throw new VoteError('conflict');
        return [receipt];
       } catch(error) {
        if(!(error instanceof VoteError)||error.code!=='pending_media') throw error;
        const before=await check();
        if(!before.sources||!await warm([{...m}],before.sources)) throw pending('copies',receipts.length,r.media.length);
       }
      }
     }),
    ]);
    const byId=new Map(copies.flat().map(c=>[c.mediaId,c]));
    receipts.push(...batch.map(m=>{const receipt=byId.get(m.mediaId);if(!receipt) throw new VoteError('conflict');return receipt;}));
   }
   // Last post-readback authority is also the pre-stage gate: no intervening await.
   const staged=accept(await rpc('social_vote_link_stage',{p_owner:uid,p_vote:input.voteId,p_revision:r.revision,p_snapshot:snapshot(r),p_media:receipts}),'prepared');
   const final=await check();const hash=record(staged.prepared).manifestHash;
   if(typeof hash!=='string'||!sameHash(final.link.manifest_hash,hash)) throw new VoteError('conflict');
   return prepared(r,hash);
  },
  async publish(token:string,input:{voteId:string;revision:number;manifestHash:string;consentVersion:1|2}):Promise<ReadyVoteLink> {
   validVoteInput(input.voteId,input.revision);
   if (![1,2].includes(input.consentVersion) || typeof input.manifestHash !== 'string' || !HASH.test(input.manifestHash)) throw new VoteError('invalid');
   const uid = await owner(token); const check = ()=>authority(token,uid,input.voteId,input.revision);
   const current = await check();
   if(input.consentVersion!==(current.reservation.media.some(m=>m.sourceKind==='vote_render')?2:1)) throw new VoteError('invalid');
   if (!sameHash(current.link.manifest_hash,input.manifestHash)) throw new VoteError('conflict');
   await verifiedCopies(token,uid,input.voteId,input.revision,current);
   const tokenValue = voteToken(secret(),input.voteId,input.revision); const hash = tokenHash(tokenValue);
   try {
    accept(await rpc('social_vote_link_commit',{p_owner:uid,p_vote:input.voteId,p_revision:input.revision,p_token_hash:hash,p_manifest_hash:input.manifestHash,p_consent_version:input.consentVersion}),'ready');
   } catch (error) {
    // A failed response may follow a committed transaction. Read before any decision; never delete here.
    const after = await check();
    if (after.link.state !== 'ready' || !sameHash(after.link.token_hash,hash)) throw error;
   }
   const final = await check();
   if (final.link.state !== 'ready' || !sameHash(final.link.token_hash,hash) || !sameHash(final.link.manifest_hash,input.manifestHash) || final.link.consent_version !== input.consentVersion || final.link.consent_revision !== input.revision || !sameHash(final.link.consent_manifest_hash,input.manifestHash)) throw new VoteError('conflict');
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
   const bytes = m.sourceKind==='item'?await readVoteImage(backend,budget,m.destinationBucket,m.destinationPath,row.sha256):await readRender(uid,input.voteId,input.revision,m,input.manifestHash,row.sha256);
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
export function publishVoteLink(token:string,input:{voteId:string;revision:number;manifestHash:string;consentVersion:1|2}) { return votePublication(voteBackend()).publish(token,input); }
export function revokeVoteLink(token:string,input:{voteId:string;expectedRevision:number}) { return votePublication(voteBackend()).revoke(token,input); }
