import { HASH, UUID, VoteBudget, VoteError, record, voteBackend } from '@/lib/server/voteBackend';
import { votePublication } from '@/lib/server/votePublication';
export const runtime = 'nodejs';
export const maxDuration = 60;
const HEADERS = {'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
async function bodyOf(request:Request,budget:VoteBudget):Promise<Record<string,unknown>> {
 if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json') || !request.body) throw new VoteError('invalid');
 const reader = request.body.getReader(); const chunks:Uint8Array[] = []; let size=0;
 try {
  while (true) {
   const {value,done} = await budget.run(()=>reader.read());
   if (done) break;
   size+=value.byteLength; if (size>16*1024) throw new VoteError('too_large'); chunks.push(value);
  }
 } catch (error) { void reader.cancel().catch(()=>console.warn('[social-vote] body cancellation pending')); throw error; }
 finally { reader.releaseLock(); }
 try { return record(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks)))); }
 catch { throw new VoteError('invalid'); }
}
export async function POST(request:Request):Promise<Response> {
 const budget = new VoteBudget(Date.now(),request.signal);
 try {
  const bearer = /^Bearer ([^\s]{1,8192})$/.exec(request.headers.get('authorization') ?? '');
  if (!bearer) throw new VoteError('unauthorized');
  const body = await bodyOf(request,budget);
  const keys:Record<string,string[]> = {
   prepare:['action','voteId','expectedRevision','firstName'], publish:['action','voteId','revision','manifestHash','consentVersion'],
   preview_media:['action','voteId','revision','manifestHash','mediaId'],revoke:['action','voteId','expectedRevision'],
  };
  if (typeof body.action !== 'string' || !Object.hasOwn(keys,body.action) || Object.keys(body).length !== keys[body.action].length || keys[body.action].some(k=>!Object.hasOwn(body,k)) || typeof body.voteId !== 'string' || !UUID.test(body.voteId)) throw new VoteError('invalid');
  const publication = votePublication(voteBackend(),budget);
  let result:unknown;
  switch (body.action) {
   case 'prepare':
    if (typeof body.firstName !== 'string' || typeof body.expectedRevision !== 'number') throw new VoteError('invalid');
    result = await publication.prepare(bearer[1],{voteId:body.voteId,expectedRevision:body.expectedRevision,firstName:body.firstName}); break;
   case 'publish':
    if (body.consentVersion !== 1 || typeof body.revision !== 'number' || typeof body.manifestHash !== 'string' || !HASH.test(body.manifestHash)) throw new VoteError('invalid');
    result = await publication.publish(bearer[1],{voteId:body.voteId,revision:body.revision,manifestHash:body.manifestHash,consentVersion:1}); break;
   case 'preview_media':
    if (typeof body.revision !== 'number' || typeof body.manifestHash !== 'string' || typeof body.mediaId !== 'string') throw new VoteError('invalid');
    return await publication.preview(bearer[1],{voteId:body.voteId,revision:body.revision,manifestHash:body.manifestHash,mediaId:body.mediaId});
   case 'revoke':
    if (typeof body.expectedRevision !== 'number') throw new VoteError('invalid');
    await publication.revoke(bearer[1],{voteId:body.voteId,expectedRevision:body.expectedRevision}); result = {state:'revoked'}; break;
  }
  return Response.json(result,{headers:HEADERS});
 } catch (error) {
  const safe = error instanceof VoteError ? error : new VoteError('unavailable');
  const status = {invalid:400,unauthorized:401,unavailable:503,conflict:409,closed:409,selection_changed:409,limited:429,pending_media:202,pending:503,too_large:413}[safe.code];
  return Response.json({error:safe.code},{status,headers:{...HEADERS,...(safe.retryAfter?{'Retry-After':String(safe.retryAfter)}:{})}});
 }
}
