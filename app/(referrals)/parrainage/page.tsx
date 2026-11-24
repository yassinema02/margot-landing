import { PortalPage } from '@/components/ReferralPortalPage';

export default async function ReferralPage({ searchParams }: { searchParams: Promise<{ invitation?: string | string[] }> }) {
  return <PortalPage invitation={(await searchParams).invitation} />;
}
