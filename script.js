/* ═══════════════════════════════════════════════════════════
   NEXAKIT — HOMEPAGE JS
   Countdown · Nav · FAQ · Scroll Animations
═══════════════════════════════════════════════════════════ */
'use strict';

/* ─── COUNTDOWN TIMER ────────────────────────────────────── */
(function initCountdown() {
  // Set target 30 minutes from page load (or restore from session)
  const SESSION_KEY = 'nexakit_countdown_end';
  let endTime = parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
  if (!endTime || endTime < Date.now()) {
    endTime = Date.now() + 30 * 60 * 1000; // 30 min
    sessionStorage.setItem(SESSION_KEY, endTime);
  }

  const timerEls = [
    document.getElementById('offer-bar-timer'),
    document.getElementById('pricing-timer')
  ];

  function update() {
    const remaining = Math.max(0, endTime - Date.now());
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    const display = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    timerEls.forEach(el => { if (el) el.textContent = display; });
    if (remaining === 0) {
      // Reset timer
      endTime = Date.now() + 30 * 60 * 1000;
      sessionStorage.setItem(SESSION_KEY, endTime);
    }
  }

  update();
  setInterval(update, 1000);
})();

/* ─── FLOATING OFFER BANNER (dismiss) ────────────────────── */
(function initOfferBar() {
  const bar      = document.getElementById('offer-bar');
  const closeBtn = document.getElementById('offer-bar-close');
  if (!bar || !closeBtn) return;

  const DISMISS_KEY = 'nexakit_offerbar_dismissed';
  if (sessionStorage.getItem(DISMISS_KEY) === '1') {
    bar.classList.add('is-dismissed');
    document.body.style.paddingBottom = '0px';
  }

  closeBtn.addEventListener('click', () => {
    bar.classList.add('is-dismissed');
    document.body.style.paddingBottom = '0px';
    sessionStorage.setItem(DISMISS_KEY, '1');
  });
})();

/* ─── LIVE BUY NOTIFICATIONS ──────────────────────────────── */
(function initBuyNotifications() {
  const wrap = document.getElementById('buy-toast-wrap');
  if (!wrap) return;

  const firstNames = [
    'Emily', 'Jacob', 'Olivia', 'Michael', 'Sophia', 'Ethan', 'Ava', 'Daniel',
    'Isabella', 'Matthew', 'Mia', 'Andrew', 'Charlotte', 'Joshua', 'Amelia',
    'Ryan', 'Harper', 'Tyler', 'Abigail', 'Brandon', 'Grace', 'Justin',
    'Chloe', 'Kevin', 'Lily', 'Austin', 'Hannah', 'Jordan', 'Natalie', 'Cole'
  ];

  const places = [
    ['Austin', 'TX'], ['Denver', 'CO'], ['Seattle', 'WA'], ['Miami', 'FL'],
    ['Chicago', 'IL'], ['Phoenix', 'AZ'], ['Boston', 'MA'], ['Portland', 'OR'],
    ['Nashville', 'TN'], ['Atlanta', 'GA'], ['San Diego', 'CA'], ['Charlotte', 'NC'],
    ['Columbus', 'OH'], ['Dallas', 'TX'], ['Orlando', 'FL'], ['Sacramento', 'CA'],
    ['Minneapolis', 'MN'], ['Raleigh', 'NC'], ['Tampa', 'FL'], ['Salt Lake City', 'UT'],
    ['Las Vegas', 'NV'], ['Kansas City', 'MO'], ['Philadelphia', 'PA'], ['Houston', 'TX'],
    ['San Antonio', 'TX'], ['Brooklyn', 'NY'], ['San Jose', 'CA'], ['Indianapolis', 'IN'],
    ['Cleveland', 'OH'], ['Pittsburgh', 'PA']
  ];

  let lastNameIdx = -1;
  let lastPlaceIdx = -1;

  function pickRandom(arr, avoidIdx) {
    if (arr.length === 1) return 0;
    let idx;
    do { idx = Math.floor(Math.random() * arr.length); } while (idx === avoidIdx);
    return idx;
  }

  function showNotification() {
    lastNameIdx  = pickRandom(firstNames, lastNameIdx);
    lastPlaceIdx = pickRandom(places, lastPlaceIdx);
    const name  = firstNames[lastNameIdx];
    const [city, state] = places[lastPlaceIdx];
    const minsAgo = Math.floor(Math.random() * 14) + 1;

    const toast = document.createElement('div');
    toast.className = 'buy-toast';
    toast.innerHTML =
      '<div class="buy-toast__icon" aria-hidden="true">🛍️</div>' +
      '<div class="buy-toast__body">' +
        '<span class="buy-toast__name">' + name + ' from ' + city + ', ' + state + '</span>' +
        '<span class="buy-toast__meta"><strong>✓ Purchased</strong> Nexakit Planner · ' + minsAgo + ' min ago</span>' +
      '</div>';

    wrap.innerHTML = '';
    wrap.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 400);
    }, 4200);
  }

  // First popup shortly after the page loads, then repeat every ~5 seconds
  setTimeout(() => {
    showNotification();
    setInterval(showNotification, 5000);
  }, 3000);
})();

/* ─── NAVIGATION ─────────────────────────────────────────── */
(function initNav() {
  const nav         = document.getElementById('main-nav');
  const hamburger   = document.getElementById('hamburger-btn');
  const mobileMenu  = document.getElementById('mobile-menu');

  // Scroll → add shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close when mobile link clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Close on outside click
  document.addEventListener('click', e => {
    if (nav && !nav.contains(e.target)) {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      mobileMenu?.setAttribute('aria-hidden', 'true');
    }
  });
})();

