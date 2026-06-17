export const demoReactCode = `function App() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="inline-flex rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
          Demo React generada con Fabrick
        </div>

        <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
          Una landing React lista para compartir con clientes.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
          Este código fue pegado en el admin, renderizado en un visor aislado y puede compartirse como demo mediante un link público único.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button className="rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-400 px-6 py-4 font-bold text-black shadow-xl shadow-orange-500/20">
            Solicitar demo
          </button>
          <button className="rounded-2xl border border-white/15 px-6 py-4 font-bold text-white">
            Ver propuesta
          </button>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            ["24h", "Entrega rápida"],
            ["100%", "Responsive"],
            ["Demo", "Compartible"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <strong className="block text-4xl">{value}</strong>
              <span className="mt-2 block text-neutral-400">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}`;

export const demoReactCss = `body {
  margin: 0;
}

* {
  box-sizing: border-box;
}`;

export const demoHtmlApp = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>HTML App Fabrick</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
</head>
<body class="bg-slate-950 text-white">
  <main class="min-h-screen font-sans">
    <nav class="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 p-3 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <strong>Fabrick HTML App</strong>
        <div class="flex gap-2 text-xs">
          <button data-action="go" data-target="inicio" class="rounded-full bg-white px-3 py-2 font-bold text-slate-950">Inicio</button>
          <button data-action="go" data-target="cotizador" class="rounded-full border border-white/15 px-3 py-2">Cotizador</button>
          <button data-action="go" data-target="contacto" class="rounded-full border border-white/15 px-3 py-2">Contacto</button>
        </div>
      </div>
    </nav>

    <section data-screen="inicio" class="mx-auto max-w-5xl px-6 py-16">
      <span class="rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-200">HTML funcional sin React</span>
      <h1 class="mt-8 max-w-3xl text-5xl font-black tracking-tight md:text-7xl">Landing interactiva con botones reales.</h1>
      <p class="mt-5 max-w-2xl text-slate-300">Usa data-action para crear navegación interna, WhatsApp, modales, cálculos y acciones sin codificar todo desde cero.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <button data-action="go" data-target="cotizador" class="rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-400 px-6 py-4 font-black text-black">Calcular precio</button>
        <button data-action="modal" data-target="modal-demo" class="rounded-2xl border border-white/15 px-6 py-4 font-bold">Ver modal</button>
      </div>
    </section>

    <section data-screen="cotizador" hidden class="mx-auto max-w-5xl px-6 py-16">
      <div data-calc class="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 class="text-3xl font-black">Cotizador interno</h2>
        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <label class="space-y-2 text-sm">Cantidad
            <input data-calc-field="cantidad" value="3" type="number" class="w-full rounded-xl border border-white/10 bg-slate-900 p-3" />
          </label>
          <label class="space-y-2 text-sm">Precio unitario
            <input data-calc-field="precio" value="120000" type="number" class="w-full rounded-xl border border-white/10 bg-slate-900 p-3" />
          </label>
          <div class="rounded-2xl bg-slate-900 p-4">
            <span class="text-xs text-slate-400">Total estimado</span>
            <strong data-calc-result data-formula="cantidad * precio" data-prefix="$" class="mt-1 block text-3xl text-emerald-300">$360.000</strong>
          </div>
        </div>
        <button data-action="go" data-target="contacto" class="mt-6 rounded-2xl bg-white px-5 py-3 font-black text-slate-950">Enviar datos</button>
      </div>
    </section>

    <section data-screen="contacto" hidden class="mx-auto max-w-5xl px-6 py-16">
      <form data-action="lead" data-success="Lead capturado dentro de la demo." class="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 class="text-3xl font-black">Captura de lead</h2>
        <input name="nombre" required placeholder="Nombre" class="mt-5 w-full rounded-xl border border-white/10 bg-slate-900 p-3" />
        <input name="telefono" required placeholder="WhatsApp" class="mt-3 w-full rounded-xl border border-white/10 bg-slate-900 p-3" />
        <div class="mt-5 flex flex-wrap gap-3">
          <button class="rounded-2xl bg-emerald-500 px-5 py-3 font-black text-slate-950">Guardar lead simulado</button>
          <button type="button" data-action="whatsapp" data-phone="56900000000" data-message="Hola, quiero una demo Fabrick" class="rounded-2xl border border-white/15 px-5 py-3 font-bold">WhatsApp</button>
        </div>
      </form>
    </section>
  </main>

  <dialog id="modal-demo" class="rounded-3xl border border-white/10 bg-slate-950 p-0 text-white backdrop:bg-black/70">
    <div class="max-w-sm p-6">
      <h3 class="text-2xl font-black">Modal funcional</h3>
      <p class="mt-3 text-slate-300">Este modal se abre con data-action="modal" y se cierra con data-action="close-modal".</p>
      <button data-action="close-modal" data-target="modal-demo" class="mt-5 rounded-xl bg-white px-4 py-2 font-bold text-slate-950">Cerrar</button>
    </div>
  </dialog>
</body>
</html>`;

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
  description: "Motor para crear HTMLs o demos React, guardarlos y compartirlos con token.",
  route: "/admin/landing-builder",
};
