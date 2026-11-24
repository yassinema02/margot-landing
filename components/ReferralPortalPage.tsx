import { headers } from 'next/headers';
import { MargotMark } from '@/components/MargotMark';
import { ReferralPortal } from '@/components/ReferralPortal';
import { pickInviteLocale } from '@/lib/socialInvite';
import { signupCode } from '@/lib/signupInvite';

// Only the public key for the app's own Supabase project may cross this boundary.
function publicClientKey(key: string | undefined): string {
  if (!key) return '';
  if (key.startsWith('sb_publishable_')) return key;
  try { return JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role === 'anon' ? key : ''; }
  catch { return ''; }
}

export async function PortalPage({ invitation, confirmation = false }: { invitation?: string | string[]; confirmation?: boolean }) {
  const locale = pickInviteLocale((await headers()).get('accept-language'));
  const origin = 'https://ynldmugsihrgwpvuvofu.supabase.co';
  const enabled = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/$/, '') === origin;
  return <main className="mx-auto flex min-h-screen max-w-lg flex-col px-6 py-10 sm:py-16">
    <a className="mb-8 self-start" href={locale === 'fr' ? '/fr' : '/'} aria-label="Margot"><MargotMark fontSize={32} /></a>
    <ReferralPortal origin={origin} publicKey={enabled ? publicClientKey(process.env.SUPABASE_ANON_KEY) : ''}
      locale={locale} invitation={signupCode(invitation)} invalidInvitation={invitation !== undefined && !signupCode(invitation)} confirmation={confirmation} />
  </main>;
}
