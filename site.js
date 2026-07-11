/* ===== Ideal Kitchens — shared site behaviour (all pages) ===== */

// ----- NAV scroll state -----
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));
}

// ----- Burger / mobile menu -----
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.mm-link').forEach(link => link.addEventListener('click', () => {
    menuOpen = false; mobileMenu.classList.remove('open'); document.body.style.overflow = '';
  }));
}

// ----- Scroll reveal -----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 80 * (entry.target.dataset.delay || 0));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ----- Order modal -----
function openOrder(serviceName) {
  const box = document.getElementById('orderModal');
  if (!box) { window.location.href = 'contact.html#order'; return; }
  const label = document.getElementById('modalService');
  if (label) label.textContent = serviceName;
  box.classList.add('open');
  const ov = document.getElementById('modalOverlay');
  if (ov) ov.classList.add('open');
  document.body.style.overflow = 'hidden';
  const sel = document.getElementById('service');
  if (sel) for (let opt of sel.options) if (opt.value === serviceName) { opt.selected = true; break; }
}
function closeModal() {
  const box = document.getElementById('orderModal');
  if (box) box.classList.remove('open');
  const ov = document.getElementById('modalOverlay');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function submitModal(e) {
  e.preventDefault();
  const name = document.getElementById('mName').value;
  const phone = document.getElementById('mPhone').value;
  const service = document.getElementById('modalService').textContent;
  const desc = document.getElementById('mDesc').value;
  const msg = encodeURIComponent(`Hi Ideal Kitchens! I'd like a quote.\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDetails: ${desc}`);
  closeModal();
  window.location.href = `mailto:simunza@ideal-kitchenzm.com?subject=Quote Request: ${service}&body=${msg}`;
}

// ----- Smooth scroll for any same-page anchors -----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ----- Data-driven content (services + gallery) -----
async function loadJSON(path) {
  try {
    const r = await fetch(path + '?v=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (e) { console.warn('Could not load ' + path, e); return null; }
}
function revealNew(grid) {
  Array.from(grid.children).forEach((child, i) => {
    child.dataset.delay = i;
    if (child.classList.contains('reveal')) revealObserver.observe(child);
  });
}
async function renderServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  const data = await loadJSON('data/services.json');
  if (!Array.isArray(data)) return;
  grid.innerHTML = '';
  data.forEach((s) => {
    const card = document.createElement('div'); card.className = 'service-card reveal';
    const wrap = document.createElement('div'); wrap.className = 'service-card__img';
    if (s.image) { const img = document.createElement('img'); img.src = s.image; img.alt = s.title || ''; img.loading = 'lazy'; wrap.appendChild(img); }
    card.appendChild(wrap);
    const body = document.createElement('div'); body.className = 'service-card__body';
    const h3 = document.createElement('h3'); h3.className = 'service-card__title'; h3.textContent = s.title || ''; body.appendChild(h3);
    const p = document.createElement('p'); p.className = 'service-card__text'; p.textContent = s.desc || ''; body.appendChild(p);
    if (Array.isArray(s.tags) && s.tags.length) {
      const tg = document.createElement('div'); tg.className = 'service-card__tags';
      s.tags.forEach(t => { const sp = document.createElement('span'); sp.textContent = t; tg.appendChild(sp); });
      body.appendChild(tg);
    }
    const btn = document.createElement('button'); btn.className = 'service-card__btn'; btn.innerHTML = 'Order This &rarr;';
    btn.addEventListener('click', () => openOrder(s.order || s.title || ''));
    body.appendChild(btn);
    card.appendChild(body);
    grid.appendChild(card);
  });
  revealNew(grid);
}
async function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const data = await loadJSON('data/gallery.json');
  if (!Array.isArray(data)) return;
  grid.innerHTML = '';
  data.forEach(g => {
    const item = document.createElement('div');
    item.className = 'gallery__item reveal' + (g.large ? ' gallery__item--large' : '');
    if (g.image) { const img = document.createElement('img'); img.src = g.image; img.alt = g.title || ''; img.loading = 'lazy'; item.appendChild(img); }
    const label = document.createElement('div'); label.className = 'gallery__label';
    const lh = document.createElement('h4'); lh.textContent = g.title || ''; const lp = document.createElement('p'); lp.textContent = g.caption || '';
    label.appendChild(lh); label.appendChild(lp); item.appendChild(label);
    const ov = document.createElement('div'); ov.className = 'gallery__overlay';
    const oh = document.createElement('h4'); oh.textContent = g.title || ''; const op = document.createElement('p'); op.textContent = 'Click to request a quote';
    ov.appendChild(oh); ov.appendChild(op); item.appendChild(ov);
    item.addEventListener('click', () => openOrder(g.order || g.title || ''));
    grid.appendChild(item);
  });
  revealNew(grid);
}
renderServices();
renderGallery();
