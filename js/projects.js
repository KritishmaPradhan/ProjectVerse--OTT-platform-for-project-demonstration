/* projects.js - Dynamic Projects Data Access Layer */

const ProjectsAPI = {
  projects: [],
  isLoaded: false,
  
  async loadProjects() {
    if (this.isLoaded) return this.projects;
    
    // Resolve relative path dynamically based on route depth
    const pathPrefix = window.location.pathname.includes('/projects/') ? '../' : '';
    
    try {
      const response = await fetch(`${pathPrefix}data/projects.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.projects = await response.json();
      this.isLoaded = true;
      return this.projects;
    } catch (error) {
      console.error("Failed to load projects data:", error);
      // Fail-safe fallbacks if JSON request is blocked or offline
      this.projects = this.getFallbackProjects();
      this.isLoaded = true;
      return this.projects;
    }
  },

  async getProjects() {
    return await this.loadProjects();
  },

  async getProjectById(id) {
    const list = await this.getProjects();
    return list.find(p => p.id === id);
  },

  async getProjectsByCategory(category) {
    const list = await this.getProjects();
    return list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  },

  getFallbackProjects() {
    return [
      {
        "id": "khoj",
        "title": "Khoj",
        "tagline": "An AI-powered cognitive search & intelligent retrieval engine.",
        "description": "Khoj is an advanced search and discovery platform that utilizes machine learning and vector embeddings to locate hidden or forgotten information across scattered databases.",
        "problemStatement": "Traditional search systems rely heavily on exact keyword matching, which fails when users don't know the exact vocabulary used.",
        "features": ["Semantic Search via Vector Embeddings", "Multi-source Document Indexing", "Interactive AI Chat Q&A Assistant"],
        "techStack": ["Python", "FastAPI", "Qdrant", "React"],
        "category": "AI & Machine Learning",
        "duration": "16 Weeks",
        "year": "2026",
        "language": "Python",
        "framework": "FastAPI",
        "poster": "images/posters/khoj.jpg",
        "banner": "images/banners/khoj.jpg",
        "demoVideo": "videos/demos/khoj.mp4",
        "githubUrl": "https://github.com/KritishmaPradhan/khoj"
      },
      {
        "id": "hastakala",
        "title": "Hastakala",
        "tagline": "Connecting traditional Nepalese artisans with global craft enthusiasts.",
        "description": "Hastakala is a premium e-commerce marketplace dedicated to traditional handmade crafts designed to empower local artisans.",
        "problemStatement": "Indigenous artisans often live in remote areas with limited access to modern digital commerce, leaving them dependent on local middlemen.",
        "features": ["Artisan Shopfronts", "Interactive Provenance Map", "AR Viewer for Crafts"],
        "techStack": ["JavaScript", "Node.js", "Express", "Three.js"],
        "category": "Web Applications",
        "duration": "10 Weeks",
        "year": "2026",
        "language": "JavaScript",
        "framework": "Express",
        "poster": "images/posters/hastakala.jpg",
        "banner": "images/banners/hastakala.jpg",
        "demoVideo": "videos/demos/hastakala.mp4",
        "githubUrl": "https://github.com/KritishmaPradhan/hastakala"
      },
      {
        "id": "chatsphere",
        "title": "ChatSphere",
        "tagline": "Real-time communication with virtual rooms and dynamic theme syncing.",
        "description": "ChatSphere is a real-time messaging, audio calling, and collaboration platform offering sleek custom-themed chat rooms.",
        "problemStatement": "Most casual messaging web apps lack tools tailored for developers, such as seamless multi-language code editors.",
        "features": ["Instant Messaging", "Collaborative Code Editor", "SVG Sketchpad Overlay"],
        "techStack": ["JavaScript", "React", "Node.js", "Socket.io"],
        "category": "Web Applications",
        "duration": "8 Weeks",
        "year": "2026",
        "language": "JavaScript",
        "framework": "React",
        "poster": "images/posters/chatsphere.jpg",
        "banner": "images/banners/chatsphere.jpg",
        "demoVideo": "videos/demos/chatsphere.mp4",
        "githubUrl": "https://github.com/KritishmaPradhan/chatsphere"
      },
      {
        "id": "lostfound",
        "title": "Lost & Found",
        "tagline": "A smart, localized portal to report, track, and recover items.",
        "description": "Lost & Found is a community-driven locator portal tailored for college campuses allowing easy item tracking.",
        "problemStatement": "Lost-and-found systems in communities are often fragmented, relying on physical bulletin boards.",
        "features": ["AI Tagging Integration", "Secure Claim Validation", "Dev Tunnel Access Configuration"],
        "techStack": ["JavaScript", "Laravel", "React", "MySQL"],
        "category": "Web Applications",
        "duration": "12 Weeks",
        "year": "2026",
        "language": "JavaScript",
        "framework": "React",
        "poster": "images/posters/lostfound.jpg",
        "banner": "images/banners/lostfound.jpg",
        "demoVideo": "videos/demos/lostfound.mp4",
        "githubUrl": "https://github/KritishmaPradhan/lost-and-found"
      }
    ];
  }
};

window.ProjectsAPI = ProjectsAPI;

