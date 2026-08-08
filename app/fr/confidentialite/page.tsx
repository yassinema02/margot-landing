import type { Metadata } from "next";
import Link from "next/link";
import {
  BackLink,
  Hr,
  LegalMain,
  Li,
  P,
  Section,
  Strong,
  Sub,
  Th,
  Tr,
  Ul,
} from "@/components/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité · Margot",
  description:
    "Comment Margot collecte, utilise et protège vos données personnelles — données conservées, usage par les fonctionnalités de style, ce qui n'est jamais vendu, et comment demander la suppression.",
  alternates: { canonical: "/fr/confidentialite" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "8 août 2026";

export default function ConfidentialitePage() {
  return (
    <LegalMain>
      <BackLink href="/fr" label="← Retour à Margot" />

      <header className="mt-8 mb-12">
        <h1 className="font-display font-normal text-ink opsz-144 m-0 text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight2">
          Politique de <em>confidentialité</em>
        </h1>
        <p className="mt-3 font-sans text-[13px] text-ink3 tracking-tight7">
          Dernière mise à jour : {LAST_UPDATED}
        </p>
      </header>

      <Section>
        <P>
          La présente politique de confidentialité décrit comment <Strong>Margot</Strong>{" "}
          (« nous »), édité par YAVREN, collecte, utilise et protège vos données
          personnelles lorsque vous utilisez l&apos;application mobile Margot
          (l&apos;« Application »).
        </P>
        <P>
          En utilisant Margot, vous acceptez les pratiques décrites dans cette politique. Si
          vous n&apos;êtes pas d&apos;accord, merci de ne pas utiliser l&apos;Application.
        </P>
      </Section>

      <Hr />

      <Section title="1. Qui sommes-nous">
        <P>
          Margot est une application mobile qui vous aide à numériser votre garde-robe, à
          recevoir des suggestions de tenues et à décider si un nouveau vêtement s&apos;accorde
          avec votre dressing existant.
        </P>
        <P>
          Le responsable de traitement est <Strong>YAVREN</Strong>, société par actions
          simplifiée (SAS) au capital de 5 000 €, immatriculée au RCS Paris sous le
          n° 108 367 863, dont le siège social est situé 78 avenue des Champs-Élysées,
          Bureau 326, 75008 Paris, France (voir aussi nos{" "}
          <Link href="/mentions-legales" className="underline hover:text-peach">
            mentions légales
          </Link>
          ). YAVREN n&apos;a pas désigné de délégué à la protection des données (DPO) ; les
          demandes relatives à la vie privée sont traitées directement à l&apos;adresse
          ci-dessous.
        </P>
        <P>
          <Strong>Email de contact :</Strong>{" "}
          <a href="mailto:margot@margotwardrobe.com" className="underline hover:text-peach">
            margot@margotwardrobe.com
          </a>
        </P>
      </Section>

      <Section title="2. Données que nous collectons">
        <P>
          Nous collectons uniquement les données nécessaires au fonctionnement de
          l&apos;Application.
        </P>

        <Sub title="2.1 Données que vous nous fournissez directement">
          <Ul>
            <Li>
              <Strong>Informations de compte</Strong> (facultatives) : adresse email, nom,
              photo de profil si vous vous connectez avec Apple ou Google.
            </Li>
            <Li>
              <Strong>Données de garde-robe :</Strong> photos de vêtements que vous ajoutez,
              métadonnées des articles (catégorie, couleur, marque, étiquettes, notes).
            </Li>
            <Li>
              <Strong>Données de shopping et de scan :</Strong> liens produits, captures
              d&apos;écran, photos d&apos;articles et notes associées que vous soumettez pour
              une vérification d&apos;achat ou un import de garde-robe.
            </Li>
            <Li>
              <Strong>Journal des tenues portées :</Strong> quels articles vous avez portés à
              quelles dates.
            </Li>
            <Li>
              <Strong>Notes et retours sur les tenues :</Strong> signaux « j&apos;adore » /
              « enregistrer » / « ignorer » sur les suggestions de tenues générées par IA.
            </Li>
            <Li>
              <Strong>Reçus d&apos;abonnement :</Strong> informations sur les achats premium,
              validés via Apple StoreKit et RevenueCat.
            </Li>
          </Ul>
        </Sub>

        <Sub title="2.2 Données collectées avec votre autorisation explicite">
          <Ul>
            <Li>
              <Strong>Accès à l&apos;appareil photo et à la photothèque</Strong> (iOS) :
              utilisé uniquement pour prendre ou importer des photos de vêtements dans votre
              garde-robe.
            </Li>
            <Li>
              <Strong>Accès au calendrier</Strong> (iOS, facultatif) : utilisé pour lire les
              titres et horaires de vos événements afin que Margot puisse suggérer des tenues
              adaptées à votre journée. Les données de calendrier peuvent être synchronisées
              avec votre compte pour que les tenues d&apos;événements et les rappels
              fonctionnent d&apos;une session à l&apos;autre.
            </Li>
            <Li>
              <Strong>Accès à la localisation</Strong> (iOS, facultatif) : utilisé pour
              récupérer la météo locale afin que les suggestions de tenues correspondent à la
              température du jour. La localisation est traitée en mémoire et n&apos;est pas
              conservée.
            </Li>
          </Ul>
        </Sub>

        <Sub title="2.3 Données collectées automatiquement">
          <Ul>
            <Li>
              <Strong>Statistiques d&apos;utilisation :</Strong> événements anonymisés (écrans
              consultés, interactions avec les fonctionnalités, durée des sessions) pour
              améliorer l&apos;Application. Vous pouvez vous y opposer à tout moment dans
              l&apos;Application, sous <em>Réglages → Confidentialité &amp; données</em>.
            </Li>
            <Li>
              <Strong>Rapports de plantage :</Strong> informations techniques de diagnostic
              envoyées automatiquement lorsque l&apos;Application plante.
            </Li>
            <Li>
              <Strong>Informations sur l&apos;appareil :</Strong> modèle, version du système
              d&apos;exploitation, langue, fuseau horaire.
            </Li>
          </Ul>
        </Sub>

        <P>
          Nous ne collectons <Strong>pas</Strong> : les identifiants publicitaires précis
          (IDFA), votre historique de navigation en dehors de l&apos;Application, vos
          contacts, l&apos;audio du microphone, vos données de santé ou vos coordonnées
          bancaires.
        </P>
      </Section>

      <Section title="3. Comment nous utilisons vos données">
        <P>Nous utilisons vos données exclusivement pour :</P>
        <Ul>
          <Li>
            Faire fonctionner les fonctionnalités principales de l&apos;Application
            (garde-robe numérique, suggestions de tenues, « vérifier avant d&apos;acheter »,
            génération d&apos;annonces Vinted).
          </Li>
          <Li>
            Personnaliser les recommandations de tenues en fonction de votre historique de
            port, de vos préférences de style et du contexte calendrier/météo.
          </Li>
          <Li>
            Traiter et valider les paiements d&apos;abonnement via le système d&apos;achats
            intégrés d&apos;Apple et RevenueCat.
          </Li>
          <Li>
            Diagnostiquer les problèmes techniques, surveiller la stabilité de
            l&apos;Application et améliorer ses fonctionnalités.
          </Li>
          <Li>Communiquer avec vous au sujet de votre compte ou de votre abonnement.</Li>
        </Ul>
        <P>
          Nous ne vendons <Strong>pas</Strong> vos données d&apos;application, ne partageons
          pas le contenu de votre garde-robe avec des courtiers en données et
          n&apos;utilisons pas vos données de garde-robe à des fins publicitaires.
        </P>

        <Sub title="Bases légales (art. 6 du RGPD)">
          <Ul>
            <Li>
              <Strong>Exécution du contrat :</Strong> stockage de la garde-robe, suggestions
              de tenues, vérifications d&apos;achat, gestion de l&apos;abonnement — tout ce
              qui est nécessaire pour vous fournir l&apos;Application à laquelle vous vous
              êtes inscrit·e.
            </Li>
            <Li>
              <Strong>Consentement :</Strong> accès au calendrier, à la localisation, à
              l&apos;appareil photo et à la photothèque (via les autorisations iOS,
              révocables à tout moment dans les réglages iOS), ainsi que toute communication
              marketing. Le retrait du consentement n&apos;affecte pas la licéité des
              traitements antérieurs.
            </Li>
            <Li>
              <Strong>Intérêt légitime :</Strong> statistiques d&apos;utilisation dans
              l&apos;Application (opposition possible sous{" "}
              <em>Réglages → Confidentialité &amp; données</em>), diagnostics de plantage et
              prévention des abus.
            </Li>
            <Li>
              <Strong>Obligation légale :</Strong> conservation des reçus d&apos;abonnement
              et documents de facturation à des fins fiscales et comptables.
            </Li>
          </Ul>
        </Sub>
      </Section>

      <Section title="4. Stylisme automatisé et traitement d'images">
        <P>
          Margot utilise Google Gemini, via un proxy côté serveur, pour générer des
          suggestions de tenues, analyser des vêtements, produire des verdicts d&apos;achat
          et préparer du contenu de garde-robe ou de revente. Selon la fonctionnalité
          utilisée, les informations suivantes peuvent être envoyées pour traitement :
        </P>
        <Ul>
          <Li>
            Les descriptions de vos articles : catégories, couleurs, matières, saisons et
            étiquettes de style.
          </Li>
          <Li>
            Les photos ou captures d&apos;écran que vous soumettez explicitement pour un
            import de garde-robe, une analyse d&apos;article, la génération de photos
            produit ou une vérification d&apos;achat.
          </Li>
          <Li>
            Le contexte du jour, comme la météo et les titres ou horaires des événements de
            calendrier pertinents.
          </Li>
          <Li>Vos préférences de style déclarées et vos réglages de l&apos;Application.</Li>
        </Ul>
        <P>
          Nous n&apos;envoyons <Strong>pas</Strong> votre nom, votre adresse email, vos
          informations de paiement ni l&apos;identifiant direct de votre compte aux
          fournisseurs de modèles. Les requêtes transitent par notre serveur afin que les
          clés d&apos;API restent privées et que l&apos;usage puisse être limité.
        </P>
      </Section>

      <Section title="5. Tiers avec qui nous partageons des données">
        <P>
          Nous faisons appel à un petit nombre de prestataires de confiance pour faire
          fonctionner l&apos;Application.
        </P>
        <div className="overflow-x-auto my-6">
          <table className="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-warm2">
                <Th>Prestataire</Th>
                <Th>Finalité</Th>
                <Th>Données partagées</Th>
              </tr>
            </thead>
            <tbody>
              <Tr cells={["Supabase", "Stockage des garde-robes, comptes et journaux de port", "Toutes les données de garde-robe et de compte"]} />
              <Tr cells={["Google Gemini", "Suggestions de tenues, analyse de vêtements, verdicts d'achat et traitement d'images", "Résumés de garde-robe, photos/captures soumises, contexte de style"]} />
              <Tr cells={["RevenueCat", "Validation et gestion des abonnements premium", "Reçu d'abonnement + identifiant utilisateur anonyme"]} />
              <Tr cells={["Apple", "Traitement des paiements, distribution de l'application", "Selon la politique de confidentialité d'Apple"]} />
              <Tr cells={["OpenWeatherMap", "Météo locale pour le contexte des tenues", "Localisation approximative uniquement"]} />
              <Tr cells={["remove.bg / rembg", "Détourage des photos (suppression de l'arrière-plan)", "Photos d'articles (traitées en temps réel, non conservées)"]} />
            </tbody>
          </table>
        </div>
        <P>
          Nous ne partageons pas vos données de garde-robe ou de compte avec des régies
          publicitaires, des courtiers en données ou des services marketing tiers.
        </P>
      </Section>

      <Section title="6. Durée de conservation de vos données">
        <Ul>
          <Li>
            <Strong>Données de garde-robe, journaux de port, données de compte :</Strong>{" "}
            conservées tant que votre compte existe. Les données du compte actif sont
            supprimées lorsque vous supprimez votre compte ; les sauvegardes et journaux
            techniques peuvent mettre jusqu&apos;à 30 jours à expirer.
          </Li>
          <Li>
            <Strong>Rapports de plantage et statistiques :</Strong> conservés 90 jours, puis
            agrégés/anonymisés ou supprimés.
          </Li>
          <Li>
            <Strong>Reçus d&apos;abonnement :</Strong> conservés conformément aux exigences
            liées aux achats intégrés d&apos;Apple (en général 7 ans à des fins fiscales et
            légales).
          </Li>
          <Li>
            <Strong>Fichiers d&apos;import temporaires</Strong> (photos temporaires utilisées
            lors de l&apos;import de garde-robe ou de l&apos;inscription) : purgés
            automatiquement après 7 jours.
          </Li>
        </Ul>
        <P>
          Vous pouvez supprimer votre compte à tout moment depuis les réglages de
          l&apos;Application. Cela supprime immédiatement votre compte actif et vos données
          de garde-robe, sous réserve des délais de sauvegarde, de journalisation et de
          conservation légale décrits ci-dessus.
        </P>
      </Section>

      <Section title="7. Vos droits (RGPD et équivalents)">
        <P>
          Si vous résidez dans l&apos;Union européenne, au Royaume-Uni ou dans un autre pays
          disposant de lois similaires sur la protection des données, vous avez le droit :
        </P>
        <Ul>
          <Li>
            d&apos;<Strong>accéder</Strong> aux données personnelles que nous détenons à
            votre sujet ;
          </Li>
          <Li>
            de <Strong>rectifier</Strong> des données inexactes ;
          </Li>
          <Li>
            de <Strong>supprimer</Strong> vos données (droit à l&apos;effacement) ;
          </Li>
          <Li>
            d&apos;<Strong>exporter</Strong> vos données dans un format portable ;
          </Li>
          <Li>
            de vous <Strong>opposer</Strong> à certains traitements ou d&apos;en demander la
            limitation ;
          </Li>
          <Li>
            de <Strong>retirer votre consentement</Strong> aux autorisations facultatives à
            tout moment via les réglages iOS ;
          </Li>
          <Li>
            d&apos;<Strong>introduire une réclamation</Strong> auprès de votre autorité de
            protection des données (en France : la CNIL,{" "}
            <a
              href="https://www.cnil.fr"
              className="underline hover:text-peach"
              target="_blank"
              rel="noopener noreferrer"
            >
              cnil.fr
            </a>
            ).
          </Li>
        </Ul>
        <P>
          Pour exercer l&apos;un de ces droits, écrivez à{" "}
          <a href="mailto:margot@margotwardrobe.com" className="underline hover:text-peach">
            margot@margotwardrobe.com
          </a>
          . Nous vous répondrons sous 30 jours.
        </P>
      </Section>

      <Section title="8. Sécurité">
        <Ul>
          <Li>Toutes les données sont chiffrées en transit (TLS 1.2+).</Li>
          <Li>Les données au repos chez Supabase sont chiffrées (AES-256).</Li>
          <Li>
            L&apos;accès aux systèmes de production est réservé aux personnes autorisées.
          </Li>
          <Li>
            L&apos;authentification repose sur Apple Sign In / Google Sign In (OAuth) ; nous
            ne stockons aucun mot de passe.
          </Li>
        </Ul>
        <P>
          Si nous avons connaissance d&apos;une violation de données affectant vos
          informations personnelles, nous notifierons l&apos;autorité de contrôle compétente
          (en France, la CNIL) dans les 72 heures lorsque l&apos;article 33 du RGPD
          l&apos;exige, et nous vous en informerons sans délai injustifié dès lors que la
          violation est susceptible d&apos;engendrer un risque élevé pour vos droits
          (article 34 du RGPD).
        </P>
      </Section>

      <Section title="9. Protection des mineurs">
        <P>
          Margot ne s&apos;adresse pas aux enfants de moins de 13 ans. Nous ne collectons pas
          sciemment de données personnelles d&apos;enfants de moins de 13 ans. Si vous pensez
          que nous avons collecté des données d&apos;un enfant de moins de 13 ans, écrivez à{" "}
          <a href="mailto:margot@margotwardrobe.com" className="underline hover:text-peach">
            margot@margotwardrobe.com
          </a>{" "}
          et nous les supprimerons rapidement.
        </P>
        <P>
          En France, les utilisateurs de moins de 15 ans doivent obtenir le consentement
          d&apos;un parent ou d&apos;un tuteur (article 45 de la loi Informatique et
          Libertés). Ailleurs dans l&apos;Espace économique européen et au Royaume-Uni,
          l&apos;âge du consentement numérique applicable (de 13 à 16 ans selon le pays)
          s&apos;applique.
        </P>
      </Section>

      <Section title="10. Transferts internationaux de données">
        <P>
          Vos données de garde-robe et de compte sont hébergées par Supabase sur une
          infrastructure située à Londres, au Royaume-Uni. Le Royaume-Uni bénéficie
          d&apos;une décision d&apos;adéquation de la Commission européenne ; ce transfert
          ne nécessite donc aucune garantie supplémentaire.
        </P>
        <P>
          Certains de nos prestataires sont situés en dehors de l&apos;Espace économique
          européen, notamment Google, RevenueCat et d&apos;autres fournisseurs
          d&apos;infrastructure aux États-Unis. Lorsque des données sont transférées à
          l&apos;international, nous nous appuyons sur les Clauses Contractuelles Types
          adoptées par la Commission européenne afin de garantir à vos données un niveau de
          protection équivalent.
        </P>
      </Section>

      <Section title="11. Site web, cookies et mesure d'audience">
        <P>
          Cette section concerne le site margotwardrobe.com (hébergé par Vercel Inc.,
          États-Unis). Lors de votre première visite, un bandeau de consentement vous permet
          d&apos;accepter ou de refuser les cookies — les deux choix sont aussi simples
          l&apos;un que l&apos;autre, et refuser ne laisse que des statistiques anonymes,
          sans cookie. Aucun cookie publicitaire ou de mesure d&apos;audience n&apos;est
          déposé avant votre consentement.
        </P>
        <div className="overflow-x-auto my-6">
          <table className="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-warm2">
                <Th>Service</Th>
                <Th>Finalité</Th>
                <Th>Base · durée</Th>
              </tr>
            </thead>
            <tbody>
              <Tr cells={["Google Analytics 4", "Mesure d'audience (visites, pages, sources)", "Consentement · 13 mois maximum"]} />
              <Tr cells={["Meta Pixel", "Mesure publicitaire et attribution des campagnes", "Consentement · 13 mois maximum"]} />
              <Tr cells={["PostHog (UE)", "Statistiques produit sans cookie (agrégées)", "Intérêt légitime · aucun cookie sans consentement"]} />
              <Tr cells={["Stockage du choix", "Mémorisation de votre choix de cookies (stockage local)", "Stockage technique exempté · 6 mois"]} />
            </tbody>
          </table>
        </div>
        <P>
          Vous pouvez retirer ou modifier votre choix à tout moment via le lien{" "}
          <Strong>« Gérer les cookies »</Strong> en pied de page, qui rouvre le bandeau de
          consentement. Retirer son consentement est aussi simple que le donner,
          conformément aux recommandations de la CNIL.
        </P>
      </Section>

      <Section title="12. Modifications de cette politique">
        <P>
          Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. En
          cas de modification importante, nous vous en informerons dans l&apos;Application et
          mettrons à jour la date de « dernière mise à jour » en haut de cette page.
        </P>
      </Section>

      <Section title="13. Contact">
        <P>
          Pour toute question sur cette politique de confidentialité ou sur la manière dont
          nous traitons vos données, contactez :
        </P>
        <P>
          <Strong>YAVREN</Strong> (SAS) — 78 avenue des Champs-Élysées, Bureau 326, 75008
          Paris, France
          <br />
          Email :{" "}
          <a href="mailto:margot@margotwardrobe.com" className="underline hover:text-peach">
            margot@margotwardrobe.com
          </a>
        </P>
        <P className="text-ink3 text-[13px] italic">
          Pour les demandes relatives à vos données, merci d&apos;indiquer « Demande
          RGPD » dans l&apos;objet de votre email.
        </P>
      </Section>
    </LegalMain>
  );
}
