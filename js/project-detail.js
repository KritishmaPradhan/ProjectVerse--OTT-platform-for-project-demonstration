/* project-detail.js - Dynamic Template Populator */

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (!projectId) {
    showError();
    return;
  }

  try {
    const project = await ProjectsAPI.getProjectById(projectId);
    
    if (!project) {
      showError();
      return;
    }
    
    populateProjectDetails(project);
  } catch (error) {
    console.error("Error populating project:", error);
    showError();
  }
});

function showError() {
  const mainContent = document.getElementById('mainContent');
  const errorContainer = document.getElementById('errorContainer');
  const heroTitle = document.getElementById('projTitle');
  const heroDesc = document.getElementById('projTagline');
  
  if (mainContent) mainContent.style.display = 'none';
  if (errorContainer) errorContainer.style.display = 'block';
  if (heroTitle) heroTitle.textContent = 'Project Not Found';
  if (heroDesc) heroDesc.textContent = '';
  
  hideLoadingScreen();
}

function populateProjectDetails(project) {
  // Update Title and Meta
  document.title = `${project.title} - ProjectVerse`;

  // Hero Section
  document.getElementById('projCategory').textContent = (project.category || 'PROJECT').toUpperCase();
  document.getElementById('projTitle').textContent = project.title;
  document.getElementById('projTagline').textContent = project.tagline;
  
  // Optional Banner Logic (fallback to poster or gradient)
  const heroSection = document.getElementById('hero');
  if (project.banner) {
    heroSection.style.background = `linear-gradient(to top, var(--bg-color) 0%, rgba(8,1,15,0.4) 100%), radial-gradient(circle at center, rgba(171, 24, 90, 0.2) 0%, transparent 70%), url('../${project.banner}') center/cover no-repeat`;
  }
  
  // Left Side Description Blocks
  document.getElementById('projDescription').textContent = project.description;
  document.getElementById('projProblem').textContent = project.problemStatement;
  
  // Features List
  const featuresList = document.getElementById('projFeatures');
  featuresList.innerHTML = '';
  if (project.features && project.features.length > 0) {
    project.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });
  }

  // Challenges
  const challengesSection = document.getElementById('projChallengesSection');
  if (project.challenges) {
    document.getElementById('projChallenges').textContent = project.challenges;
    challengesSection.style.display = 'block';
  } else {
    challengesSection.style.display = 'none';
  }

  // Video and Poster
  const posterDiv = document.getElementById('projPoster');
  if (project.poster) {
    posterDiv.style.background = `linear-gradient(rgba(0, 0, 0, 0.708), rgba(0, 0, 0, 0.697)), url('../${project.poster}') center/cover no-repeat`;
  }
  if (project.demoVideo) {
    posterDiv.onclick = () => window.openVideoModal('../' + project.demoVideo);
  } else {
    posterDiv.style.cursor = 'default';
    const playBtn = posterDiv.querySelector('.overlay-play');
    if (playBtn) playBtn.style.display = 'none';
  }

  // Right Side Meta
  document.getElementById('projYear').textContent = project.year || 'N/A';
  document.getElementById('projDuration').textContent = project.duration || 'N/A';
  document.getElementById('projLanguage').textContent = project.language || 'N/A';
  document.getElementById('projFramework').textContent = project.framework || 'N/A';
  
  // Tech Stack
  const techStackContainer = document.getElementById('projTechStack');
  techStackContainer.innerHTML = '';
  if (project.techStack && project.techStack.length > 0) {
    project.techStack.forEach(tech => {
      const span = document.createElement('span');
      span.className = 'tech-badge';
      span.textContent = tech;
      techStackContainer.appendChild(span);
    });
  }

  // Links
  const githubLink = document.getElementById('projGithub');
  if (project.githubUrl) {
    githubLink.href = project.githubUrl;
    githubLink.style.display = 'inline-flex';
  }

  // Show content
  document.getElementById('mainContent').style.display = 'block';
  hideLoadingScreen();
}
