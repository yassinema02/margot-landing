// landing-c.jsx — Meet Margot, Pricing, Second capture, FAQ, Footer, FadeIn.

// ─── FadeIn — subtle on-scroll reveal (uses IntersectionObserver) ───────
function FadeIn({ children, delay = 0, y = 18 }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    // Respect reduced motion.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setVisible(true), delay);
        obs.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
      transition: 'opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1)',
      willChange: 'opacity, transform',
    }}>{children}</div>
  );
}

// ─── MEET MARGOT ────────────────────────────────────────────────────────
function MeetMargot({ t }) {
  // Italicise the last word of the headline for editorial emphasis.
  const headlineParts = t.meet.headline.split(' ');
  const last = headlineParts.pop();
  const head = headlineParts.join(' ');
  return (
    <section style={{
      padding: 'clamp(72px, 9vw, 128px) 24px',
      background: T.surface,
      borderTop: `1px solid ${T.warm2}`,
      borderBottom: `1px solid ${T.warm2}`,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
          gap: 'clamp(40px, 6vw, 96px)',
          alignItems: 'center',
        }} className="meet-grid">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '70%', maxWidth: 360 }}>
              <MargotSVG state="considering" size={400} showLegs={true} />
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: '"Inter Tight"', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: T.ink3,
            }}>{t.meet.eyebrow}</div>
            <h2 style={{
              margin: '14px 0 0',
              fontFamily: '"Fraunces", serif', fontWeight: 400,
              fontSize: 'clamp(40px, 5.5vw, 80px)', lineHeight: 0.95,
              letterSpacing: '-0.04em', color: T.ink,
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
            }}>
              {head} <em>{last}</em>
            </h2>
            <p style={{
              margin: '24px 0 0', maxWidth: 540,
              fontFamily: '"Fraunces", serif', fontWeight: 400,
              fontSize: 'clamp(18px, 1.8vw, 22px)', lineHeight: 1.5,
              letterSpacing: '-0.015em', color: T.ink2,
              fontVariationSettings: '"opsz" 96, "SOFT" 50',
              textWrap: 'pretty',
            }}>{t.meet.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRICING TEASER ─────────────────────────────────────────────────────
function Pricing({ t }) {
  return (
    <section style={{
      padding: 'clamp(72px, 9vw, 128px) 24px',
      maxWidth: 820, margin: '0 auto',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {t.pricing.map((line, i) => (
          <div key={i} style={{
            fontFamily: '"Fraunces", serif', fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(20px, 2.4vw, 30px)', lineHeight: 1.4,
            letterSpacing: '-0.02em',
            color: i === 0 ? T.ink : T.ink2,
            fontVariationSettings: '"opsz" 96',
            textWrap: 'pretty',
          }}>{line}</div>
        ))}
      </div>
    </section>
  );
}

// ─── SECOND EMAIL CAPTURE ───────────────────────────────────────────────
// Brief: "Same form, same microcopy, same button." No extra headline.
// We just give it a small ornamental top so it doesn't feel orphaned.
function SecondCapture({ t, submitted, setSubmitted, email, setEmail }) {
  return (
    <section style={{
      padding: 'clamp(64px, 8vw, 112px) 24px',
      background: T.bg,
      borderTop: `1px solid ${T.warm2}`,
    }}>
      <div style={{
        maxWidth: 620, margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        textAlign: 'center',
      }}>
        {/* Ornamental serif glyph — three rust pips, like a magazine end mark */}
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center',
        }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              width: 5, height: 5, borderRadius: 999,
              background: i === 1 ? T.peach : T.ink4,
            }} />
          ))}
        </div>
        <div style={{
          fontFamily: '"Fraunces", serif', fontStyle: 'italic',
          fontSize: 'clamp(22px, 2.2vw, 28px)', lineHeight: 1.35,
          letterSpacing: '-0.02em', color: T.ink2,
          fontVariationSettings: '"opsz" 96',
          maxWidth: 460,
        }}>{t.hero.subline}</div>
        <div style={{ width: '100%' }}>
          <WaitlistForm
            t={t} submitted={submitted} setSubmitted={setSubmitted}
            email={email} setEmail={setEmail} variant="footer"
          />
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────
function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div style={{
      borderBottom: `1px solid ${T.warm2}`,
    }}>
      <button onClick={onToggle} style={{
        width: '100%', textAlign: 'left',
        padding: '24px 0',
        background: 'transparent', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24,
      }} aria-expanded={isOpen}>
        <span style={{
          fontFamily: '"Fraunces", serif', fontWeight: 400,
          fontSize: 'clamp(20px, 2.2vw, 28px)', lineHeight: 1.25,
          letterSpacing: '-0.025em', color: T.ink,
          fontVariationSettings: '"opsz" 96',
        }}>{q}</span>
        <span style={{
          fontFamily: '"Fraunces", serif', fontSize: 30, color: T.ink3,
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 240ms cubic-bezier(0.4,0,0.2,1)',
          flexShrink: 0, lineHeight: 1, fontWeight: 300,
        }}>+</span>
      </button>
      <div style={{
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows 360ms cubic-bezier(0.4,0,0.2,1), opacity 280ms ease',
        opacity: isOpen ? 1 : 0,
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            paddingBottom: 28, paddingRight: 24,
            fontFamily: '"Inter Tight"', fontSize: 15, lineHeight: 1.6,
            color: T.ink2, letterSpacing: '-0.005em',
            maxWidth: 720, textWrap: 'pretty',
          }}>{a}</div>
        </div>
      </div>
    </div>
  );
}

