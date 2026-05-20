import { NextResponse } from "next/server";

export const revalidate = 3600;

const FLOOR_BOOST = 47;

export async function GET() {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) {
    return NextResponse.json({ count: null });
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions?limit=1`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return NextResponse.json({ count: null });
    const data = await res.json();
    const raw =
      typeof data?.total_results === "number"
        ? data.total_results
        : typeof data?.total_count === "number"
        ? data.total_count
        : typeof data?.pagination?.total_count === "number"
        ? data.pagination.total_count
        : null;
    const count = raw !== null ? raw + FLOOR_BOOST : null;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: null });
  }
}
