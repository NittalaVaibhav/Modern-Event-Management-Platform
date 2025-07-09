// Global state
let currentUser = null;
let events = [
    {
        id: '1',
        title: 'AI & Machine Learning Summit 2025',
        description: 'Explore the future of AI with industry leaders, researchers, and practitioners. Learn about cutting-edge technologies, ethical AI development, and practical applications across industries.',
        date: '2025-03-15',
        time: '09:00',
        location: 'Silicon Valley Convention Center',
        category: 'Technology',
        capacity: 500,
        registered: 342,
        image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 299,
        featured: true
    },
    {
        id: '2',
        title: 'Sustainable Future Conference',
        description: 'Join environmental experts, activists, and policy makers to discuss climate change solutions, renewable energy innovations, and sustainable business practices.',
        date: '2025-03-22',
        time: '10:00',
        location: 'Green Campus Auditorium',
        category: 'Environment',
        capacity: 300,
        registered: 156,
        image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 0,
        featured: false
    },
    {
        id: '3',
        title: 'Startup Pitch Competition',
        description: 'Present your innovative ideas to top-tier investors and industry mentors. Network with fellow entrepreneurs and compete for funding opportunities.',
        date: '2025-04-05',
        time: '14:00',
        location: 'Innovation Hub Downtown',
        category: 'Business',
        capacity: 200,
        registered: 89,
        image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 149,
        featured: true
    },
    {
        id: '4',
        title: 'Digital Marketing Masterclass',
        description: 'Master the latest digital marketing strategies, social media trends, and analytics tools. Perfect for marketers and business owners.',
        date: '2025-04-12',
        time: '11:00',
        location: 'Marketing Institute',
        category: 'Business',
        capacity: 150,
        registered: 78,
        image: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 199,
        featured: false
    },
    {
        id: '5',
        title: 'Web Development Workshop',
        description: 'Learn modern web development with React, Node.js, and cloud technologies. Hands-on coding sessions with experienced developers.',
        date: '2025-04-18',
        time: '09:30',
        location: 'Tech Training Center',
        category: 'Technology',
        capacity: 80,
        registered: 65,
        image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 249,
        featured: false
    },
    {
        id: '6',
        title: 'Leadership Excellence Summit',
        description: 'Develop essential leadership skills, emotional intelligence, and team management techniques with renowned leadership coaches.',
        date: '2025-04-25',
        time: '08:00',
        location: 'Executive Conference Center',
        category: 'Business',
        capacity: 250,
        registered: 123,
        image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
        price: 399,
        featured: true
    }
];

let userRegistrations = new Set();
let editingEventId = null;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const authContainer = document.getElementById('authContainer');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            authContainer.classList.remove('hidden');
        }, 500);
    }, 1500);

    // Initialize event listeners
    initializeEventListeners();
});

function initializeEventListeners() {
    // Navigation
    document.getElementById('dashboardNav').addEventListener('click', () => {
        setActiveNav('dashboardNav');
        showDashboard();
    });

    document.getElementById('eventsNav').addEventListener('click', () => {
        setActiveNav('eventsNav');
        showDashboard();
    });

    // Search functionality
    document.getElementById('userSearchEvents')?.addEventListener('input', handleUserSearch);
    document.getElementById('adminSearchEvents')?.addEventListener('input', handleAdminSearch);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterEvents(e.target.dataset.category);
        });
    });

    // Modal click outside to close
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
}

// Authentication functions
function switchToSignup() {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
}

function switchToLogin() {
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    if (!email || !password || !role) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Simulate login
    currentUser = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
        role: role
    };

    showMainApp();
    showNotification(`Welcome back, ${currentUser.name}!`, 'success');
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (!name || !email || !phone || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    // Simulate signup
    currentUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone,
        role: 'user'
    };

    showMainApp();
    showNotification(`Welcome, ${currentUser.name}! Your account has been created.`, 'success');
}

