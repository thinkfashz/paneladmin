import { ImageResponse } from "next/og";

import { getGeneratedPageByToken } from "@/fabrick/modules/landing-builder/services/page-engine-service";
import { getProspectByLandingToken } from "@/fabrick/modules/landing-builder/services/prospects-service";

export const runtime = "edge";
export const alt = "Demo comercial Fabrick";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "SF";
}

function validColor(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ? value : fallback;
}

export default async function Image({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const page = await getGeneratedPageByToken(token);
  const prospect = await getProspectByLandingToken(token);

  const brandName = prospect?.brandName || page?.clientName || page?.title || "Demo Fabrick";
  const projectName = prospect?.projectName || page?.niche || "Página comercial personalizada";
  const followers = prospect?.followers || "Demo privada";
  const website = prospect?.website || prospect?.landingUrl || `/p/${token}`;
  const notes =
    prospect?.notes ||
    "Vista previa comercial creada con Fabrick Demo Engine para validar una propuesta antes de crear el sitio final.";

  const c1 = validColor(prospect?.colorPalette?.[0], "#f97316");
  const c2 = validColor(prospect?.colorPalette?.[1], "#111827");
  const c3 = validColor(prospect?.colorPalette?.[2], "#fff7ed");

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: `radial-gradient(circle at top left, ${c1} 0%, transparent 34%), linear-gradient(135deg, ${c2}, #050505 72%)`,
          color: "white",
          fontFamily: "Arial",
          padding: "64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-120px",
            bottom: "-120px",
            width: "420px",
            height: "420px",
            borderRadius: "999px",
            background: c3,
            opacity: 0.18,
          }}
        />

        <div style={{ display: "flex", width: "100%", gap: "46px", alignItems: "center" }}>
          <div
            style={{
              width: "260px",
              height: "260px",
              borderRadius: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${c1}, ${c3})`,
              color: "#111827",
              fontSize: "86px",
              fontWeight: 900,
              letterSpacing: "-8px",
              boxShadow: "0 36px 120px rgba(0,0,0,.45)",
              border: "6px solid rgba(255,255,255,.24)",
            }}
          >
            {initials(brandName)}
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                width: "fit-content",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,.28)",
                padding: "10px 18px",
                fontSize: "24px",
                color: "#dbeafe",
                marginBottom: "26px",
              }}
            >
              Fabrick Demo Engine · Vista previa comercial
            </div>

            <div
              style={{
                fontSize: "72px",
                lineHeight: 0.95,
                fontWeight: 900,
                letterSpacing: "-5px",
                maxWidth: "760px",
              }}
            >
              {brandName}
            </div>

            <div
              style={{
                marginTop: "18px",
                fontSize: "34px",
                color: "#e5e7eb",
                fontWeight: 700,
              }}
            >
              {projectName}
            </div>

            <div
              style={{
                marginTop: "18px",
                fontSize: "25px",
                lineHeight: 1.35,
                color: "#cbd5e1",
                maxWidth: "760px",
              }}
            >
              {notes.slice(0, 150)}
            </div>

            <div
              style={{
                marginTop: "34px",
                display: "flex",
                gap: "14px",
                fontSize: "24px",
                color: "#f8fafc",
              }}
            >
              <span style={{ padding: "10px 16px", borderRadius: "18px", background: "rgba(255,255,255,.12)" }}>
                {followers} seguidores
              </span>
              <span style={{ padding: "10px 16px", borderRadius: "18px", background: "rgba(255,255,255,.12)" }}>
                {website}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
