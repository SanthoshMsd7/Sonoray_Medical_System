// Navbar scroll effect removed to keep theme color constant

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Scroll-reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, parseInt(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-aos]').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(32px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Counter animation
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const num = parseInt(text);
      const suffix = text.replace(/[0-9]/g, '');
      animateCounter(el, num, suffix);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statsObserver.observe(el));

// Contact form
const scriptURL = 'https://script.google.com/macros/s/AKfycbzCDvgZmdw4GCBofpEnt1rFnBwlLpaRc5MkPTwp_MapUXwQefJf4vWQVAGsw8FnHhZ0/exec';

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const formData = new FormData(this);
    // Add timestamp to data
    formData.append('timestamp', new Date().toLocaleString());

    fetch(scriptURL, { method: 'POST', body: formData})
      .then(response => {
        document.getElementById('formSuccess').classList.add('show');
        btn.textContent = 'Sent!';
        this.reset();
      })
      .catch(error => {
        console.error('Error!', error.message);
        btn.textContent = 'Error - Try Again';
        btn.disabled = false;
      });
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--red)';
      a.style.fontWeight = '800';
    } else {
      a.style.color = '';
      a.style.fontWeight = '700';
    }
  });
});

// Products Portal Tabs Logic
const portalLinks = document.querySelectorAll('.portal-link');
const portalPanes = document.querySelectorAll('.portal-pane');

if (portalLinks.length > 0) {
  portalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links
      portalLinks.forEach(l => l.classList.remove('active-filter'));
      
      // Hide all panes
      portalPanes.forEach(p => {
        p.style.display = 'none';
      });
      
      // Add active class to clicked link
      link.classList.add('active-filter');
      
      // Show corresponding pane
      const targetId = link.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.style.display = 'block';
        // Scroll to top of portal content smoothly if on mobile
        if (window.innerWidth <= 900) {
          targetPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// Dependent Dropdowns Logic
const classificationSelect = document.getElementById('classification');
const productSelect = document.getElementById('interest');

const productsByClassification = {
  'sonoray': [
    'Sonoray DS 30 Plus',
    'Sonoray DS 50',
    'Sonoray DS 50 Plus',
    'Sonoray DS 100 Plus',
    'Sonoray DS 150 Plus',
    'Sonoray DS 200 Plus'
  ],
  'sonoscape': [
    'SonoScape E2V',
    'SonoScape S12',
    'SonoScape Propet 60'
  ],
  'alerio': [
    'Alerio Smart 1600 (Portable)',
    'Alerio Smart 2800 (Portable)',
    'Alerio Smart 4200 (Mobile)',
    'Alerio Smart 5000 (Mobile)',
    'ERAY Gold (DR)',
    'AeroX DR (Konica Minolta)'
  ],
  'handheld': [
    'Edan Nano C5 EXP',
    'Edan Nano L12 EXP',
    'Wired Endorectal Probe',
    'Farm Scanner',
    'Interchangeable Probes System',
    'C10 RS Microconvex Wireless'
  ],
  'others': [
    'Full Product Demo / Site Visit',
    'Probe Repair Services',
    'General Inquiry'
  ]
};

if (classificationSelect && productSelect) {
  classificationSelect.addEventListener('change', function() {
    const selected = this.value;
    productSelect.innerHTML = '';
    
    // Add a default placeholder even after classification is selected
    const placeholder = document.createElement('option');
    placeholder.value = "";
    placeholder.textContent = selected ? "Select machine..." : "Select classification first...";
    placeholder.disabled = true;
    placeholder.selected = true;
    productSelect.appendChild(placeholder);

    if (selected && productsByClassification[selected]) {
      productsByClassification[selected].forEach(prod => {
        const opt = document.createElement('option');
        opt.value = prod;
        opt.textContent = prod;
        productSelect.appendChild(opt);
      });
    }
  });
}
