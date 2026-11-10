import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('server-only',()=>({}));
import { POST as ballot, runtime, maxDuration } from '../(vote)/v/[token]/ballot/route';
import { POST as device, maxDuration as deviceMax } from '../(vote)/v/[token]/device/route';
import { GET as media, maxDuration as mediaMax } from '../(vote)/v/[token]/media/[mediaId]/route';
import * as backend from '../../lib/server/voteBackend';
import { sha256 } from '../../lib/server/voteImages';
import { tokenHash, VOTE_ORIGIN } from '../../lib/server/votePublication';
const TOKEN='A'.repeat(43),MID='00000000-0000-0000-0000-000000000010',OWNER='00000000-0000-0000-0000-000000000001',VOTE='00000000-0000-0000-0000-000000000002';
const context={params:Promise.resolve({token:TOKEN})};
const request=(path:string,init:RequestInit={})=>new Request(`${VOTE_ORIGIN}/v/${TOKEN}/${path}`,{...init,headers:{origin:VOTE_ORIGIN,'x-vercel-forwarded-for':'192.0.2.20',...init.headers}});
function fixture(){
 const jpeg=Buffer.from([255,216,255,224,0,2,7,8,255,217]);
 const snapshot={version:1,occasion:'Dîner',firstName:'Élo',initials:'É',endsAt:new Date(Date.now()+86400000).toISOString(),expiresAt:new Date(Date.now()+8*86400000).toISOString(),closed:false,options:['a','b'].map((choice,n)=>({choice,pieces:[0,1].map(m=>({media_id:`00000000-0000-0000-0000-0000000000${10+2*n+m}`,name:null,category:'tops'}))}))};
 const row={status:'ok',snapshot,my_choice:null};
 const io={rpc:vi.fn(async(n:string):Promise<unknown>=>n==='social_vote_web_access'?row:n==='social_vote_link_read'?snapshot:{status:'ok',choice:'a',closed:false}),rows:vi.fn(async(t:string):Promise<unknown[]>=>t==='style_vote_links'?[{vote_id:VOTE,revision:1,state:'ready',token_hash:tokenHash(TOKEN)}]:[{id:MID,owner_id:OWNER,vote_id:VOTE,revision:1,path:`${OWNER}/votes/${VOTE}/1/${MID}.jpg`,sha256:sha256(jpeg),state:'ready'}]),download:vi.fn(async()=>({bytes:jpeg,type:'image/jpeg'})),user:vi.fn(),upload:vi.fn(),remove:vi.fn(),exists:vi.fn(),prepareMedia:vi.fn()};
 const create=vi.spyOn(backend,'voteBackend').mockReturnValue(io as backend.VoteBackend);return {io,row,snapshot,create};
}
beforeEach(()=>{vi.stubEnv('VERCEL','1');vi.stubEnv('SOCIAL_VOTE_COOKIE_SECRET','synthetic-cookie-secret-'.repeat(2));vi.stubEnv('SOCIAL_VOTE_IP_SECRET','synthetic-ip-secret-'.repeat(2));});
afterEach(()=>{vi.unstubAllEnvs();vi.restoreAllMocks();});
it('malformed_token_no_db route and deployment constants',async()=>{
 const f=fixture(),bad={params:Promise.resolve({token:'bad'})};
 for(const response of [await ballot(request('ballot',{method:'POST'}),bad),await device(request('device',{method:'POST'}),bad),await media(request('media/'+MID),{params:Promise.resolve({token:'bad',mediaId:MID})})]){
  expect(response.status).toBe(404);expect(response.headers.get('cache-control')).toContain('no-store');expect(await response.json()).toEqual({error:'unavailable'});
 }
 expect(f.create).not.toHaveBeenCalled();expect(runtime).toBe('nodejs');expect([maxDuration,deviceMax,mediaMax]).toEqual([60,60,60]);
});
it('handlers require user POST, canonical Origin and cookie roundtrip before ballot',async()=>{
 const f=fixture();
 expect((await device(request('device'),context)).status).toBe(405);expect((await ballot(request('ballot'),context)).status).toBe(405);
 const forged=await device(request('device',{method:'POST',headers:{origin:'https://evil.example'}}),context);expect(forged.status).toBe(403);expect(f.io.rpc).not.toHaveBeenCalled();
 expect((await ballot(request('ballot',{method:'POST'}),context)).status).toBe(409);
 const first=await device(request('device',{method:'POST'}),context),cookie=first.headers.get('set-cookie')!.split(';')[0];
 expect(await first.json()).toEqual({status:'ok',confirmed:false});
 const result=await ballot(request('ballot',{method:'POST',headers:{cookie,'content-type':'application/json'},body:JSON.stringify({choice:'a'})}),context);
 expect(result.status).toBe(200);expect(await result.json()).toEqual({status:'ok',choice:'a',closed:false});expect(result.headers.has('set-cookie')).toBe(false);
});
it('handlers preserve limited429, service503 and unavailable404 with private error headers',async()=>{
 const f=fixture();
 for(const [status,code] of [['limited',429],['unavailable',404],['invalid',404],['mystery',503]] as const){
  f.io.rpc.mockResolvedValue({status,retryAfter:60});
  for(const res of [await device(request('device',{method:'POST'}),context),await media(request('media/'+MID),{params:Promise.resolve({token:TOKEN,mediaId:MID})})]){
   expect(res.status).toBe(code);expect(res.headers.get('cache-control')).toContain('no-store');expect(res.headers.get('referrer-policy')).toBe('no-referrer');expect(res.headers.get('x-robots-tag')).toContain('noindex');if(code===429)expect(res.headers.get('retry-after')).toBe('60');
  }
 }
 f.io.rpc.mockRejectedValue(Error('secret backend detail'));const res=await device(request('device',{method:'POST'}),context);expect(res.status).toBe(503);expect(await res.text()).not.toContain('secret');
});
it('expired_media_and_og: image handler and future OG read share denial, never vote on GET',async()=>{
 const f=fixture(),ctx={params:Promise.resolve({token:TOKEN,mediaId:MID})};
 const res=await media(request('media/'+MID),ctx);expect(res.status).toBe(200);expect(res.headers.get('content-type')).toBe('image/jpeg');expect(res.headers.has('set-cookie')).toBe(false);
 expect(f.io.rpc.mock.calls.every(([n])=>n==='social_vote_web_access'||n==='social_vote_link_read')).toBe(true);
 f.snapshot.expiresAt=new Date(Date.now()-1).toISOString();const expired=await media(request('media/'+MID),ctx);expect(expired.status).toBe(404);
});
it('Next header rules disable caching and referrer for every public vote path',async()=>{
 // Same config consumed by Next, without starting a server or claiming CDN proof.
 // @ts-expect-error JavaScript config has no declaration file.
 const {default:config}=await import('../../next.config.mjs');
 const rules=await config.headers(),index=rules.findIndex((r:{source:string})=>r.source==='/v/:path*');expect(index).toBeGreaterThan(0);
 const headers=new Headers(rules[index].headers.map((h:{key:string;value:string})=>[h.key,h.value]));expect(headers.get('cache-control')).toContain('no-store');expect(headers.get('referrer-policy')).toBe('no-referrer');expect(headers.get('x-robots-tag')).toContain('noindex');
});

