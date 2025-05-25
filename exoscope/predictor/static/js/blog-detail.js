document.addEventListener('DOMContentLoaded', function() {
  // Animate elements when they come into view
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.cosmic-title, .cosmic-article, .galactic-actions, .comment-comet, .comment-nebula, .galaxy-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (elementPosition < screenPosition) {
        element.classList.add('animate__animated', 'animate__fadeInUp');
      }
    });
  };

  // Run on initial load
  animateOnScroll();
  
  // Run on scroll
  window.addEventListener('scroll', animateOnScroll);

  // Smooth scroll for navigation
  document.querySelector('.cosmic-scroll-indicator').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.nebula-content').scrollIntoView({
      behavior: 'smooth'
    });
  });

  // Like button functionality
  const likeButtons = document.querySelectorAll('.like-btn');
  likeButtons.forEach(button => {
    button.addEventListener('click', function() {
      this.classList.toggle('liked');
      const icon = this.querySelector('i');
      const span = this.querySelector('span');
      
      if (this.classList.contains('liked')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        if (span) span.textContent = 'Liked';
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        if (span) span.textContent = 'Like';
      }
    });
  });

  // Bookmark button functionality
  const bookmarkButton = document.querySelector('.bookmark-btn');
  if (bookmarkButton) {
    bookmarkButton.addEventListener('click', function() {
      this.classList.toggle('bookmarked');
      const icon = this.querySelector('i');
      const span = this.querySelector('span');
      
      if (this.classList.contains('bookmarked')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        if (span) span.textContent = 'Saved';
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        if (span) span.textContent = 'Save';
      }
    });
  }

  // Reply button functionality
  const replyButtons = document.querySelectorAll('.reply-btn');
  replyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const commentId = this.closest('.comment-orbit').dataset.commentId;
      const form = document.querySelector('.comment-nebula');
      const textarea = form.querySelector('textarea');
      
      // Scroll to form
      form.scrollIntoView({ behavior: 'smooth' });
      
      // Focus textarea and add mention
      textarea.focus();
      textarea.value = `@${this.closest('.comment-comet').querySelector('strong').textContent}, `;
    });
  });

  // Form submission feedback
  const commentForm = document.querySelector('.cosmic-form');
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      const submitButton = this.querySelector('button[type="submit"]');
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Launching...';
      submitButton.disabled = true;
    });
  }
});