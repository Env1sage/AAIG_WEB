/* ============================================
   AA INFINITE — Main JavaScript
   Minimal, Elegant Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initHeaderScroll();
  initScrollAnimations();
  initContactForm();
  initDynamicServices();
  initFileUpload();
  initCookieBanner();
});

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  
  if (!toggle || !mobileNav) return;
  
  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
    
    // Toggle icon
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-times', isOpen);
    }
  });
  
  // Close menu when clicking a link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ---------- Header Scroll Effect ---------- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScroll = 0;
  
  const handleScroll = () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  };
  
  // Throttle scroll event
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ---------- Scroll Animations ---------- */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Check consent checkbox
    const consent = form.querySelector('#consent');
    if (consent && !consent.checked) {
      alert('Please agree to the Privacy Policy before submitting.');
      consent.focus();
      return;
    }
    
    // Check at least one service is selected
    const serviceChecks = form.querySelectorAll('input[name="service"]:checked');
    if (serviceChecks.length === 0) {
      alert('Please select at least one service of interest.');
      return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
    submitBtn.style.backgroundColor = '#059669';
    
    // Reset form
    form.reset();
    
    // Reset button after delay
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.backgroundColor = '';
      submitBtn.disabled = false;
    }, 3000);
  });
}

/* ---------- File Upload Drag & Drop ---------- */
function initFileUpload() {
  const area = document.getElementById('fileUploadArea');
  if (!area) return;
  
  ['dragenter', 'dragover'].forEach(evt => {
    area.addEventListener(evt, (e) => {
      e.preventDefault();
      area.classList.add('drag-over');
    });
  });
  
  ['dragleave', 'drop'].forEach(evt => {
    area.addEventListener(evt, (e) => {
      e.preventDefault();
      area.classList.remove('drag-over');
    });
  });
  
  const input = area.querySelector('.file-input');
  if (input) {
    input.addEventListener('change', () => {
      const label = area.querySelector('.file-upload-label span');
      if (label && input.files.length > 0) {
        const names = Array.from(input.files).map(f => f.name).join(', ');
        label.innerHTML = `<strong>${input.files.length} file(s) selected:</strong> ${names}`;
      }
    });
  }
}

/* ---------- Cookie Consent Banner ---------- */
function initCookieBanner() {
  if (localStorage.getItem('aaig_cookies_accepted')) return;
  
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-banner__inner">
      <p>We use cookies to improve your experience. By continuing to use this site, you agree to our <a href="privacy-policy.html#cookies">Cookie Policy</a>.</p>
      <div class="cookie-banner__actions">
        <button class="btn btn--primary btn--sm" id="cookieAccept">Accept All</button>
        <button class="btn btn--outline btn--sm" id="cookieDecline">Decline</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
  
  // Show with animation
  requestAnimationFrame(() => {
    banner.classList.add('visible');
  });
  
  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('aaig_cookies_accepted', 'true');
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 400);
  });
  
  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    localStorage.setItem('aaig_cookies_accepted', 'declined');
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 400);
  });
}

/* ---------- Utility: Debounce ---------- */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ---------- Utility: Throttle ---------- */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* ---------- Dynamic Services (from Admin) ---------- */
function initDynamicServices() {
  // Only run on services page
  const servicesGrid = document.getElementById('dynamicServicesGrid');
  if (!servicesGrid) return;
  
  // Get published services from localStorage
  const services = JSON.parse(localStorage.getItem('aaig_services') || '[]');
  const published = services.filter(s => s.status === 'published');
  
  if (published.length === 0) return;
  
  // Sort by order
  published.sort((a, b) => (a.order || 999) - (b.order || 999));
  
  // Render service cards
  const html = published.map(s => `
    <div class="service-card fade-in">
      <div class="service-card__icon">
        <i class="${escapeHtmlAttr(s.icon || 'fa-solid fa-gears')}"></i>
      </div>
      <h3 class="service-card__title">${escapeHtmlText(s.title)}</h3>
      <p class="service-card__description">${escapeHtmlText(s.description)}</p>
    </div>
  `).join('');
  
  servicesGrid.innerHTML = html;
  
  // Re-initialize animations for new elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  servicesGrid.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function escapeHtmlText(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeHtmlAttr(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
