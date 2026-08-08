import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalMain,
  BackLink,
  Section,
  Sub,
  P,
  Ul,
  Li,
  Strong,
  Hr,
} from "@/components/legal";

export const metadata: Metadata = {
  title: "Conditions d'utilisation · Margot",
  description:
    "Conditions régissant votre utilisation de Margot — compte, abonnement et facturation, utilisation acceptable, propriété des contenus et limitation de responsabilité.",
  alternates: { canonical: "/fr/conditions" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "8 août 2026";

export default function ConditionsPage() {
  return (
    <LegalMain>
      <BackLink href="/fr" label="← Retour à Margot" />

      <header className="mt-8 mb-12">
        <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight2">
          Conditions <em>d&apos;utilisation</em>
        </h1>
        <p className="mt-3 font-sans text-[13px] text-ink3 tracking-tight7">
          Dernière mise à jour : {LAST_UPDATED}
        </p>
      </header>

      <Section>
        <P>
          Les présentes Conditions d&apos;utilisation (« CGU ») régissent votre utilisation de{" "}
          <Strong>Margot</Strong>, une application mobile éditée par YAVREN (« nous »). En créant
          un compte, en téléchargeant ou en utilisant Margot (l&apos;« Application »), vous
          acceptez d&apos;être lié par ces CGU. Si vous ne les acceptez pas, n&apos;utilisez pas
          l&apos;Application.
        </P>
        <P>
          Ces CGU s&apos;appliquent conjointement avec notre{" "}
          <Link href="/fr/confidentialite" className="underline hover:text-peach">
            Politique de confidentialité
          </Link>
          , qui explique comment nous traitons vos données personnelles. La Politique de
          confidentialité est incorporée aux présentes CGU par référence.
        </P>
      </Section>

      <Hr />

      <Section title="1. Le service">
        <P>
          Margot vous aide à numériser votre garde-robe, planifier vos tenues et décider si un
          nouveau vêtement s&apos;intègre à votre dressing existant. Nous pouvons ajouter, retirer
          ou modifier des fonctionnalités à tout moment et sans préavis.
        </P>
        <P>
          Les recommandations de tenues, scores de durabilité, estimations de coût par port et
          règles de style de Margot sont générés par des logiciels, y compris des fournisseurs de
          modèles tiers.{" "}
          <Strong>
            Toutes les recommandations sont des suggestions, pas des conseils professionnels.
          </Strong>{" "}
          Vous restez seul responsable de vos décisions d&apos;achat, de style et de revente.
        </P>
      </Section>

      <Section title="2. Éligibilité et compte">
        <P>
          Vous devez avoir au moins 13 ans pour utiliser Margot. Si vous avez moins de 18 ans,
          vous ne pouvez utiliser l&apos;Application qu&apos;avec l&apos;accord et sous la
          supervision d&apos;un parent ou tuteur légal.
        </P>
        <P>
          Vous êtes responsable de l&apos;exactitude des informations que vous fournissez et de la
          confidentialité de vos identifiants. Vous vous engagez à nous signaler rapidement tout
          accès non autorisé à{" "}
          <a href="mailto:margot@margotwardrobe.com" className="underline hover:text-peach">
            margot@margotwardrobe.com
          </a>
          .
        </P>
        <P>
          Vous pouvez vous connecter par email, Google ou Apple. Vous pouvez fermer votre compte à
          tout moment depuis <em>Réglages → Confidentialité → Supprimer le compte</em>. La
          suppression est définitive et irréversible — voir la section 8 ci-dessous.
        </P>
      </Section>

      <Hr />

      <Section title="3. Abonnements et facturation">
        <Sub title="3.1 Margot Premium">
          <P>
            Margot propose un abonnement payant, <Strong>Margot Premium</Strong>. Les formules
            disponibles, leurs prix et leurs périodes de facturation sont affichés dans
            l&apos;Application avant toute confirmation d&apos;achat, dans votre devise locale
            telle que présentée par Apple. Margot Premium est compatible avec le{" "}
            <em>Partage familial Apple</em>.
          </P>
        </Sub>

        <Sub title="3.2 Facturation gérée par Apple">
          <P>
            Tous les abonnements sont vendus et gérés via l&apos;App Store d&apos;Apple. Le
            paiement est débité sur votre compte Apple au début de chaque période de facturation.
            Les{" "}
            <a
              href="https://www.apple.com/legal/internet-services/itunes/"
              className="underline hover:text-peach"
              target="_blank"
              rel="noopener noreferrer"
            >
              Conditions des services multimédias
            </a>{" "}
            d&apos;Apple s&apos;appliquent également à votre abonnement.
          </P>
        </Sub>

        <Sub title="3.3 Renouvellement automatique">
          <P>
            Votre abonnement se renouvelle automatiquement à la fin de chaque période de
            facturation, sauf annulation au moins 24 heures avant la fin de la période en cours.
            Le renouvellement est facturé au tarif alors en vigueur (généralement le même prix,
            mais Apple peut facturer un montant différent en cas d&apos;évolution des taxes
            locales).
          </P>
          <P>
            Vous pouvez annuler à tout moment dans les réglages de votre identifiant Apple :{" "}
            <em>Réglages → [votre nom] → Abonnements → Margot Premium</em>. Nous n&apos;avons pas
            accès à vos informations de paiement et ne pouvons pas annuler l&apos;abonnement à
            votre place.
          </P>
        </Sub>

        <Sub title="3.4 Remboursements">
          <P>
            Les remboursements sont traités exclusivement par Apple selon sa{" "}
            <a
              href="https://reportaproblem.apple.com"
              className="underline hover:text-peach"
              target="_blank"
              rel="noopener noreferrer"
            >
              politique de remboursement
            </a>
            . Nous n&apos;avons pas accès à vos informations de paiement et ne pouvons pas émettre
            de remboursement directement.
          </P>
        </Sub>

        <Sub title="3.5 Contenu de l'abonnement">
          <P>
            Nous pouvons à tout moment faire évoluer la répartition des fonctionnalités entre
            l&apos;offre gratuite et Margot Premium. Les fonctionnalités disponibles au moment de
            votre achat et déplacées ensuite vers Premium restent accessibles jusqu&apos;à la fin
            de votre période de facturation en cours.
          </P>
        </Sub>
      </Section>

      <Hr />

      <Section title="4. Vos contenus">
        <P>
          Vous restez propriétaire des photos, descriptions et autres contenus que vous ajoutez à
          Margot (collectivement, « vos Contenus »). En utilisant l&apos;Application, vous nous
          accordez une licence limitée, mondiale et gratuite pour héberger, traiter et afficher
          vos Contenus dans le seul but de faire fonctionner et d&apos;améliorer l&apos;Application
          pour vous. Cette licence prend fin lorsque vous supprimez le contenu ou votre compte.
        </P>
        <P>
          Vous êtes responsable de disposer des droits nécessaires sur les contenus que vous
          téléversez. Ne téléversez pas d&apos;images dont vous n&apos;êtes pas propriétaire ou
          que vous n&apos;êtes pas autorisé à partager.
        </P>
      </Section>

      <Section title="5. Utilisation acceptable">
        <P>Vous vous engagez à ne pas utiliser Margot pour :</P>
        <Ul>
          <Li>
            téléverser des contenus illégaux, contrefaisants, diffamatoires ou haineux ;
          </Li>
          <Li>
            tenter de rétro-concevoir, décompiler, extraire massivement (scraper) ou perturber le
            fonctionnement normal de l&apos;Application ;
          </Li>
          <Li>
            contourner les limites d&apos;usage, abuser des fonctionnalités d&apos;IA ou tenter
            d&apos;épuiser nos ressources ;
          </Li>
          <Li>
            usurper l&apos;identité d&apos;autrui, partager le contenu d&apos;un autre utilisateur
            sans son accord ou harceler d&apos;autres utilisateurs ;
          </Li>
          <Li>
            sonder, scanner ou tester la vulnérabilité de l&apos;Application ou de son
            infrastructure sans autorisation écrite.
          </Li>
        </Ul>
        <P>
          Nous pouvons suspendre ou résilier les comptes qui enfreignent ces règles, sans préavis
          dans les cas graves.
        </P>
      </Section>

      <Hr />

      <Section title="6. Contenus générés par IA">
        <P>
          Margot utilise l&apos;IA générative pour suggérer des tenues, évaluer des achats et
          produire des analyses de garde-robe. Les résultats de l&apos;IA sont des estimations
          statistiques : ils peuvent être inexacts, biaisés ou en décalage avec vos goûts. Nous
          n&apos;apportons aucune garantie quant à l&apos;exactitude, la pertinence ou
          l&apos;exhaustivité des contenus générés par IA.
        </P>
        <P>
          Traitez ces résultats comme des points de départ, pas des réponses définitives — en
          particulier pour les décisions d&apos;achat, les prix de revente ou les affirmations de
          durabilité.
        </P>
      </Section>

      <Section title="7. Services tiers">
        <P>
          Margot s&apos;appuie sur des prestataires tiers pour fonctionner (par exemple
          hébergement cloud, authentification, modèles d&apos;IA, paiement, données météo). Votre
          utilisation de l&apos;Application est également soumise aux conditions de ces
          prestataires lorsque leur service est sollicité. Nous ne sommes pas responsables du
          contenu, de l&apos;exactitude ou de la disponibilité des services tiers.
        </P>
      </Section>

      <Hr />

      <Section title="8. Suppression du compte et conservation des données">
        <P>
          Vous pouvez supprimer définitivement votre compte Margot depuis{" "}
          <em>Réglages → Confidentialité → Supprimer le compte</em>. La suppression retire
          immédiatement votre profil, vos vêtements, tenues, données de calendrier, publications
          OOTD, scans et photos associées. Cette action est{" "}
          <Strong>irréversible</Strong>.
        </P>
        <P>
          Nous pouvons conserver des statistiques d&apos;usage anonymisées et agrégées qui ne
          permettent plus de vous identifier (par exemple des journaux de requêtes IA dont
          l&apos;identifiant utilisateur a été retiré), à des fins d&apos;amélioration du service
          et de lutte contre les abus.
        </P>
      </Section>

      <Section title="9. Exclusions de garantie">
        <P>
          <Strong>
            L&apos;Application est fournie « en l&apos;état » et « selon disponibilité ».
          </Strong>{" "}
          Dans la mesure maximale permise par la loi, nous excluons toute garantie, expresse ou
          implicite, y compris les garanties de qualité marchande, d&apos;adéquation à un usage
          particulier, d&apos;exactitude et de non-contrefaçon.
        </P>
        <P>
          Nous ne garantissons pas que l&apos;Application sera ininterrompue, exempte
          d&apos;erreurs ou sécurisée contre tout accès non autorisé, ni que les défauts seront
          corrigés. Vous utilisez l&apos;Application à vos propres risques.
        </P>
      </Section>

      <Section title="10. Limitation de responsabilité">
        <P>
          Dans la mesure maximale permise par la loi, nous ne serons pas responsables des
          dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, ni de toute perte
          de profits, de revenus, de données, de clientèle ou d&apos;activité résultant de votre
          utilisation (ou impossibilité d&apos;utilisation) de l&apos;Application.
        </P>
        <P>
          Lorsque la responsabilité ne peut être exclue par la loi, notre responsabilité totale
          cumulée pour toute réclamation liée à l&apos;Application est limitée au plus élevé des
          deux montants suivants : (a) les sommes que vous nous avez payées pour l&apos;Application
          au cours des douze mois précédant le fait générateur de la réclamation, ou (b) 20 €.
          Rien dans ces CGU n&apos;exclut ou ne limite la responsabilité qui ne peut être exclue
          en droit français, notamment en cas de faute lourde, de dol, de décès ou de dommage
          corporel.
        </P>
      </Section>

      <Hr />

      <Section title="11. Résiliation">
        <P>
          Nous pouvons suspendre ou résilier votre accès à l&apos;Application à tout moment en
          cas de violation des présentes CGU, ou pour tout motif à notre discrétion raisonnable.
          Les stipulations qui, par nature, doivent survivre à la résiliation (par exemple la
          licence sur les contenus, les exclusions de garantie, la limitation de responsabilité)
          continuent de s&apos;appliquer.
        </P>
      </Section>

      <Section title="12. Modification des CGU">
        <P>
          Nous pouvons mettre à jour ces CGU. Les modifications substantielles seront annoncées
          dans l&apos;Application ou par email. La poursuite de l&apos;utilisation après
          l&apos;entrée en vigueur d&apos;une modification vaut acceptation des CGU révisées. En
          cas de désaccord, cessez d&apos;utiliser l&apos;Application ; vous pouvez supprimer
          votre compte.
        </P>
      </Section>

      <Section title="13. Droit applicable">
        <P>
          Les présentes CGU sont régies par le droit français, sans égard à ses règles de conflit
          de lois. Tout litige relatif aux présentes sera porté devant les tribunaux compétents
          de Paris, France, sauf si des dispositions impératives de protection des consommateurs
          vous donnent le droit d&apos;agir dans votre pays de résidence.
        </P>
        <P>
          Conformément aux articles L.616-1 et R.616-1 du Code de la consommation, vous pouvez
          recourir gratuitement à un médiateur de la consommation en vue de la résolution
          amiable d&apos;un litige. Vous pouvez également utiliser la plateforme européenne de
          règlement en ligne des litiges :{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            className="underline hover:text-peach"
            target="_blank"
            rel="noopener noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </P>
      </Section>

      <Section title="14. Contact">
        <P>
          Une question sur ces CGU ? Écrivez-nous à{" "}
          <a href="mailto:margot@margotwardrobe.com" className="underline hover:text-peach">
            margot@margotwardrobe.com
          </a>
          .
        </P>
        <P>
          <Strong>YAVREN</Strong>, société par actions simplifiée (SAS) au capital de 5 000 € —
          78 avenue des Champs-Élysées, Bureau 326, 75008 Paris, France — RCS Paris 108 367 863.
        </P>
      </Section>

      <Hr />

      <p className="font-sans text-[12px] text-ink3 tracking-tight7 mt-12">
        En utilisant Margot, vous confirmez avoir lu, compris et accepté les présentes Conditions
        d&apos;utilisation ainsi que notre{" "}
        <Link href="/fr/confidentialite" className="underline hover:text-peach">
          Politique de confidentialité
        </Link>
        .
      </p>
    </LegalMain>
  );
}
