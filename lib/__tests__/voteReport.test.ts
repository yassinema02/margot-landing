import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('server-only',()=>({}));
import { voteAccess } from '../server/voteAccess';
import { VoteBudget, type VoteBackend } from '../server/voteBackend';
import { tokenHash, VOTE_ORIGIN } from '../server/votePublication';
const TOKEN='A'.repeat(43),NOW=Date.parse('2026-11-10T12:34:56Z'),KEY='synthetic-ip-secret-'.repeat(2);
function req(body:unknown={reason:'privacy'},headers:Record<string,string>={},method='POST') {
 return new Request(`${VOTE_ORIGIN}/v/${TOKEN}/report`,{method,headers:{origin:VOTE_ORIGIN,'x-vercel-forwarded-for':'192.0.2.20','content-type':'application/json',...headers},...(method==='POST'?{body:JSON.stringify(body)}:{})});
}
function fixture() {
 const rpc=vi.fn(async(..._args:unknown[]):Promise<unknown>=>({status:'ok'}));
 return {rpc,service:voteAccess({rpc} as unknown as VoteBackend,new VoteBudget(NOW,undefined,()=>NOW))};
}
beforeEach(()=>{vi.stubEnv('VERCEL','1');vi.stubEnv('SOCIAL_VOTE_IP_SECRET',KEY);});
afterEach(()=>{vi.unstubAllEnvs();vi.restoreAllMocks();});
it.each(['harassment','hate','sexual','violence','spam','privacy','other'])('reports only reason %s with existing HMAC windows',async reason=>{
 const f=fixture();const result=await f.service.report(TOKEN,req({reason}));expect(result.status).toBe(204);expect(await result.text()).toBe('');
 const [name,args]=f.rpc.mock.calls[0] as [string,Record<string,unknown>];expect(name).toBe('social_vote_web_report');
 const buckets={minute:Math.floor(NOW/60000)*60,day:Date.parse('2026-11-10T00:00:00Z')/1000,month:Date.parse('2026-11-01T00:00:00Z')/1000};
 expect(args).toEqual({p_token_hash:tokenHash(TOKEN),p_reason:reason,p_keys:Object.fromEntries(Object.entries(buckets).map(([w,bucket])=>[w,{bucket,hash:createHmac('sha256',KEY).update(`margot-vote-ip-v1|${w}|${bucket}|192.0.2.20`).digest('hex')}]))});
 expect(JSON.stringify(args)).not.toContain(TOKEN);expect(JSON.stringify(args)).not.toContain('192.0.2.20');expect(result.headers.get('cache-control')).toContain('no-store');
});
it('rejects extra fields, unknown reasons and invalid body before DB',async()=>{
 const f=fixture();for(const body of [{reason:'no'}, {},{reason:'spam',ownerId:'forged'},[],null]) expect((await f.service.report(TOKEN,req(body))).status).toBe(400);
 expect((await f.service.report(TOKEN,req({reason:'spam',text:'x'.repeat(2100)}))).status).toBe(413);expect(f.rpc).not.toHaveBeenCalled();
});
it('public_report_has_no_identity_or_sibling_content and retry is generic',async()=>{
 const f=fixture();for(let i=0;i<2;i++){const r=await f.service.report(TOKEN,req());expect(r.status).toBe(204);expect(await r.text()).toBe('');}
 for(const [statusName,status] of [['unavailable',404],['limited',429],['invalid',400],['unknown',503]] as const){
 f.rpc.mockResolvedValue({status:statusName,retryAfter:60});const r=await f.service.report(TOKEN,req());expect(r.status).toBe(status);expect(await r.text()).not.toContain('payload');if(status===429)expect(r.headers.get('retry-after')).toBe('60');}
});
it('refuses invalid token/origin/method and unavailable proxy configuration',async()=>{
 const f=fixture();expect((await f.service.report('bad',req())).status).toBe(404);expect((await f.service.report(TOKEN,req(undefined,{origin:'https://evil.example'}))).status).toBe(403);
 expect((await f.service.report(TOKEN,req(undefined,{},'GET'))).status).toBe(405);vi.stubEnv('VERCEL','');expect((await f.service.report(TOKEN,req())).status).toBe(503);expect(f.rpc).not.toHaveBeenCalled();
});
