// =========================================================
// Interações das landing pages (v3)
//  1. Tema claro/escuro       6. Montador de pedido/agendamento
//  2. Menu do celular         7. Galeria em tela cheia
//  3. Topo e barra de leitura 8. Perguntas frequentes
//  4. Animação ao rolar       9. Catálogo: busca, filtro, ordem e visualização
//  5. Contadores animados
// =========================================================
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
root.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } },
};

// Aviso rápido na parte de baixo da tela
const toastEl = $('.toast');
let toastTimer;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}

// 1. Tema ------------------------------------------------------------
const isDark = () => root.dataset.theme
  ? root.dataset.theme === 'dark'
  : matchMedia('(prefers-color-scheme: dark)').matches;
$$('.theme').forEach((btn) => btn.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  root.dataset.theme = next;
  store.set('ac-theme', next);
  toast(next === 'dark' ? 'Modo escuro ativado' : 'Modo claro ativado');
}));

// 2. Menu do celular -------------------------------------------------
const burger = $('.burger');
if (burger) {
  const toggle = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.addEventListener('click', () => toggle(!document.body.classList.contains('menu-open')));
  $$('#menu a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', (ev) => { if (ev.key === 'Escape') toggle(false); });
}

// 3. Topo, barra de leitura, parallax e botão flutuante --------------
const header = $('.header');
const heroBg = $('.hero-bg');
const fab = $('.fab');
let ticking = false;
function onScroll() {
  const y = scrollY;
  const max = document.body.scrollHeight - innerHeight;
  root.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
  header && header.classList.toggle('scrolled', y > 10);
  if (heroBg && !reduce && y < innerHeight) heroBg.style.setProperty('--py', `${y * 0.3}px`);
  fab && fab.classList.toggle('show', y > innerHeight * 0.6);
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
onScroll();

// Destaca no menu a seção que está na tela
const links = $$('#menu a');
if (links.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.hash === `#${en.target.id}`));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => { const s = $(a.hash); if (s) spy.observe(s); });
}

// 4 e 5. Animação ao rolar e contadores ------------------------------
function countUp(el) {
  const raw = el.dataset.count;                 // ex.: "4,4" ou "3.579"
  const decimals = raw.includes(',') ? raw.split(',')[1].length : 0;
  const target = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
  if (reduce || !target) return;
  const fmt = (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const t0 = performance.now();
  const dur = 1200;
  (function frame(t) {
    const k = Math.min((t - t0) / dur, 1);
    el.textContent = fmt(target * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(frame); else el.textContent = raw;
  })(t0);
}
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    $$('[data-count]', en.target).forEach(countUp);
    io.unobserve(en.target);
  }), { threshold: 0.12 });
  $$('.reveal').forEach((el) => io.observe(el));
} else {
  $$('.reveal').forEach((el) => el.classList.add('in'));
}

