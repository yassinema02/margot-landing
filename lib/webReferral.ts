import type { SupabaseClient } from '@supabase/supabase-js';
import { signupCode } from './signupInvite';

export const REFERRAL_RETURN = 'https://www.margotwardrobe.com/parrainage/confirmation';
export const REFERRAL_HOME = 'https://www.margotwardrobe.com/parrainage';

export async function emailLink(sb: SupabaseClient, email: string) {
  const { error } = await sb.auth.signInWithOtp({
    email, options: { shouldCreateUser: false, emailRedirectTo: REFERRAL_RETURN },
  });
  if (error) throw error;
}

export async function registerInvite(sb: SupabaseClient, rawCode: string, email: string, password: string, locale: string) {
  const code = signupCode(rawCode);
  if (!code) throw new Error('INVALID_CODE');
  const { data, error: sessionError } = await sb.auth.getSession();
  if (sessionError) throw sessionError;
  if (data.session && !data.session.user.is_anonymous) throw new Error('ALREADY_SIGNED_IN');
  if (!data.session) {
    const { error } = await sb.auth.signInAnonymously();
    if (error) throw error;
  }
  const prepared = await sb.rpc('prepare_referral_signup', { p_code: code });
  if (prepared.error) throw prepared.error;
  if (!prepared.data?.ok || typeof prepared.data.token !== 'string') throw new Error(prepared.data?.error || 'INVALID_CODE');

  // The signup trigger binds the unguessable intent. Email ownership is proven
  // independently on the authenticated magic-link session before granting time.
  const registered = await sb.auth.signUp({
    email, password, options: { emailRedirectTo: REFERRAL_RETURN, data: { locale, referral_signup_token: prepared.data.token } },
  });
  if (registered.error) throw registered.error;
  return { needsLink: !!registered.data.session };
}

export interface ReferralState {
  code: string | null;
  benefits: {
    programOpen: boolean; premium: boolean; recharges: number;
    latestReward: { kind: string; role: string; expiresAt: string | null } | null;
    quotas: { feature: string; remaining: number; limit: number; resetsAt: string | null }[];
  };
}

export async function referralState(sb: SupabaseClient): Promise<ReferralState> {
  const { data, error } = await sb.rpc('get_referral_state');
  if (error) throw error;
  if (!data?.ok || !data.benefits || !Array.isArray(data.benefits.quotas)) throw new Error('STATE_UNAVAILABLE');
  return data;
}

export async function finishInvitation(sb: SupabaseClient) {
  const { data, error } = await sb.rpc('complete_referral_signup', { p_token: null });
  if (error) throw error;
  // A sign-in link can also belong to an existing sponsor with no invitation.
  if (!data?.ok && data?.error !== 'CLAIM_WINDOW_EXPIRED') throw new Error(data?.error || 'CLAIM_FAILED');
}
