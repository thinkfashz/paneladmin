export const demoLandingHtml = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Propuesta Comercial Premium</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #09090b;
      --card: rgba(255,255,255,.08);
      --line: rgba(255,255,255,.14);
      --text: #fafafa;
      --muted: #a1a1aa;
      --accent: #f97316;
      --accent2: #facc15;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at top left, rgba(249,115,22,.28), transparent 35%),
        radial-gradient(circle at bottom right, rgba(250,204,21,.18), transparent 35%),
        var(--bg);
      color: var(--text);
    }
    .wrap { max-width: 1120px; margin: 0 auto; padding: 48px 20px; }
    .badge {
      display:inline-flex; gap:8px; align-items:center;
      border:1px solid var(--line); background:var(--card);
      border-radius:999px; padding:8px 12px; color:var(--accent2); font-size:14px;
    }
    .hero {
      margin-top: 28px;
      display:grid; gap:24px; grid-template-columns: 1.1fr .9fr; align-items:center;
    }
    h1 { font-size: clamp(42px, 8vw, 86px); line-height:.95; margin: 0; letter-spacing:-.06em; }
    p { color: var(--muted); font-size: 18px; line-height:1.7; }
    .card {
      border:1px solid var(--line); background:linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,.05));
      border-radius:28px; padding:24px; box-shadow: 0 24px 90px rgba(0,0,0,.4);
    }
    .cta {
      display:inline-flex; margin-top:20px; padding:14px 20px; border-radius:16px;
      background:linear-gradient(135deg, var(--accent), var(--accent2));
      color:#111; font-weight:800; text-decoration:none;
    }
    .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:36px; }
    .mini { border:1px solid var(--line); background:var(--card); border-radius:22px; padding:20px; }
    .mini strong { display:block; font-size:28px; }
    @media (max-width: 800px) {
      .hero, .grid { grid-template-columns:1fr; }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <span class="badge">🔥 Propuesta generada con Fabrick Page Engine</span>
    <section class="hero">
      <div>
        <h1>Tu negocio puede vender más con una página premium.</h1>
        <p>
          Esta página fue creada, guardada en base de datos y compartida con un token público.
          Puedes usarla para prospectos, cotizaciones, campañas y propuestas rápidas.
        </p>
        <a class="cta" href="https://wa.me/56900000000">Solicitar propuesta</a>
      </div>
      <div class="card">
        <h2>Oferta demostrativa</h2>
        <p>Landing personalizada + copy comercial + llamada directa a WhatsApp + diseño responsive.</p>
        <div class="grid">
          <div class="mini"><strong>24h</strong><span>Entrega base</span></div>
          <div class="mini"><strong>3x</strong><span>Más claridad</span></div>
          <div class="mini"><strong>100%</strong><span>Mobile ready</span></div>
        </div>
      </div>
    </section>
  </main>
</body>
</html>`;

export const moduleInfo = {
  id: "landing-builder",
  title: "Landing Builder",
  description: "Motor para crear HTMLs, guardarlos y compartirlos con token.",
  route: "/admin/landing-builder",
};
