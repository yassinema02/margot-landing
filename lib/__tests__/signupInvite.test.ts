import { describe, expect, it } from 'vitest';
import { redactInviteToken } from '../redactInviteToken';
import { SIGNUP_COPY, signupCode } from '../signupInvite';

describe('referral fallback after store installation', () => {
  it('accepts the same eight-character alphabet as the app', () => {
    expect(signupCode('ABCDEFG2')).toBe('ABCDEFG2');
    expect(signupCode('abcdefgh')).toBe('ABCDEFGH');
    for (const value of ['ABCDEF01', 'ABCDEFG22', ['ABCDEFG2'], undefined]) expect(signupCode(value)).toBeNull();
    for (const text of Object.values(SIGNUP_COPY)) expect(text.detail).toMatch(/3/);
  });
  it('redacts both referral paths and the code attached to social links', () => {
    expect(redactInviteToken('https://www.margotwardrobe.com/r/ABCDEFG2')).toBe('https://www.margotwardrobe.com/r/:code');
    expect(redactInviteToken('https://www.margotwardrobe.com/i/example?ref=ABCDEFG2')).not.toContain('ABCDEFG2');
  });
});
