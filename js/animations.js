/* animations.js - Parallax, Scroll Observers & Active Page Link Tracking */

document.addEventListener('DOMContentLoaded', () => {
  setupScrollReveal();
  setupParallaxHero();
  setupNavigationObserver();
  setupSmoothPageTransitions();
  animateSkillsProgressBarOnViewport();
});

// Scroll reveals using IntersectionObserver
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

// Parallax scrolling effect for hero banners
function setupParallaxHero() {
  const heroBg = document.querySelector('.hero-bg');
  const heroContent = document.querySelector('.hero-content');
  
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scrollVal = window.scrollY;
    if (scrollVal < window.innerHeight) {
      // Scale dynamic translate
      heroBg.style.transform = `translateY(${scrollVal * 0.4}px) scale(${1.02 + scrollVal * 0.0003})`;
      if (heroContent) {
        heroContent.style.opacity = `${1 - scrollVal * 0.0025}`;
        heroContent.style.transform = `translateY(${scrollVal * 0.1}px)`;
      }
    }
  });
}

// Active navigation links highlighting based on viewport scrolling position (on Home page)
function setupNavigationObserver() {
  const isIndexPage = !window.location.pathname.includes('/projects/') && 
                      (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '');

  if (!isIndexPage) {
    // If we're on other pages, highlight based on filename match
    const filename = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      const link = item.querySelector('a');
      if (link && link.getAttribute('href') === filename) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    return;
  }

  // On landing page, watch custom sections IDs
  const sections = document.querySelectorAll('section[id], header[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          const link = item.querySelector('a');
          if (link) {
            const href = link.getAttribute('href');
            if (href === `#${id}` || (id === 'hero' && href === '#home')) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          }
        });
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '-80px 0px -40% 0px'
  });

  sections.forEach(sec => navObserver.observe(sec));
}

// Behind the Scenes Progress Bars animate in when row enters viewport
function animateSkillsProgressBarOnViewport() {
  const btsSection = document.getElementById('behindTheScenes');
  if (!btsSection) return;

  const barObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressFills = entry.target.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
          const percent = fill.dataset.percent || '0';
          fill.style.width = `${percent}%`;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  barObserver.observe(btsSection);
}

// Page Transition Overlay animation triggers
function setupSmoothPageTransitions() {
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'page-transition-overlay';
  document.body.appendChild(transitionOverlay);

  const links = document.querySelectorAll('a:not([target="_blank"])');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const destination = link.getAttribute('href');
      if (!destination || destination.startsWith('javascript:')) return;

      // Check if destination URL points to current page (e.g. index.html#projects while on index.html)
      try {
        const targetUrl = new URL(destination, window.location.href);
        const isSamePage = targetUrl.origin === window.location.origin && targetUrl.pathname === window.location.pathname;

        if (isSamePage) {
          e.preventDefault();
          // Close mobile menu if active
          const navMenu = document.getElementById('navMenu');
          const menuToggle = document.getElementById('menuToggle');
          if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuToggle) menuToggle.textContent = '☰';
          }

          if (targetUrl.hash) {
            const targetElement = document.querySelector(targetUrl.hash);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
              history.pushState(null, null, targetUrl.hash);
            }
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.pushState(null, null, ' ');
          }
          return;
        }
      } catch (err) {
        // Fallback for relative hash if URL parsing fails
        if (destination.startsWith('#')) return;
      }
      
      e.preventDefault();
      transitionOverlay.classList.add('active');
      
      setTimeout(() => {
        window.location.href = destination;
      }, 400);
    });
  });

  // Reset overlay on entrance
  window.addEventListener('pageshow', (event) => {
    transitionOverlay.classList.remove('active');
  });

  setupGalleryLightbox();
}

// Lightbox preview modal for gallery screenshots
function setupGalleryLightbox() {
  document.addEventListener('click', (e) => {
    const thumbnail = e.target.closest('.gallery-thumbnail');
    if (!thumbnail) return;
    const img = thumbnail.querySelector('img');
    if (!img || img.style.display === 'none' || !img.src) return;

    let lightbox = document.getElementById('galleryLightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'galleryLightbox';
      lightbox.className = 'lightbox-modal';
      lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
          <button class="lightbox-close">&times;</button>
          <img src="" alt="Enlarged screenshot" class="lightbox-img">
        </div>
      `;
      document.body.appendChild(lightbox);

      lightbox.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('lightbox-overlay') || evt.target.classList.contains('lightbox-close')) {
          lightbox.classList.remove('active');
        }
      });
    }

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    if (lightboxImg) {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    }
  });
}
