// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80 * (entry.target.dataset.delay || 0));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Stagger children in grids
document.querySelectorAll('.services__grid, .gallery__grid, .materials__grid, .footer__top').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.dataset.delay = i;
  });
});

reveals.forEach(el => observer.observe(el));

// ===== ORDER MODAL =====
function openOrder(serviceName) {
  document.getElementById('modalService').textContent = serviceName;
  document.getElementById('orderModal').classList.add('open');
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  // Pre-fill main form
  const serviceSelect = document.getElementById('service');
  if (serviceSelect) {
    for (let opt of serviceSelect.options) {
      if (opt.value === serviceName) { opt.selected = true; break; }
    }
  }
}

function closeModal() {
  document.getElementById('orderModal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Close on escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== MODAL SUBMIT =====
function submitModal(e) {
  e.preventDefault();
  const name = document.getElementById('mName').value;
  const phone = document.getElementById('mPhone').value;
  const service = document.getElementById('modalService').textContent;
  const desc = document.getElementById('mDesc').value;

  // Build WhatsApp / email message
  const msg = encodeURIComponent(
    `Hi Ideal Kitchens! I'd like a quote.\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDetails: ${desc}`
  );

  closeModal();
  // Open email client (fallback since no backend)
  window.location.href = `mailto:simunza@ideal-kitchenzm.com?subject=Quote Request: ${service}&body=${msg}`;
}

// ===== MAIN FORM SUBMIT =====
function submitOrder(e) {
  e.preventDefault();

  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const service = document.getElementById('service').value;
  const ptype = document.getElementById('ptype').value;
  const timeline = document.getElementById('timeline').value;
  const location = document.getElementById('location').value;
  const finish = document.querySelector('input[name=finish]:checked')?.value || 'Not specified';
  const details = document.getElementById('details').value;

  const body = encodeURIComponent(
`QUOTE REQUEST — Ideal Kitchens Website

Name: ${fname} ${lname}
Phone: ${phone}
Email: ${email || 'Not provided'}
Service: ${service}
Property Type: ${ptype}
Timeline: ${timeline || 'Not specified'}
Location: ${location}
Preferred Finish: ${finish}

Project Details:
${details || 'No additional details provided.'}

---
This request was submitted via the Ideal Kitchens website.`
  );

  const subject = encodeURIComponent(`Quote Request: ${service} — ${fname} ${lname}`);

  // Open email
  window.location.href = `mailto:simunza@ideal-kitchenzm.com?subject=${subject}&body=${body}`;

  // Show success
  setTimeout(() => {
    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('orderSuccess').style.display = 'block';
  }, 500);
}

// ===== RESET FORM =====
function resetForm() {
  document.getElementById('quoteForm').reset();
  document.getElementById('orderForm').style.display = 'block';
  document.getElementById('orderSuccess').style.display = 'none';
}

// ===== SMOOTH SCROLL NAV =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== GALLERY ITEM CLICK (lightbox placeholder) =====
document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    const title = item.querySelector('h4')?.textContent;
    const desc = item.querySelector('p')?.textContent;
    if (title) {
      const service = title.replace(/kitchen|wardrobe|vanity|counter|gate|door|fitout/gi, '').trim();
      openOrder(title);
    }
  });
});

console.log('Ideal Kitchens — Website loaded successfully 🏠');
