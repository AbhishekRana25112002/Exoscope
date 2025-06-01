document.addEventListener('DOMContentLoaded', function() {
    // Set max date to today
    const dateInput = document.getElementById('date');
    if (dateInput && !dateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Add loading state to form button
    const form = document.querySelector('.apod-form');
    if (form) {
        form.addEventListener('submit', function() {
            const button = this.querySelector('button[type="submit"]');
            if (button) {
                button.innerHTML = '<span class="button-text">Loading...</span><span class="button-icon">🌌</span>';
                button.disabled = true;
            }
        });
    }

    // Lazy load images with Intersection Observer
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.apod-image[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src || image.src;
                    imageObserver.unobserve(image);
                }
            });
        });

        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    }
});