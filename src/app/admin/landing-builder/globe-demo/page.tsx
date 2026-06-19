import { GlobeDemo } from "@/fabrick/modules/landing-builder/components/generated/globe-demo";

export const dynamic = "force-dynamic";

export default function GlobeDemoPage() {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <GlobeDemo />
    </main>
  );
}
