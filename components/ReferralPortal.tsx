'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/launch';
import { emailLink, finishInvitation, REFERRAL_HOME, referralState, registerInvite, type ReferralState } from '@/lib/webReferral';
import { WEB_REFERRAL, QUOTA_NAMES } from '@/lib/webReferralCopy';
import type { InviteLocale } from '@/lib/socialInvite';

const field = 'block w-full rounded-xl border border-ink/30 bg-white p-3 text-ink';
const button = 'inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-2 text-white disabled:opacity-50';
const secondary = 'min-h-11 text-left underline disabled:opacity-50';
const storageKey = 'margot-referral-portal';
type View = 'login' | 'signup' | 'verify' | 'confirm' | 'hub';

function feedback(error: unknown, locale: InviteLocale) {
  const e = error as { code?: string; message?: string; status?: number };
  const c = WEB_REFERRAL[locale];
  if (e.status === 429 || /rate.limit|over_email|over_request/i.test(e.code || e.message || '')) return c.limited;
  switch (e.code || e.message) {
    case 'FEATURE_DISABLED': return c.closed;
    case 'INVALID_CODE': return c.invalid;
    case 'ALREADY_CLAIMED': case 'ALREADY_SIGNED_IN': case 'SELF_REFERRAL': return c.already;
    case 'QUOTAS_FULL': return c.full;
    case 'PREMIUM_REQUIRED': case 'NO_RECHARGE': return c.premiumOnly;
    case 'EMAIL_UNVERIFIED': return c.verifyIntro;
    case 'weak_password': return c.weak;
    case 'invalid_credentials': return c.invalidLogin;
    case 'user_already_exists': case 'email_exists': return c.duplicate;
    default: return c.fail;
  }
}