function logout() {
    currentUser = null;
    userRegistrations.clear();
    authContainer.classList.remove('hidden');
    mainApp.classList.add('hidden');
    
    // Reset forms
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginRole').value = '';
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPhone').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
    
    switchToLogin();
    showNotification('Successfully logged out', 'success');
}

function showMainApp() {
    authContainer.classList.add('hidden');
    mainApp.classList.remove('hidden');
    
    // Update user info in header
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role;
    
    if (currentUser.role === 'user') {
        document.getElementById('userWelcomeName').textContent = currentUser.name;
    }
    
    showDashboard();
}

// Dashboard functions
function showDashboard() {
    const adminDashboard = document.getElementById('adminDashboard');
    const userDashboard = document.getElementById('userDashboard');
    
    if (currentUser.role === 'admin') {
        adminDashboard.classList.remove('hidden');
        userDashboard.classList.add('hidden');
        renderAdminDashboard();
    } else {
        userDashboard.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
        renderUserDashboard();
    }
}

function renderAdminDashboard() {
    updateAdminStats();
    renderAdminEventsTable();
}

function updateAdminStats() {
    const totalEvents = events.length;
    const totalRegistrations = events.reduce((sum, event) => sum + event.registered, 0);
    const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
    const avgRegistrations = totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0;

    document.getElementById('totalEvents').textContent = totalEvents;
    document.getElementById('totalRegistrations').textContent = totalRegistrations;
    document.getElementById('upcomingEvents').textContent = upcomingEvents;
    document.getElementById('avgRegistrations').textContent = avgRegistrations;
}

