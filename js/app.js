/* app.js - Main Application Coordinator */

document.addEventListener('DOMContentLoaded', async () => {
  // Setup header scrolling effect
  setupHeaderScroll();
  
  // Setup mobile navigation toggle
  setupMobileNav();

  // Initialize main page context
  const isIndexPage = !window.location.pathname.includes('/projects/') && 
                      (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '');

  if (isIndexPage) {
    try {
      const projects = await ProjectsAPI.getProjects();
      renderFeaturedHero(projects);
      renderCategoryRows(projects);
      setupCarouselButtons();
    } catch (e) {
      console.error("Index initialization error: ", e);
    }
  }

  // Remove loading overlay
  hideLoadingScreen();
});

// Scroll handler for navbar opacity
function setupHeaderScroll() {
  const header = document.getElementById('appHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Init status
}

// Side menu for mobile screens
function setupMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
  });

  // Close mobile nav when clicking a link
  const navLinks = navMenu.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.textContent = '☰';
    });
  });
}

// Select premier project as featured main banner
function renderFeaturedHero(projects) {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  // // Let's choose "lostfound" or "khoj" as the main billboard item
  // const featured = projects.find(p => p.id === 'lostfound') || projects[0];
  // if (!featured) return;

  const appTitle = document.getElementById('heroProjectTitle');
  const appDesc = document.getElementById('heroProjectDesc');
  const appTech = document.getElementById('heroProjectTech');
  const appPoster = document.getElementById('heroBgImage');
  const appPlayBtn = document.getElementById('heroPlayBtn');
  const appDetailsBtn = document.getElementById('heroDetailsBtn');

  if (appTitle) appTitle.textContent = featured.title;
  if (appDesc) appDesc.textContent = featured.tagline;
  if (appPoster && featured.banner) appPoster.src = featured.banner;
  
  if (appTech) {
    appTech.innerHTML = featured.techStack.map(tech => 
      `<span class="tech-badge">${tech}</span>`
    ).join('');
  }

  if (appPlayBtn) {
    appPlayBtn.addEventListener('click', () => {
      if (typeof window.openVideoModal === 'function') {
        window.openVideoModal(featured.demoVideo);
      }
    });
  }

  if (appDetailsBtn) {
    appDetailsBtn.setAttribute('href', `projects/${featured.id}.html`);
  }
}

// Categorize and populate row elements
function renderCategoryRows(projects) {
  const categories = [
    { title: "Web Applications", id: "webapps-carousel", match: "Web Applications" },
    { title: "Mobile Apps", id: "mobile-carousel", match: "Mobile Apps" },
    { title: "Games", id: "games-carousel", match: "Games" },
    { title: "AI & Machine Learning", id: "ai-carousel", match: "AI & Machine Learning" },
    { title: "UI/UX Designs", id: "uiux-carousel", match: "UI/UX Designs" },
    { title: "Mini Projects", id: "mini-carousel", match: "Mini Projects" }
  ];

  categories.forEach(cat => {
    const listContainer = document.getElementById(cat.id);
    if (!listContainer) return;

    const filtered = projects.filter(p => p.category.toLowerCase() === cat.match.toLowerCase());
    
    // If category has no projects, we can display a friendly message or hide the row container wrapper
    const rowWrapper = listContainer.closest('.category-row');
    if (filtered.length === 0) {
      if (rowWrapper) {
        rowWrapper.style.display = 'none'; // Keep UI clean by hiding empty categories
      }
      return;
    }

    listContainer.innerHTML = '';
    
    filtered.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card card-lift';
      const detailsUrl = `projects/${project.id}.html`;
      
      card.innerHTML = `
        <div class="card-poster-wrapper">
          ${project.poster ? 
            `<img src="${project.poster}" alt="${project.title} Poster" class="card-poster" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">` : ''
          }
          <div class="poster-placeholder" style="${project.poster ? 'display: none;' : 'display: flex;'}">
            <div class="poster-logo">${project.title.substring(0,2)}</div>
            <span style="font-size: 0.8rem; letter-spacing: 0.05em; font-weight: 600;">PROJECTVERSE</span>
          </div>
          <div class="card-overlay">
            <div style="display: flex; gap: 12px; margin-bottom: 8px;">
              <div class="overlay-btn overlay-play" title="Watch Demo" onclick="event.stopPropagation(); window.openVideoModal('${project.demoVideo}')">▶</div>
              <a href="${detailsUrl}" class="overlay-btn overlay-info" title="View Details">ℹ</a>
            </div>
          </div>
        </div>
        <div class="card-info">
          <div class="card-title-row">
            <h3 class="card-title">${project.title}</h3>
            <span class="card-duration">${project.duration}</span>
          </div>
          <div class="card-tech-list">
            ${project.techStack.map(t => `<span class="card-tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      `;
      
      // Card navigation callback on outer wrapper click
      card.addEventListener('click', () => {
        window.location.href = detailsUrl;
      });
      
      listContainer.appendChild(card);
    });
  });
}

// Attach slide events to row buttons
function setupCarouselButtons() {
  const carousels = document.querySelectorAll('.cards-carousel-container');
  
  carousels.forEach(con => {
    const leftBtn = con.querySelector('.carousel-btn.left');
    const rightBtn = con.querySelector('.carousel-btn.right');
    const carouselBox = con.querySelector('.cards-carousel');
    
    if (!carouselBox) return;

    if (leftBtn) {
      leftBtn.addEventListener('click', () => {
        carouselBox.scrollBy({ left: -340, behavior: 'smooth' });
      });
    }
    
    if (rightBtn) {
      rightBtn.addEventListener('click', () => {
        carouselBox.scrollBy({ left: 340, behavior: 'smooth' });
      });
    }
  });
}

function hideLoadingScreen() {
  const loader = document.getElementById('loaderScreen');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    }, 450); // Small delay to feel smooth
  }
}
