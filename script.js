/* ═══════════════════════════════════════════════════════════
   BLOOM PLANNER — INTERACTIONS & ANIMATIONS
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── NAV SCROLL EFFECT ──────────────────────────────────── */
const nav = document.getElementById('main-nav');

function updateNav() {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ─── HAMBURGER MENU ─────────────────────────────────────── */
const hamburgerBtn  = document.getElementById('hamburger-btn');
const mobileMenu    = document.getElementById('mobile-menu');
const mobileLinks   = document.querySelectorAll('.nav__mobile-link, .nav__mobile-menu .btn');

function closeMobileMenu() {
  hamburgerBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

hamburgerBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburgerBtn.classList.toggle('open', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = nav.offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── CAROUSEL ───────────────────────────────────────────── */
const track     = document.getElementById('carousel-track');
const prevBtn   = document.getElementById('carousel-prev');
const nextBtn   = document.getElementById('carousel-next');
const dots      = document.querySelectorAll('.carousel__dot');
const slides    = document.querySelectorAll('.carousel__slide');
let   currentIdx = 0;
let   isDragging = false;
let   dragStartX = 0;
let   dragScrollLeft = 0;

function goToSlide(idx) {
  idx = Math.max(0, Math.min(idx, slides.length - 1));
  currentIdx = idx;

  const slide = slides[idx];
  const slideLeft = slide.offsetLeft;
  const trackWidth = track.offsetWidth;
  const slideWidth = slide.offsetWidth;
  const scrollPos = slideLeft - (trackWidth / 2) + (slideWidth / 2);

  track.scrollTo({ left: scrollPos, behavior: 'smooth' });

  dots.forEach((dot, i) => {
    dot.classList.toggle('carousel__dot--active', i === idx);
    dot.setAttribute('aria-selected', String(i === idx));
  });
}

prevBtn.addEventListener('click', () => goToSlide(currentIdx - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIdx + 1));

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => goToSlide(i));
});

/* Drag-to-scroll */
track.addEventListener('mousedown', e => {
  isDragging = true;
  dragStartX = e.pageX - track.offsetLeft;
  dragScrollLeft = track.scrollLeft;
  track.style.userSelect = 'none';
});

track.addEventListener('mouseleave', () => { isDragging = false; });
track.addEventListener('mouseup',    () => {
  isDragging = false;
  track.style.userSelect = '';
  snapToNearestSlide();
});

track.addEventListener('mousemove', e => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - track.offsetLeft;
  const walk = (x - dragStartX) * 1.5;
  track.scrollLeft = dragScrollLeft - walk;
});

/* Touch drag (passive) */
let touchStartX = 0;
let touchScrollLeft = 0;

track.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].pageX;
  touchScrollLeft = track.scrollLeft;
}, { passive: true });

track.addEventListener('touchend', () => snapToNearestSlide(), { passive: true });

function snapToNearestSlide() {
  let closestIdx = 0;
  let closestDist = Infinity;
  slides.forEach((slide, i) => {
    const dist = Math.abs(slide.offsetLeft - track.scrollLeft - (track.offsetWidth / 2) + (slide.offsetWidth / 2));
    if (dist < closestDist) { closestDist = dist; closestIdx = i; }
  });
  goToSlide(closestIdx);
}

/* Auto-advance */
let autoplayTimer = setInterval(() => goToSlide((currentIdx + 1) % slides.length), 4500);

track.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
track.addEventListener('mouseleave', () => {
  autoplayTimer = setInterval(() => goToSlide((currentIdx + 1) % slides.length), 4500);
});

/* ─── FAQ ACCORDION ──────────────────────────────────────── */
const faqQuestions = document.querySelectorAll('.faq__question');

faqQuestions.forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const answerId = btn.getAttribute('aria-controls');
    const answer   = document.getElementById(answerId);

    // Close all
    faqQuestions.forEach(q => {
      q.setAttribute('aria-expanded', 'false');
      const a = document.getElementById(q.getAttribute('aria-controls'));
      if (a) { a.hidden = true; a.style.maxHeight = '0'; }
    });

    // Open clicked (unless it was already open)
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
      // Force reflow for transition
      answer.offsetHeight;
    }
  });
});

/* ─── SCROLL ANIMATIONS ──────────────────────────────────── */
const animatedEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--delay') || '0s';
        const ms = parseFloat(delay) * 1000;
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, ms);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

animatedEls.forEach(el => observer.observe(el));

/* Feature cards and lifestyle pillars */
const featureCards  = document.querySelectorAll('.feature-card');
const lifePillars   = document.querySelectorAll('.lifestyle__pillar');
const quoteWrap     = document.querySelector('.lifestyle__quote-wrap');

const cardObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--delay') || '0s';
        const ms = parseFloat(delay) * 1000;
        setTimeout(() => entry.target.classList.add('animated'), ms);
        cardObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

featureCards.forEach(card => cardObserver.observe(card));

const pillarObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--delay') || '0s';
        const ms = parseFloat(delay) * 1000;
        setTimeout(() => entry.target.classList.add('animated'), ms);
        pillarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

lifePillars.forEach(p => pillarObserver.observe(p));

if (quoteWrap) {
  const quoteObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        quoteWrap.classList.add('animated');
        quoteObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  quoteObs.observe(quoteWrap);
}

/* ─── STICKY CTA ─────────────────────────────────────────── */
const stickyCta = document.getElementById('sticky-cta');
const heroSection = document.getElementById('home');
const footerSection = document.querySelector('.footer');

function updateStickyCta() {
  const heroBottom    = heroSection ? heroSection.getBoundingClientRect().bottom : 0;
  const footerTop     = footerSection ? footerSection.getBoundingClientRect().top : Infinity;
  const windowHeight  = window.innerHeight;

  if (heroBottom < 0 && footerTop > windowHeight) {
    stickyCta.classList.add('visible');
  } else {
    stickyCta.classList.remove('visible');
  }
}

window.addEventListener('scroll', updateStickyCta, { passive: true });
updateStickyCta();

/* ─── COUNTER ANIMATION (proof strip) ───────────────────── */
function animateCounter(el, target, suffix) {
  const duration = 1200;
  const start    = performance.now();
  const startVal = 0;

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    const current  = Math.round(startVal + (target - startVal) * ease);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const proofStats = document.querySelectorAll('.proof-strip__stat strong');
let proofAnimated = false;

const proofObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !proofAnimated) {
      proofAnimated = true;
      const data = [
        { el: proofStats[0], target: 10000, suffix: '+' },
        { el: proofStats[1], target: 4.9,   suffix: ' ★', isFloat: true },
        { el: proofStats[2], target: 1,      suffix: '',   prefix: '#' },
        { el: proofStats[3], target: 720,    suffix: '+' },
      ];
      data.forEach(({ el, target, suffix, prefix, isFloat }) => {
        if (!el) return;
        if (isFloat) {
          const dur = 1200, st = performance.now();
          function stepF(ts) {
            const prog = Math.min((ts - st) / dur, 1);
            const ease = 1 - Math.pow(1 - prog, 3);
            el.textContent = (0 + target * ease).toFixed(1) + suffix;
            if (prog < 1) requestAnimationFrame(stepF);
          }
          requestAnimationFrame(stepF);
        } else if (prefix) {
          el.textContent = prefix + target + suffix;
        } else {
          animateCounter(el, target, suffix);
        }
      });
      proofObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const proofStrip = document.querySelector('.proof-strip');
if (proofStrip) proofObserver.observe(proofStrip);
