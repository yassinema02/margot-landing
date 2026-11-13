"use client";
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { PublicVoteSnapshot } from '@/lib/server/voteAccess';
import { VOTE_COPY, type VoteLocale } from '@/lib/voteCopy';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/launch';
import { captureVoteEvent } from '@/components/PostHogProvider';

type Choice='a'|'b';
type ReportReason='harassment'|'hate'|'sexual'|'violence'|'spam'|'privacy'|'other';
const REPORT_REASONS:ReportReason[]=['harassment','hate','sexual','violence','spam','privacy','other'];
type State='social_text_rejected'|'idle'|'submitting'|'voted'|'closed'|'unavailable'|'cookie_required'|'rate_limited'|'service_unavailable'|'invalid';
const BUTTON='min-h-[44px] rounded-full px-5 py-3 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4';

export function VoteBallot({snapshot,myChoice,locale}:{snapshot:PublicVoteSnapshot;myChoice:Choice|null;locale:VoteLocale}) {
 const c=VOTE_COPY[locale],path=usePathname();
 const [state,setState]=useState<State>(snapshot.closed?'closed':myChoice?'voted':'idle');
 const [choice,setChoice]=useState<Choice|null>(myChoice),[firstName,setFirstName]=useState(''),[reason,setReason]=useState(''),[retryAfter,setRetryAfter]=useState(0);
 const [copyState,setCopyState]=useState<'idle'|'copied'|'failed'>('idle'),[copyUrl,setCopyUrl]=useState('');
 const [platform,setPlatform]=useState<'ios'|'android'|'other'>('other');
 const lastAttempt=useRef<Choice|null>(null),recordedChoice=useRef(myChoice),unavailable=useRef(false);
 const lock=useRef(false),confirmed=useRef(false),controller=useRef<AbortController|null>(null),alive=useRef(true),expired=useRef(false),closed=useRef(snapshot.closed);
 const [expiredView,setExpiredView]=useState(false);
 const [reportOpen,setReportOpen]=useState(false),[reportReason,setReportReason]=useState<ReportReason>('harassment'),[reportState,setReportState]=useState<'idle'|'sending'|'sent'|'failed'|'limited'>('idle');
 const reportLock=useRef(false),reportAbort=useRef<AbortController|null>(null),reportAttempt=useRef<ReportReason|null>(null);
 useEffect(()=>{
  alive.current=true;
  const ua=navigator.userAgent;setPlatform(/Android/i.test(ua)?'android':/iPhone|iPad|iPod/i.test(ua)?'ios':'other');
  // Recheck on focus/visibility as background timers may be throttled.
  let timer:ReturnType<typeof setTimeout>;
  function check(){
   clearTimeout(timer);if(unavailable.current)return;
   const now=Date.now(),end=Date.parse(snapshot.endsAt),expiry=Date.parse(snapshot.expiresAt);
   if(now>=expiry){expired.current=true;controller.current?.abort();setExpiredView(true);setState('unavailable');return;}
   if(now>=end){closed.current=true;setChoice(recordedChoice.current);setState('closed');}
   timer=setTimeout(check,Math.min(2147483647,Math.max(1,(now<end?end:expiry)-now)));
  }
  check();window.addEventListener('focus',check);document.addEventListener('visibilitychange',check);
  return ()=>{alive.current=false;clearTimeout(timer);controller.current?.abort();reportAbort.current?.abort();window.removeEventListener('focus',check);document.removeEventListener('visibilitychange',check);};
 },[snapshot.endsAt,snapshot.expiresAt]);
 async function submit(next:Choice) {
  if(lock.current || closed.current || expired.current || unavailable.current)return;
  const previous=choice;lastAttempt.current=next;lock.current=true;setChoice(next);setState('submitting');
  const abort=new AbortController();controller.current=abort;const timeout=setTimeout(()=>abort.abort(),50000);
  async function post(endpoint:string,body?:unknown){
   const res=await fetch(`${path}/${endpoint}`,{method:'POST',credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,signal:abort.signal});
   const data:unknown=await res.json();
   if(!data || typeof data!=='object' || Array.isArray(data))throw Error('invalid_response');
   return {res,data:data as Record<string,unknown>};
  }
  try {
   if(!confirmed.current){
    let device=await post('device');
    if(!device.res.ok)throw {error:device.data.error,retryAfter:device.res.headers.get('retry-after')};
    if(device.data.status!=='ok' || typeof device.data.confirmed!=='boolean')throw Error('invalid_response');
    if(!device.data.confirmed){device=await post('device');if(!device.res.ok)throw {error:device.data.error,retryAfter:device.res.headers.get('retry-after')};if(device.data.status!=='ok' || device.data.confirmed!==true)throw {error:'cookie_required'};}
    confirmed.current=true;
   }
   if(closed.current || expired.current)return;
   const {res,data}=await post('ballot',{choice:next,firstName:firstName||null,reason:reason||null});
   if(!res.ok)throw {error:data.error,retryAfter:res.headers.get('retry-after')};
   if(data.status!=='ok' || data.choice!==next || data.closed!==false)throw Error('invalid_response');
   if(alive.current && !expired.current){recordedChoice.current=next;setChoice(next);setState(closed.current?'closed':'voted');captureVoteEvent('social_vote_web_voted',{locale,platform,result:'ok'});}
  } catch(error) {
   if(!alive.current || expired.current)return;
   setChoice(previous);
   const code=error && typeof error==='object' && 'error' in error?String(error.error):'service_unavailable';
   if(code==='cookie_required')confirmed.current=false;
   if(code==='closed')closed.current=true;
   if(code==='unavailable')unavailable.current=true;
   const nextState:State=unavailable.current?'unavailable':closed.current?'closed':code==='cookie_required'?'cookie_required':code==='limited'?'rate_limited':code==='social_text_rejected'?'social_text_rejected':code==='invalid'?'invalid':'service_unavailable';
   setState(nextState);
   if(nextState==='rate_limited'){const delay=Number((error as {retryAfter?:unknown}).retryAfter);setRetryAfter(Number.isSafeInteger(delay)&&delay>0?delay:60);}
  } finally {clearTimeout(timeout);lock.current=false;if(controller.current===abort)controller.current=null;}
 }
 async function report() {
  if(reportLock.current || reportState==='sent' || expired.current || unavailable.current || !alive.current)return;
  reportLock.current=true;setReportState('sending');
  const reason=reportAttempt.current ?? reportReason;reportAttempt.current=reason;
  const abort=new AbortController();reportAbort.current=abort;const timeout=setTimeout(()=>abort.abort(),50000);
  try {
   const response=await fetch(`${path}/report`,{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({reason}),signal:abort.signal});
   if(!alive.current || expired.current || unavailable.current)return;
   if(response.status===204){setReportState('sent');captureVoteEvent('social_reported',{target_kind:'vote',reason});}
   else if(response.status===404 || response.status===403){unavailable.current=true;setState('unavailable');}
   else setReportState(response.status===429?'limited':'failed');
  } catch {if(alive.current && !expired.current && !unavailable.current)setReportState('failed');}
  finally {clearTimeout(timeout);reportLock.current=false;if(reportAbort.current===abort)reportAbort.current=null;}
 }
 async function copyLink(){
  const url=window.location.origin+path;setCopyUrl(url);
  try {if(!navigator.clipboard?.writeText)throw Error('clipboard_unavailable');await navigator.clipboard.writeText(url);if(alive.current)setCopyState('copied');}
  catch {if(alive.current)setCopyState('failed');}
 }
 const terminal=state==='closed'||state==='voted';
 const message=state==='submitting'?c.submitting:state==='voted'?`${c.voted} ${choice?.toUpperCase()}. ${c.change}`:state==='closed'?c.closed:state==='cookie_required'?c.cookie:state==='rate_limited'?`${c.limited} ${retryAfter} ${c.seconds}`:state==='service_unavailable'?c.temporary:state==='social_text_rejected'?c.social_text_rejected:state==='invalid'?c.invalid:'';
 if(state==='unavailable'||expiredView)return <h1 className="font-display text-3xl">{c.unavailable}</h1>;
 return <>
  <header className="mb-6 text-center">
   <div aria-hidden="true" className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink font-display text-2xl text-surface"><bdi>{snapshot.initials}</bdi></div>
   <h1 className="break-words font-display text-3xl"><bdi>{snapshot.firstName}</bdi></h1>
   <p className="mt-3 break-words text-ink2">{c.question} <bdi>{snapshot.occasion}</bdi> ?</p>
  </header>
  <div className="grid grid-cols-2 gap-3">
   {snapshot.options.map(option=><section key={option.choice} aria-label={option.choice.toUpperCase()} className="min-w-0 rounded-2xl bg-surface p-3" style={{border:choice===option.choice?'2px solid #7D3048':'2px solid transparent'}}>
    <h2 className="mb-3 font-display text-2xl">{option.choice.toUpperCase()}</h2>
    <div className="grid gap-3">{option.pieces.map((piece,index)=><figure key={index} className="min-w-0">
     {/* Exact authorized copy: deliberately no Next optimizer or source fallback. */}
     <img src={piece.imageUrl} alt={piece.name||piece.category||c.piece} referrerPolicy="no-referrer" className="aspect-square w-full rounded-xl bg-white object-contain"/>
     <figcaption className="mt-1 break-words text-xs text-ink2"><bdi>{piece.name||piece.category||c.piece}</bdi></figcaption>
    </figure>)}</div>
    {state==='closed' && choice && <p className="mt-3 text-sm" aria-label={choice===option.choice?`${c.voted} ${choice.toUpperCase()}`:undefined}>{choice===option.choice?c.voted+' '+choice.toUpperCase():''}</p>}
   </section>)}
  </div>
  <p id="vote-status" role="status" aria-live="polite" aria-atomic="true" className="my-5 break-words text-center">{message}</p>
  {state!=='closed' && <form onSubmit={event=>event.preventDefault()} aria-describedby="vote-privacy vote-status">
   <label htmlFor="vote-first-name" className="mb-2 block text-sm">{c.firstName}</label>
   <input id="vote-first-name" name="firstName" autoComplete="given-name" value={firstName} onChange={event=>setFirstName(event.target.value)} maxLength={40} aria-invalid={(state==='invalid'||state==='social_text_rejected')} aria-describedby={(state==='invalid'||state==='social_text_rejected')?'vote-status':undefined} className="mb-4 min-h-[44px] w-full rounded-xl border border-ink3 bg-surface p-3"/>
   <label htmlFor="vote-reason" className="mb-2 block text-sm">{c.reason}</label>
   <textarea id="vote-reason" name="reason" value={reason} onChange={event=>setReason(event.target.value)} maxLength={160} rows={2} aria-invalid={(state==='invalid'||state==='social_text_rejected')} aria-describedby={(state==='invalid'||state==='social_text_rejected')?'vote-status':undefined} className="min-h-[44px] w-full rounded-xl border border-ink3 bg-surface p-3"/>
   <p id="vote-privacy" className="my-3 text-xs leading-relaxed text-ink2">{c.privateNote}</p>
   <div className="grid grid-cols-2 gap-3">{(['a','b'] as const).map(option=><button type="button" key={option} aria-pressed={choice===option} disabled={state==='submitting'} onClick={()=>void submit(option)} className={`${BUTTON} text-surface disabled:opacity-50`} style={{background:choice===option?'#7D3048':'#2D3A33'}}>{option==='a'?c.voteA:c.voteB}</button>)}</div>
   {(['cookie_required','rate_limited','service_unavailable','invalid','social_text_rejected'] as State[]).includes(state) && <button type="button" onClick={()=>{if(lastAttempt.current)void submit(lastAttempt.current);}} className={`${BUTTON} mt-3 w-full border border-ink3`}>{c.retry}</button>}
  </form>}
  <section className="mt-6 break-words" aria-label={c.reportTitle}>
   {!reportOpen ? <button type="button" className={`${BUTTON} underline`} onClick={()=>{reportAttempt.current=null;setReportState('idle');setReportOpen(true);}}>{c.report}</button> : <>
    <h2 className="font-display text-xl">{c.reportTitle}</h2>
    {reportState==='sent' ? <p role="status">{c.reportSent}</p> : <>
     <p className="my-3">{c.reportNotice}</p>
     <label htmlFor="vote-report-reason">{c.reportTitle}</label>
     <select id="vote-report-reason" value={reportReason} disabled={reportState==='sending'||!!reportAttempt.current} onChange={event=>setReportReason(event.target.value as ReportReason)} className="my-3 min-h-[44px] w-full rounded-xl border border-ink3 bg-surface p-3">
      {REPORT_REASONS.map(reason=><option key={reason} value={reason}>{c[`report_${reason}`]}</option>)}
     </select>
     <p role="status" aria-live="polite">{reportState==='failed'?c.reportFailed:reportState==='limited'?c.reportLimited:reportState==='sending'?c.reportSending:''}</p>
     <button type="button" className={`${BUTTON} bg-ink text-surface`} disabled={reportState==='sending'} onClick={()=>void report()}>{reportState==='failed'||reportState==='limited'?c.retry:c.reportSend}</button>
    </>}
    <button type="button" className={`${BUTTON} ml-2 border border-ink3`} disabled={reportState==='sending'} onClick={()=>{setReportOpen(false);reportAttempt.current=null;}}>{c.reportCancel}</button>
   </>}
  </section>
  {terminal && <aside data-vote-invitation="true" className="mt-9 rounded-3xl bg-surface p-5 text-center">
   <p className="font-display text-xl">{c.pitch}</p>
   <div className="mt-5 flex flex-wrap justify-center gap-3">{(platform==='android'?['android']:platform==='ios'?['ios']:['ios','android']).map(store=><a key={store} href={store==='ios'?APP_STORE_URL:PLAY_STORE_URL} rel="noreferrer" className={`${BUTTON} bg-ink text-surface no-underline`} onClick={()=>{void copyLink();captureVoteEvent('social_vote_web_store_clicked',{locale,platform:store,result:'clicked'});}}>{c.download} · {store==='ios'?c.appStore:c.playStore}</a>)}</div>
   <button type="button" className={`${BUTTON} mt-3 underline`} onClick={()=>void copyLink()}>{c.copy}</button>
   <p role="status" aria-live="polite" className="text-sm">{copyState==='copied'?c.copied:copyState==='failed'?c.copyFailed:''}</p>
   {copyState==='failed' && <input aria-label={c.copy} readOnly value={copyUrl} onFocus={event=>event.target.select()} className="mt-2 min-h-[44px] w-full rounded-xl border border-ink3 p-3"/>}
  </aside>}
 </>;
}
