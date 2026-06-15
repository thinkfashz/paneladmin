import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getGeneratedPageByToken } from "@/fabrick/modules/landing-builder/services/page-engine-service";
import { getProspectByLandingToken } from "@/fabrick/modules/landing-builder/services/prospects-service";

export const dynamic = "force-dynamic";

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function cleanText(value: string | null | undefined, fallback: string) {
  return String(value || fallback).replace(/\s+/g, " ").trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const page = await getGeneratedPageByToken(token);
  const prospect = await getProspectByLandingToken(token);

  if (!page) {
    return {
      title: "Demo no encontrada · Fabrick",
      description: "La demo solicitada no está disponible.",
    };
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/p/${token}`;
  const imageUrl = `${baseUrl}/p/${token}/opengraph-image`;

  const brandName = cleanText(prospect?.brandName || page.clientName, page.title);
  const projectName = cleanText(prospect?.projectName || page.niche, "Demo comercial personalizada");
  const followers = cleanText(prospect?.followers, "Prospecto comercial");
  const description = cleanText(
    prospect?.notes,
    `${projectName}. Vista previa comercial para ${brandName}. ${followers}.`,
  );

  const title = `${brandName} · Demo comercial Fabrick`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Soluciones Fabrick",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${brandName} · ${projectName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

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
        sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        className="h-screen w-full border-0"
      />
    </main>
  );
}
