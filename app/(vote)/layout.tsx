import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { PostHogProvider } from '@/components/PostHogProvider';
import { fraunces, montserrat } from '@/lib/fonts';
import { pickInviteLocale } from '@/lib/socialInvite';
import '@/app/globals.css';

export const metadata:Metadata={metadataBase:new URL('https://www.margotwardrobe.com'),applicationName:'Margot',robots:{index:false,follow:false},referrer:'no-referrer'};
export default async function VoteRootLayout({children}:{children:React.ReactNode}) {
 const lang=pickInviteLocale((await headers()).get('accept-language'));
 return <html lang={lang} className={`${fraunces.variable} ${montserrat.variable}`}><body className="font-sans bg-bg text-ink"><PostHogProvider strictVote>{children}</PostHogProvider></body></html>;
}
