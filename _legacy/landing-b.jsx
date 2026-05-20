// landing-b.jsx — Hero + email form + sections.

// ─── Reusable email capture form ────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function WaitlistForm({ t, submitted, setSubmitted, email, setEmail, variant = 'hero' }) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState('');
  const onSubmit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError(t.hero.placeholder);
      return;
    }
    setError('');
    setPending(true);
    // TODO: swap with Beehiiv endpoint.
    // fetch('https://api.beehiiv.com/v2/publications/{pub-id}/subscriptions', {
    //   method: 'POST', headers: {...}, body: JSON.stringify({ email })
    // }).then(...)
    setTimeout(() => {
      setPending(false);
      setSubmitted(true);
    }, 700);
  };

  if (submitted) {
    return (
      <div style={{
        background: T.surface, border: `1px solid ${T.warm2}`,
        borderRadius: 8, padding: '24px 28px',
        maxWidth: variant === 'hero' ? 520 : 600,
      }}>
        <div style={{
          fontFamily: '"Inter Tight"', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: T.sage,
        }}>· {t.success.eyebrow}</div>
        <div style={{
          marginTop: 10,
          fontFamily: '"Fraunces", serif', fontStyle: 'italic',
          fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.025em',
          color: T.ink, fontVariationSettings: '"opsz" 144',
        }}>{t.success.headline}</div>
        <div style={{
          marginTop: 8,
          fontFamily: '"Inter Tight"', fontSize: 14,
          color: T.ink2, lineHeight: 1.55, maxWidth: 440,
        }}>{t.success.body}</div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => {
            navigator.clipboard?.writeText('https://margot.app/?ref=you');
          }} style={{
            padding: '11px 18px', borderRadius: 999,
            background: T.ink, color: T.surface, border: 'none',
            fontFamily: '"Inter Tight"', fontSize: 13, fontWeight: 600,
            letterSpacing: '-0.005em', cursor: 'pointer',
          }}>{t.success.cta}</button>
          <span style={{
            fontFamily: '"Inter Tight"', fontSize: 12, color: T.ink3,
          }}>{t.success.hint}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      maxWidth: variant === 'hero' ? 520 : 600, width: '100%',
    }}>
      <div style={{
        display: 'flex', gap: 8,
        background: T.surface, padding: 6, borderRadius: 999,
        border: `1px solid ${T.warm2}`,
      }}>
        <input
          type="email" required value={email}
          placeholder={t.hero.placeholder}
          onChange={e => setEmail(e.target.value)}
          style={{
            flex: 1, padding: '10px 18px',
            background: 'transparent', border: 'none', outline: 'none',
            fontFamily: '"Inter Tight"', fontSize: 15, color: T.ink,
            letterSpacing: '-0.005em',
            minWidth: 0,
          }}
          aria-label={t.hero.placeholder}
        />
        <button type="submit" disabled={pending} style={{
          padding: '10px 20px', borderRadius: 999,
          background: T.ink, color: T.surface, border: 'none',
          fontFamily: '"Inter Tight"', fontSize: 13, fontWeight: 600,
          letterSpacing: '-0.005em', cursor: pending ? 'wait' : 'pointer',
          whiteSpace: 'nowrap', opacity: pending ? 0.7 : 1,
        }}>{pending ? '…' : t.hero.button}</button>
      </div>
      <div style={{
        fontFamily: '"Inter Tight"', fontSize: 12,
        color: error ? T.peach : T.ink3,
        marginLeft: 4,
      }}>{t.hero.micro}</div>
    </form>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────────
function Hero({ t, submitted, setSubmitted, email, setEmail }) {
  return (
    <section id="top" style={{
      padding: 'clamp(48px, 8vw, 96px) 24px 80px',
      maxWidth: 1280, margin: '0 auto',
    }}>
      <div style={{
        display: 'grid', gap: 'clamp(32px, 5vw, 64px)',
        gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
        alignItems: 'center',
      }} className="hero-grid">
        <div>
          <div style={{
            fontFamily: '"Inter Tight"', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: T.ink3, marginBottom: 24,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 999,
            border: `1px solid ${T.warm2}`, background: T.surface,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: T.peach }} />
            {t.hero.eyebrow}
          </div>
          <h1 style={{
            margin: 0,
            fontFamily: '"Fraunces", serif', fontWeight: 400,
            fontSize: 'clamp(54px, 9vw, 120px)', lineHeight: 0.92,
            letterSpacing: '-0.045em', color: T.ink,
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
          }}>
            {t.hero.headline[0]}<br/>
            <em>{t.hero.headline[1]}</em>
          </h1>
          <div style={{
            marginTop: 'clamp(20px, 2.5vw, 32px)',
            fontFamily: '"Fraunces", serif', fontStyle: 'italic',
            fontSize: 'clamp(18px, 2vw, 26px)', lineHeight: 1.3,
            letterSpacing: '-0.015em', color: T.ink2,
            maxWidth: 540,
            fontVariationSettings: '"opsz" 96',
          }}>{t.hero.subline}</div>
          <div style={{ marginTop: 'clamp(28px, 3vw, 40px)' }}>
            <WaitlistForm t={t} submitted={submitted} setSubmitted={setSubmitted}
                          email={email} setEmail={setEmail} variant="hero" />
          </div>
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <MargotSVG state="considering" size={420} showLegs={true} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PROBLEM ────────────────────────────────────────────────────────────
function Problem({ t }) {
  return (
    <section style={{
      padding: 'clamp(64px, 9vw, 120px) 24px',
      maxWidth: 880, margin: '0 auto',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: '"Fraunces", serif', fontWeight: 400,
        fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.45,
        letterSpacing: '-0.02em', color: T.ink2,
        fontVariationSettings: '"opsz" 96, "SOFT" 50',
        textWrap: 'pretty',
      }}>
        {t.problem.split('—').map((part, i, arr) =>
          i < arr.length - 1
            ? <React.Fragment key={i}>{part}<span style={{ color: T.peach }}>—</span></React.Fragment>
            : part
        )}
      </div>
    </section>
  );
}

// ─── FEATURES ───────────────────────────────────────────────────────────
// Brief: "No section called 'Features' labelled as such. The three blocks
// flow without that header." — so we render the blocks bare, no heading.
function Features({ t }) {
  return (
    <section style={{
      padding: 'clamp(48px, 6vw, 88px) 24px',
      maxWidth: 1280, margin: '0 auto',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 'clamp(24px, 3vw, 40px)',
      }}>
        {t.features.map((f, i) => (
          <div key={i} style={{
            padding: '32px 24px',
            background: T.surface, border: `1px solid ${T.warm2}`,
            borderRadius: 8,
          }}>
            <div style={{ height: 92, marginBottom: 24, display: 'flex', alignItems: 'center' }}>
              <MargotSVG state={f.state} size={84} showLegs={false} crop="portrait" />
            </div>
            <div style={{
              fontFamily: '"Fraunces", serif', fontWeight: 400,
              fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.025em',
              color: T.ink, marginBottom: 12,
              fontVariationSettings: '"opsz" 96',
            }}>{f.title}</div>
            <div style={{
              fontFamily: '"Inter Tight"', fontSize: 15, lineHeight: 1.55,
              color: T.ink2, letterSpacing: '-0.005em',
              textWrap: 'pretty',
            }}>{f.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { WaitlistForm, Hero, Problem, Features });
