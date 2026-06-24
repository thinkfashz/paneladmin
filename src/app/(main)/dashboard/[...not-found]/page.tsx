import { ModulePlaceholder } from "@/fabrick/modules/module-placeholder";

export const dynamic = "force-dynamic";

type DashboardNotFoundPageProps = {
  params: Promise<{
    "not-found"?: string[];
  }>;
};

export default async function DashboardNotFoundPage({ params }: DashboardNotFoundPageProps) {
  const value = await params;
  return <ModulePlaceholder section="dashboard" segments={value["not-found"] ?? []} />;
}
