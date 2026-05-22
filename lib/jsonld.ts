// Safe JSON.stringify for embedding inside a <script> tag — escapes
// HTML-meaningful characters so a payload can be passed as a React text
// child of <script type="application/ld+json"> with no XSS surface.
export function safeJson(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