// 6. Montador de pedido / agendamento --------------------------------
const builder = $('[data-builder]');
if (builder) {
  const cfg = JSON.parse($('#cfg').textContent);
  const preview = $('[data-preview]', builder);
  const bubble = preview.parentElement;
  const date = $('input[name="data"]', builder);
  if (date) date.min = new Date().toISOString().slice(0, 10);

  const fmtDate = (v) => (v ? v.split('-').reverse().join('/') : '');
  const val = (n) => ($(`[name="${n}"]`, builder) || {}).value || '';
  const checked = (n) => ($(`[name="${n}"]:checked`, builder) || {}).value || '';

  function message() {
    const lines = [`Olá, ${cfg.nome}! Vim pela página de vocês.`];
    if (cfg.modo === 'pedido') {
      const items = $$('.item', builder)
        .map((it) => [it.dataset.item, +$('output', it).value])
        .filter(([, q]) => q > 0);
      if (items.length) {
        lines.push('', 'Gostaria de fazer um pedido:');
        items.forEach(([n, q]) => lines.push(`• ${q}x ${n}`));
      } else {
        lines.push('', 'Gostaria de fazer um pedido. (escolha os itens ao lado)');
      }
      if (val('data')) lines.push('', `Para: ${fmtDate(val('data'))}`);
    } else {
      lines.push('', `Gostaria de agendar: ${checked('servico')}`);
      const d = fmtDate(val('data'));
      lines.push(`Quando: ${d ? `${d}, ` : ''}${checked('periodo').toLowerCase()}`);
      const extra = $('[name="extra"]', builder);
      if (extra && extra.value.trim()) lines.push(`${extra.dataset.label}: ${extra.value.trim()}`);
    }
    if (val('cliente').trim()) lines.push(`Nome: ${val('cliente').trim()}`);
    if (val('obs').trim()) lines.push(`Obs.: ${val('obs').trim()}`);
    return lines.join('\n');
  }
  function render() {
    preview.textContent = message();
    bubble.classList.remove('bump'); void bubble.offsetWidth; bubble.classList.add('bump');
  }

  builder.addEventListener('click', (ev) => {
    const step = ev.target.closest('.step');
    if (step) {
      const item = step.closest('.item');
      const out = $('output', item);
      const q = Math.max(0, Math.min(99, +out.value + +step.dataset.step));
      out.value = q;
      item.classList.toggle('has', q > 0);
      render();
    }
    const send = ev.target.closest('[data-send]');
    if (!send) return;
    const msg = message();
    if (send.dataset.send === 'zap') {
      window.open(`https://wa.me/${cfg.zap}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    } else {
      copy(msg).then(() => toast('Mensagem copiada!'), () => toast('Não foi possível copiar'));
    }
  });
  builder.addEventListener('input', render);
  builder.addEventListener('change', render);
  render();
}
function copy(text) {
  // Tenta a API moderna; se o navegador bloquear, usa o método antigo.
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).catch(() => copyLegacy(text));
  }
  return copyLegacy(text);
}
function copyLegacy(text) {
  return new Promise((ok, fail) => {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.append(ta); ta.select();
    try { document.execCommand('copy') ? ok() : fail(); } catch (e) { fail(e); }
    ta.remove();
  });
}

// 7. Galeria em tela cheia -------------------------------------------
const lb = $('.lightbox');
const shots = $$('.g-item');
if (lb && shots.length) {
  const img = $('img', lb);
  let cur = 0;
  let lastFocus;
  const show = (i) => {
    cur = (i + shots.length) % shots.length;
    img.src = shots[cur].dataset.full;
    img.alt = `Foto ${cur + 1} de ${shots.length}`;
  };
  const open = (i) => { lastFocus = document.activeElement; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus(); };
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };
  img.addEventListener('error', () => toast('Foto indisponível sem internet'));
  shots.forEach((s, i) => s.addEventListener('click', () => open(i)));
  $('.lb-close', lb).addEventListener('click', close);
  $('.lb-prev', lb).addEventListener('click', () => show(cur - 1));
  $('.lb-next', lb).addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', (ev) => { if (ev.target === lb) close(); });
  addEventListener('keydown', (ev) => {
    if (lb.hidden) return;
    if (ev.key === 'Escape') close();
    if (ev.key === 'ArrowLeft') show(cur - 1);
    if (ev.key === 'ArrowRight') show(cur + 1);
  });
  let x0 = null;   // arrastar para os lados no celular
  lb.addEventListener('touchstart', (ev) => { x0 = ev.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (ev) => {
    if (x0 === null) return;
    const dx = ev.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

// 8. Perguntas frequentes: abre uma de cada vez ----------------------
$$('.faq').forEach((d) => d.addEventListener('toggle', () => {
  if (d.open) $$('.faq').forEach((o) => { if (o !== d) o.open = false; });
}));

// 9. Catálogo ----------------------------------------------------------
const grid = $('#cards');
if (grid) {
  const cards = $$('.card', grid);
  const q = $('#q');
  const sort = $('#sort');
  const empty = $('.empty');
  const count = $('#count');
  let cat = 'Todos';
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function apply() {
    const term = norm(q.value.trim());
    const order = {
      top: (a, b) => a.dataset.i - b.dataset.i,
      nota: (a, b) => b.dataset.nota - a.dataset.nota || b.dataset.aval - a.dataset.aval,
      aval: (a, b) => b.dataset.aval - a.dataset.aval,
      nome: (a, b) => a.dataset.nome.localeCompare(b.dataset.nome, 'pt-BR'),
    }[sort.value];
    let n = 0;
    cards.sort(order).forEach((c) => {
      const ok = (cat === 'Todos' || c.dataset.cat === cat) && (!term || norm(c.dataset.q).includes(term));
      c.hidden = !ok;
      if (ok) { n += 1; c.classList.add('in'); }
      grid.append(c);
    });
    count.textContent = n;
    empty.hidden = n > 0;
  }
  $$('.fchip').forEach((b) => b.addEventListener('click', () => {
    $$('.fchip').forEach((o) => o.classList.toggle('on', o === b));
    cat = b.dataset.f;
    apply();
  }));
  q.addEventListener('input', apply);
  $('.bigsearch').addEventListener('submit', () => $('#lojas').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }));
  sort.addEventListener('change', apply);
  $('#clear').addEventListener('click', () => { q.value = ''; cat = 'Todos'; $$('.fchip').forEach((o) => o.classList.toggle('on', o.dataset.f === 'Todos')); apply(); });

  const views = $$('[data-view]');
  const setView = (v) => {
    grid.classList.toggle('list', v === 'list');
    views.forEach((b) => b.classList.toggle('on', b.dataset.view === v));
    store.set('ac-view', v);
  };
  views.forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
  setView(store.get('ac-view') || 'grid');
}
