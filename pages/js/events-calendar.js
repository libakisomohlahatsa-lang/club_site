// js/events-calendar.js
class EventsCalendar {
    constructor() {
        this.currentDate = new Date();
        this.events = this.getEventsFromPage();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCalendar();
    }

    setupEventListeners() {
        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleView(e.target));
        });

        // Calendar navigation
        document.getElementById('prev-month')?.addEventListener('click', () => this.previousMonth());
        document.getElementById('next-month')?.addEventListener('click', () => this.nextMonth());

        // Filter buttons
        document.querySelectorAll('.events-filter .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterEvents(e.target));
        });
    }

    toggleView(button) {
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const view = button.getAttribute('data-view');
        const calendarView = document.getElementById('calendar-view');
        const listView = document.getElementById('events-list');

        if (view === 'calendar') {
            calendarView.style.display = 'block';
            listView.style.display = 'none';
            this.renderCalendar();
        } else {
            calendarView.style.display = 'none';
            listView.style.display = 'block';
        }
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        if (!calendarGrid) return;

        const month = this.currentDate.getMonth();
        const year = this.currentDate.getFullYear();
        
        // Update month header
        document.getElementById('current-month').textContent = 
            this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        // Clear previous calendar
        calendarGrid.innerHTML = '';

        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day header';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `<div class="day-number">${day}</div>`;
            
            // Add events for this day
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = this.getEventsForDate(dateString);
            
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'calendar-event';
                eventElement.textContent = event.title;
                eventElement.title = `${event.title} - ${event.time}`;
                dayElement.appendChild(eventElement);
            });

            calendarGrid.appendChild(dayElement);
        }
    }

    getEventsFromPage() {
        const events = [];
        const eventCards = document.querySelectorAll('.event-card');

        eventCards.forEach(card => {
            const date = card.getAttribute('data-date');
            const title = card.querySelector('h3').textContent;
            const time = card.querySelector('.event-time').textContent;
            const category = card.getAttribute('data-category');

            events.push({
                date,
                title,
                time,
                category
            });
        });

        return events;
    }

    getEventsForDate(dateString) {
        return this.events.filter(event => event.date === dateString);
    }

    filterEvents(button) {
        // Remove active class from all filter buttons
        document.querySelectorAll('.events-filter .filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        const eventCards = document.querySelectorAll('.event-card');
        const currentDate = new Date();
        
        eventCards.forEach(card => {
            const eventDate = new Date(card.getAttribute('data-date'));
            const isPast = eventDate < currentDate;
            
            switch (filter) {
                case 'all':
                    card.style.display = 'grid';
                    break;
                case 'upcoming':
                    card.style.display = isPast ? 'none' : 'grid';
                    break;
                case 'this-week':
                    const oneWeekFromNow = new Date();
                    oneWeekFromNow.setDate(currentDate.getDate() + 7);
                    card.style.display = (eventDate >= currentDate && eventDate <= oneWeekFromNow) ? 'grid' : 'none';
                    break;
                case 'month':
                    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                    card.style.display = (eventDate >= currentDate && eventDate <= endOfMonth) ? 'grid' : 'none';
                    break;
                case 'past':
                    card.style.display = isPast ? 'grid' : 'none';
                    break;
            }
        });

        // Show/hide month sections based on visible events
        document.querySelectorAll('.events-month').forEach(monthSection => {
            const hasVisibleEvents = monthSection.querySelector('.event-card[style=""]') || 
                                   monthSection.querySelector('.event-card[style="grid"]');
            monthSection.style.display = hasVisibleEvents ? 'block' : 'none';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new EventsCalendar();
    
    // RSVP button functionality
    document.querySelectorAll('.rsvp-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const eventTitle = this.closest('.event-card').querySelector('h3').textContent;
            alert(`Thank you for your interest in "${eventTitle}"! The club organizer will contact you with more details.`);
        });
    });

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}! You'll receive our next newsletter soon.`);
            this.reset();
        });
    }
});