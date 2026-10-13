import { describe, expect, it } from "vitest";
import { HOME } from "@/lib/home";
import { alt as frAlt } from "../(fr)/fr/opengraph-image";
import { alt as enAlt } from "../opengraph-image";

describe("homepage social card alt", () => {
  it("quotes the headline drawn on the card, in each language", () => {
    expect(enAlt).toContain(HOME.en.headline);
    expect(frAlt).toContain(HOME.fr.headline);
  });
});
