import { notFound } from "next/navigation";

import { getGeneratedPageByToken } from "@/fabrick/modules/landing-builder/services/page-engine-service";

export const dynamic = "force-dynamic";

export default async function PublicGeneratedPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const page = await getGeneratedPageByToken(token);

  if (!page) notFound();

  return (
    <main className="min-h-screen bg-black">
      <iframe
        title={page.title}
        srcDoc={page.html}
        sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        className="h-screen w-full border-0"
      />
    </main>
  );
}
