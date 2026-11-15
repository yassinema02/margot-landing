import 'server-only';
import { createHash } from 'node:crypto';
import { VoteBackend, VoteBudget, VoteError, sameHash } from './voteBackend';
import type { ReservedMedia } from './votePublication';
export const MAX_IMAGE_BYTES = 5_242_880;
export function sha256(bytes:Uint8Array): string { return createHash('sha256').update(bytes).digest('hex'); }
/** Technical envelope only. Provenance is checked separately, no content verdict or codec. */
export function validateJpeg(bytes:Uint8Array,type:string): Uint8Array {
 if (bytes.byteLength > MAX_IMAGE_BYTES) throw new VoteError('too_large');
 if (type.toLowerCase().split(';')[0] !== 'image/jpeg' || bytes.length < 4 || bytes[0] !== 255 || bytes[1] !== 216 || bytes[2] !== 255 || bytes.at(-2) !== 255 || bytes.at(-1) !== 217) throw new VoteError('selection_changed');
 return bytes;
}
export async function readVoteImage(backend:VoteBackend,budget:VoteBudget,bucket:string,path:string,expected?:string): Promise<Uint8Array> {
 const data = await budget.run(signal => backend.download(bucket,path,signal));
 const bytes = validateJpeg(data.bytes,data.type);
 if (expected !== undefined && !sameHash(sha256(bytes),expected)) throw new VoteError('conflict');
 return bytes;
}
/** Mandatory group gates: no caller can opt out of revalidation around writes/readback. */
export async function copyVoteImages(backend:VoteBackend,budget:VoteBudget,media:ReservedMedia[],bytes:Uint8Array[],authority:()=>Promise<unknown>): Promise<Array<{mediaId:string;sha256:string}>> {
 if (!media.length || media.length>2 || bytes.length!==media.length) throw new VoteError('invalid');
 const receipts=media.map((m,i)=>({mediaId:m.mediaId,sha256:sha256(bytes[i])}));
 await authority(); // Post-download gate immediately before the first mutation.
 // A collision or lost response is accepted only by exact readback. Never overwrite/delete.
 await Promise.allSettled(media.map((m,i)=>budget.run(signal=>backend.upload(m.destinationBucket,m.destinationPath,bytes[i],signal))));
 await authority();
 const reads=await Promise.allSettled(media.map((m,i)=>readVoteImage(backend,budget,m.destinationBucket,m.destinationPath,receipts[i].sha256)));
 await authority();
 for (const read of reads) if(read.status==='rejected') throw read.reason;
 return receipts;
}
/** Streaming starts only after complete hash validation and the caller's final authority read. */
export function jpegResponse(bytes:Uint8Array): Response {
 let offset = 0;
 return new Response(new ReadableStream<Uint8Array>({
  pull(controller) {
   if (offset >= bytes.length) { controller.close(); return; }
   const next = Math.min(bytes.length,offset+64*1024); controller.enqueue(bytes.slice(offset,next)); offset=next;
  },
 }),{status:200,headers:{'Content-Type':'image/jpeg','Content-Length':String(bytes.byteLength),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow','Referrer-Policy':'no-referrer'}});
}
