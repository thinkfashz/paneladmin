import { ModulePlaceholder } from "@/fabrick/modules/module-placeholder";

export const dynamic = "force-dynamic";

type AdminMissingModulePageProps = {
  params: Promise<{
    missing?: string[];
  }>;
};

export default async function AdminMissingModulePage({ params }: AdminMissingModulePageProps) {
  const { missing } = await params;
  return <ModulePlaceholder section="admin" segments={missing ?? []} />;
}