function Faq({ t }) {
  // Brief: "Closed by default."
  const [open, setOpen] = React.useState(-1);
  return (
    <section style={{
      padding: 'clamp(64px, 8vw, 120px) 24px',
      maxWidth: 880, margin: '0 auto',
    }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: '"Fraunces", serif', fontWeight: 400,
          fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.0,
          letterSpacing: '-0.035em', color: T.ink,
          fontVariationSettings: '"opsz" 144, "SOFT" 50',
        }}>{t.faqHeading}</div>
      </div>
      <div>
        {t.faq.map((item, i) => (
          <FaqItem key={i} q={item.q} a={item.a}
                   isOpen={open === i}
                   onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────
function Footer({ t }) {
  return (
    <footer style={{
      padding: '56px 24px 56px',
      borderTop: `1px solid ${T.warm2}`,
      background: T.surface,
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', flexDirection: 'column', gap: 32,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: 32, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <MargotSVG state="considering" size={44} showLegs={false} crop="portrait" />
            <div>
              <div style={{
                fontFamily: '"Fraunces", serif', fontWeight: 400,
                fontStyle: 'italic', fontSize: 26, color: T.ink,
                fontVariationSettings: '"opsz" 96',
                letterSpacing: '-0.03em', lineHeight: 1,
              }}>Margot<span style={{ color: T.peach, fontStyle: 'normal' }}>.</span></div>
              <div style={{
                fontFamily: '"Fraunces", serif', fontStyle: 'italic',
                fontSize: 13, color: T.ink3, marginTop: 4,
              }}>{t.footer.tagline}</div>
            </div>
          </div>

          {/* Links */}
          <nav style={{
            display: 'flex', gap: 'clamp(14px, 2vw, 28px)',
            flexWrap: 'wrap', alignItems: 'center',
          }}>
            {t.footer.links.map(link => (
              <a key={link.label} href={link.href}
                 target={link.href.startsWith('http') ? '_blank' : undefined}
                 rel="noopener noreferrer"
                 style={{
                   fontFamily: '"Inter Tight"', fontSize: 13, fontWeight: 500,
                   color: T.ink2, textDecoration: 'none',
                   letterSpacing: '-0.005em',
                   borderBottom: `1px solid transparent`,
                   paddingBottom: 2,
                   transition: 'border-color 200ms ease, color 200ms ease',
                 }}
                 onMouseEnter={e => {
                   e.currentTarget.style.borderBottomColor = T.peach;
                   e.currentTarget.style.color = T.ink;
                 }}
                 onMouseLeave={e => {
                   e.currentTarget.style.borderBottomColor = 'transparent';
                   e.currentTarget.style.color = T.ink2;
                 }}>{link.label}</a>
            ))}
          </nav>
        </div>

        <div style={{
          paddingTop: 24,
          borderTop: `1px solid ${T.warm2}`,
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{
            fontFamily: '"Inter Tight"', fontSize: 12, color: T.ink3,
            letterSpacing: '0.04em',
          }}>{t.footer.madeIn}</div>
          <div style={{
            fontFamily: '"Inter Tight"', fontSize: 11, color: T.ink3,
            letterSpacing: '0.06em',
          }}>{t.footer.legal}</div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  FadeIn, MeetMargot, Pricing, SecondCapture,
  FaqItem, Faq, Footer,
});
