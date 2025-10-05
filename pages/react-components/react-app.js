// react-components/react-app.js
// This file demonstrates how to integrate React into your existing HTML

class ReactIntegration {
    static init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.renderComponents());
        } else {
            this.renderComponents();
        }
    }

    static renderComponents() {
        // Find all containers where React components should be rendered
        const registrationContainers = document.querySelectorAll('.react-registration-form');
        
        registrationContainers.forEach(container => {
            // Render React component
            ReactDOM.render(React.createElement(ClubRegistrationForm), container);
        });
    }
}

// Initialize React integration
ReactIntegration.init();