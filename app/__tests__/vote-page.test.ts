import {createElement,isValidElement,type ReactNode,type ReactElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {expect,it,vi,afterEach} from 'vitest';
// Only the hooks used by this component are adapted. Real component callbacks,
// timers, fetch boundaries and rendered elements run unchanged; React scheduling
// is qualified separately by the private hydrated browser harness.
const hooks=vi.hoisted(()=>({active:false,cursor:0,values:[] as unknown[],effects:[] as Array<()=>void|(()=>void)>,cleanups:[] as Array<()=>void>,mounted:new Set<number>()}));
vi.mock('react',async importOriginal=>{
 const react=await importOriginal<typeof import('react')>();
 return {...react,
  useState:(initial:unknown)=>{if(!hooks.active)return react.useState(initial);const i=hooks.cursor++;if(!(i in hooks.values))hooks.values[i]=typeof initial==='function'?initial():initial;return [hooks.values[i],(next:unknown)=>{hooks.values[i]=typeof next==='function'?next(hooks.values[i]):next;}];},
  useRef:(initial:unknown)=>{if(!hooks.active)return react.useRef(initial);const i=hooks.cursor++;if(!(i in hooks.values))hooks.values[i]={current:initial};return hooks.values[i];},
  useEffect:(effect:()=>void|(()=>void),deps:unknown[])=>{if(!hooks.active)return react.useEffect(effect,deps);const i=hooks.cursor++;if(!hooks.mounted.has(i)){hooks.mounted.add(i);hooks.effects.push(effect);}},
 };
});
vi.mock('next/navigation',()=>({useRouter:()=>({refresh:vi.fn()}),usePathname:()=>'/v/'+ 'A'.repeat(43),useSearchParams:()=>new URLSearchParams()}));
import {VotePage} from '@/components/VotePage';
import {VoteBallot} from '@/components/VoteBallot';
import {VOTE_COPY} from '@/lib/voteCopy';
import type {PublicVoteSnapshot,PublicVoteReadResult} from '@/lib/server/voteAccess';
const token='A'.repeat(43);
function snapshot():PublicVoteSnapshot {return {version:1,firstName:'Élo',initials:'É',occasion:'Dîner',endsAt:'2099-01-01T00:00:00Z',expiresAt:'2099-01-08T00:00:00Z',closed:false,options:['a','b'].map(choice=>({choice,pieces:[{name:'Pull',category:'tops',imageUrl:`https://www.margotwardrobe.com/v/${token}/media/00000000-0000-0000-0000-000000000001`},{name:null,category:'jeans',imageUrl:`https://www.margotwardrobe.com/v/${token}/media/00000000-0000-0000-0000-000000000002`}]})) as PublicVoteSnapshot['options']};}
function render(result:PublicVoteReadResult,locale:'fr'|'en'|'es'='fr'){return renderToStaticMarkup(createElement(VotePage,{result,locale}));}
it('public_projection_only: renders only snapshot, never private metadata or third-party ballot',()=>{
 const s={...snapshot(),owner_id:'owner-secret',avatar:'avatar-secret',path:'privateStoragePath',reason:'private-reason',vote_id:'vote-secret'};
 const html=render({status:'ok',snapshot:s,myChoice:null});
 for(const value of ['owner-secret','avatar-secret','privateStoragePath','private-reason','vote-secret'])expect(html).not.toContain(value);
 expect(html).toContain('Dîner');expect(html).toContain('object-contain');expect(html).not.toContain('srcset');
 expect(html).toContain('min-h-[44px]');expect(html).toContain('aria-live="polite"');expect(html).toContain('maxLength="40"');expect(html).toContain('maxLength="160"');
});
it('hostile_text_and_account_switch: React escapes hostile public text and isolates bidi',()=>{
 const s=snapshot();s.firstName='<img src=x onerror=alert(1)>';s.occasion='<a href="https://evil.test">x</a>\u202e';s.options[0].pieces[0].name='<script>alert(1)</script>';
 const html=render({status:'ok',snapshot:s,myChoice:null});
 expect(html).not.toContain('<script>');expect(html).not.toContain('<a href="https://evil.test');expect(html).toContain('&lt;img');expect(html).toContain('<bdi>');
});
it.each(['fr','en','es'] as const)('one_soft_invitation and own-choice announcement in %s',locale=>{
 const html=render({status:'ok',snapshot:snapshot(),myChoice:'b'},locale);
 expect(html.split('data-vote-invitation="true"')).toHaveLength(2);expect(html).toContain(VOTE_COPY[locale].pitch);expect(html).toContain('aria-pressed="true"');expect(html).toContain('B');
 const closed=render({status:'ok',snapshot:{...snapshot(),closed:true},myChoice:null},locale);expect(closed).not.toContain('<form');expect(closed.split('data-vote-invitation="true"')).toHaveLength(2);expect(closed).toContain(VOTE_COPY[locale].closed);
});
it.each([{status:'unavailable'},{status:'limited',retryAfter:45},{status:'service_unavailable'}] as const)('preserves denial $status without images or ballot',result=>{
 const html=render(result);expect(html).not.toContain('<img');expect(html).not.toContain('<form');expect(html).not.toContain('data-vote-invitation');if(result.status==='limited')expect(html).toContain('45');
});


function controlledBallot(myChoice:'b'|null){
 hooks.active=true;hooks.cursor=0;hooks.values=[];hooks.effects=[];hooks.cleanups=[];hooks.mounted.clear();
 const windowTarget=new EventTarget(),documentTarget=new EventTarget();
 vi.stubGlobal('window',windowTarget);vi.stubGlobal('document',documentTarget);vi.stubGlobal('navigator',{userAgent:'Browser'});
 vi.useFakeTimers();vi.setSystemTime(new Date('2026-11-10T12:00:00Z'));
 const s={...snapshot(),endsAt:new Date(Date.now()+1000).toISOString(),expiresAt:new Date(Date.now()+86400000).toISOString()};
 function draw(){hooks.cursor=0;return VoteBallot({snapshot:s,myChoice,locale:'fr'});}
 draw();for(const effect of hooks.effects.splice(0)){const cleanup=effect();if(cleanup)hooks.cleanups.push(cleanup);}
 function buttons(node:ReactNode):ReactElement<{children?:ReactNode;onClick:()=>void}>[]{
  if(Array.isArray(node))return node.flatMap(buttons);if(!isValidElement<{children?:ReactNode}>(node))return [];
  return [...(node.type==='button'?[node as ReactElement<{children?:ReactNode;onClick:()=>void}>]:[]),...buttons(node.props.children)];
 }
 return {html:()=>renderToStaticMarkup(draw()),chooseA:()=>buttons(draw()).find(button=>button.props.children==='Je vote A')!.props.onClick(),windowTarget,documentTarget};
}
afterEach(()=>{for(const cleanup of hooks.cleanups.splice(0))cleanup();hooks.active=false;vi.useRealTimers();vi.unstubAllGlobals();vi.restoreAllMocks();});

it.each([null,'b'] as const)('I1: device delayed past closure preserves confirmed %s and never announces unsent A',async myChoice=>{
 const ballot=controlledBallot(myChoice);let resolveDevice!:(response:Response)=>void;
 const request=vi.fn((_url:string)=>new Promise<Response>(resolve=>{resolveDevice=resolve;}));vi.stubGlobal('fetch',request);
 ballot.chooseA();await vi.advanceTimersByTimeAsync(1001);
 let html=ballot.html();expect.soft(html).not.toContain('Ton choix est enregistré : A');expect.soft(html.includes('Ton choix est enregistré : B')).toBe(myChoice==='b');
 resolveDevice(Response.json({status:'ok',confirmed:true}));await vi.advanceTimersByTimeAsync(0);
 html=ballot.html();expect(html).not.toContain('<form');expect(html).not.toContain('Ton choix est enregistré : A');expect(html.includes('Ton choix est enregistré : B')).toBe(myChoice==='b');
 expect(request.mock.calls).toHaveLength(1);expect(request.mock.calls.every(call=>String(call[0]).endsWith('/device'))).toBe(true);
});

it('I2: unavailable remains terminal after endsAt, focus and visibilitychange',async()=>{
 const ballot=controlledBallot(null);
 vi.stubGlobal('fetch',vi.fn(async(url:string)=>String(url).endsWith('/device')?Response.json({status:'ok',confirmed:true}):Response.json({error:'unavailable'},{status:404})));
 ballot.chooseA();await vi.advanceTimersByTimeAsync(0);
 function expectUnavailable(){const html=ballot.html();expect(html).toContain('Ce lien n’est plus disponible');for(const text of ['Élo','Dîner','<img','<form','data-vote-invitation'])expect(html).not.toContain(text);}
 expectUnavailable();await vi.advanceTimersByTimeAsync(1001);expectUnavailable();
 ballot.windowTarget.dispatchEvent(new Event('focus'));expectUnavailable();ballot.documentTarget.dispatchEvent(new Event('visibilitychange'));expectUnavailable();
});


it('keeps a newly server-confirmed choice when the timer closes voting',async()=>{
 const ballot=controlledBallot(null);
 vi.stubGlobal('fetch',vi.fn(async(url:string)=>String(url).endsWith('/device')?Response.json({status:'ok',confirmed:true}):Response.json({status:'ok',choice:'a',closed:false})));
 ballot.chooseA();await vi.advanceTimersByTimeAsync(0);expect(ballot.html()).toContain('Ton choix est enregistré : A');
 await vi.advanceTimersByTimeAsync(1001);const html=ballot.html();expect(html).toContain('Ton choix est enregistré : A');expect(html).not.toContain('<form');
});
