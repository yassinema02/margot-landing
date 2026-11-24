import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { CopyReferralCode } from '@/components/CopyReferralCode';
import { MargotMark } from '@/components/MargotMark';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/launch';
import { invitePlatform, pickInviteLocale } from '@/lib/socialInvite';
import { WEB_REFERRAL } from '@/lib/webReferralCopy';
import { SIGNUP_COPY, signupCode } from '@/lib/signupInvite';

export const metadata: Metadata = { title: 'Margot', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function ReferralSignupPage({ params }: { params: Promise<{code: string}> }) {
  const h = await headers();
  const locale = pickInviteLocale(h.get('accept-language'));
  const c = SIGNUP_COPY[locale];
  const device = invitePlatform(h.get('user-agent'));
  const code = signupCode((await params).code);
  return <main className="ph-no-capture flex min-h-screen flex-col items-center justify-center gap-5 bg-bg px-6 py-12 text-center text-ink">
    <MargotMark fontSize={28} />
    <h1 className="max-w-sm font-display text-3xl">{code ? c.title : c.invalid}</h1>
    {code && <><a className="rounded-full bg-ink px-6 py-3 text-white" href={'/parrainage?invitation=' + code}>{WEB_REFERRAL[locale].website}</a><p className="max-w-sm">{c.detail}</p><CopyReferralCode code={code} label={c.code} copy={c.copy} copied={c.copied} manual={c.manual} /></>}
    {device !== 'android' && <a className="rounded-full bg-ink px-6 py-3 text-white" href={APP_STORE_URL}>App Store</a>}
    {device !== 'ios' && <a className="rounded-full bg-ink px-6 py-3 text-white" href={PLAY_STORE_URL}>Google Play</a>}
  </main>;
}
