// ============================
// AURUM INTERIORS — main.js
// ============================

// --- Loader ---
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1800);
});

// --- Custom Cursor (disabled) ---
// Cursor animation removed per user request.

// --- Navbar Scroll ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
});

// --- Hamburger / Mobile Menu ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}
if (mobileClose && mobileMenu && hamburger) {
  mobileClose.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu-overlay .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// --- Hero Slider ---
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');

function setSlide(index) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  currentSlide = index;
  if (slides[index]) slides[index].classList.add('active');
  if (dots[index]) dots[index].classList.add('active');
}

if (slides.length > 0) {
  setInterval(() => {
    const next = (currentSlide + 1) % slides.length;
    setSlide(next);
  }, 5000);
}

// --- Counter Animation ---
function animateCounter(el) {
  const target = +el.getAttribute('data-target');
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = Math.ceil(current);
  }, 16);
}

const counterEls = document.querySelectorAll('.counter');
let countersStarted = false;

function checkCounters() {
  if (countersStarted) return;
  counterEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      countersStarted = true;
      counterEls.forEach(animateCounter);
    }
  });
}
window.addEventListener('scroll', checkCounters);
checkCounters();

// --- AOS Init ---
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });
}

// --- Testimonial Swiper ---
if (typeof Swiper !== 'undefined') {
  const testimonialSwiper = new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: { delay: 4500, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 2 }
    }
  });
}

// --- Gallery Filter ---
const filterTabs = document.querySelectorAll('.filter-tab');
const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.getAttribute('data-filter');
    galleryItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = '';
        item.style.animation = 'fadeIn 0.4s ease';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// --- Lightbox ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    if (lightbox && lightboxImg) {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

if (lightboxClose && lightbox) {
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  });
}
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// --- Contact Form ---
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      if (formSuccess) {
        formSuccess.style.display = 'block';
        contactForm.reset();
      }
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }, 1800);
  });
}

// --- Parallax on scroll for banners ---
document.querySelectorAll('.pb-image, .cta-bg').forEach(el => {
  window.addEventListener('scroll', () => {
    const rect = el.closest('section, .project-banner, .cta-banner')?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.2;
      el.style.transform = `translateY(${offset}px)`;
    }
  });
});

// --- Set active nav link ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});
