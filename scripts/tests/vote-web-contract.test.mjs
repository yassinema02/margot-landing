import { describe, expect, it } from 'vitest';
import { assertLoopbackUrl, checkConfig, Barrier, cookieFromResponse, assertFinalEvidence } from './vote-web-contract.mjs';

describe('physical vote contract safety boundaries (no network)', () => {
  it.each(['https://example.com', 'http://localhost:50021', 'http://127.1:50021', 'http://2130706433:50021', 'http://127.0.0.1.evil:50021', 'http://user@127.0.0.1:50021', 'http://127.0.0.1:50021/#x', 'http://127.0.0.1:50021\n'])('rejects ambiguous or non-loopback origin %s', value => {
    expect(() => assertLoopbackUrl(value)).toThrow();
  });
  it('accepts only literal loopback origins with bounded ports', () => {
    expect(assertLoopbackUrl('http://127.0.0.1:50025').port).toBe('50025');
    expect(assertLoopbackUrl('https://127.0.0.1:50024').protocol).toBe('https:');
    expect(() => assertLoopbackUrl('http://127.0.0.1:0')).toThrow();
    expect(() => assertLoopbackUrl('http://127.0.0.1:50025/path')).toThrow();
  });
  it('validates every destination before a caller can create clients', () => {
    expect(() => checkConfig({ apiOrigin: 'http://127.0.0.1:50025', webOrigin: 'https://production.invalid', directOrigin: 'http://127.0.0.1:50021' })).toThrow();
  });
  it('keeps a real response blocked until explicit release', async () => {
    const gate = new Barrier(); gate.arm({ method: 'POST', path: '/rest/v1/rpc/social_vote_link_commit', phase: 'after', mode: 'hold' });
    let forwarded = false;
    const held = gate.hit({ method: 'POST', path: '/rest/v1/rpc/social_vote_link_commit', phase: 'after' }).then(() => { forwarded = true; });
    await gate.wait(); expect(forwarded).toBe(false);
    gate.release(); await held; expect(forwarded).toBe(true);
    expect(gate.snapshot().hits).toBe(1);
  });
  it('matches only the requested attempt and does not stall another RPC', async () => {
    const gate = new Barrier(); gate.arm({ method: 'POST', path: '/storage/v1/object/social-media/', prefix: true, phase: 'before', mode: 'fail', nth: 2 });
    expect(await gate.hit({ method: 'POST', path: '/rest/v1/rpc/social_vote_link_commit', phase: 'before' })).toBe('pass');
    expect(await gate.hit({ method: 'POST', path: '/storage/v1/object/social-media/a', phase: 'before' })).toBe('pass');
    expect(await gate.hit({ method: 'POST', path: '/storage/v1/object/social-media/b', phase: 'before' })).toBe('fail');
    expect(await gate.hit({ method: 'POST', path: '/storage/v1/object/social-media/c', phase: 'before' })).toBe('pass');
    gate.release();
  });
  it('targets the owned purge body without failing another inventory item', async () => {
    const gate = new Barrier(); gate.arm({ method: 'DELETE', path: '/storage/v1/object/social-media', phase: 'before', mode: 'fail', bodyIncludes: 'owner/votes/target.jpg' });
    const meta = { method: 'DELETE', path: '/storage/v1/object/social-media', phase: 'before' };
    expect(await gate.hit({ ...meta, body: '{"prefixes":["owner/votes/other.jpg"]}' })).toBe('pass');
    expect(await gate.hit({ ...meta, body: '{"prefixes":["owner/votes/target.jpg"]}' })).toBe('fail');
    expect(gate.snapshot().hits).toBe(1); gate.release();
  });
  it('does not permit replacing an armed gate or waiting forever', async () => {
    const gate = new Barrier(); gate.arm({ method: 'POST', path: '/x', phase: 'after', mode: 'hold' });
    expect(() => gate.arm({})).toThrow();
    await expect(gate.wait(1)).rejects.toThrow('barrier_timeout');
    gate.release();
  });
  it('enforces secure cookie attributes without inventing a cookie', () => {
    const value = '__Secure-margot_vote_device=abc.def; HttpOnly; Secure; SameSite=Lax; Path=/v; Max-Age=691200';
    expect(cookieFromResponse(value)).toBe('__Secure-margot_vote_device=abc.def');
    expect(() => cookieFromResponse(value.replace('; Secure', ''))).toThrow();
    expect(() => cookieFromResponse(value.replace('Path=/v', 'Path=/'))).toThrow();
  });
  it('requires independent material cleanup, late-commit refusal and no new outcomes', () => {
    const base = { storageFilesAfterPurge: [], lateCommitRejected: true, publicGetAfterRevoke: { status: 404 }, newAiCalls: 0, newWearOutcomes: 0, authUsersAfterPurge: [{ status: 404 }], physicalScanCompleted: true };
    expect(() => assertFinalEvidence(base)).not.toThrow();
    for (const change of [{storageFilesAfterPurge:['orphan']},{lateCommitRejected:false},{publicGetAfterRevoke:{status:200}},{newAiCalls:1},{newWearOutcomes:1},{authUsersAfterPurge:[{status:200}]},{physicalScanCompleted:false}]) {
      expect(() => assertFinalEvidence({...base,...change})).toThrow();
    }
  });
});