function renderAdminEventsTable() {
    const tableBody = document.getElementById('adminEventsTable');
    tableBody.innerHTML = '';

    events.forEach(event => {
        const row = document.createElement('tr');
        const eventDate = new Date(event.date);
        const isUpcoming = eventDate > new Date();
        
        row.innerHTML = `
            <td>
                <div class="event-cell">
                    <img src="${event.image}" alt="${event.title}" class="event-image">
                    <div class="event-info">
                        <h4>${event.title}</h4>
                        <p>${event.location}</p>
                    </div>
                </div>
            </td>
            <td>${formatDate(event.date)}</td>
            <td>${event.category}</td>
            <td>${event.registered} / ${event.capacity}</td>
            <td>
                <span class="status-badge ${isUpcoming ? 'active' : 'inactive'}">
                    ${isUpcoming ? 'Active' : 'Past'}
                </span>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn edit" onclick="editEvent('${event.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteEvent('${event.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function renderUserDashboard() {
    updateUserStats();
    renderFeaturedEvents();
    renderAllEvents();
    renderMyRegistrations();
}

function updateUserStats() {
    const registeredCount = userRegistrations.size;
    const upcomingCount = events.filter(event => 
        userRegistrations.has(event.id) && new Date(event.date) > new Date()
    ).length;

    document.getElementById('userRegisteredCount').textContent = registeredCount;
    document.getElementById('userUpcomingCount').textContent = upcomingCount;
}

function renderFeaturedEvents() {
    const featuredEvents = events.filter(event => event.featured);
    const container = document.getElementById('featuredEvents');
    renderEventsGrid(featuredEvents, container);
}

function renderAllEvents() {
    const container = document.getElementById('allEvents');
    renderEventsGrid(events, container);
}

function renderMyRegistrations() {
    const myEvents = events.filter(event => userRegistrations.has(event.id));
    const container = document.getElementById('myRegistrations');
    renderEventsGrid(myEvents, container);
}

function renderEventsGrid(eventsList, container) {
    container.innerHTML = '';
    
    if (eventsList.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray-500); padding: 2rem;">No events found</p>';
        return;
    }

    eventsList.forEach(event => {
        const eventCard = createEventCard(event);
        container.appendChild(eventCard);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.onclick = () => showEventDetails(event.id);
    
    const isRegistered = userRegistrations.has(event.id);
    const isFull = event.registered >= event.capacity;
    const isUpcoming = new Date(event.date) > new Date();
    
    card.innerHTML = `
        <div class="event-card-image">
            <img src="${event.image}" alt="${event.title}">
            ${event.featured ? '<span class="featured-badge">Featured</span>' : ''}
        </div>
        <div class="event-card-content">
            <div class="event-card-header">
                <h3 class="event-card-title">${event.title}</h3>
                <span class="event-card-category">${event.category}</span>
            </div>
            <p class="event-card-description">${event.description}</p>
            <div class="event-card-meta">
                <div class="event-meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(event.date)}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${formatTime(event.time)}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-users"></i>
                    <span>${event.registered}/${event.capacity} registered</span>
                </div>
            </div>
            <div class="event-card-footer">
                <div class="event-price ${event.price === 0 ? 'free' : ''}">
                    ${event.price === 0 ? 'Free' : `$${event.price}`}
                </div>
                ${isRegistered ? 
                    '<div class="registered-badge"><i class="fas fa-check"></i> Registered</div>' :
                    `<button class="register-btn" onclick="registerForEvent('${event.id}', event)" ${isFull || !isUpcoming ? 'disabled' : ''}>
                        <i class="fas fa-ticket-alt"></i>
                        ${isFull ? 'Full' : !isUpcoming ? 'Past Event' : 'Register'}
                    </button>`
                }
            </div>
        </div>
    `;
    
    return card;
}

// Event management functions
function showCreateEventModal() {
    editingEventId = null;
    document.getElementById('eventModalTitle').textContent = 'Create New Event';
    document.getElementById('eventSubmitText').textContent = 'Create Event';
    resetEventForm();
    showModal('eventModal');
}

function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    editingEventId = eventId;
    document.getElementById('eventModalTitle').textContent = 'Edit Event';
    document.getElementById('eventSubmitText').textContent = 'Update Event';
    
    // Populate form
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventCategory').value = event.category;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.time;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventCapacity').value = event.capacity;
    document.getElementById('eventPrice').value = event.price;
    document.getElementById('eventFeatured').checked = event.featured;
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('eventImage').value = event.image;
    
    showModal('eventModal');
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(e => e.id !== eventId);
        userRegistrations.delete(eventId);
        renderAdminDashboard();
        showNotification('Event deleted successfully', 'success');
    }
}

function handleEventSubmit(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('eventTitle').value,
        category: document.getElementById('eventCategory').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        capacity: parseInt(document.getElementById('eventCapacity').value),
        price: parseFloat(document.getElementById('eventPrice').value) || 0,
        featured: document.getElementById('eventFeatured').checked,
        description: document.getElementById('eventDescription').value,
        image: document.getElementById('eventImage').value || 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800'
    };

    if (editingEventId) {
        // Update existing event
        const eventIndex = events.findIndex(e => e.id === editingEventId);
        if (eventIndex !== -1) {
            events[eventIndex] = { ...events[eventIndex], ...formData };
            showNotification('Event updated successfully', 'success');
        }
    } else {
        // Create new event
        const newEvent = {
            id: Date.now().toString(),
            ...formData,
            registered: 0
        };
        events.push(newEvent);
        showNotification('Event created successfully', 'success');
    }
    
    closeEventModal();
    renderAdminDashboard();
}

function registerForEvent(eventId, event) {
    event.stopPropagation();
    
    const eventObj = events.find(e => e.id === eventId);
    if (!eventObj) return;
    
    if (eventObj.registered >= eventObj.capacity) {
        showNotification('Event is full', 'error');
        return;
    }
    
    if (userRegistrations.has(eventId)) {
        showNotification('Already registered for this event', 'warning');
        return;
    }
    
    userRegistrations.add(eventId);
    eventObj.registered++;
    
    renderUserDashboard();
    showNotification('Successfully registered for event', 'success');
}

function showEventDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    document.getElementById('eventDetailsTitle').textContent = event.title;
    document.getElementById('eventDetailsImage').src = event.image;
    document.getElementById('eventDetailsDate').textContent = formatDate(event.date);
    document.getElementById('eventDetailsTime').textContent = formatTime(event.time);
    document.getElementById('eventDetailsLocation').textContent = event.location;
    document.getElementById('eventDetailsCategory').textContent = event.category;
    document.getElementById('eventDetailsCapacity').textContent = `${event.registered}/${event.capacity} registered`;
    document.getElementById('eventDetailsPrice').textContent = event.price === 0 ? 'Free' : `$${event.price}`;
    document.getElementById('eventDetailsDescription').textContent = event.description;
    
    const registerBtn = document.getElementById('registerEventBtn');
    const isRegistered = userRegistrations.has(eventId);
    const isFull = event.registered >= event.capacity;
    const isUpcoming = new Date(event.date) > new Date();
    
    if (currentUser.role === 'admin') {
        registerBtn.style.display = 'none';
    } else {
        registerBtn.style.display = 'flex';
        
        if (isRegistered) {
            registerBtn.innerHTML = '<i class="fas fa-check"></i> Registered';
            registerBtn.disabled = true;
            registerBtn.style.background = 'var(--success-color)';
        } else if (isFull) {
            registerBtn.innerHTML = '<i class="fas fa-times"></i> Event Full';
            registerBtn.disabled = true;
            registerBtn.style.background = 'var(--error-color)';
        } else if (!isUpcoming) {
            registerBtn.innerHTML = '<i class="fas fa-clock"></i> Past Event';
            registerBtn.disabled = true;
            registerBtn.style.background = 'var(--gray-400)';
        } else {
            registerBtn.innerHTML = '<i class="fas fa-ticket-alt"></i> Register Now';
            registerBtn.disabled = false;
            registerBtn.style.background = '';
            registerBtn.onclick = (e) => {
                registerForEvent(eventId, e);
                closeEventDetailsModal();
            };
        }
    }
    
    showModal('eventDetailsModal');
}

// Search and filter functions
function handleUserSearch() {
    const searchTerm = document.getElementById('userSearchEvents').value.toLowerCase();
    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.category.toLowerCase().includes(searchTerm)
    );
    
    renderEventsGrid(filteredEvents, document.getElementById('allEvents'));
}

function handleAdminSearch() {
    const searchTerm = document.getElementById('adminSearchEvents').value.toLowerCase();
    const tableBody = document.getElementById('adminEventsTable');
    const rows = tableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterEvents(category) {
    let filteredEvents = events;
    if (category !== 'all') {
        filteredEvents = events.filter(event => event.category === category);
    }
    
    renderEventsGrid(filteredEvents, document.getElementById('allEvents'));
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeEventModal() {
    closeModal('eventModal');
    resetEventForm();
    editingEventId = null;
}

function closeEventDetailsModal() {
    closeModal('eventDetailsModal');
}

function resetEventForm() {
    document.getElementById('eventForm').reset();
}

// Navigation functions
function setActiveNav(activeId) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(activeId).classList.add('active');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = document.getElementById('notificationIcon');
    const messageElement = document.getElementById('notificationMessage');
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    icon.className = `notification-icon ${icons[type] || icons.success}`;
    messageElement.textContent = message;
    
    // Remove existing type classes and add new one
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal);
        });
    }
    
    // Ctrl/Cmd + N to create new event (admin only)
    if ((e.ctrlKey || e.metaKey) && e.key === 'n' && currentUser?.role === 'admin') {
        e.preventDefault();
        showCreateEventModal();
    }
});

// Auto-save search preferences
let searchTimeout;
function debounceSearch(callback, delay = 300) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(callback, delay);
}

// Update search handlers to use debouncing
document.getElementById('userSearchEvents')?.addEventListener('input', () => {
    debounceSearch(handleUserSearch);
});

document.getElementById('adminSearchEvents')?.addEventListener('input', () => {
    debounceSearch(handleAdminSearch);
});
