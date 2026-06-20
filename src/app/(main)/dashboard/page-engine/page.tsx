import LandingBuilderModulePage from "@/fabrick/modules/landing-builder/page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Page Engine | Dashboard",
  description: "Motor de páginas y prospectos dentro del dashboard principal.",
};

export default function DashboardPageEnginePage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    deleted?: string;
    created?: string;
    type?: string;
    imported?: string;
    prospect?: string;
  }>;
}) {
  return <LandingBuilderModulePage searchParams={searchParams} />;
}
