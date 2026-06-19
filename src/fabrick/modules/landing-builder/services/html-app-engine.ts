function stripCodeFence(value: string) {
  const raw = String(value || "").trim();

  return raw
    .replace(/^```(?:html|javascript|js)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

const HTML_APP_RUNTIME = `<script>
(function FabrickHtmlAppRuntime(){
  const state = { history: [] };

  function notify(message, type) {
    const existing = document.querySelector('[data-fabrick-toast]');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.setAttribute('data-fabrick-toast', 'true');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;padding:14px 16px;border-radius:18px;font:700 13px system-ui;background:' + (type === 'error' ? '#7f1d1d' : '#0f172a') + ';color:#fff;border:1px solid rgba(255,255,255,.18);box-shadow:0 20px 80px rgba(0,0,0,.35);';
    document.body.appendChild(toast);
    setTimeout(function(){ toast.remove(); }, 3600);
  }

  function getScreenName() {
    return (location.hash || '').replace('#', '') || document.querySelector('[data-screen]')?.getAttribute('data-screen') || 'inicio';
  }

  function goTo(target) {
    if (!target) return;
    const screens = Array.from(document.querySelectorAll('[data-screen]'));

    if (screens.length) {
      screens.forEach(function(screen){
        const isActive = screen.getAttribute('data-screen') === target;
        screen.hidden = !isActive;
        screen.classList.toggle('is-active', isActive);
      });
      state.history.push(target);
      location.hash = target;
      return;
    }

    const element = document.getElementById(target);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openModal(target) {
    const modal = document.getElementById(target);
    if (!modal) return notify('No encontré el modal ' + target, 'error');

    if (typeof modal.showModal === 'function') modal.showModal();
    modal.hidden = false;
    modal.classList.add('is-open');
  }

  function closeModal(target) {
    const modal = target ? document.getElementById(target) : document.querySelector('dialog[open], .is-open');
    if (!modal) return;

    if (typeof modal.close === 'function') modal.close();
    modal.hidden = true;
    modal.classList.remove('is-open');
  }

  function toggleTarget(target) {
    const element = document.getElementById(target);
    if (!element) return;
    element.hidden = !element.hidden;
    element.classList.toggle('is-open', !element.hidden);
  }

  function copyValue(button) {
    const target = button.getAttribute('data-target');
    const directText = button.getAttribute('data-text');
    const source = target ? document.getElementById(target) : null;
    const text = directText || source?.value || source?.textContent || '';

    navigator.clipboard?.writeText(text).then(function(){
      notify('Copiado al portapapeles');
    }).catch(function(){
      notify('No pude copiar en este navegador', 'error');
    });
  }

  function sendWhatsapp(button, form) {
    const phone = button.getAttribute('data-phone') || form?.getAttribute('data-phone') || '56900000000';
    let message = button.getAttribute('data-message') || form?.getAttribute('data-message') || 'Hola, quiero cotizar.';

    if (form) {
      const data = new FormData(form);
      data.forEach(function(value, key){
        message = message.replaceAll('{{' + key + '}}', String(value));
      });
    }

    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(message), '_blank');
  }

  function calculate(scope) {
    const root = scope || document;
    const calcTarget = root.querySelector('[data-calc-result]');
    if (!calcTarget) return;

    const fields = Array.from(root.querySelectorAll('[data-calc-field]'));
    const values = {};
    fields.forEach(function(field){
      const key = field.getAttribute('data-calc-field');
      const raw = field.value || field.getAttribute('data-value') || '0';
      values[key] = Number(String(raw).replace(/[^0-9.-]/g, '')) || 0;
    });

    const formula = calcTarget.getAttribute('data-formula') || '';
    const safeFormula = formula.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, function(name){ return String(values[name] ?? 0); });

    try {
      if (!/^[0-9+\-*/().\s]+$/.test(safeFormula)) throw new Error('Fórmula no permitida');
      const result = Function('return (' + safeFormula + ')')();
      const prefix = calcTarget.getAttribute('data-prefix') || '';
      const suffix = calcTarget.getAttribute('data-suffix') || '';
      calcTarget.textContent = prefix + Math.round(Number(result || 0)).toLocaleString('es-CL') + suffix;
    } catch {
      calcTarget.textContent = 'Error de cálculo';
    }
  }

  function fetchJson(element) {
    const url = element.getAttribute('data-fetch-json');
    if (!url || !/^https:\/\//i.test(url)) {
      element.textContent = 'API bloqueada: usa una URL https pública.';
      return;
    }

    element.textContent = 'Cargando datos...';
    fetch(url)
      .then(function(response){ return response.json(); })
      .then(function(data){
        element.textContent = JSON.stringify(data, null, 2).slice(0, 1200);
      })
      .catch(function(err){
        element.textContent = 'No se pudo cargar la API: ' + (err.message || err);
      });
  }

  document.addEventListener('click', function(event){
    const button = event.target.closest('[data-action]');
    if (!button) return;

    const action = button.getAttribute('data-action');
    const target = button.getAttribute('data-target');

    if (action === 'go') goTo(target);
    if (action === 'back') goTo(state.history[state.history.length - 2] || getScreenName());
    if (action === 'modal') openModal(target);
    if (action === 'close-modal') closeModal(target);
    if (action === 'toggle') toggleTarget(target);
    if (action === 'copy') copyValue(button);
    if (action === 'whatsapp') sendWhatsapp(button, button.closest('form'));
    if (action === 'notify') notify(button.getAttribute('data-message') || 'Acción ejecutada');
  });

  document.addEventListener('input', function(event){
    if (event.target.matches('[data-calc-field]')) calculate(event.target.closest('[data-calc]') || document);
  });

  document.addEventListener('submit', function(event){
    const form = event.target.closest('form[data-action]');
    if (!form) return;

    const action = form.getAttribute('data-action');
    if (action === 'lead') {
      event.preventDefault();
      notify(form.getAttribute('data-success') || 'Formulario recibido.');
    }

    if (action === 'whatsapp') {
      event.preventDefault();
      sendWhatsapp(form, form);
    }
  });

  window.addEventListener('hashchange', function(){ goTo(getScreenName()); });
  document.querySelectorAll('[data-calc]').forEach(calculate);
  document.querySelectorAll('[data-fetch-json]').forEach(fetchJson);
  goTo(getScreenName());
})();
<\/script>`;

function wrapHtmlAppFragment(fragment: string) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>HTML App Preview</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
</head>
<body>
${fragment}
${HTML_APP_RUNTIME}
</body>
</html>`;
}

export function buildHtmlAppDocument(source: string) {
  const html = stripCodeFence(source);

  if (!html) {
    return wrapHtmlAppFragment('<main style="font-family:system-ui;padding:24px"><h1>HTML App vacío</h1><p>Sube un archivo o pega una plantilla HTML App.</p></main>');
  }

  if (/<html[\s>]/i.test(html)) {
    if (html.includes('FabrickHtmlAppRuntime')) return html;
    if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${HTML_APP_RUNTIME}\n</body>`);
    return `${html}\n${HTML_APP_RUNTIME}`;
  }

  return wrapHtmlAppFragment(html);
}
