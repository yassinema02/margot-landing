import type { Metadata } from "next";
import Link from "next/link";
import {
  BackLink,
  COMPANY,
  Hr,
  LegalMain,
  P,
  Section,
  Strong,
} from "@/components/legal";

export const metadata: Metadata = {
  title: "Mentions légales · Margot",
  description:
    "Mentions légales du site margotwardrobe.com — éditeur, directeur de la publication, hébergement, propriété intellectuelle et droit applicable.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "8 août 2026";

export default function MentionsLegalesPage() {
  return (
    <LegalMain>
      <BackLink href="/fr" label="← Retour à Margot" />

      <header className="mt-8 mb-12">
        <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight2">
          Mentions <em>légales</em>
        </h1>
        <p className="mt-3 font-sans text-[13px] text-ink3 tracking-tight7">
          Dernière mise à jour : {LAST_UPDATED}
        </p>
      </header>

      <Section>
        <P>
          Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
          l&apos;économie numérique (LCEN), les présentes mentions identifient l&apos;éditeur et
          l&apos;hébergeur du site <Strong>margotwardrobe.com</Strong> et de l&apos;application
          mobile <Strong>Margot</Strong>.
        </P>
      </Section>

      <Hr />

      <Section title="Éditeur du site">
        <P>
          Le site et l&apos;application Margot sont édités par <Strong>{COMPANY.name}</Strong>,{" "}
          {COMPANY.form.fr} au capital de {COMPANY.capital.fr}, immatriculée au{" "}
          {COMPANY.rcs.fr} (SIRET : {COMPANY.siret}).
        </P>
        <P>
          <Strong>Siège social :</Strong> {COMPANY.address}
          <br />
          <Strong>Email :</Strong>{" "}
          <a href={`mailto:${COMPANY.contactEmail}`} className="underline hover:text-peach">
            {COMPANY.contactEmail}
          </a>
        </P>
      </Section>

      <Section title="Directeur de la publication">
        <P>{COMPANY.publicationDirector}.</P>
      </Section>

      <Section title="Hébergement">
        <P>
          Le site margotwardrobe.com est hébergé par <Strong>Vercel Inc.</Strong>, 440 N
          Barranca Avenue #4133, Covina, CA 91723, États-Unis (
          <a
            href="https://vercel.com"
            className="underline hover:text-peach"
            target="_blank"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
          ).
        </P>
        <P>
          Les données de l&apos;application Margot (comptes, garde-robes) sont hébergées par{" "}
          <Strong>Supabase Inc.</Strong> sur une infrastructure Amazon Web Services située à
          Londres, Royaume-Uni.
        </P>
      </Section>

      <Hr />

      <Section title="Propriété intellectuelle">
        <P>
          L&apos;ensemble des éléments composant le site et l&apos;application Margot — textes,
          illustrations, logos, la pie Margot, marques, interfaces et logiciels — est la
          propriété exclusive de {COMPANY.name} ou fait l&apos;objet d&apos;une autorisation
          d&apos;utilisation. Toute reproduction, représentation ou adaptation, totale ou
          partielle, sans autorisation écrite préalable est interdite et constitue une
          contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété
          intellectuelle.
        </P>
        <P>
          Les photos de vêtements que vous ajoutez dans l&apos;application restent votre
          propriété — voir nos{" "}
          <Link href="/terms" className="underline hover:text-peach">
            conditions d&apos;utilisation
          </Link>
          .
        </P>
      </Section>

      <Section title="Données personnelles">
        <P>
          Le traitement de vos données personnelles est décrit dans notre{" "}
          <Link href="/fr/confidentialite" className="underline hover:text-peach">
            politique de confidentialité
          </Link>{" "}
          (
          <Link href="/privacy" className="underline hover:text-peach">
            English version
          </Link>
          ). Pour exercer vos droits (accès, rectification, effacement, opposition,
          portabilité), écrivez à{" "}
          <a href={`mailto:${COMPANY.contactEmail}`} className="underline hover:text-peach">
            {COMPANY.contactEmail}
          </a>
          . Vous pouvez également introduire une réclamation auprès de la CNIL (
          <a
            href="https://www.cnil.fr"
            className="underline hover:text-peach"
            target="_blank"
            rel="noopener noreferrer"
          >
            cnil.fr
          </a>
          ).
        </P>
      </Section>

      <Section title="Cookies">
        <P>
          Le site utilise des cookies de mesure d&apos;audience et de publicité (Google
          Analytics, Meta Pixel), déposés uniquement après votre consentement via le bandeau
          prévu à cet effet. Vous pouvez retirer votre consentement à tout moment via le lien
          « Gérer les cookies » en pied de page. Le détail des cookies figure dans la{" "}
          <Link href="/fr/confidentialite" className="underline hover:text-peach">
            politique de confidentialité
          </Link>
          .
        </P>
      </Section>

      <Section title="Limitation de responsabilité">
        <P>
          {COMPANY.name} s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des
          informations diffusées sur ce site, mais ne peut garantir l&apos;absence
          d&apos;erreurs ou d&apos;omissions, ni la disponibilité permanente du site. Les
          suggestions générées par l&apos;application (tenues, verdicts d&apos;achat) sont des
          recommandations logicielles et non des conseils professionnels.
        </P>
      </Section>

      <Section title="Droit applicable">
        <P>
          Le présent site et les présentes mentions légales sont soumis au droit français. En
          cas de litige, et à défaut de résolution amiable, les tribunaux de Paris seront
          compétents, sous réserve des dispositions impératives protectrices du consommateur.
        </P>
      </Section>
    </LegalMain>
  );
}
