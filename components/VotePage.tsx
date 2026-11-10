"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { PublicVoteReadResult } from '@/lib/server/voteAccess';
import { VOTE_COPY, type VoteLocale } from '@/lib/voteCopy';
import { MargotMark } from '@/components/MargotMark';
import { VoteBallot } from '@/components/VoteBallot';
import { captureVoteEvent } from '@/components/PostHogProvider';

export function VotePage({result,locale}:{result:PublicVoteReadResult;locale:VoteLocale}) {
 const c=VOTE_COPY[locale],router=useRouter();
 useEffect(()=>{captureVoteEvent('social_vote_web_viewed',{locale,result:result.status});},[locale,result.status]);
 return <main lang={locale} className="mx-auto min-h-screen w-full max-w-2xl px-4 py-8 text-ink">
  <div className="mb-8 text-center"><MargotMark fontSize={30}/></div>
  {result.status==='ok' ? <VoteBallot key={JSON.stringify(result.snapshot)} snapshot={result.snapshot} myChoice={result.myChoice} locale={locale}/> : <section className="rounded-3xl bg-surface p-6 text-center">
   <h1 className="font-display text-3xl">{result.status==='unavailable'?c.unavailable:result.status==='limited'?c.limited:c.temporary}</h1>
   {result.status==='limited' && <p className="mt-4">{result.retryAfter} {c.seconds}</p>}
   {result.status!=='unavailable' && <button type="button" onClick={()=>router.refresh()} className="mt-6 min-h-[44px] rounded-full bg-ink px-6 py-3 text-surface">{c.retry}</button>}
  </section>}
 </main>;
}
