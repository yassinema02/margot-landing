import { redirect } from "next/navigation";

// /i/<token>/<anything>: not an invitation link, but without this route it
// would render the global 404 (RootShell: GA4, Meta Pixel) with the token in
// its URL. Back to /i/<token>, which stays inside the tracker-free (invite)
// layout and says whether the link is valid.
export const dynamic = "force-dynamic";

export default async function InviteCatchAll({ params }: { params: Promise<{ token: string; rest: string[] }> }) {
  const { token } = await params;
  redirect(`/i/${encodeURIComponent(token)}`);
}
