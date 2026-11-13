import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock('server-only',()=>({}));
vi.mock('@/lib/server/voteCleanup',()=>({purgeVoteCopies:vi.fn()}));
import { purgeVoteCopies } from '@/lib/server/voteCleanup';
import { POST } from './route';
const purge=vi.mocked(purgeVoteCopies);
function request(body:unknown={limit:50},token='synthetic-service'):Request { return new Request('https://margotwardrobe.com/api/internal/social-maintenance',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(body)}); }
afterEach(()=>{vi.unstubAllEnvs();vi.clearAllMocks();});
describe('social maintenance',()=>{
 it('maintenance_auth_is_service_only',async()=>{vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','synthetic-service');for(const token of ['','anon','authenticated','synthetic-servicf'])expect((await POST(request({},token))).status).toBe(401);expect(purge).not.toHaveBeenCalled();});
 it('drains one bounded page and returns only counts',async()=>{vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','synthetic-service');purge.mockResolvedValue({removed:50,pending:0});const r=await POST(request());expect(r.status).toBe(200);expect(await r.json()).toEqual({removed:50,pending:0});expect(purge).toHaveBeenCalledWith(50);expect(r.headers.get('access-control-allow-origin')).toBeNull();});
 it('rejects malformed, extra and unbounded inputs',async()=>{vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','synthetic-service');for(const body of [{limit:0},{limit:101},{limit:1.5},{limit:50,url:'https://other.invalid'},null,[]])expect((await POST(request(body))).status).toBe(400);expect((await POST(new Request('https://margotwardrobe.com',{method:'POST',headers:{authorization:'Bearer synthetic-service'},body:'{'}))).status).toBe(400);expect(purge).not.toHaveBeenCalled();});
 it('maintenance_logs_have_no_pii and failure is retryable',async()=>{vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','synthetic-service');const warn=vi.spyOn(console,'warn').mockImplementation(()=>{});purge.mockRejectedValue(new Error('private-path-token'));expect((await POST(request())).status).toBe(503);expect(JSON.stringify(warn.mock.calls)).not.toContain('private-path-token');warn.mockRestore();});
 it('missing server key refuses before purge',async()=>{vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','');expect((await POST(request())).status).toBe(503);expect(purge).not.toHaveBeenCalled();});
});
