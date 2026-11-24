import { describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { emailLink, finishInvitation, REFERRAL_RETURN, registerInvite } from '../webReferral';

function client(session: {user: {is_anonymous: boolean}} | null = null) {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session } }),
      signInAnonymously: vi.fn().mockResolvedValue({}),
      signUp: vi.fn().mockResolvedValue({ data: { session: {} } }),
      signInWithOtp: vi.fn().mockResolvedValue({}),
    },
    rpc: vi.fn().mockResolvedValue({ data: { ok: true, token: 'test-intent-token' } }),
  };
}
const asClient = (sb: ReturnType<typeof client>) => sb as unknown as SupabaseClient;

describe('web referrals', () => {
  it('binds a code before creating the durable account and requests a separate email proof', async () => {
    const sb = client();
    const response = await registerInvite(asClient(sb), 'abcdefgh', 'friend@example.invalid', 'a-password', 'fr');
    expect(sb.auth.signInAnonymously).toHaveBeenCalledOnce();
    expect(sb.rpc).toHaveBeenCalledWith('prepare_referral_signup', { p_code: 'ABCDEFGH' });
    expect(sb.rpc.mock.invocationCallOrder[0]).toBeLessThan(sb.auth.signUp.mock.invocationCallOrder[0]);
    expect(sb.auth.signUp).toHaveBeenCalledWith({
      email: 'friend@example.invalid', password: 'a-password',
      options: { emailRedirectTo: REFERRAL_RETURN, data: { locale: 'fr', referral_signup_token: 'test-intent-token' } },
    });
    expect(response.needsLink).toBe(true);
  });
  it('does not register when the server closes the pilot or the code is invalid', async () => {
    const sb = client({user:{is_anonymous:true}});
    sb.rpc.mockResolvedValue({ data:{ok:false, error:'FEATURE_DISABLED'} });
    await expect(registerInvite(asClient(sb), 'abcdefgh', 'a@example.invalid', 'a-password', 'en')).rejects.toThrow('FEATURE_DISABLED');
    expect(sb.auth.signUp).not.toHaveBeenCalled();
    expect(sb.auth.signInAnonymously).not.toHaveBeenCalled();
  });
  it('keeps existing accounts out of the invitee path', async () => {
    const sb = client({user:{is_anonymous:false}});
    await expect(registerInvite(asClient(sb), 'abcdefgh', 'a@example.invalid', 'a-password', 'en')).rejects.toThrow('ALREADY_SIGNED_IN');
    expect(sb.rpc).not.toHaveBeenCalled();
    expect(sb.auth.signUp).not.toHaveBeenCalled();
  });
  it('uses an existing account only for a magic link', async () => {
    const sb = client();
    await emailLink(asClient(sb), 'a@example.invalid');
    expect(sb.auth.signInWithOtp).toHaveBeenCalledWith({
      email:'a@example.invalid', options:{shouldCreateUser:false,emailRedirectTo:REFERRAL_RETURN},
    });
  });
  it('completes only the signed-in account via server proof, and permits non-referred sponsors to sign in', async () => {
    const sb = client();
    sb.rpc.mockResolvedValue({ data: { ok:false, error:'CLAIM_WINDOW_EXPIRED' } });
    await expect(finishInvitation(asClient(sb))).resolves.toBeUndefined();
    expect(sb.rpc).toHaveBeenCalledWith('complete_referral_signup', { p_token:null });
    sb.rpc.mockResolvedValue({ data: { ok:false, error:'EMAIL_UNVERIFIED' } });
    await expect(finishInvitation(asClient(sb))).rejects.toThrow('EMAIL_UNVERIFIED');
  });
});
