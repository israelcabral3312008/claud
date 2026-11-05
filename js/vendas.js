// Página de vendas: lê js/config.js e monta CTA, VSL, contagem e formulário.
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
document.documentElement.classList.add('js');
const O = Object.assign({ bonus: [] }, window.OFERTA || {});
const zap = String(O.whatsapp || '').replace(/\D/g, '');
const insta = String(O.instagram || '').replace(/^@/, '').trim();

// Aviso rápido
const toastEl = $('.toast');
let tt;
function toast(m) { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('show'), 3200); }

// 1. Preenche textos e esconde o que não foi configurado
$$('[data-cfg]').forEach((el) => { const v = O[el.dataset.cfg]; if (v) el.textContent = v; });
$$('[data-needs]').forEach((el) => {
  const v = O[el.dataset.needs];
  if (!v || (Array.isArray(v) && !v.length)) el.hidden = true;
});
const links = { whatsapp: zap && `https://wa.me/${zap}`, instagram: insta && `https://instagram.com/${insta}` };
$$('[data-link]').forEach((el) => { const u = links[el.dataset.link]; if (u) el.href = u; else el.hidden = true; });
const bl = $('#bonus-list');
(O.bonus || []).forEach((b) => { const li = document.createElement('li'); li.textContent = b; bl.append(li); });
if (O.marca) document.title = `${O.marca} · Mais clientes para o seu comércio`;

// 2. Vídeo de vendas (VSL)
function youtubeId(url) {
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : '';
}
$('.vsl-cover').addEventListener('click', () => {
  const id = youtubeId(O.video);
  if (!id) { toast('O vídeo está chegando! Enquanto isso, veja a oferta abaixo.'); $('#oferta').scrollIntoView({ behavior: 'smooth' }); return; }
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
  f.title = 'Vídeo de apresentação';
  f.allow = 'autoplay; encrypted-media; picture-in-picture';
  f.allowFullscreen = true;
  $('#vsl').replaceChildren(f);
});

// 3. Contagem regressiva até a data real do fim da oferta
const end = O.fimDaOferta ? new Date(`${O.fimDaOferta}T23:59:59`) : null;
const pad = (n) => String(n).padStart(2, '0');
function tick() {
  if (!end || isNaN(end)) return;
  const ms = end - Date.now();
  if (ms <= 0) {
    $$('[data-needs="fimDaOferta"]').forEach((el) => { el.hidden = true; });
    $('.ended').hidden = false;
    return;
  }
  const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
  $('[data-cd="d"]').textContent = pad(d); $('[data-cd="h"]').textContent = pad(h);
  $('[data-cd="m"]').textContent = pad(m); $('[data-cd="s"]').textContent = pad(s);
  $('.cd-inline').textContent = d > 0 ? `${d}d ${pad(h)}h ${pad(m)}m` : `${pad(h)}:${pad(m)}:${pad(s)}`;
  setTimeout(tick, 1000);
}
tick();

// 4. Formulário -> mensagem pronta no WhatsApp
const form = $('#form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = form.elements.nome, neg = form.elements.negocio;
  const ok = nome.value.trim() && neg.value.trim();
  nome.classList.toggle('bad', !nome.value.trim());
  neg.classList.toggle('bad', !neg.value.trim());
  $('.err', form).hidden = !!ok;
  if (!ok) { (nome.value.trim() ? neg : nome).focus(); return; }
  const ramo = form.elements.ramo.value;
  const msg = [
    `Olá${O.nome ? ', ' + O.nome.split(' ')[0] : ''}! Vi a oferta Black November de site.`,
    '',
    `Meu nome é ${nome.value.trim()} e tenho o comércio ${neg.value.trim()} (${ramo}).`,
    'Quero garantir minha vaga!',
  ].join('\n');
  if (zap) window.open(`https://wa.me/${zap}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  else toast('Falta configurar o número de WhatsApp em js/config.js');
});

// 5. Barra fixa do celular aparece depois do vídeo
const mcta = $('.mcta');
addEventListener('scroll', () => mcta.classList.toggle('show', scrollY > innerHeight * 0.9), { passive: true });

// 6. Animação ao rolar
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  $$('.reveal').forEach((el) => io.observe(el));
} else { $$('.reveal').forEach((el) => el.classList.add('in')); }
