import { describe, expect, it } from "vitest";
import { MARGOT_LIMITS, MARGOT_PREMIUM_SUMMARY, MARGOT_PRICES, MARGOT_ROWS } from "../margot";

describe("MARGOT_LIMITS", () => {
  it("holds the free and Premium quotas", () => {
    expect(MARGOT_LIMITS).toEqual({
      freePieces: 15,
      freeOutfitsPerDay: 5,
      premiumOutfitsPerDay: 20,
      freeTryOnsPerWeek: 1,
      premiumTryOnsPerDay: 15,
    });
  });

  it("leaves the comparison-page copy word for word", () => {
    expect(MARGOT_PRICES.free).toEqual({
      fr: "0 € : jusqu'à 15 pièces, 5 générations de tenues par jour",
      en: "$0: up to 15 pieces, 5 outfit generations a day",
    });
    expect(MARGOT_ROWS.tryon).toEqual({
      fr: "Oui : 1 par semaine en gratuit, 15 par jour avec Premium",
      en: "Yes: 1 a week free, 15 a day with Premium",
    });
    expect(MARGOT_PREMIUM_SUMMARY).toEqual({
      fr: "Margot Premium lève la limite de 15 pièces, passe de 5 à 20 générations de tenues par jour et d'un essayage par semaine à 15 par jour, et ajoute les tenues pour tes événements.",
      en: "Margot Premium removes the 15-piece limit, raises outfit generations from 5 to 20 a day and try-ons from one a week to 15 a day, and adds outfits for your events.",
    });
  });
});
