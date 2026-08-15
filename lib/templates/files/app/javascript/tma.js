// Telegram Mini App bootstrap.
// 1. Apply TG themeParams to CSS variables.
// 2. POST initData to /api/v1/tma/auth (server verifies HMAC, sets JWT cookie).
// 3. Render minimal greeting. Replace this with your app code.

(function () {
  const root = document.getElementById('tma-root');
  const tg = window.Telegram && window.Telegram.WebApp;

  function fail(msg) {
    root.innerHTML = '<div class="tma-error"><p>' + msg + '</p></div>';
  }

  if (!tg) {
    fail('window.Telegram.WebApp not found — открой эту страницу из Telegram (через Menu Button или t.me).');
    return;
  }

  // 1. Theme bridge
  document.documentElement.setAttribute('data-tg-theme', '');
  const tp = tg.themeParams || {};
  const set = (k, v) => v && document.documentElement.style.setProperty(k, v);
  set('--tg-bg', tp.bg_color);
  set('--tg-surface', tp.secondary_bg_color);
  set('--tg-text', tp.text_color);
  set('--tg-hint', tp.hint_color);
  set('--tg-link', tp.link_color);
  set('--tg-button', tp.button_color);
  set('--tg-button-text', tp.button_text_color);

  tg.ready();
  tg.expand();

  // 2. Auth
  const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
  fetch('/api/v1/tma/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
    credentials: 'same-origin',
    body: JSON.stringify({ init_data: tg.initData || '' })
  })
    .then((r) => r.json().then((b) => ({ ok: r.ok, body: b })))
    .then(({ ok, body }) => {
      if (!ok) return fail('Не удалось авторизоваться: ' + (body.error || 'unknown'));
      const name = body.first_name || body.username || ('tg#' + body.telegram_id);
      root.innerHTML =
        '<div class="tma-card"><h1>Привет, ' + escapeHtml(name) + '!</h1>' +
        '<p>Это шаблон Telegram Mini App. Замени содержимое <code>app/views/tma/index.html.erb</code> и <code>app/javascript/tma.js</code>.</p></div>';
    })
    .catch((e) => fail('Сеть: ' + e.message));

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
})();
