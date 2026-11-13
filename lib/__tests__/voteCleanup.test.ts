import { expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { purgeVoteCopiesWith } from '../server/voteCleanup';
import { VoteBudget } from '../server/voteBackend';
it('does not ack ambiguous physical removal', async () => {
 const backend = { rpc:vi.fn().mockResolvedValue([{ mediaId:'00000000-0000-0000-0000-000000000001',sweepAt:'2026-11-10T00:00:00.123456+00:00',bucket:'social-media',path:'00000000-0000-0000-0000-000000000002/votes/00000000-0000-0000-0000-000000000003/1/00000000-0000-0000-0000-000000000001.jpg',leaseUntil:'2026-11-10T00:01:00Z' }]),remove:vi.fn().mockRejectedValue(new Error('lost')),exists:vi.fn().mockResolvedValue(false) };
 expect(await purgeVoteCopiesWith(backend as never,new VoteBudget(),1)).toEqual({removed:0,pending:1});
 expect(backend.rpc).toHaveBeenCalledTimes(1);
});

it('removes then verifies absence then ACKs opaque microseconds unchanged',async()=>{
 const sweepAt='2026-11-10T00:00:00.123456+00:00';const mediaId='00000000-0000-0000-0000-000000000001';
 const candidate={mediaId,sweepAt,bucket:'social-media',path:`00000000-0000-0000-0000-000000000002/votes/00000000-0000-0000-0000-000000000003/1/${mediaId}.jpg`,leaseUntil:'2026-11-10T00:01:00Z'};
 const calls:string[]=[];const backend={rpc:vi.fn(async(name:string)=>{calls.push(name);return name==='social_vote_link_cleanup_candidates'?[candidate]:null;}),remove:vi.fn(async()=>{calls.push('remove');}),exists:vi.fn(async()=>{calls.push('absence');return false;})};
 expect(await purgeVoteCopiesWith(backend as never,new VoteBudget(),1)).toEqual({removed:1,pending:0});
 expect(calls).toEqual(['social_vote_link_cleanup_candidates','remove','absence','social_vote_link_cleanup_ack']);
 expect(backend.rpc.mock.calls[1][0]).toBe('social_vote_link_cleanup_ack');
 expect((backend.rpc.mock.calls[1] as unknown[])[1]).toEqual({p_receipts:[{mediaId,sweepAt}]});
});
it('retains inventory when a late upload is still present and rejects non-reserved paths',async()=>{
 const candidate={mediaId:'00000000-0000-0000-0000-000000000001',sweepAt:'2026-11-10T00:00:00.123456+00:00',bucket:'social-media',path:'00000000-0000-0000-0000-000000000002/votes/00000000-0000-0000-0000-000000000003/1/00000000-0000-0000-0000-000000000001.jpg',leaseUntil:'2026-11-10T00:01:00Z'};
 const backend={rpc:vi.fn().mockResolvedValue([candidate]),remove:vi.fn().mockResolvedValue(undefined),exists:vi.fn().mockResolvedValue(true)};
 expect(await purgeVoteCopiesWith(backend as never,new VoteBudget(),1)).toEqual({removed:0,pending:1});expect(backend.rpc).toHaveBeenCalledTimes(1);
 candidate.path='../private.jpg';await expect(purgeVoteCopiesWith(backend as never,new VoteBudget(),1)).rejects.toThrow();expect(backend.remove).toHaveBeenCalledTimes(1);
});
