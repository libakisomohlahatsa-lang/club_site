// events.js - University Clubs Hub Events Page Functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Events page loaded - initializing functionality');
    
    // Initialize all components
    initSlideshow();
    initEventFilters();
    initFormValidation();
    highlightActivePage();
    initCountdownTimers();
    initLightbox();
    initSmoothScrolling();
    initMobileNavigation();
    initRegisterButtons();
    initGalleryButtons();
    
    console.log('All event page components initialized successfully');
});

// Slideshow functionality
let slideIndex = 1;
let slideInterval;

function initSlideshow() {
    console.log('Initializing slideshow');
    
    // Show first slide
    showSlides(slideIndex);
    
    // Auto-advance slideshow every 5 seconds
    slideInterval = setInterval(() => {
        plusSlides(1);
    }, 5000);
    
    // Pause slideshow on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            console.log('Slideshow paused');
            clearInterval(slideInterval);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            console.log('Slideshow resumed');
            slideInterval = setInterval(() => {
                plusSlides(1);
            }, 5000);
        });
    }
}

function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove('active');
    }
    
    // Remove active class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active-dot", "");
    }
    
    // Show the current slide and activate the corresponding dot
    if (slides.length > 0) {
        slides[slideIndex - 1].style.display = "block";
        slides[slideIndex - 1].classList.add('active');
        dots[slideIndex - 1].className += " active-dot";
    }
}

function plusSlides(n) {
    console.log(`Changing slide by: ${n}`);
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    console.log(`Jumping to slide: ${n}`);
    showSlides(slideIndex = n);
}

// Event filtering functionality
function initEventFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    console.log(`Found ${filterButtons.length} filter buttons`);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            console.log(`Filtering events by: ${filterValue}`);
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            filterEvents(filterValue);
        });
    });
}

function filterEvents(category) {
    const eventCards = document.querySelectorAll('.event-card');
    let visibleCount = 0;
    
    eventCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log(`Filtered events: ${visibleCount} visible out of ${eventCards.length}`);
    
    // Show message if no events match filter
    showFilterMessage(visibleCount, category);
}

function showFilterMessage(visibleCount, category) {
    // Remove existing message
    const existingMessage = document.querySelector('.filter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (visibleCount === 0) {
        const eventsGrid = document.querySelector('.events-grid');
        const message = document.createElement('div');
        message.className = 'filter-message';
        message.innerHTML = `
            <div class="no-events-message">
                <i class="fas fa-calendar-times"></i>
                <h3>No events found</h3>
                <p>There are no ${category !== 'all' ? category + ' ' : ''}events scheduled at the moment.</p>
                <button class="btn btn-outline show-all-events">Show All Events</button>
            </div>
        `;
        
        eventsGrid.appendChild(message);
        
        // Add event listener to show all events button
        const showAllBtn = message.querySelector('.show-all-events');
        showAllBtn.addEventListener('click', () => {
            filterEvents('all');
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.getAttribute('data-filter') === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    }
}

// Form validation
function initFormValidation() {
    const form = document.getElementById('event-form');
    
    if (!form) {
        console.warn('Event form not found');
        return;
    }
    
    console.log('Initializing form validation');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submission attempted');
        
        if (validateForm()) {
            console.log('Form validation successful');
            showFormSuccess();
        } else {
            console.log('Form validation failed');
        }
    });
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
    
    // Add future date validation for date field
    const dateField = document.getElementById('event-date');
    if (dateField) {
        dateField.addEventListener('change', function() {
            validateFutureDate(this);
        });
    }
}

