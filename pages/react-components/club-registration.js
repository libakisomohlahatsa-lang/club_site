// react-components/club-registration.js
const { useState } = React;

const ClubRegistrationForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        studentId: '',
        selectedClub: '',
        year: '',
        interests: '',
        message: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const clubs = [
        { id: 'drama', name: 'Drama Club' },
        { id: 'tech', name: 'Tech Club' },
        { id: 'debate', name: 'Debate Club' },
        { id: 'sports', name: 'Sports Club' }
    ];

    const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.studentId.trim()) {
            newErrors.studentId = 'Student ID is required';
        }

        if (!formData.selectedClub) {
            newErrors.selectedClub = 'Please select a club';
        }

        if (!formData.year) {
            newErrors.year = 'Please select your year';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('Form submitted:', formData);
            setIsSubmitted(true);
            setFormData({
                fullName: '',
                email: '',
                studentId: '',
                selectedClub: '',
                year: '',
                interests: '',
                message: ''
            });
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="success-message">
                <h3>🎉 Registration Successful!</h3>
                <p>Thank you for registering for the {clubs.find(club => club.id === formData.selectedClub)?.name}. 
                   We'll contact you at {formData.email} with more details.</p>
                <button 
                    onClick={() => setIsSubmitted(false)}
                    className="cta-button"
                >
                    Register Another Student
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="club-registration-form">
            <h3>Join a Club</h3>
            
            <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="studentId">Student ID *</label>
                <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className={errors.studentId ? 'error' : ''}
                />
                {errors.studentId && <span className="error-text">{errors.studentId}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="selectedClub">Select Club *</label>
                    <select
                        id="selectedClub"
                        name="selectedClub"
                        value={formData.selectedClub}
                        onChange={handleChange}
                        className={errors.selectedClub ? 'error' : ''}
                    >
                        <option value="">Choose a club...</option>
                        {clubs.map(club => (
                            <option key={club.id} value={club.id}>
                                {club.name}
                            </option>
                        ))}
                    </select>
                    {errors.selectedClub && <span className="error-text">{errors.selectedClub}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="year">Academic Year *</label>
                    <select
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className={errors.year ? 'error' : ''}
                    >
                        <option value="">Select year...</option>
                        {years.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    {errors.year && <span className="error-text">{errors.year}</span>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="interests">Your Interests</label>
                <input
                    type="text"
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="e.g., Acting, Web Development, Basketball..."
                />
            </div>

            <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell us why you want to join this club..."
                ></textarea>
            </div>

            <button 
                type="submit" 
                disabled={isSubmitting}
                className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            >
                {isSubmitting ? 'Submitting...' : 'Join Club'}
            </button>
        </form>
    );
};

// Add React-specific CSS
const reactStyles = `
.club-registration-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background: var(--white);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
}

.club-registration-form h3 {
    color: var(--primary-color);
    margin-bottom: 2rem;
    text-align: center;
    font-size: 1.8rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--primary-color);
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--secondary-color);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
    border-color: #e74c3c;
}

.error-text {
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

.submit-button {
    width: 100%;
    background: var(--secondary-color);
    color: var(--white);
    padding: 1rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
    background: #2980b9;
}

.submit-button:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
}

.submit-button.submitting {
    position: relative;
}

.submit-button.submitting::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid var(--white);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.success-message {
    text-align: center;
    padding: 3rem 2rem;
    background: var(--white);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
}

.success-message h3 {
    color: #27ae60;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .club-registration-form {
        padding: 1.5rem;
        margin: 0 1rem;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = reactStyles;
document.head.appendChild(styleSheet);