import { ModulePlaceholder } from "@/fabrick/modules/module-placeholder";

export const dynamic = "force-dynamic";

type AdminMissingModulePageProps = {
  params: {
    missing?: string[];
  };
};

export default function AdminMissingModulePage({ params }: AdminMissingModulePageProps) {
  return <ModulePlaceholder section="admin" segments={params.missing ?? []} />;
}
