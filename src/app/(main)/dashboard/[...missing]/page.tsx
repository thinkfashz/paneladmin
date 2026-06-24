import { ModulePlaceholder } from "@/fabrick/modules/module-placeholder";

export const dynamic = "force-dynamic";

type DashboardMissingModulePageProps = {
  params: {
    missing?: string[];
  };
};

export default function DashboardMissingModulePage({ params }: DashboardMissingModulePageProps) {
  return <ModulePlaceholder section="dashboard" segments={params.missing ?? []} />;
}
