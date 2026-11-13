import 'server-only';
import { createClient } from '@supabase/supabase-js';

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const HASH = /^[0-9a-f]{64}$/;
export type VoteErrorCode = 'social_text_rejected' | 'invalid' | 'unauthorized' | 'unavailable' | 'conflict' | 'closed' | 'selection_changed' | 'limited' | 'pending_media' | 'pending' | 'too_large';
export class VoteError extends Error {
 constructor(readonly code: VoteErrorCode, readonly retryAfter?: number) { super(code); }
}
export function record(value: unknown): Record<string, unknown> {
 if (!value || typeof value !== 'object' || Array.isArray(value)) throw new VoteError('unavailable');
 return value as Record<string, unknown>;
}
export function sameHash(a: unknown, b: string): boolean {
 // Fixed-length hashes only, compared without early exit.
 if (typeof a !== 'string' || !HASH.test(a) || !HASH.test(b)) return false;
 let diff = 0; for (let i = 0; i < 64; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
 return diff === 0;
}
export class VoteBudget {
 readonly deadline: number;
 leaseUntil?: number;
 constructor(readonly startedAt = Date.now(), readonly signal?: AbortSignal, readonly now = Date.now) { this.deadline = startedAt + 50_000; }
 async run<T>(operation: (signal: AbortSignal) => PromiseLike<T>): Promise<T> {
  const remaining = Math.min(10_000, this.deadline - this.now(), this.leaseUntil === undefined ? Infinity : this.leaseUntil - this.now() - 5_000);
  if (this.signal?.aborted || remaining <= 0) throw new VoteError('pending');
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let abort: (() => void) | undefined;
  const stopped = new Promise<never>((_, reject) => {
   abort = () => { controller.abort(); reject(new VoteError('pending')); };
   this.signal?.addEventListener('abort', abort, { once:true });
   timer = setTimeout(abort, remaining);
  });
  try {
   const result = await Promise.race([Promise.resolve().then(() => operation(controller.signal)), stopped]);
   if (this.signal?.aborted || this.now() >= this.deadline || (this.leaseUntil !== undefined && this.now() >= this.leaseUntil-5000)) throw new VoteError('pending');
   return result;
  }
  finally { clearTimeout(timer); if (abort) this.signal?.removeEventListener('abort', abort); }
 }
}
export interface VoteBackend {
 user(token:string, signal:AbortSignal): Promise<string>;
 rpcAsUser(token:string, name:string, args:Record<string,unknown>, signal:AbortSignal): Promise<unknown>;
 rpc(name:string, args:Record<string,unknown>, signal:AbortSignal): Promise<unknown>;
 rows(table:string, columns:string, filters:Record<string,unknown>, limit:number, signal:AbortSignal): Promise<unknown[]>;
 prepareMedia(token:string, owner:string, ids:string[], signal:AbortSignal): Promise<void>;
 download(bucket:string,path:string,signal:AbortSignal): Promise<{bytes:Uint8Array;type:string}>;
 upload(bucket:string,path:string,bytes:Uint8Array,signal:AbortSignal): Promise<void>;
 remove(bucket:string,path:string,signal:AbortSignal): Promise<void>;
 exists(bucket:string,path:string,signal:AbortSignal): Promise<boolean>;
}
/** Server configuration only. The browser never supplies an origin, key or path. */
export function voteBackend(): VoteBackend {
 const origin = process.env.SUPABASE_URL;
 const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
 if (!origin || !key) throw new VoteError('unavailable');
 let url: URL; try { url = new URL(origin); } catch { throw new VoteError('unavailable'); }
 if (url.username || url.password || url.search || url.hash || url.pathname !== '/' ||
  (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['127.0.0.1','localhost','[::1]'].includes(url.hostname)))) throw new VoteError('unavailable');
 const client = (signal:AbortSignal, token?:string) => createClient(origin,key,{
  auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
  global:{...(token ? {headers:{Authorization:`Bearer ${token}`}} : {}),fetch:(input,init) => fetch(input,{...init,signal})},
 });
 const checked = <T>(result:{data:T;error:unknown}) => { if (result.error) {
   const error = result.error as {code?:unknown;message?:unknown};
   throw new VoteError(error.code === 'P0001' && error.message === 'social_text_rejected' ? 'social_text_rejected' : 'unavailable');
  } return result.data; };
 return {
  async user(token,signal) {
   const result = await client(signal).auth.getUser(token);
   if (result.error || !result.data.user || result.data.user.is_anonymous) throw new VoteError('unauthorized');
   return result.data.user.id;
  },
  async rpcAsUser(token,name,args,signal) { return checked(await client(signal,token).rpc(name,args)); },
  async rpc(name,args,signal) { return checked(await client(signal).rpc(name,args)); },
  async rows(table,columns,filters,limit,signal) {
   let query = client(signal).from(table).select(columns);
   for (const [field,value] of Object.entries(filters)) query = query.eq(field,value);
   return checked(await query.limit(Math.min(100,Math.max(1,limit)))) ?? [];
  },
  async prepareMedia(token,owner,ids,signal) {
   // Existing authenticated derivation endpoint. Signed URLs in its response are discarded.
   const result = await client(signal).functions.invoke('social-media',{
    headers:{Authorization:`Bearer ${token}`},body:{action:'items',ownerId:owner,itemIds:ids,size:'large'},
   }); checked(result);
  },
  async download(bucket,path,signal) {
   const result = await client(signal).storage.from(bucket).download(path);
   if (result.error) {
    const error = result.error as {statusCode?:string};
    throw new VoteError(error.statusCode === '404' || error.statusCode === 'NoSuchKey' ? 'pending_media' : 'unavailable');
   }
   const blob = result.data;
   if (!blob) throw new VoteError('pending_media');
   if (blob.size > 5_242_880) throw new VoteError('too_large');
   return {bytes:new Uint8Array(await blob.arrayBuffer()),type:blob.type};
  },
  async upload(bucket,path,bytes,signal) { checked(await client(signal).storage.from(bucket).upload(path,bytes,{contentType:'image/jpeg',upsert:false})); },
  async remove(bucket,path,signal) { checked(await client(signal).storage.from(bucket).remove([path])); },
  async exists(bucket,path,signal) {
   const slash = path.lastIndexOf('/'); const name = path.slice(slash+1);
   const rows = checked(await client(signal).storage.from(bucket).list(path.slice(0,slash),{limit:100,offset:0,search:name}));
   if (!rows || rows.length >= 100) throw new VoteError('unavailable');
   return rows.some(row => row.name === name);
  },
 };
}
export function signingSecret(): string {
 const secret = process.env.SOCIAL_VOTE_LINK_SECRET;
 if (!secret || Buffer.byteLength(secret) < 32) throw new VoteError('unavailable');
 return secret;
}
