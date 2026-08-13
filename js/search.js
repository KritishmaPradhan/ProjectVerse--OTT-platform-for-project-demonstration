/* search.js - Client-Side Adaptive Search Interface */

let allProjects = [];

document.addEventListener('DOMContentLoaded', async () => {
  // Wait for projects API to be ready
  allProjects = await ProjectsAPI.getProjects();
  
  initializeSearch();
});

function initializeSearch() {
  const searchTriggers = document.querySelectorAll('.search-trigger');
  const searchModal = document.getElementById('searchFullscreen');
  const searchClose = document.getElementById('searchCloseBtn');
  const searchInput = document.getElementById('searchInputField');
  
  if (!searchModal) return;

  // Open Search Overlay
  searchTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      searchModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput.focus(), 200);
    });
  });

  // Close Search Overlay
  const closeSearch = () => {
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
    searchInput.value = '';
    performSearch('');
  };

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  // Close search overlay with ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      closeSearch();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }
}

function performSearch(query) {
  const resultsGrid = document.getElementById('searchResultsGrid');
  const resultsHeading = document.getElementById('searchResultsHeading');
  
  if (!resultsGrid) return;
  
  const formattedQuery = query.toLowerCase().trim();
  
  // Get active pills status from filters.js
  const activeCategory = document.querySelector('.filter-pill[data-filter-type="category"].active')?.dataset.val || 'all';
  const activeLang = document.querySelector('.filter-pill[data-filter-type="language"].active')?.dataset.val || 'all';
  const activeFramework = document.querySelector('.filter-pill[data-filter-type="framework"].active')?.dataset.val || 'all';
  const activeYear = document.querySelector('.filter-pill[data-filter-type="year"].active')?.dataset.val || 'all';

  // Filter projects by string search AND pills selected
  const filtered = allProjects.filter(project => {
    // String search
    const matchesSearch = !formattedQuery || 
      project.title.toLowerCase().includes(formattedQuery) ||
      project.techStack.some(t => t.toLowerCase().includes(formattedQuery)) ||
      project.category.toLowerCase().includes(formattedQuery);
      
    // Filters match
    const matchesCategory = activeCategory === 'all' || project.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesLang = activeLang === 'all' || (project.language && project.language.toLowerCase() === activeLang.toLowerCase());
    const matchesFramework = activeFramework === 'all' || (project.framework && project.framework.toLowerCase() === activeFramework.toLowerCase());
    const matchesYear = activeYear === 'all' || project.year.toString() === activeYear;

    return matchesSearch && matchesCategory && matchesLang && matchesFramework && matchesYear;
  });

  // Render results
  renderSearchResults(filtered, resultsGrid, resultsHeading, query);
}

function renderSearchResults(results, container, heading, query) {
  container.innerHTML = '';
  
  let labelPrefix = query ? `Results for "${query}"` : 'All Catalog Projects';
  heading.textContent = `${labelPrefix} (${results.length})`;
  
  if (results.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 1.2rem; margin-bottom: 8px;">No projects found</p>
        <p style="font-size: 0.9rem;">Try selecting a different filter pill or adjusting your search term.</p>
      </div>
    `;
    return;
  }
  
  // Path prefix check
  const pathPrefix = window.location.pathname.includes('/projects/') ? '../' : '';

  results.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card animate-fade-in';
    
    // Poster check or elegant inline gradient placeholder
    const posterSrc = project.poster ? `${pathPrefix}${project.poster}` : '';
    const detailsUrl = `${pathPrefix}projects/project.html?id=${project.id}`;
    
    card.innerHTML = `
      <div class="card-poster-wrapper">
        ${project.poster ? 
          `<img src="${posterSrc}" alt="${project.title} poster" class="card-poster" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">` : ''
        }
        <div class="poster-placeholder" style="${project.poster ? 'display: none;' : 'display: flex;'}">
          <div class="poster-logo">${project.title.substring(0,2)}</div>
          <span style="font-size: 0.8rem; letter-spacing: 0.05em; font-weight: 600;">PROJECTVERSE</span>
        </div>
        <div class="card-overlay">
          <div style="display: flex; gap: 12px;">
            <div class="overlay-btn overlay-play" title="Watch Demo" onclick="event.stopPropagation(); window.openVideoModal('${pathPrefix}${project.demoVideo}')">▶</div>
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
    
    // Card navigation trigger on clicking the content outer frame
    card.addEventListener('click', () => {
      window.location.href = detailsUrl;
    });
    
    container.appendChild(card);
  });
}
