class Slideshow {
    constructor(container) {
        this.slides = container.querySelectorAll('.slide');
        this.prevBtn = container.querySelector('.prev-btn');
        this.nextBtn = container.querySelector('.next-btn');
        this.currentSlide = 0;
        
        this.init();
    }
    
    init() {
        this.showSlide(this.currentSlide);
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Auto-advance slides every 5 seconds
        this.startAutoPlay();
        
        // Pause auto-play on hover
        this.slides[0].parentElement.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slides[0].parentElement.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Show current slide
        this.slides[index].classList.add('active');
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }
    
    startAutoPlay() {
        this.autoPlay = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlay);
    }
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const slideshowContainer = document.querySelector('.events-slideshow');
    if (slideshowContainer) {
        new Slideshow(slideshowContainer.parentElement);
    }
});