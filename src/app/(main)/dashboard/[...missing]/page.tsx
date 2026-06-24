import { ModulePlaceholder } from "@/fabrick/modules/module-placeholder";

export const dynamic = "force-dynamic";

type MissingDashboardPageProps = {
  params: Promise<{
    missing?: string[];
  }>;
};

export default async function MissingDashboardPage({ params }: MissingDashboardPageProps) {
  const { missing } = await params;
  return <ModulePlaceholder section="dashboard" segments={missing ?? []} />;
}