/* ─── SMOOTH SCROLL for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = 74; // fixed nav height + small gap
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── FAQ ACCORDION ──────────────────────────────────────── */
(function initFAQ() {
  const faqList = document.getElementById('faq-list');
  if (!faqList) return;

  faqList.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer  = btn.nextElementSibling;
      const isOpen  = btn.getAttribute('aria-expanded') === 'true';
      const allBtns = faqList.querySelectorAll('.faq-q');

      // Close all
      allBtns.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const a = b.nextElementSibling;
        if (a) a.hidden = true;
      });

      // Toggle current
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        if (answer) answer.hidden = false;
      }
    });
  });
})();

/* ─── SCROLL FADE-UP ANIMATIONS ─────────────────────────── */
(function initScrollAnimations() {
  const targets = [
    '.life-card', '.theme-card', '.why-card', '.review-card',
    '.preview-card', '.app-card', '.ai-section__content',
    '.ai-section__visual', '.pricing-card', '.trust-item'
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('fade-up');
      el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
      observer.observe(el);
    });
  });
})();

/* ─── ACTIVE NAV LINK on scroll ─────────────────────────── */
(function initActiveNav() {
  const sections = ['home','features','preview','reviews','pricing','faq'];
  const links    = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.style.color = '';
          l.style.background = '';
          if (l.getAttribute('href') === '#' + id) {
            l.style.color = 'var(--purple-600)';
            l.style.background = 'var(--purple-50)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();

/* ─── PLANNER IMAGE SLIDER ───────────────────────────────────── */
(function initPlannerSlider() {
  const track     = document.getElementById('pslider-track');
  const prevBtn   = document.getElementById('pslide-prev');
  const nextBtn   = document.getElementById('pslide-next');
  const dotsWrap  = document.getElementById('pslider-dots');
  const counter   = document.getElementById('pslider-counter');
  const thumbStrip = document.getElementById('pthumb-strip');

  if (!track) return;

  const slides  = Array.from(track.querySelectorAll('.pslide'));
  const thumbs  = thumbStrip ? Array.from(thumbStrip.querySelectorAll('.pthumb')) : [];
  const total   = slides.length;
  let current   = 0;
  let autoTimer = null;

  /* ── Build dots ── */
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'pslider-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.pslider-dot'));

  /* ── How many slides visible (1 on mobile, 1 peek on desktop) ── */
  function slideWidth() {
    return track.querySelector('.pslide').getBoundingClientRect().width;
  }

  /* ── Go to slide ── */
  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));
    track.style.transform = `translateX(-${current * slideWidth()}px)`;

    /* Update dots */
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });

    /* Update counter */
    if (counter) counter.textContent = `${current + 1} / ${total}`;

    /* Update arrow states */
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === total - 1;

    /* Update thumbnails */
    thumbs.forEach((t, i) => {
      t.classList.toggle('pthumb--active', i === current);
    });
    /* Scroll active thumb into view */
    if (thumbs[current] && thumbStrip) {
      thumbStrip.scrollTo({
        left: thumbs[current].offsetLeft - thumbStrip.clientWidth / 2 + thumbs[current].offsetWidth / 2,
        behavior: 'smooth'
      });
    }

    resetAuto();
  }

  /* ── Arrows ── */
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  /* ── Thumb clicks ── */
  thumbs.forEach(t => {
    t.addEventListener('click', () => goTo(parseInt(t.dataset.idx, 10)));
  });

  /* ── Touch / drag ── */
  let startX = 0, startY = 0, dragDx = 0, isDragging = false, isHorizDrag = false;

  function onPointerDown(e) {
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    isDragging = true;
    isHorizDrag = false;
    dragDx = 0;
    track.classList.add('dragging');
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = x - startX;
    const dy = y - startY;

    if (!isHorizDrag && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;

    if (!isHorizDrag) {
      if (Math.abs(dx) >= Math.abs(dy)) {
        isHorizDrag = true;
      } else {
        isDragging = false; // vertical scroll — let browser handle
        track.classList.remove('dragging');
        return;
      }
    }

    if (e.cancelable) e.preventDefault();
    dragDx = dx;
    track.style.transform = `translateX(${-current * slideWidth() + dx}px)`;
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    if (dragDx < -50 && current < total - 1) goTo(current + 1);
    else if (dragDx > 50 && current > 0) goTo(current - 1);
    else goTo(current); // snap back
    dragDx = 0;
  }

  track.addEventListener('touchstart',  onPointerDown, { passive: true });
  track.addEventListener('touchmove',   onPointerMove, { passive: false });
  track.addEventListener('touchend',    onPointerUp);
  track.addEventListener('mousedown',   onPointerDown);
  window.addEventListener('mousemove',  onPointerMove);
  window.addEventListener('mouseup',    onPointerUp);

  /* ── Keyboard nav ── */
  track.setAttribute('tabindex', '0');
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* ── Autoplay ── */
  function startAuto() {
    autoTimer = setInterval(() => {
      goTo(current < total - 1 ? current + 1 : 0);
    }, 4000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  /* Pause on hover/touch */
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', startAuto);
  track.addEventListener('touchstart',  () => clearInterval(autoTimer), { passive: true });
  track.addEventListener('touchend',    () => { setTimeout(startAuto, 2000); });

  /* ── Recalc on resize ── */
  window.addEventListener('resize', () => {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${current * slideWidth()}px)`;
    setTimeout(() => { track.style.transition = ''; }, 50);
  }, { passive: true });

  /* ── Init ── */
  goTo(0);
  startAuto();
})();
