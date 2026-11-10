import { describe, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { validateJpeg, sha256, copyVoteImage } from '../server/voteImages';
import { VoteBudget } from '../server/voteBackend';

describe('canonical bytes', () => {
 it('canonical_bytes_only: JPEG printed garment bytes are never transformed', () => {
  const bytes = Buffer.from([255,216,255,224,0,2,1,2,255,217]);
  expect(validateJpeg(bytes, 'image/jpeg')).toBe(bytes);
  expect(sha256(bytes)).toMatch(/^[a-f0-9]{64}$/);
  expect(() => validateJpeg(bytes, 'image/png')).toThrow();
  expect(() => validateJpeg(Buffer.alloc(5242881), 'image/jpeg')).toThrow();
 });
 it('lost upload response reads exact destination and refuses one changed byte', async () => {
  const bytes = Buffer.from([255,216,255,224,0,2,1,2,255,217]);
  const io = { download: vi.fn().mockResolvedValue({ bytes, type:'image/jpeg' }), upload: vi.fn().mockRejectedValue(new Error('lost')) };
  const check = vi.fn().mockResolvedValue(undefined);
  const media = { destinationBucket:'social-media', destinationPath:'reserved' };
  expect(await copyVoteImage(io as never, new VoteBudget(), media as never, bytes, check)).toBe(sha256(bytes));
  io.download.mockResolvedValue({ bytes:Buffer.from([255,216,255,224,0,2,1,3,255,217]),type:'image/jpeg' });
  await expect(copyVoteImage(io as never, new VoteBudget(), media as never, bytes, check)).rejects.toThrow();
 });
});

import { afterEach } from 'vitest';
import { jpegResponse } from '../server/voteImages';
afterEach(()=>vi.useRealTimers());
it('deadline, lease margin and aborted caller do not start another operation',async()=>{
 const op=vi.fn(async()=>1);let now=0;
 const budget=new VoteBudget(0,undefined,()=>now);now=50_000;
 await expect(budget.run(op)).rejects.toMatchObject({code:'pending'});expect(op).not.toHaveBeenCalled();
 now=0;budget.leaseUntil=5000;await expect(budget.run(op)).rejects.toThrow();expect(op).not.toHaveBeenCalled();
 const c=new AbortController();c.abort();await expect(new VoteBudget(Date.now(),c.signal).run(op)).rejects.toThrow();expect(op).not.toHaveBeenCalled();
});
it('remote call aborts at10s and an ambiguous late write cannot resume within expired budget',async()=>{
 vi.useFakeTimers();let signal:AbortSignal|undefined;let finish:((value:number)=>void)|undefined;
 const budget=new VoteBudget();const pending=budget.run(s=>{signal=s;return new Promise<number>(resolve=>{finish=resolve;});});
 const rejected=expect(pending).rejects.toMatchObject({code:'pending'});
 await vi.advanceTimersByTimeAsync(10_000);await rejected;expect(signal?.aborted).toBe(true);
 finish?.(1);await vi.advanceTimersByTimeAsync(40_000);
 const op=vi.fn(async()=>1);await expect(budget.run(op)).rejects.toThrow();expect(op).not.toHaveBeenCalled();
});
it('lease deadline shortens a remote call and timers are cleaned on early success',async()=>{
 vi.useFakeTimers();const budget=new VoteBudget();budget.leaseUntil=Date.now()+6000;
 const pending=budget.run(()=>new Promise(()=>undefined));const rejected=expect(pending).rejects.toThrow();await vi.advanceTimersByTimeAsync(1000);await rejected;expect(vi.getTimerCount()).toBe(0);
 const fast=new VoteBudget();expect(await fast.run(async()=>3)).toBe(3);expect(vi.getTimerCount()).toBe(0);
});
it('streams >4.5MB and <=5MiB as validated bytes without base64 or recompression',async()=>{
 const bytes=Buffer.alloc(4_800_000,7);bytes.set([255,216,255]);bytes.set([255,217],bytes.length-2);
 validateJpeg(bytes,'image/jpeg');const response=jpegResponse(bytes);
 expect(response.body).toBeInstanceOf(ReadableStream);expect(response.headers.get('content-length')).toBe('4800000');
 expect(sha256(new Uint8Array(await response.arrayBuffer()))).toBe(sha256(bytes));
});
