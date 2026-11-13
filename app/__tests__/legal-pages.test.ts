import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";

import TermsPage from "../(en)/terms/page";
import PrivacyPage from "../(en)/privacy/page";
import ConditionsPage from "../(fr)/fr/conditions/page";
import ConfidentialitePage from "../(fr)/fr/confidentialite/page";
import DeleteAccountPage, { metadata as deleteMetadata } from "../(en)/delete-account/page";

// T12: the four legal pages and the external deletion page, rendered locally
// (no Next build). Facts checked against the social code of the app.
function page(render: () => unknown): { html: string; text: string } {
  const html = renderToStaticMarkup(render() as ReactElement);
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  return { html, text };
}

/** Text under the heading (h2 section or h3 subsection) whose text is exactly `title`, up to the next heading or the end of its section. */
function section(html: string, title: string): string {
  const start = html.search(new RegExp(`>${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</h[23]>`));
  if (start < 0) throw new Error(`missing section ${title}`);
  const rest = html.slice(start + 1);
  const ends = [rest.search(/<h[23][ >]/), rest.indexOf("</section>")].filter(index => index >= 0);
  const found = rest.slice(0, Math.min(...ends));
  return found
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

// Case-sensitive for « IA » / "AI" (« Je l'ai aussi » is allowed), case-insensitive for the promises.
const FORBIDDEN_MARKS = /[—–]|\b(IA|AI)\b|!/;
const FORBIDDEN_PROMISES = /visage public|public face|instantly|instantanément|révocation immédiate|immediate revocation/i;

describe("legal pages: social features", () => {
  it("terms explain the social rules, moderation and the 24 hour review", () => {
    const en = section(page(TermsPage).html, "4a. Social features");
    for (const fact of [/15 and over/, /the date and time/, /within 24 hours/, /only the reported content/, /neither your private closet nor your purchases/, /margot@margotwardrobe\.com/, /"I have it too"/]) {
      expect([fact.source, fact.test(en)]).toEqual([fact.source, true]);
    }
    const fr = section(page(ConditionsPage).html, "4 bis. Fonctions sociales");
    for (const fact of [/15 ans et plus/, /la date et l'heure/, /sous 24 heures/, /qu'au contenu signalé/, /ni votre placard privé ni vos achats/, /margot@margotwardrobe\.com/, /« Je l'ai aussi »/]) {
      expect([fact.source, fact.test(fr)]).toEqual([fact.source, true]);
    }
    expect([en.match(FORBIDDEN_MARKS), en.match(FORBIDDEN_PROMISES)]).toEqual([null, null]);
    expect([fr.match(FORBIDDEN_MARKS), fr.match(FORBIDDEN_PROMISES)]).toEqual([null, null]);
  });

  it("privacy policies say who sees what, what a public link shows and its limits", () => {
    const en = section(page(PrivacyPage).html, "2.4 Social features");
    for (const fact of [/private by default/, /initials/, /7 days after the vote ends/, /up to one hour/, /screenshot/, /technical cookie \(8 days\)/, /hashed fingerprint of the IP address/, /erased as soon as the decision is made/]) {
      expect([fact.source, fact.test(en)]).toEqual([fact.source, true]);
    }
    const fr = section(page(ConfidentialitePage).html, "2.4 Fonctions sociales");
    for (const fact of [/privé par défaut/, /initiales/, /7 jours après la fin du vote/, /jusqu'à une heure/, /capture d'écran/, /cookie technique \(8 jours\)/, /empreinte hachée de l'adresse IP/, /effacée dès la décision/]) {
      expect([fact.source, fact.test(fr)]).toEqual([fact.source, true]);
    }
    expect([en.match(FORBIDDEN_MARKS), en.match(FORBIDDEN_PROMISES)]).toEqual([null, null]);
    expect([fr.match(FORBIDDEN_MARKS), fr.match(FORBIDDEN_PROMISES)]).toEqual([null, null]);
  });

  // T12 fix 1: what the code keeps (device fingerprint with each web ballot,
  // IP fingerprint with a report sent from the vote page, account uuid on analytics).
  it("privacy policies describe the fingerprints and analytics the code keeps", () => {
    const enHtml = page(PrivacyPage).html;
    const frHtml = page(ConfidentialitePage).html;
    const en = section(enHtml, "2.4 Social features");
    const fr = section(frHtml, "2.4 Fonctions sociales");
    expect(en).toMatch(/hashed fingerprint of this device identifier, for as long as the vote is kept/);
    expect(en).toMatch(/hashed fingerprint of the IP address for a report sent from the vote page/);
    expect(fr).toMatch(/empreinte hachée de cet identifiant d'appareil, aussi longtemps que le bulletin/);
    expect(fr).toMatch(/empreinte hachée de l'adresse IP pour un signalement envoyé depuis la page de vote/);
    expect(section(enHtml, "6. How long we keep your data")).toMatch(
      /except the one attached to a report sent from the vote page, which is kept for as long as that report/
    );
    expect(section(frHtml, "6. Durée de conservation de vos données")).toMatch(
      /sauf celle jointe à un signalement envoyé depuis la page de vote, conservée aussi longtemps que ce signalement/
    );
    expect(section(enHtml, "2.3 Data collected automatically")).toMatch(/technical identifier of your account/);
    expect(section(frHtml, "2.3 Données collectées automatiquement")).toMatch(/identifiant technique de votre compte/);
    expect(page(PrivacyPage).text).not.toMatch(/anonymised events/);
    expect(page(ConfidentialitePage).text).not.toMatch(/événements anonymisés/);
  });

  // T14 final wave (W-I3, T12-M5, T12-M6, T12-M7). Facts checked in the SQL:
  // initial = upper(left(first_name,1)) (social_vote_links.sql:270); links revoked
  // by vote deletion (social_votes.sql:173), account erasure
  // (social_account_erasure.sql:114) and moderation (social_reports.sql:205-213);
  // a reported ballot shows choice, reason and guest name to the team
  // (social_reports.sql:119-124); the age is declared (social_profiles.sql:21-28).
  it("privacy policies give the exact public link limits, who reads a web ballot and the declared age", () => {
    const en = section(page(PrivacyPage).html, "2.4 Social features");
    for (const fact of [
      /the first name you confirm and its initial, and the photos/,
      /a short reason, visible to the person who created the vote, and to our team if that person reports the reply\./,
      /stays visible until you remove it or it expires, even if you then hide its pieces\. It is also removed when you delete the vote or your account, and when our team, after a report, hides the vote or your profile, hides or removes one of its pieces, or suspends your access to the social features\./,
      /A preview of the link already shown in a messaging app \(occasion, initial of the first name and photos\) may stay there after the link is removed\./,
      /may be asked to confirm the age you declare;/,
    ]) {
      expect([fact.source, fact.test(en)]).toEqual([fact.source, true]);
    }
    expect(en).not.toMatch(/visible only to the person|your initials and the photos|to check your age/);
    const fr = section(page(ConfidentialitePage).html, "2.4 Fonctions sociales");
    for (const fact of [
      /le prénom que vous confirmez et son initiale, et les photos/,
      /une courte raison, visibles par la personne qui a créé le vote, et par notre équipe si cette personne signale la réponse\./,
      /reste visible jusqu'à son retrait ou son expiration, même si vous masquez ensuite ses pièces\. Il est aussi retiré quand vous supprimez le vote ou votre compte, et quand notre équipe, après un signalement, masque le vote ou votre profil, masque ou retire l'une de ses pièces, ou suspend votre accès aux fonctions sociales\./,
      /L'aperçu du lien déjà affiché dans une messagerie \(occasion, initiale du prénom et photos\) peut y rester après le retrait du lien\./,
      /peuvent être demandés pour confirmer l'âge que vous déclarez ;/,
    ]) {
      expect([fact.source, fact.test(fr)]).toEqual([fact.source, true]);
    }
    expect(fr).not.toMatch(/visibles seulement par la personne|vos initiales et les photos|pour vérifier l'âge/);
    expect([en.match(FORBIDDEN_MARKS), fr.match(FORBIDDEN_MARKS)]).toEqual([null, null]);
  });

  it("terms name social follows unambiguously and the first-name initial of a public link", () => {
    const fr = section(page(ConditionsPage).html, "4 bis. Fonctions sociales");
    expect(fr).toMatch(/\(profil social, abonnements à d'autres comptes, looks,/);
    expect(fr).toMatch(/le prénom que vous confirmez et son initiale, et les photos/);
    expect(fr).not.toMatch(/vos initiales/);
    const en = section(page(TermsPage).html, "4a. Social features");
    expect(en).toMatch(/\(social profile, follows, looks,/);
    expect(en).toMatch(/the first name you confirm and its initial, and the photos/);
    expect(en).not.toMatch(/your initials/);
  });

  it("each page links to its counterpart and to the existing contact", () => {
    expect(page(TermsPage).html).toContain('href="/privacy"');
    expect(page(ConditionsPage).html).toContain('href="/fr/confidentialite"');
    for (const render of [TermsPage, PrivacyPage, ConditionsPage, ConfidentialitePage]) {
      expect(page(render).html).toContain('href="mailto:margot@margotwardrobe.com"');
    }
  });
});

describe("delete-account page", () => {
  it("describes the in-app deletion as the server performs it, without an extra email", () => {
    const { html, text } = page(DeleteAccountPage);
    expect(text).not.toMatch(/To finalise removal/);
    expect(text).not.toMatch(/send a short confirmation email/);
    const steps = section(html, "1. Delete from inside the app");
    expect(steps).toMatch(/Settings/);
    expect(steps).toMatch(/Privacy & data/);
    expect(steps).toMatch(/Delete Account/);
    expect(steps).toMatch(/No email is needed/);
    expect(steps).toMatch(/at least 24 hours later/);
  });

  it("keeps the external request path for people without the app", () => {
    const { html, text } = page(DeleteAccountPage);
    expect(html).toContain('href="mailto:margot@margotwardrobe.com?subject=Delete%20my%20account"');
    expect(text).toMatch(/Margot/);
    expect(text).toMatch(/YAVREN/);
    expect(deleteMetadata.alternates).toEqual({ canonical: "/delete-account" });
  });

  it("does not claim the analytics identifiers are deleted, and says what stays", () => {
    const { html, text } = page(DeleteAccountPage);
    expect(section(html, "3. What data is deleted")).not.toMatch(/Analytics identifiers/);
    const retained = section(html, "4. What is retained, and for how long");
    expect(retained).toMatch(/not deleted when you delete your account/);
    expect(retained).toMatch(/technical account identifier, usage events and onboarding information remain with PostHog after you delete your account/);
    expect(retained).toMatch(/Deleting your Margot account does not automatically erase them/);
    expect(retained).not.toMatch(/Aggregated \/ anonymised analytics|90 days|can no longer be linked back to you/);
    expect(text).toMatch(/Last updated: 13 November 2026/);
  });

  it("lists the social data deleted and what stays with other people", () => {
    const deleted = section(page(DeleteAccountPage).html, "3. What data is deleted");
    for (const fact of [/social profile/, /public vote links/, /"Message deleted"/, /"I have it too"/]) {
      expect([fact.source, fact.test(deleted)]).toEqual([fact.source, true]);
    }
    expect([deleted.match(FORBIDDEN_MARKS), deleted.match(FORBIDDEN_PROMISES)]).toEqual([null, null]);
  });
});
