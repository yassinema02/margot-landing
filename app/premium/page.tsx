import type { Metadata } from "next";
import Link from "next/link";

// Les emails (relance VIP, fin d'essai, winback) pointaient vers /premium, qui
// n'existait pas : bouton -> 404. Cette page reprend le fonctionnement de
// /weekly-recap : on tente d'ouvrir l'app, et on retombe sur un bouton visible
// si rien ne se passe. Le repli est l'App Store et pas un message d'erreur,
// parce qu'une partie des destinataires a desinstalle l'app.
const DEEP_LINK = "margot://premium";
const APP_STORE = "https://apps.apple.com/app/id6766047882";

export const metadata: Metadata = {
  title: "Ouvrir Margot Premium",
  description: "Ouvrez Margot Premium dans l'application.",
  alternates: { canonical: "/premium" },
  robots: { index: false, follow: false },
};

export default function PremiumRedirectPage() {
  return (
    <main className="bg-bg text-ink min-h-screen px-6 py-[clamp(48px,7vw,96px)]">
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.location.replace(${JSON.stringify(DEEP_LINK)});
            // Si l'app n'est pas installee, le schema custom ne fait rien et la
            // page reste affichee : au bout de 2 s on bascule sur l'App Store.
            // Le timer est annule si la page passe en arriere-plan, signe que
            // l'app s'est bien ouverte.
            var jumped = false;
            function cancel() { jumped = true; }
            document.addEventListener('visibilitychange', function () {
              if (document.hidden) cancel();
            });
            window.addEventListener('pagehide', cancel);
            setTimeout(function () {
              if (!jumped && !document.hidden) {
                window.location.replace(${JSON.stringify(APP_STORE)});
              }
            }, 2000);
          `,
        }}
      />
      <article className="max-w-[620px] mx-auto">
        <Link
          href="/"
          className="font-sans text-[12px] font-medium tracking-tight7 text-ink3 hover:text-ink no-underline"
        >
          ← Retour à Margot
        </Link>

        <header className="mt-8 mb-8">
          <div className="font-sans text-[11px] font-semibold tracking-wider2 uppercase text-peach mb-4">
            Premium
          </div>
          <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(40px,5.5vw,68px)] leading-[1.02] tracking-tight2 [text-wrap:balance]">
            Ouverture de <em>Margot</em>.
          </h1>
          <p className="mt-5 font-display italic text-ink3 opsz-96 text-[clamp(16px,1.7vw,19px)] leading-[1.45] tracking-tight5 [text-wrap:pretty]">
            Si l&apos;application ne s&apos;est pas ouverte toute seule, touchez le bouton ci-dessous.
          </p>
        </header>

        <a
          href={DEEP_LINK}
          className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 font-sans text-[14px] font-semibold text-white no-underline hover:opacity-90"
        >
          Ouvrir Margot
        </a>

        <p className="mt-6 font-sans text-[13px] text-ink3">
          Vous n&apos;avez pas encore l&apos;application ?{" "}
          <a href={APP_STORE} className="text-ink underline">
            Télécharger sur l&apos;App Store
          </a>
        </p>
      </article>
    </main>
  );
}
