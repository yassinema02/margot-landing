import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy · Margot",
  description:
    "How Margot collects, uses, and protects your personal information — data we hold, how AI uses it, what's never shared, and how to request deletion. GDPR-compliant.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "20 May 2026";

export default function PrivacyPage() {
  return (
    <main className="bg-bg text-ink min-h-screen px-6 py-[clamp(48px,7vw,96px)]">
      <article className="max-w-[760px] mx-auto">
        <Link
          href="/"
          className="font-sans text-[12px] font-medium tracking-tight7 text-ink3 hover:text-ink no-underline"
        >
          ← Back to Margot
        </Link>

        <header className="mt-8 mb-12">
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight2">
            Privacy <em>Policy</em>
          </h1>
          <p className="mt-3 font-sans text-[13px] text-ink3 tracking-tight7">
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <Section>
          <P>
            This Privacy Policy describes how <Strong>Margot</Strong> ("we", "us", "our"),
            operated by BRAMS Technologies LLC, collects, uses, and protects your personal information
            when you use the Margot mobile application (the "App").
          </P>
          <P>
            By using Margot, you agree to the practices described in this policy. If you do not
            agree, please do not use the App.
          </P>
        </Section>

        <Hr />

        <Section title="1. Who we are">
          <P>
            Margot is a mobile application that helps you digitise your wardrobe, get AI-powered
            outfit suggestions, and decide whether new clothing items fit your existing closet.
            The App is developed and operated by BRAMS Technologies LLC.
          </P>
          <P>
            <Strong>Contact email:</Strong>{" "}
            <a href="mailto:hello@margotwardrobe.com" className="underline hover:text-peach">
              hello@margotwardrobe.com
            </a>
          </P>
        </Section>

        <Section title="2. Data we collect">
          <P>We collect only the data necessary to deliver the App's features.</P>

          <Sub title="2.1 Data you provide directly">
            <Ul>
              <Li>
                <Strong>Account information</Strong> (optional): email address, name, profile
                photo if you sign in with Apple or Google.
              </Li>
              <Li>
                <Strong>Wardrobe data:</Strong> photos of clothing items you upload, item metadata
                (category, color, brand, tags, notes).
              </Li>
              <Li>
                <Strong>Wear logs:</Strong> which items you wore on which dates.
              </Li>
              <Li>
                <Strong>Outfit ratings and feedback:</Strong> love / save / dismiss signals on
                AI-generated outfit suggestions.
              </Li>
              <Li>
                <Strong>Subscription receipts:</Strong> information about premium purchases,
                validated via Apple StoreKit and RevenueCat.
              </Li>
            </Ul>
          </Sub>

          <Sub title="2.2 Data collected with your explicit permission">
            <Ul>
              <Li>
                <Strong>Camera and photo library access</Strong> (iOS): only used to capture or
                import photos of clothing items into your wardrobe.
              </Li>
              <Li>
                <Strong>Calendar access</Strong> (iOS, optional): used to read event titles and
                times so the AI can suggest outfits appropriate for your day. Calendar data is
                processed in memory and not stored persistently.
              </Li>
              <Li>
                <Strong>Location access</Strong> (iOS, optional): used to fetch local weather data
                so outfit suggestions match the day's temperature. Location is processed in memory
                and not stored.
              </Li>
            </Ul>
          </Sub>

          <Sub title="2.3 Data collected automatically">
            <Ul>
              <Li>
                <Strong>Usage analytics:</Strong> anonymised events (screen views, feature
                interactions, session length) to improve the App.
              </Li>
              <Li>
                <Strong>Crash reports:</Strong> technical diagnostic information sent
                automatically when the App crashes.
              </Li>
              <Li>
                <Strong>Device information:</Strong> model, operating system version, language,
                time zone.
              </Li>
            </Ul>
          </Sub>

          <P>
            We do <Strong>not</Strong> collect: precise advertising identifiers (IDFA), browsing
            history outside the App, contacts, microphone audio, health data, or financial
            account details.
          </P>
        </Section>

        <Section title="3. How we use your data">
          <P>We use your data exclusively to:</P>
          <Ul>
            <Li>
              Power the App's core features (digital wardrobe, AI outfit suggestions, "Check
              Before You Buy", Vinted listing generation).
            </Li>
            <Li>
              Personalise outfit recommendations based on your wear history, style preferences,
              and calendar/weather context.
            </Li>
            <Li>
              Process and validate subscription payments via Apple's IAP system and RevenueCat.
            </Li>
            <Li>Diagnose technical issues, monitor App stability, and improve features.</Li>
            <Li>Communicate with you about account or subscription matters.</Li>
          </Ul>
          <P>
            We do <Strong>not</Strong> use your data for advertising, sell it to third parties,
            or share it with data brokers.
          </P>
        </Section>

        <Section title="4. AI processing">
          <P>
            Margot uses large language models (currently OpenAI GPT-4o-mini) to generate outfit
            suggestions and shopping advice. When the AI generates a suggestion, the following
            information is sent to OpenAI's API:
          </P>
          <Ul>
            <Li>
              Anonymised wardrobe item descriptions (categories, colors, materials — no images or
              personal identifiers).
            </Li>
            <Li>The day's context (weather and calendar summary, anonymised).</Li>
            <Li>Your stated style preferences.</Li>
          </Ul>
          <P>
            We do <Strong>not</Strong> send your photos, your name, or any direct identifier to
            AI providers. OpenAI is contractually bound not to use API data for model training.
          </P>
        </Section>

        <Section title="5. Third parties we share data with">
          <P>We use a small number of trusted service providers to operate the App.</P>
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-warm2">
                  <Th>Provider</Th>
                  <Th>Purpose</Th>
                  <Th>Data shared</Th>
                </tr>
              </thead>
              <tbody>
                <Tr provider="Supabase" purpose="Storage of wardrobe data, accounts, wear logs" data="All wardrobe data, account data" />
                <Tr provider="OpenAI" purpose="Outfit suggestion generation" data="Anonymised wardrobe summaries + context" />
                <Tr provider="RevenueCat" purpose="Validate and manage premium subscriptions" data="Subscription receipt + anonymous user ID" />
                <Tr provider="Apple" purpose="Payment processing, app distribution" data="Per Apple's privacy policy" />
                <Tr provider="OpenWeatherMap" purpose="Local weather for outfit context" data="Approximate location only" />
                <Tr provider="remove.bg / rembg" purpose="Background removal on photos" data="Item photos (processed in real-time, not retained)" />
              </tbody>
            </table>
          </div>
          <P>
            We do not share data with advertising networks, data brokers, or third-party marketing
            services.
          </P>
        </Section>

        <Section title="6. How long we keep your data">
          <Ul>
            <Li>
              <Strong>Wardrobe data, wear logs, account data:</Strong> retained as long as your
              account exists. Deleted within 30 days after account deletion.
            </Li>
            <Li>
              <Strong>Crash reports and analytics:</Strong> retained for 90 days, then
              aggregated/anonymised or deleted.
            </Li>
            <Li>
              <Strong>Subscription receipts:</Strong> retained as required by Apple's IAP records
              (typically 7 years for tax/legal purposes).
            </Li>
          </Ul>
          <P>
            You can delete your account at any time from the App's Settings screen, which triggers
            deletion of all your personal data within 30 days.
          </P>
        </Section>

        <Section title="7. Your rights (GDPR & equivalent)">
          <P>
            If you are located in the European Union, the United Kingdom, or another jurisdiction
            with similar privacy laws, you have the right to:
          </P>
          <Ul>
            <Li>
              <Strong>Access</Strong> the personal data we hold about you.
            </Li>
            <Li>
              <Strong>Correct</Strong> inaccurate data.
            </Li>
            <Li>
              <Strong>Delete</Strong> your data (right to erasure).
            </Li>
            <Li>
              <Strong>Export</Strong> your data in a portable format.
            </Li>
            <Li>
              <Strong>Object</Strong> to or restrict certain processing.
            </Li>
            <Li>
              <Strong>Withdraw consent</Strong> for optional permissions at any time via iOS
              Settings.
            </Li>
            <Li>
              <Strong>Lodge a complaint</Strong> with your local data protection authority.
            </Li>
          </Ul>
          <P>
            To exercise any of these rights, email{" "}
            <a href="mailto:hello@margotwardrobe.com" className="underline hover:text-peach">
              hello@margotwardrobe.com
            </a>
            . We will respond within 30 days.
          </P>
        </Section>

        <Section title="8. Security">
          <Ul>
            <Li>All data is encrypted in transit (TLS 1.2+).</Li>
            <Li>Data at rest in Supabase is encrypted (AES-256).</Li>
            <Li>Access to production systems is restricted to authorised personnel.</Li>
            <Li>
              Authentication uses Apple Sign In / Google Sign In OAuth; we do not store passwords.
            </Li>
          </Ul>
          <P>
            If we become aware of a data breach affecting your personal information, we will
            notify you within 72 hours, in accordance with GDPR Article 33.
          </P>
        </Section>

        <Section title="9. Children's privacy">
          <P>
            Margot is not directed at children under 13. We do not knowingly collect personal data
            from children under 13. If you believe we have collected data from a child under 13,
            please contact us at{" "}
            <a href="mailto:hello@margotwardrobe.com" className="underline hover:text-peach">
              hello@margotwardrobe.com
            </a>{" "}
            and we will delete it promptly.
          </P>
          <P>
            In the European Economic Area and the United Kingdom, the minimum age for using the
            App is 16 unless a parent or guardian consents.
          </P>
        </Section>

        <Section title="10. International data transfers">
          <P>
            Some of our service providers are located outside the European Economic Area (notably
            OpenAI and RevenueCat in the United States). Where data is transferred internationally,
            we rely on Standard Contractual Clauses adopted by the European Commission to ensure
            your data receives an equivalent level of protection.
          </P>
        </Section>

        <Section title="11. Changes to this policy">
          <P>
            We may update this Privacy Policy from time to time. When we make material changes, we
            will notify you in the App and update the "Last updated" date at the top.
          </P>
        </Section>

        <Section title="12. Contact">
          <P>
            If you have any questions about this Privacy Policy or how we handle your data, please
            contact:
          </P>
          <P>
            <Strong>BRAMS Technologies LLC</Strong>
            <br />
            Email:{" "}
            <a href="mailto:hello@margotwardrobe.com" className="underline hover:text-peach">
              hello@margotwardrobe.com
            </a>
          </P>
          <P className="text-ink3 text-[13px] italic">
            For data protection requests, please include "Privacy Request" in the subject line.
          </P>
        </Section>
      </article>
    </main>
  );
}

