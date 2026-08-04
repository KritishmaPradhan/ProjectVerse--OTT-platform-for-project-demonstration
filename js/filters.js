/* filters.js - Dynamic Dynamic Filtering Engine */

document.addEventListener('DOMContentLoaded', () => {
  // Let search.js fetch first, then initialize filters based on retrieved projects
  let attempts = 0;
  const checkProjectsReady = setInterval(() => {
    if (window.ProjectsAPI && window.ProjectsAPI.isLoaded) {
      clearInterval(checkProjectsReady);
      initializeFilters(window.ProjectsAPI.projects);
    } else if (++attempts > 50) {
      clearInterval(checkProjectsReady);
    }
  }, 100);
});

function initializeFilters(projects) {
  // Extract unique filter fields
  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];
  const languages = ['all', ...new Set(projects.map(p => p.language).filter(Boolean))];
  const frameworks = ['all', ...new Set(projects.map(p => p.framework).filter(Boolean))];
  const years = ['all', ...new Set(projects.map(p => p.year.toString()).filter(Boolean))];

  // Map elements groups
  renderPillGroup('filterCategoryList', categories, 'category');
  renderPillGroup('filterLanguageList', languages, 'language');
  renderPillGroup('filterFrameworkList', frameworks, 'framework');
  renderPillGroup('filterYearList', years, 'year');
}

function renderPillGroup(containerId, list, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  
  list.forEach(val => {
    const pill = document.createElement('button');
    pill.className = `filter-pill ${val === 'all' ? 'active' : ''}`;
    pill.dataset.filterType = type;
    pill.dataset.val = val;
    pill.textContent = val === 'all' ? `All ${capitalize(type)}s` : val;
    
    pill.addEventListener('click', () => {
      // Toggle active states within same filter type
      const activePill = container.querySelector('.filter-pill.active');
      if (activePill) {
        activePill.classList.remove('active');
      }
      pill.classList.add('active');
      
      // Hook search.js to run queries with updated filters
      const searchInputField = document.getElementById('searchInputField');
      const searchQuery = searchInputField ? searchInputField.value : '';
      if (typeof performSearch === 'function') {
        performSearch(searchQuery);
      }
    });
    
    container.appendChild(pill);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
