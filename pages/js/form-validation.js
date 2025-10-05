class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = this.form.querySelectorAll('[data-validate]');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.validateForm(e));
        
        // Real-time validation
        this.fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearError(field));
        });
    }
    
    validateForm(e) {
        let isValid = true;
        
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            this.showFormError('Please fix the errors above.');
        } else {
            this.showFormSuccess('Form submitted successfully!');
        }
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.getAttribute('data-validate');
        
        this.clearError(field);
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
            this.showError(field, 'This field is required.');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, 'Please enter a valid email address.');
                return false;
            }
        }
        
        // Phone validation
        if (type === 'phone' && value) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                this.showError(field, 'Please enter a valid 10-digit phone number.');
                return false;
            }
        }
        
        return true;
    }
    
    showError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    showFormError(message) {
        this.showMessage(message, 'error');
    }
    
    showFormSuccess(message) {
        this.showMessage(message, 'success');
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        this.form.insertBefore(messageElement, this.form.firstChild);
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => messageElement.remove(), 3000);
        }
    }
}

// Add CSS for form validation
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #e74c3c !important;
    }
    
    .error-message {
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: none;
    }
    
    .form-message {
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }
    
    .form-message.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .form-message.error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
`;
document.head.appendChild(style);

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        new FormValidator('contact-form');
    }
    
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        new FormValidator('join-form');
    }
});