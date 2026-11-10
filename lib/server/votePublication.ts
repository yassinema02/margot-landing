import 'server-only';
import { createHmac, createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { HASH, UUID, VoteBackend, VoteBudget, VoteError, record, sameHash, signingSecret, voteBackend } from './voteBackend';
import { copyVoteImage, readVoteImage, sha256, jpegResponse } from './voteImages';

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
 if (['invalid','conflict','closed','selection_changed','unavailable'].includes(String(row.status))) throw new VoteError(row.status as 'invalid');
 throw new VoteError('unavailable');
}

type Authority = {reservation:VoteLinkReservation;link:Record<string,unknown>;media:Record<string,unknown>[]};
export function votePublication(backend:VoteBackend,budget = new VoteBudget(),secret:()=>string = signingSecret) {
 async function owner(token:string): Promise<string> {
  if (!token || token.length > 8192 || /\s/.test(token)) throw new VoteError('unauthorized');
  return budget.run(signal=>backend.user(token,signal));
 }
 const rpc = (name:string,args:Record<string,unknown>)=>budget.run(signal=>backend.rpc(name,args,signal));
 async function authority(token:string,uid:string,vote:string,revision:number): Promise<Authority> {
  if (await owner(token) !== uid) throw new VoteError('unauthorized');
  const votes = await budget.run(signal=>backend.rows('style_votes','id,owner_id,link_revision,link_state,deleted_at,closed_at,ends_at',{id:vote,owner_id:uid},1,signal));
  const v = record(votes[0]);
  if (v.id !== vote || v.owner_id !== uid || v.deleted_at !== null || v.link_state === 'revoked' || v.link_revision !== revision) throw new VoteError('conflict');
  if ((await rpc('social_media_viewer_ok',{p_viewer:uid})) !== true) throw new VoteError('unavailable');
  const links = await budget.run(signal=>backend.rows('style_vote_links','state,preparation,manifest_hash,token_hash,consent_version,consent_revision,consent_manifest_hash,snapshot',{vote_id:vote,revision},1,signal));
  const link = record(links[0]);
  if (!['pending','ready'].includes(String(link.state)) || v.link_state !== link.state) throw new VoteError('conflict');
  const reservation = parseReservation(link.preparation,uid,vote,revision);
  const stamp = budget.now();
  if (!date(v.ends_at)) throw new VoteError('unavailable');
  if (link.state === 'pending') {
   budget.leaseUntil = Date.parse(reservation.leaseUntil);
   if (stamp >= budget.leaseUntil) throw new VoteError('conflict');
   if (v.closed_at !== null || stamp >= Date.parse(v.ends_at)) throw new VoteError('closed');
  } else {
   budget.leaseUntil = undefined;
   if (v.closed_at !== null && !date(v.closed_at)) throw new VoteError('unavailable');
   if (stamp >= Date.parse((v.closed_at as string|null) ?? v.ends_at) + 7*86400_000) throw new VoteError('unavailable');
  }
  const media = (await budget.run(signal=>backend.rows('style_vote_link_media','id,owner_id,vote_id,revision,path,source_item_id,source_version,source_path,sha256,state,lease_until',{owner_id:uid,vote_id:vote,revision},19,signal))).map(record);
  if (media.length !== reservation.media.length || new Set(media.map(m=>m.id)).size !== media.length) throw new VoteError('conflict');
  for (const m of reservation.media) {
   const row = media.find(row=>row.id===m.mediaId);
   if (!row || row.path !== m.destinationPath || row.source_item_id !== m.itemId || row.source_version !== m.sourceVersion || row.source_path !== m.sourcePath || row.state !== (link.state === 'ready'?'ready':'staged') || !date(row.lease_until)) throw new VoteError('conflict');
   if (link.state === 'pending') budget.leaseUntil = Math.min(budget.leaseUntil ?? Infinity,Date.parse(row.lease_until));
  }
  if (budget.signal?.aborted || budget.now() >= budget.deadline || (budget.leaseUntil !== undefined && budget.now() >= budget.leaseUntil-5000)) throw new VoteError('pending');
  return {reservation,link,media};
 }
 async function source(uid:string,m:ReservedMedia) {
  const resolved = await rpc('social_media_resolve_items',{p_viewer:uid,p_item_ids:[m.itemId]});
  if (!Array.isArray(resolved) || resolved.length !== 1) throw new VoteError('selection_changed');
  const item = record(resolved[0]);
  if (item.item_id !== m.itemId || item.owner_id !== uid || item.version !== m.sourceVersion) throw new VoteError('selection_changed');
  const rows = await budget.run(signal=>backend.rows('social_media_copies','source_kind,source_id,owner_id,version,large_path,encrypted',{source_kind:'item',source_id:m.itemId,owner_id:uid},1,signal));
  if (rows.length === 0) throw new VoteError('pending_media');
  const copy = record(rows[0]);
  if (copy.source_kind !== 'item' || copy.source_id !== m.itemId || copy.owner_id !== uid || copy.version !== m.sourceVersion || copy.large_path !== m.sourcePath || copy.encrypted !== false) throw new VoteError('selection_changed');
 }
 async function verifiedCopies(token:string,uid:string,vote:string,revision:number,initial:Authority) {
  const receipts:Array<{mediaId:string;sha256:string}> = [];
  for (const m of initial.reservation.media) {
   const current = await authority(token,uid,vote,revision);
   const hash = current.media.find(row=>row.id===m.mediaId)?.sha256;
   if (typeof hash !== 'string' || !HASH.test(hash)) throw new VoteError('conflict');
   const bytes = await readVoteImage(backend,budget,m.destinationBucket,m.destinationPath,hash);
   await authority(token,uid,vote,revision);
   receipts.push({mediaId:m.mediaId,sha256:sha256(bytes)});
  }
  return receipts;
 }
 return {
  async prepare(token:string,input:{voteId:string;expectedRevision:number;firstName:string}):Promise<PreparedVoteLink> {
   validVoteInput(input.voteId,input.expectedRevision);
   if (!text(input.firstName,40) || input.firstName !== input.firstName.trim()) throw new VoteError('invalid');
   const uid = await owner(token);
   const begin = record(await rpc('social_vote_link_begin',{p_owner:uid,p_vote:input.voteId,p_expected_revision:input.expectedRevision,p_first_name:input.firstName}));
   if (begin.status === 'pending_media') {
    if (begin.voteId !== input.voteId || begin.revision !== input.expectedRevision || !Array.isArray(begin.missingItemIds) || begin.missingItemIds.length < 1 || begin.missingItemIds.length > 18 || begin.missingItemIds.some(id=>typeof id!=='string'||!UUID.test(id))) throw new VoteError('unavailable');
    if (await owner(token) !== uid) throw new VoteError('unauthorized');
    await budget.run(signal=>backend.prepareMedia(token,uid,begin.missingItemIds as string[],signal));
    if (await owner(token) !== uid) throw new VoteError('unauthorized');
    throw new VoteError('pending_media');
   }
   if (!['reserved','prepared','ready'].includes(String(begin.status))) accept(begin,'reserved');
   const check = ()=>authority(token,uid,input.voteId,input.expectedRevision);
   const current = await check(); const r = current.reservation;
   if (r.firstName !== input.firstName) throw new VoteError('selection_changed');
   if (begin.status === 'reserved' && !isDeepStrictEqual(parseReservation(begin.reservation,uid,input.voteId,input.expectedRevision),r)) throw new VoteError('conflict');
   if (current.link.manifest_hash !== null) {
    if (typeof current.link.manifest_hash !== 'string' || !HASH.test(current.link.manifest_hash)) throw new VoteError('unavailable');
    await verifiedCopies(token,uid,input.voteId,input.expectedRevision,current);
    await check(); return prepared(r,current.link.manifest_hash);
   }
   const receipts:Array<{mediaId:string;sha256:string}> = [];
   for (const m of r.media) {
    await check();
    let bytes:Uint8Array;
    try { await source(uid,m); bytes = await readVoteImage(backend,budget,m.sourceBucket,m.sourcePath); }
    catch (error) {
     if (!(error instanceof VoteError) || error.code !== 'pending_media') throw error;
     await check();
     await budget.run(signal=>backend.prepareMedia(token,uid,[m.itemId],signal));
     await check(); throw new VoteError('pending_media');
    }
    await check(); await source(uid,m);
    receipts.push({mediaId:m.mediaId,sha256:await copyVoteImage(backend,budget,m,bytes,check)});
   }
   // No receipt can be staged before every physical destination has been read back.
   await check();
   const staged = accept(await rpc('social_vote_link_stage',{p_owner:uid,p_vote:input.voteId,p_revision:r.revision,p_snapshot:snapshot(r),p_media:receipts}),'prepared');
   const final = await check(); const hash = record(staged.prepared).manifestHash;
   if (typeof hash !== 'string' || !sameHash(final.link.manifest_hash,hash)) throw new VoteError('conflict');
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
   const current = await check();
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