it('installed Next optimizer matcher permits every static asset and rejects vote aliases',async()=>{
 // @ts-expect-error JavaScript config has no declaration file.
 const {default:config}=await import('../../next.config.mjs');
 const {hasLocalMatch}=await import('next/dist/shared/lib/match-local-pattern');
 const {readdir}=await import('node:fs/promises');
 const paths=await readdir(new URL('../../public',import.meta.url),{recursive:true});
 for(const path of paths.filter(p=>/\.(png|webp|svg)$/.test(p)))expect(hasLocalMatch(config.images.localPatterns,'/'+path)).toBe(true);
 for(const path of [`/v/${TOKEN}/media/${MID}`,`/%76/${TOKEN}/media/${MID}`,`/screens/%2e%2e%2fv/${TOKEN}/media/${MID}`,`/screens/../v/${TOKEN}/media/${MID}`,`/screens/en/home.webp/../../../v/${TOKEN}/media/${MID}`,`/mascot/mascot-welcome.png?url=/v/${TOKEN}/media/${MID}`])expect(hasLocalMatch(config.images.localPatterns,path)).toBe(false);
});

it('installed optimizer validator rejects absolute canonical vote URLs and encoded/normalized aliases',async()=>{
 // @ts-expect-error JavaScript config has no declaration file.
 const {default:config}=await import('../../next.config.mjs');
 const {ImageOptimizerCache}=await import('next/dist/server/image-optimizer');
 const {imageConfigDefault}=await import('next/dist/shared/lib/image-config');
 type Params=Parameters<typeof ImageOptimizerCache.validateParams>;
 const validate=(url:string)=>ImageOptimizerCache.validateParams({headers:{accept:'image/webp'}} as Params[0],{url,w:'640',q:'75'},{...config,images:{...imageConfigDefault,...config.images}} as Params[2],false);
 expect(validate('/screens/en/home.webp')).toMatchObject({href:'/screens/en/home.webp',isAbsolute:false});
 for(const url of [`${VOTE_ORIGIN}/v/${TOKEN}/media/${MID}`,`https://www.margotwardrobe.com/%76/${TOKEN}/media/${MID}`,`https://www.margotwardrobe.com/screens/../v/${TOKEN}/media/${MID}`,`//www.margotwardrobe.com/v/${TOKEN}/media/${MID}`,`/v/${TOKEN}/media/${MID}`,`/%2576/${TOKEN}/media/${MID}`,`/screens/en/%2e%2e/%2e%2e/v/${TOKEN}/media/${MID}`])expect(validate(url)).toHaveProperty('errorMessage');
});
