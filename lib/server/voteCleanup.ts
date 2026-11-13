import 'server-only';
import { UUID, VoteBackend, VoteBudget, VoteError, record, voteBackend } from './voteBackend';
export async function purgeVoteCopiesWith(backend:VoteBackend,budget:VoteBudget,limit:number):Promise<{removed:number;pending:number}> {
 if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new VoteError('invalid');
 const result = await budget.run(signal=>backend.rpc('social_vote_link_cleanup_candidates',{p_limit:limit},signal));
 if (!Array.isArray(result) || result.length > limit) throw new VoteError('unavailable');
 const candidates = result.map(value=>{
  const c = record(value);
  if (typeof c.mediaId !== 'string' || !UUID.test(c.mediaId) || typeof c.sweepAt !== 'string' || !Number.isFinite(Date.parse(c.sweepAt)) || c.bucket !== 'social-media' || typeof c.path !== 'string' || !new RegExp(`^[a-f0-9-]{36}/votes/[a-f0-9-]{36}/[1-9][0-9]*/${c.mediaId}\\.jpg$`).test(c.path) || typeof c.leaseUntil !== 'string' || !Number.isFinite(Date.parse(c.leaseUntil))) throw new VoteError('unavailable');
  const segments = c.path.split('/'); if (!UUID.test(segments[0]) || !UUID.test(segments[2])) throw new VoteError('unavailable');
  return {mediaId:c.mediaId,sweepAt:c.sweepAt,bucket:c.bucket,path:c.path};
 });
 if (new Set(candidates.map(c=>c.mediaId)).size !== candidates.length) throw new VoteError('unavailable');
 let removed = 0;
 for (const c of candidates) {
  try {
   await budget.run(signal=>backend.remove(c.bucket,c.path,signal));
   if (await budget.run(signal=>backend.exists(c.bucket,c.path,signal))) continue;
   // Keep timestamp verbatim. Old or overlapping sweep ACKs remain harmless in SQL.
   await budget.run(signal=>backend.rpc('social_vote_link_cleanup_ack',{p_receipts:[{mediaId:c.mediaId,sweepAt:c.sweepAt}]},signal));
   removed++;
  } catch {
   // Inventory remains pending for another bounded pass, including late uploads.
   console.warn('[social-vote] cleanup pending');
  }
 }
 return {removed,pending:candidates.length-removed};
}
/** Local bounded primitive for T8; deliberately no HTTP route or scheduler. */
export function purgeVoteCopies(limit:number):Promise<{removed:number;pending:number}> { return purgeVoteCopiesWith(voteBackend(),new VoteBudget(),limit); }
