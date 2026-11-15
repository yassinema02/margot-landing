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
  useState:(initial:unknown)=>{if(!hooks.active)return react.useState(initial);const i=hooks.cursor++,values=hooks.values;if(!(i in values))values[i]=typeof initial==='function'?initial():initial;return [values[i],(next:unknown)=>{values[i]=typeof next==='function'?next(values[i]):next;}];},
  useRef:(initial:unknown)=>{if(!hooks.active)return react.useRef(initial);const i=hooks.cursor++;if(!(i in hooks.values))hooks.values[i]={current:initial};return hooks.values[i];},
  useEffect:(effect:()=>void|(()=>void),deps:unknown[])=>{if(!hooks.active)return react.useEffect(effect,deps);const i=hooks.cursor++;if(!hooks.mounted.has(i)){hooks.mounted.add(i);hooks.effects.push(effect);}},
 };
});
vi.mock('next/navigation',()=>({useRouter:()=>({refresh:vi.fn()}),usePathname:()=>'/v/'+ 'A'.repeat(43),useSearchParams:()=>new URLSearchParams()}));
vi.mock('@/components/PostHogProvider',()=>({captureVoteEvent:vi.fn()}));
import {captureVoteEvent} from '@/components/PostHogProvider';
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
// W-I3: the vote creator sees the first name and reply; the team only when the
// creator reports it (social_reports.sql report_projection 'ballot'). The policy exists
// in French and English only: Spanish visitors get the English page, said so.
const BALLOT_NOTE={
 fr:'La personne qui a créé ce vote verra ton prénom et ta réponse. Si elle signale ta réponse, notre équipe de modération les verra aussi.',
 en:'The person who created this vote will see your first name and reply. If they report your reply, our moderation team will see them too.',
 es:'La persona que creó esta votación verá tu nombre y tu respuesta. Si denuncia tu respuesta, nuestro equipo de moderación también los verá.',
} as const;
const PRIVACY_LINK={fr:['/fr/confidentialite','Politique de confidentialité'],en:['/privacy','Privacy policy'],es:['/privacy','Política de privacidad (en inglés)']} as const;
it.each(['fr','en','es'] as const)('W-I3 %s: says who reads a ballot and links the privacy policy before any ballot and in every state',locale=>{
 const idle=render({status:'ok',snapshot:snapshot(),myChoice:null},locale);
 expect(idle).toContain(`<p id="vote-privacy" class="my-3 text-xs leading-relaxed text-ink2">${BALLOT_NOTE[locale]}</p>`);
 expect(idle).not.toMatch(/Seule la personne|Only the person|Solo la persona/);
 const [href,label]=PRIVACY_LINK[locale];
 for(const html of [idle,render({status:'ok',snapshot:snapshot(),myChoice:'a'},locale),render({status:'ok',snapshot:{...snapshot(),closed:true},myChoice:null},locale),render({status:'unavailable'},locale),render({status:'limited',retryAfter:45},locale),render({status:'service_unavailable'},locale)]){
  const links=html.match(new RegExp(`<a [^>]*href="${href}"[^>]*>([^<]*)</a>`,'g'))??[];
  expect(links).toHaveLength(1);expect(links[0]).toContain(`>${label}</a>`);expect(links[0]).toContain('rel="noreferrer"');
 }
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
 return {reportOpen:()=>buttons(draw()).find(b=>b.props.children===VOTE_COPY.fr.report)!.props.onClick(),sendReport:()=>buttons(draw()).find(b=>[VOTE_COPY.fr.reportSend,VOTE_COPY.fr.retry].includes(b.props.children as string))!.props.onClick(),cancelReport:()=>buttons(draw()).find(b=>b.props.children===VOTE_COPY.fr.reportCancel)!.props.onClick(),html:()=>renderToStaticMarkup(draw()),chooseA:()=>buttons(draw()).find(button=>button.props.children==='Je vote A')!.props.onClick(),windowTarget,documentTarget};
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

it('anonymous_ballot_has_no_account_block and reports only through the existing route',async()=>{
 const b=controlledBallot(null);const request=vi.fn(async(_url:string,_init:RequestInit)=>new Response(null,{status:204}));vi.stubGlobal('fetch',request);vi.mocked(captureVoteEvent).mockClear();
 b.reportOpen();expect(b.html()).toContain('Signaler ce contenu');expect(b.html()).not.toMatch(/>Bloquer<|>Block<|compte groupe/);
 b.sendReport();b.sendReport();await vi.advanceTimersByTimeAsync(0);expect(request).toHaveBeenCalledTimes(1);
 expect(request.mock.calls[0]).toEqual(['/v/'+token+'/report',expect.objectContaining({method:'POST',credentials:'same-origin',cache:'no-store',body:JSON.stringify({reason:'harassment'})})]);
 expect(b.html()).toContain(VOTE_COPY.fr.reportSent);expect(captureVoteEvent).toHaveBeenCalledExactlyOnceWith('social_reported',{target_kind:'vote',reason:'harassment'});
});
it('report failure retains the exact reason, retries and never sends device or ballot requests',async()=>{
 const b=controlledBallot(null),request=vi.fn().mockRejectedValueOnce(Error('network')).mockResolvedValue(new Response(null,{status:204}));vi.stubGlobal('fetch',request);
 b.reportOpen();b.sendReport();await vi.advanceTimersByTimeAsync(0);expect(b.html()).toContain(VOTE_COPY.fr.reportFailed);
 b.sendReport();await vi.advanceTimersByTimeAsync(0);expect(request.mock.calls.map(c=>[c[0],c[1].body])).toEqual([['/v/'+token+'/report',JSON.stringify({reason:'harassment'})],['/v/'+token+'/report',JSON.stringify({reason:'harassment'})]]);
});
it('report rights refusal masks the public content and all report controls',async()=>{
 const b=controlledBallot(null);vi.stubGlobal('fetch',vi.fn(async()=>Response.json({error:'unavailable'},{status:404})));b.reportOpen();b.sendReport();await vi.advanceTimersByTimeAsync(0);
 const html=b.html();expect(html).toContain(VOTE_COPY.fr.unavailable);expect(html).not.toContain('Élo');expect(html).not.toContain('Dîner');expect(html).not.toContain('<select');
});

it.each(['fr','en','es'] as const)('v2 %s shows each complete photo and all pieces with per-option actions after the common fields',locale=>{
 const base=snapshot();
 const s:PublicVoteSnapshot={...base,version:2,options:base.options.map((option,index)=>({...option,visual:index===0?{kind:'render',imageUrl:`/v/${token}/media/avatar`,renderedOrdinals:[1]}:{kind:'pieces'}})) as Extract<PublicVoteSnapshot,{version:2}>['options']};
 const html=render({status:'ok',snapshot:s,myChoice:null},locale);
 expect(html).toContain('h-auto w-full object-contain');expect(html).toContain('referrerPolicy="no-referrer"');
 expect(html.replace(/&#x27;/g,"'")).toContain(VOTE_COPY[locale].notShown);expect(html).toContain('minmax(min(100%, 14rem), 1fr)');
 expect(html.indexOf('vote-first-name')).toBeLessThan(html.indexOf('<section aria-label="A"'));
 const a=html.slice(html.indexOf('<section aria-label="A"'),html.indexOf('<section aria-label="B"'));
 expect(a).toContain(VOTE_COPY[locale].voteA);expect(a).not.toContain(VOTE_COPY[locale].voteB);
 expect((html.match(/<img /g)||[]).length).toBe(5);
 expect(html).not.toContain('Créer un vote');expect(html).not.toContain('srcSet');
});

type VoteImageProps={src:string;alt:string;avatar?:boolean;copy:typeof VOTE_COPY.fr};
function controlledImage(avatar:boolean){
 hooks.active=true;hooks.cursor=0;hooks.values=[];hooks.effects=[];hooks.mounted.clear();
 const s=snapshot();
 const imageUrl='/v/'+token+'/media/avatar';
 const view:PublicVoteSnapshot=avatar?{...s,version:2,options:s.options.map(option=>({...option,visual:{kind:'render',imageUrl,renderedOrdinals:[1]}})) as Extract<PublicVoteSnapshot,{version:2}>['options']}:s;
 function images(node:ReactNode):ReactElement<VoteImageProps>[]{
  if(Array.isArray(node))return node.flatMap(images);if(!isValidElement<{children?:ReactNode;src?:string}>(node))return [];
  return [...(typeof node.type==='function' && node.props.src?[node as ReactElement<VoteImageProps>]:[]),...images(node.props.children)];
 }
 const element=images(VoteBallot({snapshot:view,myChoice:null,locale:'fr'}))[0];
 const Image=element.type as (props:VoteImageProps)=>ReactElement;
 hooks.values=[];hooks.effects=[];hooks.mounted.clear();
 let source=element.props.src,mounted:ReturnType<typeof draw>|null=null;
 function draw(){hooks.cursor=0;return Image({...element.props,src:source}) as ReactElement<{children?:ReactNode;src?:string;className?:string;referrerPolicy?:string;onError:(event:{currentTarget:HTMLImageElement})=>void}> & {ref?:((node:HTMLImageElement|null)=>void)|null};}
 function attach(state:{complete:boolean;naturalWidth:number}){
  const output=draw(),node=state as HTMLImageElement;output.ref?.(node);mounted=output;
  return {node,error:()=>output.props.onError({currentTarget:node})};
 }
 function html(){return renderToStaticMarkup(draw()).replace(/&#x27;/g,"'");}
 function retry(){const output=draw(),children=output.props.children as ReactElement[];(children.find(child=>child.type==='button')!.props as {onClick:()=>void}).onClick();}
 function changeSource(next:string){mounted?.ref?.(null);source=next;hooks.values=[];hooks.effects=[];hooks.mounted.clear();}
 return {draw,attach,html,retry,changeSource,source:()=>source,element};
}

it.each([true,false])('W1: an already failed image (avatar=%s) exposes an explicit same-source retry',avatar=>{
 const image=controlledImage(avatar),first=image.draw();
 const failed=image.attach({complete:true,naturalWidth:0});
 expect(image.html()).toContain('role="status"');expect(image.html()).toContain(VOTE_COPY.fr.imageFailed);expect(image.html()).toContain(VOTE_COPY.fr.retryImage);
 image.retry();const retry=image.draw();
 expect(retry.type).toBe('img');expect(retry.props.src).toBe(first.props.src);expect(retry.key).not.toBe(first.key);
 expect(retry.props.referrerPolicy).toBe('no-referrer');expect(retry.props.className).toContain(avatar?'h-auto w-full object-contain':'aspect-square');
 image.attach({complete:false,naturalWidth:0});failed.error();expect(image.draw().type).toBe('img');expect(image.html()).not.toContain(VOTE_COPY.fr.imageFailed);
});

it.each([{complete:false,naturalWidth:0},{complete:true,naturalWidth:373}])('W1: pending/loaded $complete/$naturalWidth stays visible, later errors still allow retry',state=>{
 const image=controlledImage(true),current=image.attach(state);
 expect(image.draw().type).toBe('img');expect(image.html()).not.toContain(VOTE_COPY.fr.retryImage);
 current.error();expect(image.html()).toContain(VOTE_COPY.fr.retryImage);
 image.retry();image.attach({complete:true,naturalWidth:373});expect(image.draw().type).toBe('img');
});

it.each([true,false])('W1: source-key remount isolates failed state and old errors (avatar=%s)',avatar=>{
 const image=controlledImage(avatar),original=image.source(),old=image.attach({complete:true,naturalWidth:0});
 expect(image.element.key).toBe(original);expect(image.html()).toContain(VOTE_COPY.fr.retryImage);
 image.changeSource(original+'-new');image.attach({complete:true,naturalWidth:373});old.error();
 expect(image.draw().type).toBe('img');expect(image.draw().props.src).toBe(original+'-new');
 image.changeSource(original);image.attach({complete:false,naturalWidth:0});
 expect(image.draw().type).toBe('img');expect(image.html()).not.toContain(VOTE_COPY.fr.retryImage);
});
