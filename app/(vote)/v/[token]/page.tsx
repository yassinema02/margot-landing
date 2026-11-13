import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { readPublicVote } from '@/lib/server/voteAccess';
import { VOTE_ORIGIN } from '@/lib/server/votePublication';
import { pickInviteLocale } from '@/lib/socialInvite';
import { VOTE_COPY } from '@/lib/voteCopy';
import { VotePage } from '@/components/VotePage';

export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
type Context={params:Promise<{token:string}>};
export async function generateMetadata({params}:Context):Promise<Metadata> {
 const {token}=await params,h=await headers(),locale=pickInviteLocale(h.get('accept-language')),c=VOTE_COPY[locale];
 const result=await readPublicVote(token,new Request(`${VOTE_ORIGIN}/v/${encodeURIComponent(token)}`,{headers:h}));
 return {title:c.title,description:c.title,robots:{index:false,follow:false},referrer:'no-referrer',openGraph:{title:c.title,description:c.title,siteName:'Margot',type:'website',images:result.status==='ok'?[{url:`${VOTE_ORIGIN}/v/${token}/og`,width:1200,height:630,alt:c.title}]:[]}};
}
export default async function Page({params}:Context) {
 const {token}=await params,h=await headers(),locale=pickInviteLocale(h.get('accept-language'));
 const result=await readPublicVote(token,new Request(`${VOTE_ORIGIN}/v/${encodeURIComponent(token)}`,{headers:h}));
 return <VotePage result={result} locale={locale}/>;
}
