import {expect,it,vi,beforeEach} from 'vitest';
vi.mock('server-only',()=>({}));
const io=vi.hoisted(()=>({read:vi.fn(),media:vi.fn(),images:[] as unknown[],afterRender:undefined as undefined|(()=>void),renderer:undefined as undefined|((tree:unknown,options:ResponseInit)=>Response)}));
vi.mock('@/lib/server/voteAccess',()=>({readPublicVote:io.read,readPublicVoteMedia:io.media}));
vi.mock('next/og',()=>({ImageResponse:class extends Response {constructor(tree:unknown,options:ResponseInit){super(new ReadableStream({pull(controller){io.afterRender?.();controller.enqueue(new TextEncoder().encode('image'));controller.close();}}),options);io.images.push(tree);if(io.renderer)return io.renderer(tree,options);}}}));
vi.mock('next/headers',()=>({headers:async()=>new Headers({'accept-language':'fr','x-vercel-forwarded-for':'192.0.2.1'})}));
import {GET} from '../(vote)/v/[token]/og/route';
import Page,{generateMetadata} from '../(vote)/v/[token]/page';
import type {PublicVoteSnapshot} from '@/lib/server/voteAccess';
function snapshot():PublicVoteSnapshot {return {version:1,firstName:'Élo',initials:'É',occasion:'Dîner',endsAt:'2099-01-01T00:00:00Z',expiresAt:'2099-01-08T00:00:00Z',closed:false,options:['a','b'].map(choice=>({choice,pieces:[{name:'Pull',category:'tops',imageUrl:`https://www.margotwardrobe.com/v/${token}/media/00000000-0000-0000-0000-000000000001`},{name:null,category:'jeans',imageUrl:`https://www.margotwardrobe.com/v/${token}/media/00000000-0000-0000-0000-000000000002`}]})) as PublicVoteSnapshot['options']};}
const token='A'.repeat(43),ctx={params:Promise.resolve({token})},req=new Request(`https://www.margotwardrobe.com/v/${token}/og`,{headers:{'x-vercel-forwarded-for':'192.0.2.1'}});
beforeEach(()=>{io.read.mockReset().mockResolvedValue({status:'ok',snapshot:snapshot(),myChoice:null});io.media.mockReset().mockImplementation(async()=>new Response(new Uint8Array([255,216,255,217]),{headers:{'content-type':'image/jpeg'}}));io.images.length=0;io.afterRender=undefined;io.renderer=undefined;});
it('expired_media_and_og: denies before bytes and emits neutral metadata for each refusal',async()=>{
 for(const [status,code] of [['unavailable',404],['limited',429],['service_unavailable',503]] as const){io.read.mockResolvedValue({status,retryAfter:10});const res=await GET(req,ctx);expect(res.status).toBe(code);expect(res.headers.get('cache-control')).toContain('no-store');expect(JSON.stringify(io.images.at(-1))).not.toContain('Élo');const meta=await generateMetadata(ctx);expect(JSON.stringify(meta)).not.toContain(token);expect(meta.robots).toEqual({index:false,follow:false});}
 expect(io.media).not.toHaveBeenCalled();
});
it('uses direct T4 media reads with visitor context, exact bytes and final lease read',async()=>{
 const res=await GET(req,ctx);expect(res.status).toBe(200);expect(io.media).toHaveBeenCalledTimes(4);expect(io.media.mock.calls[0][2]).toBe(req);expect(io.read).toHaveBeenCalledTimes(2);expect(JSON.stringify(io.images[0])).toContain('data:image/jpeg;base64,/9j/2Q==');expect(res.headers.has('set-cookie')).toBe(false);
 const meta=await generateMetadata(ctx);expect(JSON.stringify(meta)).toContain(`/v/${token}/og`);expect(JSON.stringify(meta)).not.toContain('Élo');
});
it('revocation or failed media produces only neutral card',async()=>{
 io.media.mockResolvedValue(new Response('',{status:404}));expect((await GET(req,ctx)).status).toBe(404);expect(JSON.stringify(io.images[0])).not.toContain('Élo');
 io.media.mockImplementation(async()=>new Response(new Uint8Array([255,216,255,217])));io.read.mockResolvedValueOnce({status:'ok',snapshot:snapshot(),myChoice:null}).mockResolvedValueOnce({status:'unavailable'});expect((await GET(req,ctx)).status).toBe(404);expect(JSON.stringify(io.images[1])).not.toContain('Élo');
});
it('SSR reads public projection without initializing device',async()=>{const page=await Page(ctx);expect(page.props.result.status).toBe('ok');expect(io.read.mock.calls[0][1].headers.get('x-vercel-forwarded-for')).toBe('192.0.2.1');});

it('real Next ImageResponse renders the neutral SVG tree to PNG bytes',async()=>{
 io.read.mockResolvedValue({status:'unavailable'});await GET(req,ctx);
 const {ImageResponse}=await vi.importActual<typeof import('next/og')>('next/og');
 const image=new ImageResponse(io.images[0] as React.ReactElement,{width:1200,height:630});
 const bytes=new Uint8Array(await image.arrayBuffer());expect([...bytes.slice(0,8)]).toEqual([137,80,78,71,13,10,26,10]);
});

it('finishes rendering before final authoritative read, refusing revocation during lazy render',async()=>{
 // A stream is intentionally held until the generated PNG is consumed.
 io.afterRender=()=>io.read.mockResolvedValue({status:'unavailable'});
 const res=await GET(req,ctx);expect(res.status).toBe(404);expect(await res.text()).not.toContain('Élo');
 io.afterRender=undefined;
});


it('renders populated deterministic OG through the real Next engine and rechecks revocation after rendering',async()=>{
 const {ImageResponse}=await vi.importActual<typeof import('next/og')>('next/og');
 const jpeg=Buffer.from('/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAEAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKAAB//Z','base64');
 io.media.mockImplementation(async()=>new Response(jpeg,{headers:{'content-type':'image/jpeg'}}));
 io.renderer=(tree,options)=>new ImageResponse(tree as React.ReactElement,{...options,width:1200,height:630});
 const response=await GET(req,ctx);expect(response.status).toBe(200);expect(response.headers.get('content-type')).toBe('image/png');
 const bytes=new Uint8Array(await response.arrayBuffer());expect([...bytes.slice(0,8)]).toEqual([137,80,78,71,13,10,26,10]);expect(bytes.length).toBeGreaterThan(1000);
 io.afterRender=()=>io.read.mockResolvedValue({status:'unavailable'});
 const denied=await GET(req,ctx);expect(denied.status).toBe(404);expect(io.read).toHaveBeenCalledTimes(4);
 io.renderer=undefined;io.afterRender=undefined;
});

it('cancels a stalled sensitive render stream when its cumulative I/O budget fails',async()=>{
 vi.useFakeTimers();let cancelled=false;
 io.renderer=(_tree,options)=>options.status?new Response('neutral',options):new Response(new ReadableStream({cancel(){cancelled=true;}}));
 try {
  const pending=GET(req,ctx);await vi.advanceTimersByTimeAsync(10001);const res=await pending;
  expect(res.status).toBe(503);expect(cancelled).toBe(true);expect(vi.getTimerCount()).toBe(0);
 }finally{io.renderer=undefined;vi.useRealTimers();}
});

it('keeps a closed unexpired snapshot readable when voting closes during rendering',async()=>{
 const s=snapshot();io.read.mockResolvedValueOnce({status:'ok',snapshot:s,myChoice:null}).mockResolvedValueOnce({status:'ok',snapshot:{...s,closed:true},myChoice:null});
 expect((await GET(req,ctx)).status).toBe(200);
});
