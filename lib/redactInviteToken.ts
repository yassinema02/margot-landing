// Invitation links (/i/<token>) carry a single-use token: whoever holds it can
// claim the invitation. Analytics only ever sees /i/:token.
//
// Kept free of any server import: the PostHog provider (client bundle) uses it.

export const INVITE_PATH_PLACEHOLDER = "/i/:token";

// "/i/<segment>" as the first path segment, either at the start of the string
// (a pathname) or right after "//host" (a full URL, also inside a longer
// string such as an autocapture element chain). Idempotent: ":token" is
// rewritten to itself.
const INVITE_SEGMENT = /(^|\/\/[^/?#\s"'<>]*)\/i\/[^/?#\s"'<>]+/g;

export function redactInviteToken(value: string): string {
  return value.replace(INVITE_SEGMENT, `$1${INVITE_PATH_PLACEHOLDER}`);
}

const MAX_DEPTH = 6;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function redactDeep(value: unknown, depth: number): unknown {
  if (typeof value === "string") return redactInviteToken(value);
  if (depth >= MAX_DEPTH) return value;
  if (Array.isArray(value)) return value.map((item) => redactDeep(item, depth + 1));
  if (isPlainObject(value)) {
    // Keys too: heatmap data ($heatmap_data) is keyed by window.location.href.
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) out[redactInviteToken(key)] = redactDeep(item, depth + 1);
    return out;
  }
  return value;
}

type EventLike = {
  properties?: Record<string, unknown>;
  $set?: Record<string, unknown>;
  $set_once?: Record<string, unknown>;
};

/**
 * PostHog `before_send` hook: rewrites every string of the event, values and
 * object keys (URL, pathname, referrer, session entry, autocapture hrefs,
 * heatmap data, person properties) so no invitation token leaves the
 * browser in an event. Other events pass through unchanged in value.
 * The /flags request is not an event: the invitation layout turns it off.
 */
export function redactInviteEvent<E extends EventLike>(event: E | null): E | null {
  if (!event) return event;
  const out = { ...event };
  if (event.properties) out.properties = redactDeep(event.properties, 0) as E["properties"];
  if (event.$set) out.$set = redactDeep(event.$set, 0) as E["$set"];
  if (event.$set_once) out.$set_once = redactDeep(event.$set_once, 0) as E["$set_once"];
  return out;
}
