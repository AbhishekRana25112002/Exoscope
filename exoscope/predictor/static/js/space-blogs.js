document.addEventListener('DOMContentLoaded', function() {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Scroll animation trigger
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  animateElements.forEach(element => {
    observer.observe(element);
  });

  // Mock data - will be replaced with API calls later
  const mockArticles = [
    {
      id: 1,
      title: "NASA's TESS Discovers Potentially Habitable Super-Earth",
      excerpt: "The Transiting Exoplanet Survey Satellite has found a new world orbiting within the habitable zone of its star.",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      category: "nasa",
      date: "June 15, 2023",
      readTime: "4 min read"
    },
    {
      id: 2,
      title: "JWST Reveals Atmospheric Composition of Distant Exoplanet",
      excerpt: "The James Webb Space Telescope has detected water vapor and clouds on a hot gas giant 1,150 light-years away.",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      category: "exoplanets",
      date: "June 12, 2023",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "ESA's Ariel Mission: Preparing to Study Exoplanet Atmospheres",
      excerpt: "The European Space Agency's upcoming mission will characterize 1,000 exoplanet atmospheres.",
      image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      category: "missions",
      date: "June 8, 2023",
      readTime: "5 min read"
    },
    {
      id: 4,
      title: "New Algorithm Finds 100 Potential Exoplanets in Kepler Data",
      excerpt: "Machine learning techniques continue to uncover hidden gems in archival telescope data.",
      image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      category: "exoplanets",
      date: "June 5, 2023",
      readTime: "3 min read"
    },
    {
      id: 5,
      title: "NASA's Roman Telescope Will Hunt for Rogue Planets",
      excerpt: "The Nancy Grace Roman Space Telescope may find more free-floating planets than stars in our galaxy.",
      image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      category: "nasa",
      date: "June 1, 2023",
      readTime: "7 min read"
    },
    {
      id: 6,
      title: "Breakthrough in Detecting Exoplanet Magnetic Fields",
      excerpt: "Astronomers develop new technique to study magnetic environments of distant worlds.",
      image: "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      category: "exoplanets",
      date: "May 28, 2023",
      readTime: "5 min read"
    }
  ];

  // Render articles
  function renderArticles(articles) {
    const newsFeed = document.getElementById('newsFeed');
    newsFeed.innerHTML = '';
    
    if (articles.length === 0) {
      newsFeed.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-search fa-3x mb-3 text-muted"></i>
          <h4>No articles found</h4>
          <p class="text-muted">Try adjusting your filters or search term</p>
        </div>
      `;
      return;
    }
    
    articles.forEach(article => {
      const articleCol = document.createElement('div');
      articleCol.className = 'col-md-6 col-lg-4 mb-4 animate-on-scroll slide-up';
      articleCol.innerHTML = `
        <div class="card article-card h-100">
          <img src="${article.image}" class="card-img-top" alt="${article.title}">
          <span class="badge bg-primary">${article.category.toUpperCase()}</span>
          <div class="card-body">
            <h5 class="card-title">${article.title}</h5>
            <p class="card-text text-muted">${article.excerpt}</p>
          </div>
          <div class="card-footer bg-transparent">
            <small class="text-muted">${article.date} • ${article.readTime}</small>
          </div>
        </div>
      `;
      newsFeed.appendChild(articleCol);
      
      // Observe the new element for scroll animations
      observer.observe(articleCol);
    });
  }

  // Filter articles
  function filterArticles() {
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = mockArticles;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(article => article.category === activeCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm) || 
        article.excerpt.toLowerCase().includes(searchTerm)
      );
    }
    
    renderArticles(filtered);
  }

  // Event listeners
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterArticles();
    });
  });

  document.getElementById('searchBtn').addEventListener('click', filterArticles);
  document.getElementById('searchInput').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') filterArticles();
  });

  // Initial render
  setTimeout(() => {
    renderArticles(mockArticles);
  }, 1000); // Simulate loading delay
});