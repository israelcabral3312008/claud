// =========================================================
// Interações do portfólio. Os seus dados ficam em js/config.js.
// =========================================================
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
root.classList.add('js');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const C = Object.assign({ nome: '', cidade: '', whatsapp: '', instagram: '', email: '', github: '' }, window.PORTFOLIO || {});
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } },
};

// 1. Preenche a página com os dados do config.js ----------------------
const clean = {
  whatsapp: String(C.whatsapp).replace(/\D/g, ''),
  instagram: String(C.instagram).replace(/^@/, '').trim(),
  email: String(C.email).trim(),
  github: String(C.github).trim(),
};
const urls = {
  whatsapp: clean.whatsapp && `https://wa.me/${clean.whatsapp}`,
  instagram: clean.instagram && `https://instagram.com/${clean.instagram}`,
  email: clean.email && `mailto:${clean.email}`,
  github: clean.github && `https://github.com/${clean.github}`,
  repo: clean.github && `https://github.com/${clean.github}/claud`,
};
const nome = C.nome.trim() || 'Seu nome';
const fill = {
  nome,
  primeiro: nome.split(' ')[0],
  iniciais: nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase(),
  cidade: C.cidade,
  arroba: clean.instagram ? `@${clean.instagram}` : '',
};
$$('[data-cfg]').forEach((el) => { if (fill[el.dataset.cfg] !== undefined) el.textContent = fill[el.dataset.cfg]; });
$$('[data-link]').forEach((el) => { const u = urls[el.dataset.link]; if (u) el.href = u; });
$$('[data-needs]').forEach((el) => { if (!clean[el.dataset.needs]) el.hidden = true; });
$$('[data-only-if-no]').forEach((el) => { if (clean[el.dataset.onlyIfNo]) el.hidden = true; });
document.title = `${nome} · Desenvolvedor Web`;
$('#ano').textContent = new Date().getFullYear();

// Aviso rápido
const toastEl = $('.toast');
let tt;
function toast(m) { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('show'), 2400); }

// 2. Tema claro/escuro --------------------------------------------------
const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
$('.theme').addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  root.dataset.theme = next; store.set('pf-theme', next);
});

// 3. Menu do celular ----------------------------------------------------
const burger = $('.burger');
const setMenu = (open) => { document.body.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', open); };
burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
$$('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// 4. Topo, barra de leitura e menu que segue a seção -------------------
const header = $('.header');
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const max = document.body.scrollHeight - innerHeight;
    root.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
    header.classList.toggle('scrolled', scrollY > 10);
    ticking = false;
  });
}, { passive: true });
if ('IntersectionObserver' in window) {
  const links = $$('#menu a');
  const spy = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) links.forEach((a) => a.classList.toggle('on', a.hash === `#${en.target.id}`));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => { const s = $(a.hash); if (s && !s.hidden) spy.observe(s); });
}

// 5. Texto digitando no título -----------------------------------------
const words = ['sites para comércios', 'landing pages', 'pedidos no WhatsApp', 'páginas responsivas'];
const typed = $('.typed');
if (!reduce) {
  let w = 0, i = words[0].length, del = true;
  setTimeout(function tick() {
    const word = words[w];
    i += del ? -1 : 1;
    typed.textContent = word.slice(0, i);
    let wait = del ? 40 : 80;
    if (!del && i === word.length) { del = true; wait = 1800; }
    else if (del && i === 0) { del = false; w = (w + 1) % words.length; wait = 300; }
    setTimeout(tick, wait);
  }, 2200);
}

// 6. Inclinação das telas com o mouse ----------------------------------
const tilt = $('[data-tilt]');
if (tilt && !reduce && matchMedia('(pointer:fine)').matches) {
  const art = tilt.parentElement;
  art.addEventListener('pointermove', (e) => {
    const r = art.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.setProperty('--ry', `${x * 10}deg`);
    tilt.style.setProperty('--rx', `${-y * 8}deg`);
  });
  art.addEventListener('pointerleave', () => { tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg'); });
}

// 7. Animação ao rolar e contadores ------------------------------------
function countUp(el) {
  const target = +el.dataset.count;
  if (reduce || !target) return;
  const t0 = performance.now();
  (function f(t) {
    const k = Math.min((t - t0) / 1100, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(f);
  })(t0);
}
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    $$('[data-count]', en.target).forEach(countUp);
    io.unobserve(en.target);
  }), { threshold: 0.12 });
  $$('.reveal, .hero-art').forEach((el) => io.observe(el));
} else { $$('.reveal').forEach((el) => el.classList.add('in')); }

// 8. Filtro de projetos -------------------------------------------------
$$('.tab').forEach((t) => t.addEventListener('click', () => {
  $$('.tab').forEach((o) => o.classList.toggle('on', o === t));
  const f = t.dataset.f;
  $$('[data-tipo]').forEach((p) => {
    p.classList.toggle('out', f !== 'todos' && p.dataset.tipo !== f);
    p.classList.add('in');
  });
  $('.featured').hidden = f === 'estudo';
}));

// 9. Janela de detalhes -------------------------------------------------
$$('[data-open]').forEach((b) => b.addEventListener('click', () => {
  const m = $(`#m-${b.dataset.open}`);
  m.showModal();
}));
$$('.modal').forEach((m) => {
  $('.m-close', m).addEventListener('click', () => m.close());
  m.addEventListener('click', (e) => { if (e.target === m) m.close(); });
});

// 10. Formulário de contato --------------------------------------------
const form = $('#form');
let via = 'copy';
$$('[data-via]', form).forEach((b) => b.addEventListener('click', () => { via = b.dataset.via; }));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const quem = (d.get('nome') || '').trim();
  const nomeInput = form.elements.nome;
  if (!quem) { nomeInput.classList.add('bad'); $('.err', form).hidden = false; nomeInput.focus(); return; }
  nomeInput.classList.remove('bad'); $('.err', form).hidden = true;
  const lines = [`Olá, ${fill.primeiro}! Vi seu portfólio.`, '', `Meu nome é ${quem}.`];
  if ((d.get('negocio') || '').trim()) lines.push(`Negócio: ${d.get('negocio').trim()}`);
  lines.push(`Preciso de: ${d.get('tipo')}`);
  if ((d.get('msg') || '').trim()) lines.push('', d.get('msg').trim());
  const text = lines.join('\n');
  if (via === 'whatsapp' && clean.whatsapp) {
    window.open(`https://wa.me/${clean.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  } else if (via === 'email' && clean.email) {
    location.href = `mailto:${clean.email}?subject=${encodeURIComponent('Orçamento de site')}&body=${encodeURIComponent(text)}`;
  } else {
    copy(text).then(() => toast('Mensagem copiada!'), () => toast('Não foi possível copiar'));
  }
});
function copy(text) {
  const legacy = () => new Promise((ok, fail) => {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    ta.style.cssText = 'position:fixed;opacity:0'; document.body.append(ta); ta.select();
    try { document.execCommand('copy') ? ok() : fail(); } catch (err) { fail(err); }
    ta.remove();
  });
  return navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(text).catch(legacy) : legacy();
}
