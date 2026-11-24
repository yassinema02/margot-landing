import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { fraunces, montserrat } from '@/lib/fonts';
import { pickInviteLocale } from '@/lib/socialInvite';
import '@/app/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.margotwardrobe.com'), applicationName: 'Margot', title: 'Margot · Premium', referrer: 'no-referrer',
  robots: { index: false, follow: false },
};

export default async function ReferralLayout({ children }: { children: React.ReactNode }) {
  const locale = pickInviteLocale((await headers()).get('accept-language'));
  return <html lang={locale} className={fraunces.variable + ' ' + montserrat.variable}>
    <body className="font-sans bg-bg text-ink">{children}</body>
  </html>;
}