export function ReferralPortal({ origin, publicKey, locale, invitation, invalidInvitation, confirmation }: {
  origin: string; publicKey: string; locale: InviteLocale; invitation: string | null; invalidInvitation: boolean; confirmation: boolean;
}) {
  const c = WEB_REFERRAL[locale];
  const [view, setView] = useState<View>(confirmation ? 'confirm' : invitation ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(true);
  const [note, setNote] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [state, setState] = useState<ReferralState | null>(null);
  const client = useRef<SupabaseClient | null>(null);
  const code = useRef<string | null>(null);
  const exchanged = useRef(false);
  const rechargeId = useRef<string | null>(null);

  async function loadHub(sb: SupabaseClient) {
    const s = await referralState(sb);
    setShowReset(false);
    setState(s);
    setView('hub');
  }
  useEffect(() => {
    if (client.current || !publicKey || invalidInvitation) return;
    try {
      // The PKCE verifier must survive a mail link opening a new tab in the
      // same browser. Account sessions stay within their individual tab.
      const storageFor = (key: string) => key.endsWith('-code-verifier') ? window.localStorage : window.sessionStorage;
      const sb = createClient(origin, publicKey, { auth: {
        storageKey, flowType: 'pkce', detectSessionInUrl: false,
        storage: {
          getItem: k => storageFor(k).getItem(k),
          setItem: (k, v) => storageFor(k).setItem(k, v),
          removeItem: k => storageFor(k).removeItem(k),
        },
      } });
      client.current = sb;
      if (confirmation) {
        const url = new URL(window.location.href);
        code.current = url.searchParams.get('code');
        // Remove credentials from history before rendering any external link.
        window.history.replaceState(null, '', url.pathname);
        if (!code.current) { setView('verify'); setNote(c.expired); }
        setBusy(false);
        return;
      }
      sb.auth.getSession().then(async ({ data, error }) => {
        if (error) throw error;
        if (data.session && !data.session.user.is_anonymous) {
          await loadHub(sb);
          if (invitation) setNote(c.already);
        }
      }).catch(() => setNote(c.fail)).finally(() => setBusy(false));
    } catch { setNote(c.unavailable); setBusy(false); }
  }, [origin, publicKey, confirmation, invalidInvitation, invitation, c]);

  async function run(fn: (sb: SupabaseClient) => Promise<void>) {
    if (busy || !client.current) return;
    setBusy(true); setNote('');
    try { await fn(client.current); } catch (err) { setNote(feedback(err, locale)); }
    finally { setBusy(false); }
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const action = ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value;
    void run(async sb => {
      const address = email.trim();
      if (view === 'signup' && invitation) {
        const result = await registerInvite(sb, invitation, address, password, locale);
        setPassword(''); setView('verify');
        if (result.needsLink) await emailLink(sb, address);
        setNote(c.inbox);
      } else if (view === 'verify' || action === 'link') {
        await emailLink(sb, address); setPassword(''); setView('verify'); setNote(c.inbox);
      } else {
        const { error } = await sb.auth.signInWithPassword({ email: address, password });
        if (error) throw error;
        setPassword(''); await loadHub(sb);
      }
    });
  }
  function confirm() {
    void run(async sb => {
      if (!exchanged.current) {
        if (!code.current) { setView('verify'); setNote(c.expired); return; }
        const { error } = await sb.auth.exchangeCodeForSession(code.current);
        if (error) { setView('verify'); setNote(c.expired); return; }
        code.current = null;
        exchanged.current = true;
      }
      await finishInvitation(sb);
      await loadHub(sb);
    });
  }
  function reset() {
    void run(async sb => {
      const requestId = rechargeId.current ?? crypto.randomUUID();
      rechargeId.current = requestId;
      const { data, error } = await sb.rpc('redeem_referral_recharge', { p_request_id: requestId });
      if (error) throw error;
      if (!data?.ok) { rechargeId.current = null; throw new Error(data?.error || 'REFILL_FAILED'); }
      await loadHub(sb); rechargeId.current = null; setNote(c.redeemed);
    });
  }
  async function copy(link: string) {
    try { await navigator.clipboard.writeText(link); setNote(c.copied); }
    catch { setNote(c.manual); }
  }
  const benefits = state?.benefits;
  const link = state?.code && benefits?.programOpen ? REFERRAL_HOME + '?invitation=' + encodeURIComponent(state.code) : '';
  const latest = benefits?.latestReward;
  const expire = latest?.kind === 'premium_time' && latest.expiresAt ? new Date(latest.expiresAt) : null;
  const affected = benefits?.quotas.filter(q => q.resetsAt && q.remaining < q.limit) ?? [];
  const quotaName = (feature: string) => QUOTA_NAMES[feature]?.[locale === 'fr' ? 0 : locale === 'en' ? 1 : 2] ?? feature;
  const date = (value: string) => new Date(value).toLocaleString(locale, {dateStyle:'medium', timeStyle:'short'});
  const title = view === 'hub' ? c.done : view === 'confirm' || view === 'verify' ? c.verify : invitation ? c.join : c.title;
  return <div className="space-y-5">
    <h1 className="font-display text-4xl leading-tight">{title}</h1>
    {invalidInvitation || !publicKey ? <p role="alert">{invalidInvitation ? c.invalid : c.unavailable}</p> : <>
      {(view === 'signup' || view === 'login' || view === 'verify') && <>
        <p>{view === 'signup' ? c.joinIntro : view === 'verify' ? c.verifyIntro : c.intro}</p>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block">{c.email}<input className={field} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} /></label>
          {view !== 'verify' && <label className="block">{c.password}<input className={field} type="password" autoComplete={view === 'signup' ? 'new-password' : 'current-password'}
            required={view === 'signup'} minLength={view === 'signup' ? 8 : undefined} maxLength={256} value={password} onChange={e => setPassword(e.target.value)} /></label>}
          <div className="flex flex-wrap items-center gap-4">
            <button className={button} type="submit" disabled={busy}>{view === 'signup' ? c.signup : view === 'login' ? c.login : c.link}</button>
            {view === 'login' && <button className={secondary} type="submit" value="link" disabled={busy}>{c.link}</button>}
          </div>
        </form>
        {view === 'login' && <p className="text-sm">{c.emailHelp}</p>}
        {view !== 'verify' && <button className={secondary} onClick={() => { setPassword(''); setView('verify'); setNote(''); }}>{c.emailOnly}</button>}
      </>}
      {view === 'confirm' && <><p>{c.verifyIntro}</p><button className={button} disabled={busy} onClick={confirm}>{c.verify}</button></>}
      {view === 'hub' && benefits && <>
        {expire && expire.valueOf() > Date.now() && <p>{c.gift} <strong>{expire.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })}</strong>.</p>}
        {link ? <section className="space-y-3"><p>{c.intro}</p><h2 className="font-display text-xl">{c.inviteLink}</h2>
          <input className={field} aria-label={c.inviteLink} readOnly value={link} onFocus={e => e.currentTarget.select()} />
          <button className={button} onClick={() => void copy(link)}>{c.copy}</button></section> : <p>{c.closed}</p>}
        {(benefits.premium || benefits.recharges > 0) && <section className="space-y-2"><h2 className="font-display text-xl">{c.recharges} · {benefits.recharges}</h2><p>{c.resetHelp}</p>
           {benefits.recharges > 0 && !showReset && <button className={button} disabled={busy || !benefits.premium || !affected.length} onClick={() => setShowReset(true)}>{c.reset}</button>}
          {showReset && <div className="space-y-2 rounded-xl border border-ink/20 p-4"><p>{c.confirmHelp}</p><ul>
            {affected.map(q => <li key={q.feature}>{quotaName(q.feature)} · {q.remaining} → {q.limit} {c.remaining}</li>)}</ul>
            <div className="flex gap-4"><button className={button} disabled={busy} onClick={reset}>{c.confirmReset}</button>
            <button className={secondary} disabled={busy} onClick={() => setShowReset(false)}>{c.cancel}</button></div></div>}</section>}
        {!expire && <button className={secondary} onClick={() => {setView('verify'); setNote('');}}>{c.emailOnly}</button>}
        {benefits.quotas.length > 0 && <details><summary className="cursor-pointer py-2 font-semibold">{c.quotas}</summary><ul className="space-y-2 pt-2">
          {benefits.quotas.map(q => <li key={q.feature}>{quotaName(q.feature)} · {q.remaining}/{q.limit} {c.remaining}
            {q.resetsAt && <small className="block">{c.nextReset} {date(q.resetsAt)}</small>}</li>)}</ul></details>}
        <button className={secondary} disabled={busy} onClick={() => void run(async sb => {
          const { error } = await sb.auth.signOut({ scope: 'local' }); if (error) throw error;
          setState(null); setEmail(''); setView(invitation ? 'signup' : 'login');
        })}>{c.signout}</button>
      </>}
      <p role="status" aria-live="polite">{busy ? c.pending : note}</p>
    </>}
    <div className="border-t border-ink/20 pt-4"><span className="block">{c.stores}</span><div className="flex gap-5">
      <a className={secondary} href={APP_STORE_URL}>App Store</a><a className={secondary} href={PLAY_STORE_URL}>Google Play</a></div>
    </div>
  </div>;
}
