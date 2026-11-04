// Interações das landing pages: animação ao rolar, brilho que segue o mouse
// nos cards e filtro por categoria no catálogo.
document.documentElement.classList.add('js');

// 1. Revela os elementos quando entram na tela
const items = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('in'));
}

// 2. Brilho que acompanha o mouse nos cards de serviço
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('pointermove', (ev) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${ev.clientX - r.left}px`);
    card.style.setProperty('--my', `${ev.clientY - r.top}px`);
  });
});

// 3. Filtro por categoria (só existe no index.html)
const filters = document.querySelectorAll('.filter');
filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    filters.forEach((b) => b.classList.toggle('on', b === btn));
    const f = btn.dataset.f;
    document.querySelectorAll('.loja').forEach((card) => {
      card.hidden = f !== 'Todos' && card.dataset.cat !== f;
      if (!card.hidden) card.classList.add('in');
    });
  });
});
