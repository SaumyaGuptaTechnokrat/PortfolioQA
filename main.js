/* =====================================================
   SAUMYA GUPTA — QA PORTFOLIO
   main.js
   ===================================================== */

/* ===== DOM REFS ===== */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
const topBtn     = document.getElementById('topBtn');
const sendBtn    = document.getElementById('sendBtn');
const formNote   = document.getElementById('formNote');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections   = document.querySelectorAll('section[id]');

/* =====================================================
   HAMBURGER / MOBILE NAV
   ===================================================== */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close nav when a link is clicked on mobile
navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }
});

/* =====================================================
   SCROLL — ACTIVE NAV LINK  +  BACK-TO-TOP BUTTON
   ===================================================== */
function onScroll() {
  const scrollY = window.scrollY;

  // Back to top visibility
  if (scrollY > 320) {
    topBtn.classList.add('visible');
  } else {
    topBtn.classList.remove('visible');
  }

  // Active nav link based on current section
  let currentSection = '';
  sections.forEach((sec) => {
    const sectionTop = sec.offsetTop - 90;
    if (scrollY >= sectionTop) {
      currentSection = sec.getAttribute('id');
    }
  });

  allNavLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });

/* =====================================================
   BACK TO TOP
   ===================================================== */
topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =====================================================
   FADE-IN ON SCROLL  (Intersection Observer)
   ===================================================== */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // only animate once
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-in').forEach((el) => {
  fadeObserver.observe(el);
});

/* =====================================================
   STAT COUNTER ANIMATION
   ===================================================== */
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const isPlus = el.dataset.target.includes('+');

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + (isPlus ? '+' : '');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num[data-target]');
        nums.forEach((num) => {
          const target = parseInt(num.dataset.target, 10);
          animateCounter(num, target);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  // Mark each stat-num with the data-target attribute from its text
  heroStats.querySelectorAll('.stat-num').forEach((el) => {
    const raw = el.textContent.trim();
    el.dataset.target = raw; // e.g. "70+"
    el.textContent = '0';
  });
  statsObserver.observe(heroStats);
}

/* =====================================================
   CONTACT FORM  (mailto fallback)
   ===================================================== */
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      formNote.style.color = '#f47067';
      formNote.textContent = '⚠ Please fill in Name, Email, and Message.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formNote.style.color = '#f47067';
      formNote.textContent = '⚠ Please enter a valid email address.';
      return;
    }

    // Build mailto link
    const mailtoSubject = encodeURIComponent(subject || 'Portfolio Enquiry');
    const mailtoBody = encodeURIComponent(
      `Hi Saumya,\n\nMy name is ${name} (${email}).\n\n${message}`
    );
    window.location.href = `mailto:gupta.saumya837@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    formNote.style.color = 'var(--teal)';
    formNote.textContent = '✓ Opening your email client…';

    // Reset after 4 seconds
    setTimeout(() => {
      document.getElementById('name').value    = '';
      document.getElementById('email').value   = '';
      document.getElementById('subject').value = '';
      document.getElementById('message').value = '';
      formNote.textContent = '';
    }, 4000);
  });
}

/* =====================================================
   SMOOTH ANCHOR SCROLL  (offset for fixed nav)
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;
    e.preventDefault();
    const navHeight = document.getElementById('navbar').offsetHeight;
    const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =====================================================
   SKILL TAG HOVER  — subtle glow effect
   ===================================================== */
document.querySelectorAll('.skill-tag').forEach((tag) => {
  tag.addEventListener('mouseenter', () => {
    tag.style.boxShadow = '0 0 10px rgba(0,212,170,0.3)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.boxShadow = '';
  });
});

/* =====================================================
   KEYBOARD ACCESSIBILITY — close nav on Escape
   ===================================================== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    hamburger.focus();
  }
});

/* =====================================================
   INIT
   ===================================================== */
onScroll(); // run once on page load
