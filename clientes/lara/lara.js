// Página da Lara: lê config.js e monta a página.
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const L = Object.assign({ previas: [], beneficios: [] }, window.LARA || {});
let tt;
const toast = (m) => { const t = $('.toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 3000); };

// 1. Verificação de idade (vale enquanto a aba estiver aberta)
const ss = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
const gate = $('#gate');
const openPage = () => { gate.hidden = true; document.body.classList.remove('locked'); };
if (ss.get('lara-18') === 'ok') openPage();
else $('#gate-ok').focus();
$('#gate-ok').addEventListener('click', () => { ss.set('lara-18', 'ok'); openPage(); });

// 2. Textos, fotos e itens que dependem do config
$$('[data-cfg]').forEach((el) => { if (L[el.dataset.cfg]) el.textContent = L[el.dataset.cfg]; });
$$('[data-needs]').forEach((el) => { if (!L[el.dataset.needs]) el.hidden = true; });
$$('[data-src]').forEach((img) => { if (L[img.dataset.src]) img.src = L[img.dataset.src]; else img.remove(); });
if (!L.numeroFotos && !L.numeroVideos) $('.stats').hidden = true;
document.title = `${L.nome || 'Lara'} · Conteúdo exclusivo`;
$('#ano').textContent = new Date().getFullYear();

// Links para o OnlyFans
$$('[data-of]').forEach((a) => {
  if (L.linkOnlyfans) { a.href = L.linkOnlyfans; a.target = '_blank'; a.rel = 'noopener'; }
  else a.addEventListener('click', (e) => { e.preventDefault(); toast('Falta colocar o link do OnlyFans no config.js'); });
});

// Prévia borrada com cadeado
const grid = $('#previas');
const fotos = L.previas.length ? L.previas : Array(6).fill('');
fotos.slice(0, 6).forEach((src) => {
  const a = document.createElement('a');
  a.className = 'tile reveal';
  a.href = L.linkOnlyfans || '#';
  if (L.linkOnlyfans) { a.target = '_blank'; a.rel = 'noopener'; }
  else a.addEventListener('click', (e) => e.preventDefault());
  a.setAttribute('aria-label', 'Conteúdo bloqueado: desbloquear no OnlyFans');
  if (src) { const img = new Image(); img.src = src; img.alt = ''; img.loading = 'lazy'; img.onerror = () => img.remove(); a.append(img); }
  a.insertAdjacentHTML('beforeend', '<span class="lock"><span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span>EXCLUSIVO</span>');
  grid.append(a);
});

// Benefícios
const perks = $('#perks');
L.beneficios.forEach((b) => { const li = document.createElement('li'); li.className = 'reveal'; li.textContent = b; perks.append(li); });

// Redes
const nets = { instagram: (u) => `https://instagram.com/${u}`, tiktok: (u) => `https://tiktok.com/@${u}`, twitter: (u) => `https://x.com/${u}` };
let anyNet = false;
$$('[data-net]').forEach((a) => {
  const u = String(L[a.dataset.net] || '').replace(/^@/, '');
  if (u) { a.href = nets[a.dataset.net](u); anyNet = true; } else a.hidden = true;
});
if (!anyNet) $('#redes').hidden = true;

// 3. Contagem até o fim REAL da promoção
if (L.promoAte) {
  const end = new Date(`${L.promoAte}T23:59:59`);
  const cd = $('#cd');
  const pad = (n) => String(n).padStart(2, '0');
  (function tick() {
    const ms = end - Date.now();
    if (isNaN(end) || ms <= 0) { $('.cd').hidden = true; $$('[data-needs="promo"]').forEach((el) => { el.hidden = true; }); return; }
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    cd.textContent = `${d > 0 ? d + 'd ' : ''}${pad(h)}:${pad(m)}:${pad(s)}`;
    setTimeout(tick, 1000);
  })();
}

// 4. Barra fixa e animações
const sticky = $('.sticky');
addEventListener('scroll', () => sticky.classList.toggle('show', scrollY > innerHeight * 0.7), { passive: true });
$$('.sec > h2, .sec .kicker, .offer, .about > div').forEach((el) => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.1 });
  $$('.reveal').forEach((el) => io.observe(el));
} else $$('.reveal').forEach((el) => el.classList.add('in'));
