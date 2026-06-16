import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Delete Your Account · Margot",
  description:
    "How to delete your Margot account and personal data — the steps to request deletion, what data is removed, what is retained and for how long.",
  alternates: { canonical: "/delete-account" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "16 June 2026";

export default function DeleteAccountPage() {
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
            Delete Your <em>Account</em>
          </h1>
          <p className="mt-3 font-sans text-[13px] text-ink3 tracking-tight7">
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <Section>
          <P>
            This page explains how to delete your <Strong>Margot</Strong> account and the personal
            data associated with it. Margot is operated by <Strong>BRAMS Technologies LLC</Strong>.
          </P>
          <P>
            You can request deletion at any time — directly inside the app, or by email if you have
            already uninstalled it.
          </P>
        </Section>

        <Hr />

        <Section title="1. Delete from inside the app">
          <P>The fastest way to delete your account is from within Margot:</P>
          <Ol>
            <Li>Open the Margot app and sign in to your account.</Li>
            <Li>
              Go to the <Strong>Profile</Strong> tab, then tap <Strong>Privacy</Strong>.
            </Li>
            <Li>
              Tap <Strong>Delete Account</Strong> and confirm.
            </Li>
            <Li>
              You will be signed out. To finalise removal, send a short confirmation email to{" "}
              <a href="mailto:margot@margotwardrobe.com?subject=Delete%20my%20account" className="underline hover:text-peach">
                margot@margotwardrobe.com
              </a>{" "}
              from the email address linked to your account.
            </Li>
          </Ol>
        </Section>

        <Section title="2. Delete by email">
          <P>
            If you have already uninstalled the app or cannot sign in, email us and we will delete
            your account for you:
          </P>
          <Ul>
            <Li>
              Write to{" "}
              <a href="mailto:margot@margotwardrobe.com?subject=Delete%20my%20account" className="underline hover:text-peach">
                margot@margotwardrobe.com
              </a>{" "}
              from the email address linked to your Margot account.
            </Li>
            <Li>
              Use the subject line <Strong>"Delete my account"</Strong> so we can process your
              request quickly.
            </Li>
          </Ul>
          <P>
            We verify that the request comes from the account owner before deleting any data. Account
            deletion requests are processed within <Strong>30 days</Strong>, and usually much sooner.
          </P>
        </Section>

        <Section title="3. What data is deleted">
          <P>
            When your account is deleted, we permanently remove the personal data we hold about you,
            including:
          </P>
          <Ul>
            <Li>Your account and profile information (email, name, style preferences, settings).</Li>
            <Li>Your wardrobe — uploaded clothing photos and item details (category, color, brand, tags, notes).</Li>
            <Li>Generated outfits, outfit ratings, and saved looks.</Li>
            <Li>Wear logs and your wear history.</Li>
            <Li>Shopping scans, purchase-check results, and resale listings you created.</Li>
            <Li>Trips, planned outfits, and any calendar context stored on your account.</Li>
            <Li>Analytics identifiers tied to your account.</Li>
          </Ul>
        </Section>

        <Section title="4. What is retained, and for how long">
          <P>
            A limited amount of data is retained after deletion for security, operational, and legal
            reasons:
          </P>
          <Ul>
            <Li>
              <Strong>Encrypted backups and operational logs:</Strong> may persist for up to{" "}
              <Strong>30 days</Strong> before they expire and are overwritten.
            </Li>
            <Li>
              <Strong>Aggregated / anonymised analytics:</Strong> retained for up to{" "}
              <Strong>90 days</Strong>. This data can no longer be linked back to you.
            </Li>
            <Li>
              <Strong>Subscription and purchase records:</Strong> retained as required by tax and
              accounting law (typically up to <Strong>7 years</Strong>). These records do not
              include your wardrobe contents.
            </Li>
          </Ul>
          <P>
            We do <Strong>not</Strong> sell your data or share your wardrobe contents with advertisers
            or data brokers — before or after deletion.
          </P>
        </Section>

        <Section title="5. About your subscription">
          <P>
            Deleting your account does <Strong>not</Strong> automatically cancel a paid subscription.
            If you subscribed through Google Play, manage or cancel it in the{" "}
            <a href="https://play.google.com/store/account/subscriptions" className="underline hover:text-peach" target="_blank" rel="noopener noreferrer">
              Google Play subscriptions
            </a>{" "}
            settings. If you subscribed through the Apple App Store, cancel it in your iPhone
            Settings under your Apple Account → Subscriptions.
          </P>
        </Section>

        <Section title="6. Contact">
          <P>
            For any question about deleting your account or your data, contact:
          </P>
          <P>
            <Strong>BRAMS Technologies LLC</Strong>
            <br />
            Email:{" "}
            <a href="mailto:margot@margotwardrobe.com" className="underline hover:text-peach">
              margot@margotwardrobe.com
            </a>
          </P>
          <P className="text-ink3 text-[13px] italic">
            See also our{" "}
            <Link href="/privacy" className="underline hover:text-peach">
              Privacy Policy
            </Link>{" "}
            for the full description of how we handle your data and your GDPR rights.
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

function Ol({ children }: { children: React.ReactNode }) {
  return <ol className="font-sans text-[15px] leading-[1.65] text-ink2 tracking-tight7 list-decimal ml-5 my-3 space-y-1.5">{children}</ol>;
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
