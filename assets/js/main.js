/* ============================================================
   JR INTERIOR DESIGN — Main JavaScript
   Version: 2.0 | Lenis + GSAP + AOS + Swiper
   ============================================================ */

'use strict';

/* ============================================================
   1. LENIS SMOOTH SCROLL
   ============================================================ */
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Update ScrollTrigger on Lenis scroll
  lenis.on('scroll', ScrollTrigger.update);

  // Use GSAP ticker to drive Lenis raf
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Disable GSAP lag smoothing to keep scrolling in sync
  gsap.ticker.lagSmoothing(0);

  window._lenis = lenis;
}


/* ============================================================
   2. PRELOADER
   ============================================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      initHeroAnimations();
    }, 1000);
  });
}

/* ============================================================
   3. NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar-jrind');
  if (!navbar) return;

  const scrollThreshold = 80;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-link, .btn-nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   4. HERO ANIMATIONS (GSAP)
   ============================================================ */
function initHeroAnimations() {
  const heroLabel   = document.querySelector('.hero-label');
  const heroTitle   = document.querySelector('.hero-title');
  const heroSub     = document.querySelector('.hero-subtitle');
  const heroActions = document.querySelector('.hero-actions');
  const heroBg      = document.querySelector('.hero-bg');

  if (!heroTitle) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (heroLabel)   tl.to(heroLabel,   { opacity: 1, y: 0, duration: 0.8 }, 0.2);
  if (heroTitle)   tl.to(heroTitle,   { opacity: 1, y: 0, duration: 1 },   0.4);
  if (heroSub)     tl.to(heroSub,     { opacity: 1, y: 0, duration: 0.8 }, 0.6);
  if (heroActions) tl.to(heroActions, { opacity: 1, y: 0, duration: 0.8 }, 0.8);

  // Hero bg parallax
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }
}

/* ============================================================
   5. ANIMATED COUNTERS (GSAP)
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  counters.forEach(counter => {
    const target    = parseFloat(counter.getAttribute('data-target'));
    const suffix    = counter.getAttribute('data-suffix') || '';
    const isDecimal = String(target).includes('.');

    gsap.fromTo(counter,
      { innerText: 0 },
      {
        innerText: target,
        duration: 2.5,
        ease: 'power2.out',
        snap: { innerText: isDecimal ? 0.1 : 1 },
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          once: true,
        },
        onUpdate() {
          const val = isDecimal
            ? parseFloat(this.targets()[0].innerText).toFixed(1)
            : Math.round(this.targets()[0].innerText);
          counter.innerText = val + suffix;
        },
      }
    );
  });
}

/* ============================================================
   6. AOS SCROLL ANIMATIONS
   ============================================================ */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
  }
}

/* ============================================================
   7. TESTIMONIALS SWIPER
   ============================================================ */
function initSwiper() {
  const el = document.querySelector('.testimonials-swiper');
  if (!el || typeof Swiper === 'undefined') return;

  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 32,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    effect: 'slide',
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 2 },
    },
  });
}

/* ============================================================
   8. GALLERY FILTERS + MASONRY
   ============================================================ */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.masonry-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');

      items.forEach(item => {
        if (cat === 'all' || item.getAttribute('data-cat') === cat) {
          gsap.to(item, { opacity: 1, scale: 1, duration: 0.4, display: 'block' });
        } else {
          gsap.to(item, { opacity: 0, scale: 0.96, duration: 0.3,
            onComplete: () => { item.style.display = 'none'; } });
        }
      });
    });
  });
}

/* ============================================================
   9. LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox) return;

  document.querySelectorAll('.masonry-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

function initScrollReveal() {
  // Section headings
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/* ============================================================
   11. PROJECT FILTER (PROJECTS PAGE)
   ============================================================ */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-full-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
          gsap.to(card, { opacity: 1, scale: 1, duration: 0.4, display: 'block' });
        } else {
          gsap.to(card, { opacity: 0, scale: 0.97, duration: 0.3,
            onComplete: () => { card.style.display = 'none'; } });
        }
      });
    });
  });
}

/* ============================================================
   12. CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check if required fields are filled (Validation)
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    const original = btn.innerHTML;

    // Get form values
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const projectType = document.getElementById('projectType').value;
    const budget = document.getElementById('budget').value;
    const message = document.getElementById('message').value;

    // Construct WhatsApp Message
    let waText = `*New Website Enquiry*%0A%0A`;
    waText += `*Name:* ${name}%0A`;
    waText += `*Email:* ${email}%0A`;
    if (phone) waText += `*Phone:* ${phone}%0A`;
    if (projectType) waText += `*Project Type:* ${projectType}%0A`;
    if (budget) waText += `*Budget:* ${budget}%0A`;
    waText += `*Message:* ${message}`;

    // Update button state temporarily
    btn.innerHTML = '<i class="bi bi-whatsapp"></i> Redirecting...';
    btn.disabled = true;
    btn.style.background = '#25D366';

    setTimeout(() => {
      // Open WhatsApp in new tab
      window.open(`https://wa.me/919676133255?text=${waText}`, '_blank');
      
      // Reset form and button
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
    }, 1000);
  });
}

/* ============================================================
   13. INIT ALL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden'; // lock during preloader
  initPreloader();
  initNavbar();
  initAOS();
  initSwiper();
  initGallery();
  initLightbox();
  initCounters();
  initScrollReveal();
  initProjectFilter();
  initContactForm();

  // Init Lenis only if library present
  if (typeof Lenis !== 'undefined') {
    initLenis();
  }
});
