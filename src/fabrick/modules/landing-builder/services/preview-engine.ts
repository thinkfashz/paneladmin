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
];

function stripCodeFence(value: string) {
  return String(value || "")
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

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function normalizeReactPreviewCode(source: string) {
  let code = stripCodeFence(source);

  code = code
    .replace(/import\s+React\s*,\s*\{[\s\S]*?\}\s*from\s*["']react["'];?/g, "")
    .replace(/import\s+React\s+from\s*["']react["'];?/g, "")
    .replace(/import\s*\{[\s\S]*?\}\s*from\s*["']lucide-react["'];?/g, "")
    .replace(/import\s+[\s\S]*?\s+from\s*["'][^"']+["'];?/g, "")
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

  if (/<html[\s>]/i.test(html)) {
    return html;
  }

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
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <style>
    html, body, #root { min-height: 100%; margin: 0; }
    body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    * { box-sizing: border-box; }
    ${safeCss}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    window.__FABRICK_REACT_SOURCE__ = ${toJsonScript(safeCode)};
    window.__FABRICK_ICON_NAMES__ = ${JSON.stringify(SUPPORTED_ICON_NAMES)};
  <\/script>
  <script>
    (function bootstrapPreview(){
      const rootNode = document.getElementById("root");

      function showError(title, err) {
        const message = err && err.message ? err.message : String(err || "Error desconocido");
        rootNode.innerHTML = '<div style="min-height:100vh;background:#0f172a;color:#e5e7eb;font-family:system-ui;padding:24px;display:flex;align-items:center;justify-content:center;"><div style="max-width:720px;width:100%;border:1px solid rgba(255,255,255,.14);border-radius:24px;background:rgba(255,255,255,.06);padding:24px;box-shadow:0 30px 90px rgba(0,0,0,.35);"><div style="font-size:12px;text-transform:uppercase;letter-spacing:.14em;color:#93c5fd;margin-bottom:8px;">Fabrick Preview Engine</div><h1 style="margin:0 0 10px;font-size:28px;line-height:1.05;">' + title + '</h1><p style="color:#cbd5e1;line-height:1.55;">' + message.replace(/</g, '&lt;') + '</p><p style="color:#94a3b8;font-size:13px;line-height:1.5;margin-top:18px;">Consejo: pega un componente que tenga <b>function App()</b> o <b>export default function App()</b>. El motor soporta React, hooks, Tailwind y shims de íconos tipo lucide-react.</p></div></div>';
      }

      function makeIcon(name) {
        return function IconComponent(props) {
          const attrs = props || {};
          const size = attrs.size || 24;
          const strokeWidth = attrs.strokeWidth || 2;
          const className = attrs.className || "";
          return React.createElement(
            "svg",
            {
              ...attrs,
              className,
              width: size,
              height: size,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth,
              strokeLinecap: "round",
              strokeLinejoin: "round",
              role: "img",
              "aria-label": name,
            },
            React.createElement("circle", { cx: 12, cy: 12, r: 8 }),
            React.createElement("path", { d: "M8 12h8" }),
            React.createElement("path", { d: "M12 8v8" })
          );
        };
      }

      try {
        const ReactHooks = {
          useState: React.useState,
          useEffect: React.useEffect,
          useMemo: React.useMemo,
          useRef: React.useRef,
          useCallback: React.useCallback,
          Fragment: React.Fragment,
        };

        Object.assign(window, ReactHooks);
        window.__FABRICK_ICON_NAMES__.forEach(function(name){
          window[name] = window[name] || makeIcon(name);
        });

        let userCode = window.__FABRICK_REACT_SOURCE__ || "";
        if (!/function\\s+App\\s*\\(/.test(userCode) && !/const\\s+App\\s*=/.test(userCode)) {
          throw new Error("No encontré function App() ni const App = ... en el código React.");
        }

        userCode += "\\n;window.__FabrickPreviewApp = typeof App !== 'undefined' ? App : window.__FabrickPreviewApp;";

        const transformed = Babel.transform(userCode, {
          presets: [["env", { modules: false }], "react"],
          sourceType: "script",
        }).code;

        (0, eval)(transformed);

        const App = window.__FabrickPreviewApp;
        if (!App) throw new Error("El componente App no quedó disponible después de compilar.");

        ReactDOM.createRoot(rootNode).render(React.createElement(App));
      } catch (err) {
        console.error(err);
        showError("No se pudo renderizar el React Preview", err);
      }
    })();
  <\/script>
</body>
</html>`;
}