function validateForm() {
    const form = document.getElementById('event-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    let isValid = true;
    const value = field.value.trim();
    const errorElement = document.getElementById(field.id + '-error');
    
    // Clear previous error
    clearError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && value === '') {
        showError(field, errorElement, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, errorElement, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Text area minimum length
    if (field.type === 'textarea' && value !== '' && value.length < 20) {
        showError(field, errorElement, 'Please provide a more detailed description (at least 20 characters)');
        isValid = false;
    }
    
    return isValid;
}

function validateFutureDate(dateField) {
    const value = dateField.value;
    const errorElement = document.getElementById(dateField.id + '-error');
    
    if (value !== '') {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showError(dateField, errorElement, 'Event date must be in the future');
            return false;
        }
    }
    
    return true;
}

function showError(field, errorElement, message) {
    field.style.borderColor = '#e74c3c';
    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(field) {
    field.style.borderColor = '#ddd';
    field.classList.remove('error');
    const errorElement = document.getElementById(field.id + '-error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function showFormSuccess() {
    const form = document.getElementById('event-form');
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    console.log('Showing form success state');
    
    // Change button to show success
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Event Submitted!';
    submitBtn.style.backgroundColor = '#2ecc71';
    submitBtn.disabled = true;
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Thank You!</h3>
            <p>Your event has been submitted for review. We'll contact you at the provided email within 2 business days.</p>
        </div>
    `;
    
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    // Reset form after delay
    setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.style.backgroundColor = '';
        submitBtn.disabled = false;
        successMessage.remove();
        
        console.log('Form reset completed');
    }, 5000);
}

// Navigation highlighting
function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    console.log(`Current page: ${currentPage}`);
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
            console.log(`Active page: ${link.textContent}`);
        } else {
            link.classList.remove('active');
        }
    });
}

// Countdown timers
function initCountdownTimers() {
    const countdownElements = document.querySelectorAll('.countdown-timer');
    console.log(`Found ${countdownElements.length} countdown timers`);
    
    countdownElements.forEach(element => {
        const targetDate = new Date(element.getAttribute('data-date'));
        updateCountdown(element, targetDate);
        
        // Update countdown every hour
        setInterval(() => {
            updateCountdown(element, targetDate);
        }, 3600000); // 1 hour
    });
}

function updateCountdown(element, targetDate) {
    const now = new Date();
    const timeDiff = targetDate - now;
    
    if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        let countdownText = `<span class="countdown-days">${days}</span> days`;
        if (days === 0) {
            countdownText = `<span class="countdown-hours">${hours}</span> hours`;
        }
        
        element.innerHTML = countdownText;
    } else {
        element.innerHTML = '<span class="event-live">Event Live!</span>';
        element.style.backgroundColor = '#2ecc71';
    }
}

// Lightbox functionality
function initLightbox() {
    const viewGalleryButtons = document.querySelectorAll('.view-gallery-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    console.log(`Found ${viewGalleryButtons.length} gallery buttons`);
    
    // Sample gallery images (in a real app, these would come from a database)
    const galleryImages = {
        'Valentine\'s Day Improv Show': [
            'images/valentines_improv_1.jpg',
            'images/valentines_improv_2.jpg',
            'images/valentines_improv_3.jpg'
        ],
        'Winter Coding Workshop': [
            'images/winter_workshop_1.jpg',
            'images/winter_workshop_2.jpg',
            'images/winter_workshop_3.jpg'
        ],
        'Holiday Celebration Party': [
            'images/holiday_party_1.jpg',
            'images/holiday_party_2.jpg',
            'images/holiday_party_3.jpg'
        ]
    };
    
    let currentGallery = [];
    let currentImageIndex = 0;
    
    // Add event listeners to gallery buttons
    viewGalleryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const slide = this.closest('.slide');
            const eventTitle = slide.querySelector('h3').textContent;
            
            console.log(`Opening gallery for: ${eventTitle}`);
            
            // Get images for this event
            currentGallery = galleryImages[eventTitle] || ['images/placeholder_gallery.jpg'];
            currentImageIndex = 0;
            
            openLightbox(currentGallery[currentImageIndex], eventTitle);
        });
    });
    
    function openLightbox(imageSrc, caption) {
        lightboxImage.src = imageSrc;
        lightboxCaption.textContent = caption;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add navigation if multiple images
        if (currentGallery.length > 1) {
            addLightboxNavigation();
        }
    }
    
    function addLightboxNavigation() {
        // Remove existing navigation
        const existingPrev = lightbox.querySelector('.lightbox-prev');
        const existingNext = lightbox.querySelector('.lightbox-next');
        if (existingPrev) existingPrev.remove();
        if (existingNext) existingNext.remove();
        
        // Add previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'lightbox-prev';
        prevBtn.innerHTML = '&#10094;';
        prevBtn.addEventListener('click', showPrevImage);
        lightbox.querySelector('.lightbox-content').appendChild(prevBtn);
        
        // Add next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'lightbox-next';
        nextBtn.innerHTML = '&#10095;';
        nextBtn.addEventListener('click', showNextImage);
        lightbox.querySelector('.lightbox-content').appendChild(nextBtn);
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
        lightboxImage.src = currentGallery[currentImageIndex];
        lightboxImage.style.animation = 'fadeIn 0.5s';
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
        lightboxImage.src = currentGallery[currentImageIndex];
        lightboxImage.style.animation = 'fadeIn 0.5s';
    }
    
    // Close lightbox
    if (closeLightbox) {
        closeLightbox.addEventListener('click', closeLightboxHandler);
    }
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightboxHandler();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightboxHandler();
        }
        
        // Navigation with arrow keys
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
    
    function closeLightboxHandler() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        console.log('Lightbox closed');
    }
}

// Smooth scrolling
function initSmoothScrolling() {
    const scrollToEventsBtn = document.getElementById('scroll-to-events');
    const registerEventBtn = document.getElementById('register-event-btn');
    
    if (scrollToEventsBtn) {
        scrollToEventsBtn.addEventListener('click', function() {
            console.log('Scrolling to events section');
            document.getElementById('upcoming-events').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    if (registerEventBtn) {
        registerEventBtn.addEventListener('click', function() {
            console.log('Scrolling to registration section');
            document.getElementById('register-event').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Mobile navigation
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            const isExpanded = navMenu.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            
            console.log(`Mobile menu ${isExpanded ? 'opened' : 'closed'}`);
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Register button functionality
function initRegisterButtons() {
    const registerButtons = document.querySelectorAll('.register-btn');
    console.log(`Found ${registerButtons.length} register buttons`);
    
    registerButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard.querySelector('.event-title').textContent;
            
            console.log(`Register button clicked for: ${eventTitle}`);
            
            // Show registration modal or form
            showRegistrationModal(eventTitle, eventCard);
        });
    });
}

function showRegistrationModal(eventTitle, eventCard) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'registration-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Register for ${eventTitle}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form class="quick-registration-form">
                    <div class="form-group">
                        <label for="quick-name">Full Name *</label>
                        <input type="text" id="quick-name" required>
                    </div>
                    <div class="form-group">
                        <label for="quick-email">Email *</label>
                        <input type="email" id="quick-email" required>
                    </div>
                    <div class="form-group">
                        <label for="quick-student-id">Student ID</label>
                        <input type="text" id="quick-student-id" placeholder="Optional">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Complete Registration</button>
                        <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = modal.querySelector('.quick-registration-form');
    
    function closeModal() {
        modal.remove();
        console.log('Registration modal closed');
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('quick-name').value;
        const email = document.getElementById('quick-email').value;
        
        if (name && email) {
            // Simulate successful registration
            modal.querySelector('.modal-body').innerHTML = `
                <div class="registration-success">
                    <i class="fas fa-check-circle"></i>
                    <h4>Registration Successful!</h4>
                    <p>Thank you, ${name}! You've successfully registered for "${eventTitle}".</p>
                    <p>We've sent a confirmation email to ${email}.</p>
                    <button class="btn btn-primary close-success">Done</button>
                </div>
            `;
            
            modal.querySelector('.close-success').addEventListener('click', closeModal);
            
            console.log(`Registration completed for: ${name} (${email})`);
        }
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Gallery buttons for past events
function initGalleryButtons() {
    // This is handled by the lightbox functionality
    console.log('Gallery buttons initialized');
}

// Add CSS animations dynamically
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .event-card {
            animation: fadeIn 0.6s ease-out;
        }
        
        .error {
            border-color: #e74c3c !important;
            background-color: #fdf2f2;
        }
        
        .success-message {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            padding: 2rem;
            margin: 2rem 0;
            text-align: center;
            animation: fadeIn 0.5s;
        }
        
        .success-content i {
            font-size: 3rem;
            color: #28a745;
            margin-bottom: 1rem;
        }
        
        .registration-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            animation: fadeIn 0.3s;
        }
        
        .registration-modal .modal-content {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .lightbox-prev, .lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            font-size: 2rem;
            padding: 1rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .lightbox-prev:hover, .lightbox-next:hover {
            background: rgba(0,0,0,0.8);
        }
        
        .lightbox-prev { left: 10px; }
        .lightbox-next { right: 10px; }
        
        .no-events-message {
            text-align: center;
            padding: 3rem;
            grid-column: 1 / -1;
        }
        
        .no-events-message i {
            font-size: 4rem;
            color: #bdc3c7;
            margin-bottom: 1rem;
        }
        
        .event-live {
            color: white;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// Export functions for global access (if needed)
window.plusSlides = plusSlides;
window.currentSlide = currentSlide;

console.log('Events JavaScript loaded successfully');