// --- helpers ---------------------------------------------------------------

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      {title && (
        <h2 className="font-display font-normal text-ink opsz-96 text-[clamp(20px,2.2vw,26px)] leading-[1.2] tracking-tight4 mt-10 mb-4">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 mb-3">
      <h3 className="font-display italic text-ink2 opsz-96 text-[16px] leading-[1.3] tracking-tight5 mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`font-sans text-[15px] leading-[1.65] text-ink2 tracking-tight7 [text-wrap:pretty] my-3 ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="font-sans text-[15px] leading-[1.65] text-ink2 tracking-tight7 list-disc ml-5 my-3 space-y-1.5">{children}</ul>;
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="[text-wrap:pretty]">{children}</li>;
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

function Hr() {
  return <hr className="my-10 border-0 h-px bg-warm2" />;
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-3 pr-4 font-sans text-[11px] font-semibold tracking-wider2 uppercase text-ink3">
      {children}
    </th>
  );
}

function Tr({ provider, purpose, data }: { provider: string; purpose: string; data: string }) {
  return (
    <tr className="border-b border-warm2/60 last:border-b-0">
      <td className="py-3 pr-4 font-sans text-[14px] font-medium text-ink tracking-tight7">{provider}</td>
      <td className="py-3 pr-4 font-sans text-[14px] text-ink2 tracking-tight7">{purpose}</td>
      <td className="py-3 font-sans text-[14px] text-ink2 tracking-tight7">{data}</td>
    </tr>
  );
}
