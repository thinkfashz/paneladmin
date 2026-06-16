const SUPPORTED_ICON_NAMES = [
  "Sparkles",
  "MessageCircle",
  "Calendar",
  "Camera",
  "Upload",
  "CheckCircle2",
  "MapPin",
  "ChevronRight",
  "Smartphone",
  "ShieldCheck",
  "Users",
  "Sliders",
  "Award",
  "Clock",
  "Phone",
  "Layers",
  "ChevronDown",
  "Menu",
  "X",
  "ExternalLink",
  "Globe",
  "Mail",
  "FileText",
  "FileJson",
  "Palette",
  "Rocket",
  "Share2",
  "Copy",
  "Eye",
  "Plus",
  "Download",
  "Paperclip",
  "Tag",
  "MoreHorizontal",
  "Edit2",
  "Search",
  "Trash2",
  "Instagram",
  "Facebook",
  "Youtube",
  "Send",
  "ShoppingCart",
  "CreditCard",
  "Star",
  "Heart",
  "MapPinned",
  "ChevronLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowUpRight",
  "Check",
  "CircleCheck",
  "CircleAlert",
  "Info",
];

function stripCodeFence(value: string) {
  const raw = String(value || "").trim();

  return raw
    .replace(/^```(?:html|react|jsx|tsx|javascript|js)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function escapeClosingScript(value: string) {
  return value.replace(/<\/script/gi, "<\\/script");
}

function toJsonScript(value: string) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function removeImportsSafely(code: string) {
  return code
    .replace(/^[ \t]*["']use client["'];?\s*/gm, "")
    .replace(/^[ \t]*["']use strict["'];?\s*/gm, "")
    .replace(/import\s+type\s+[\s\S]*?from\s*["'][^"']+["'];?/g, "")
    .replace(/import\s+React\s*,\s*\{[\s\S]*?\}\s*from\s*["']react["'];?/g, "")
    .replace(/import\s+\{[\s\S]*?\}\s*from\s*["']react["'];?/g, "")
    .replace(/import\s+\*\s+as\s+React\s+from\s*["']react["'];?/g, "")
    .replace(/import\s+React\s+from\s*["']react["'];?/g, "")
    .replace(/import\s+([A-Za-z_$][\w$]*)\s+from\s*["']next\/link["'];?/g, "const $1 = Link;")
    .replace(/import\s+([A-Za-z_$][\w$]*)\s+from\s*["']cobe["'];?/g, "const $1 = createGlobe;")
    .replace(/import\s+([A-Za-z_$][\w$]*)\s+from\s*["']framer-motion["'];?/g, "const $1 = framerMotion;")
    .replace(/import\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s*["']framer-motion["'];?/g, "const $1 = framerMotion;")
    .replace(/import\s+\{[\s\S]*?\}\s*from\s*["'](?:lucide-react|framer-motion|@\/components\/ui\/[^"']+|\.\.\/components\/ui\/[^"']+|\.\/components\/ui\/[^"']+|@\/lib\/utils|\.\.\/lib\/utils|\.\/lib\/utils)["'];?/g, "")
    .replace(/import\s+[\s\S]*?\s+from\s*["'][^"']+["'];?/g, "")
    .replace(/import\s*["'][^"']+["'];?/g, "");
}

export function normalizeReactPreviewCode(source: string) {
  let code = stripCodeFence(source);

  code = removeImportsSafely(code)
    .replace(/export\s+default\s+function\s+App/g, "function App")
    .replace(/export\s+function\s+App/g, "function App")
    .replace(/export\s+default\s+App;?/g, "")
    .replace(/export\s+default\s+/g, "")
    .replace(/export\s+\{[\s\S]*?\};?/g, "");

  return code.trim();
}

export function buildHtmlPreviewDocument(source: string) {
  const html = stripCodeFence(source);

  if (!html) {
    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Preview vacío</title>
</head>
<body style="font-family: system-ui; padding: 24px;">
  <h1>Sin HTML cargado</h1>
  <p>Importa un archivo .html o escribe el código para ver el preview.</p>
</body>
</html>`;
  }

  if (/<html[\s>]/i.test(html)) return html;

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>HTML Preview</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
</head>
<body>
${html}
</body>
</html>`;
}

export function buildReactDemoHtml(reactCode: string, css = "") {
  const normalizedCode = normalizeReactPreviewCode(reactCode);
  const safeCode = escapeClosingScript(normalizedCode);
  const safeCss = escapeClosingScript(css || "");

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>React Demo Preview</title>
  <style>
    html, body, #root { min-height: 100%; margin: 0; }
    body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#0f172a; color:#e5e7eb; }
    * { box-sizing: border-box; }
    ${safeCss}
  </style>
</head>
<body>
  <div id="root">
    <div style="min-height:100vh;background:#0f172a;color:#e5e7eb;font-family:system-ui;padding:24px;display:flex;align-items:center;justify-content:center;">
      <div style="max-width:720px;width:100%;border:1px solid rgba(255,255,255,.14);border-radius:24px;background:rgba(255,255,255,.06);padding:24px;box-shadow:0 30px 90px rgba(0,0,0,.35);">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.14em;color:#93c5fd;margin-bottom:8px;">Fabrick Preview Engine</div>
        <h1 style="margin:0 0 10px;font-size:28px;line-height:1.05;">Cargando React Preview…</h1>
        <p style="color:#cbd5e1;line-height:1.55;">Preparando React, Babel, Tailwind y dependencias seguras.</p>
      </div>
    </div>
  </div>
  <script>
    window.__FABRICK_REACT_SOURCE__ = ${toJsonScript(safeCode)};
    window.__FABRICK_ICON_NAMES__ = ${JSON.stringify(SUPPORTED_ICON_NAMES)};
  <\/script>
  <script>
    (function bootstrapPreview(){
      const rootNode = document.getElementById("root");

      function showError(title, err) {
        const message = err && err.message ? err.message : String(err || "Error desconocido");
        rootNode.innerHTML = '<div style="min-height:100vh;background:#0f172a;color:#e5e7eb;font-family:system-ui;padding:24px;display:flex;align-items:center;justify-content:center;"><div style="max-width:720px;width:100%;border:1px solid rgba(255,255,255,.14);border-radius:24px;background:rgba(255,255,255,.06);padding:24px;box-shadow:0 30px 90px rgba(0,0,0,.35);"><div style="font-size:12px;text-transform:uppercase;letter-spacing:.14em;color:#93c5fd;margin-bottom:8px;">Fabrick Preview Engine</div><h1 style="margin:0 0 10px;font-size:28px;line-height:1.05;">' + title + '</h1><p style="color:#cbd5e1;line-height:1.55;">' + message.replace(/</g, '&lt;') + '</p><p style="color:#94a3b8;font-size:13px;line-height:1.5;margin-top:18px;">Si ves esto, el iframe sí funciona. El error está en el código pegado o en una dependencia todavía no soportada.</p></div></div>';
      }

      function loadScriptList(list, label) {
        let chain = Promise.reject(new Error("start"));
        list.forEach(function(src){
          chain = chain.catch(function(){
            return new Promise(function(resolve, reject){
              const s = document.createElement("script");
              const timer = setTimeout(function(){ s.remove(); reject(new Error("Timeout cargando " + label)); }, 9000);
              s.src = src;
              s.crossOrigin = "anonymous";
              s.onload = function(){ clearTimeout(timer); resolve(true); };
              s.onerror = function(){ clearTimeout(timer); s.remove(); reject(new Error("No cargó " + src)); };
              document.head.appendChild(s);
            });
          });
        });
        return chain;
      }

      function cn() { return Array.prototype.slice.call(arguments).flat().filter(Boolean).join(" "); }
      function cleanDomProps(props) {
        const blocked = new Set(["initial", "animate", "exit", "transition", "variants", "whileHover", "whileTap", "whileInView", "viewport", "layout", "drag", "dragConstraints", "dragElastic", "onDragEnd"]);
        const next = {};
        Object.keys(props || {}).forEach(function(key){ if (!blocked.has(key)) next[key] = props[key]; });
        return next;
      }
      function makePrimitive(tag, baseClass) {
        return React.forwardRef(function Primitive(props, ref) {
          const clean = cleanDomProps(props || {});
          const children = clean.children;
          delete clean.children;
          return React.createElement(tag, { ...clean, ref: ref, className: cn(baseClass || "", clean.className) }, children);
        });
      }
      function makeIcon(name) {
        return function IconComponent(props) {
          const attrs = props || {};
          const size = attrs.size || 24;
          const strokeWidth = attrs.strokeWidth || 2;
          const className = attrs.className || "";
          return React.createElement("svg", { ...attrs, className, width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth, strokeLinecap:"round", strokeLinejoin:"round", role:"img", "aria-label":name }, React.createElement("circle", { cx:12, cy:12, r:8 }), React.createElement("path", { d:"M8 12h8" }), React.createElement("path", { d:"M12 8v8" }));
        };
      }

      function transformPreviewSource(userCode) {
        const attempts = [
          { presets: [["typescript", { isTSX:true, allExtensions:true }], ["env", { modules:false }], "react"], filename:"preview.tsx" },
          { presets: [["env", { modules:false }], "react"], filename:"preview.jsx" },
          { presets: ["react"], filename:"preview.jsx" }
        ];
        const messages = [];
        for (let i = 0; i < attempts.length; i += 1) {
          try {
            return Babel.transform(userCode, { ...attempts[i], sourceType:"script" }).code;
          } catch (err) {
            messages.push(err && err.message ? err.message : String(err));
          }
        }
        throw new Error(messages.join(" | "));
      }

      function runPreview(){
        const motion = new Proxy({}, { get: function(_target, tag){ return makePrimitive(String(tag), ""); } });
        function AnimatePresence(props){ return React.createElement(React.Fragment, null, props.children); }
        function useReducedMotion(){ return false; }
        function Link(props){ const clean = cleanDomProps(props || {}); const href = clean.href || "#"; const children = clean.children; delete clean.children; return React.createElement("a", { ...clean, href }, children); }
        function createGlobe(canvas){ const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null; if (!ctx) return { destroy:function(){} }; let stop=false; function draw(t){ if(stop) return; const w=canvas.width||canvas.clientWidth||320; const h=canvas.height||canvas.clientHeight||320; ctx.clearRect(0,0,w,h); const r=Math.min(w,h)*.38; const x=w/2; const y=h/2; const g=ctx.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r); g.addColorStop(0,"#93c5fd"); g.addColorStop(.55,"#2563eb"); g.addColorStop(1,"#0f172a"); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.strokeStyle="rgba(255,255,255,.28)"; for(let i=-3;i<=3;i++){ctx.beginPath();ctx.ellipse(x,y,r*Math.cos(i*.18),r*.22,t/900+i,0,Math.PI*2);ctx.stroke();} requestAnimationFrame(draw); } requestAnimationFrame(draw); return { destroy:function(){stop=true;} }; }
        const Button = makePrimitive("button", "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition border border-slate-200 bg-white text-slate-950 hover:bg-slate-100 disabled:opacity-50");
        const Badge = makePrimitive("span", "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold");
        const Card = makePrimitive("div", "rounded-xl border bg-white text-slate-950 shadow-sm");
        const CardHeader = makePrimitive("div", "flex flex-col space-y-1.5 p-6");
        const CardContent = makePrimitive("div", "p-6 pt-0");
        const CardTitle = makePrimitive("h3", "font-semibold leading-none tracking-tight");
        const CardDescription = makePrimitive("p", "text-sm text-slate-500");
        const Input = makePrimitive("input", "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm");
        const Textarea = makePrimitive("textarea", "flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm");
        const Avatar = makePrimitive("span", "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full");
        const AvatarImage = makePrimitive("img", "aspect-square h-full w-full");
        const AvatarFallback = makePrimitive("span", "flex h-full w-full items-center justify-center rounded-full bg-slate-100");
        const Table = makePrimitive("table", "w-full caption-bottom text-sm");
        const TableHeader = makePrimitive("thead", "[&_tr]:border-b");
        const TableBody = makePrimitive("tbody", "[&_tr:last-child]:border-0");
        const TableRow = makePrimitive("tr", "border-b transition-colors hover:bg-slate-50");
        const TableHead = makePrimitive("th", "h-12 px-4 text-left align-middle font-medium text-slate-500");
        const TableCell = makePrimitive("td", "p-4 align-middle");
        Object.assign(window, { useState:React.useState, useEffect:React.useEffect, useMemo:React.useMemo, useRef:React.useRef, useCallback:React.useCallback, Fragment:React.Fragment, cn, motion, framerMotion:{ motion, AnimatePresence, useReducedMotion }, AnimatePresence, useReducedMotion, Link, Button, Badge, Card, CardHeader, CardContent, CardTitle, CardDescription, Input, Textarea, Avatar, AvatarImage, AvatarFallback, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, createGlobe });
        window.__FABRICK_ICON_NAMES__.forEach(function(name){ window[name] = window[name] || makeIcon(name); });
        let userCode = window.__FABRICK_REACT_SOURCE__ || "";
        if (!/function\s+App\s*\(/.test(userCode) && !/const\s+App\s*=/.test(userCode)) throw new Error("No encontré function App() ni const App = ... en el código React.");
        userCode += "\n;window.__FabrickPreviewApp = typeof App !== 'undefined' ? App : window.__FabrickPreviewApp;";
        const transformed = transformPreviewSource(userCode);
        (0, eval)(transformed);
        const App = window.__FabrickPreviewApp;
        if (!App) throw new Error("El componente App no quedó disponible después de compilar.");
        ReactDOM.createRoot(rootNode).render(React.createElement(App));
      }

      Promise.resolve()
        .then(function(){ return loadScriptList(["https://cdn.jsdelivr.net/npm/react@18/umd/react.development.js", "https://unpkg.com/react@18/umd/react.development.js"], "React"); })
        .then(function(){ return loadScriptList(["https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.development.js", "https://unpkg.com/react-dom@18/umd/react-dom.development.js"], "ReactDOM"); })
        .then(function(){ return loadScriptList(["https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js", "https://unpkg.com/@babel/standalone/babel.min.js"], "Babel"); })
        .then(function(){ return loadScriptList(["https://cdn.tailwindcss.com"], "Tailwind").catch(function(err){ console.warn(err); }); })
        .then(runPreview)
        .catch(function(err){ console.error(err); showError("No se pudo cargar el motor React", err); });
    })();
  <\/script>
</body>
</html>`;
}
