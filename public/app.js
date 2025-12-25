let currentUser = null;

// Load website settings from localStorage
function loadWebsiteSettings() {
    const SETTINGS_KEY = 'caretrip_website_settings';
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Update logo in navbar
        const navbarLogo = document.querySelector('.navbar-brand img');
        if (navbarLogo && settings.logoUrl) {
            navbarLogo.src = settings.logoUrl;
            navbarLogo.alt = settings.companyName || 'Caretrip';
        }
        
        // Update logo in footer
        const footerLogo = document.querySelector('footer .logo img');
        if (footerLogo && settings.logoUrl) {
            footerLogo.src = settings.logoUrl;
            footerLogo.alt = settings.companyName || 'Caretrip';
        }
        
        // Update page title
        if (settings.companyName) {
            document.title = `${settings.companyName} - ${settings.companyTagline || 'We Care Your Travel'}`;
        }
        
        // Update phone number in top bar
        const phoneLink = document.querySelector('.top-bar a[href^="tel:"]');
        if (phoneLink && settings.phoneNumber) {
            phoneLink.href = `tel:${settings.phoneNumber.replace(/\s/g, '')}`;
            phoneLink.innerHTML = `<i class="fas fa-phone"></i> ${settings.phoneNumber}`;
        }
        
        // Update footer contact info
        const footerPhone = document.querySelector('footer a[href^="tel:"]');
        if (footerPhone && settings.phoneNumber) {
            footerPhone.href = `tel:${settings.phoneNumber.replace(/\s/g, '')}`;
            footerPhone.innerHTML = `<i class="fas fa-phone me-2"></i>${settings.phoneNumber}`;
        }
        
        const footerWhatsApp = document.querySelector('footer a[href^="https://wa.me"]');
        if (footerWhatsApp && settings.whatsappNumber) {
            footerWhatsApp.href = `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`;
            footerWhatsApp.innerHTML = `<i class="fab fa-whatsapp me-2"></i>${settings.phoneNumber}`;
        }
        
        const footerEmail = document.querySelector('footer a[href^="mailto:"]');
        if (footerEmail && settings.emailAddress) {
            footerEmail.href = `mailto:${settings.emailAddress}`;
            footerEmail.innerHTML = `<i class="fas fa-envelope me-2"></i>${settings.emailAddress}`;
        }
        
        // Update office address
        const addressElement = document.querySelector('footer p:has(i.fa-map-marker-alt)');
        if (addressElement && settings.officeAddress) {
            addressElement.innerHTML = `<i class="fas fa-map-marker-alt me-2"></i>${settings.officeAddress}`;
        }
        
        // Update social media links
        const socialLinks = {
            facebook: document.querySelector('footer a[href*="facebook"]'),
            instagram: document.querySelector('footer a[href*="instagram"]'),
            youtube: document.querySelector('footer a[href*="youtube"]'),
            twitter: document.querySelector('footer a[href*="twitter"]'),
            linkedin: document.querySelector('footer a[href*="linkedin"]')
        };
        
        if (socialLinks.facebook && settings.facebookUrl) {
            socialLinks.facebook.href = settings.facebookUrl;
        }
        if (socialLinks.instagram && settings.instagramUrl) {
            socialLinks.instagram.href = settings.instagramUrl;
        }
        if (socialLinks.youtube && settings.youtubeUrl) {
            socialLinks.youtube.href = settings.youtubeUrl;
        }
        if (socialLinks.twitter && settings.twitterUrl) {
            socialLinks.twitter.href = settings.twitterUrl;
            socialLinks.twitter.style.display = settings.twitterUrl ? '' : 'none';
        }
        if (socialLinks.linkedin && settings.linkedinUrl) {
            socialLinks.linkedin.href = settings.linkedinUrl;
            socialLinks.linkedin.style.display = settings.linkedinUrl ? '' : 'none';
        }
        
        console.log('Website settings loaded successfully!');
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    loadWebsiteSettings(); // Load settings first
    await checkAuth();
    loadDestinations();
    loadHotels();
    loadFlights();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);
    document.getElementById('bookingTravelers').addEventListener('input', updateBookingTotal);
    
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', async (e) => {
            const href = link.getAttribute('href');
            if (href === '#bookings') {
                e.preventDefault();
                await loadBookings();
                document.getElementById('bookings').style.display = 'block';
                document.getElementById('admin').style.display = 'none';
                document.getElementById('bookings').scrollIntoView({ behavior: 'smooth' });
            } else if (href === '#admin') {
                e.preventDefault();
                await loadAdminDashboard();
                document.getElementById('admin').style.display = 'block';
                document.getElementById('bookings').style.display = 'none';
                document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (data.success) {
            currentUser = data.user;
            updateUIForUser();
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            showAlert('Login successful!', 'success');
        } else {
            showAlert(data.error || 'Login failed', 'danger');
        }
    } catch (error) {
        showAlert('Login failed', 'danger');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        if (data.success) {
            currentUser = data.user;
            updateUIForUser();
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            showAlert('Registration successful!', 'success');
        } else {
            showAlert(data.error || 'Registration failed', 'danger');
        }
    } catch (error) {
        showAlert('Registration failed', 'danger');
    }
}

async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    currentUser = null;
    updateUIForUser();
    showAlert('Logged out successfully', 'info');
}

async function checkAuth() {
    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            updateUIForUser();
        }
    } catch (error) {
        console.log('Not authenticated');
    }
}

function updateUIForUser() {
    if (currentUser) {
        document.getElementById('loginNav').style.display = 'none';
        document.getElementById('userNav').style.display = 'block';
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('myBookingsNav').style.display = 'block';
        if (currentUser.role === 'admin') {
            document.getElementById('adminNav').style.display = 'block';
        }
    } else {
        document.getElementById('loginNav').style.display = 'block';
        document.getElementById('userNav').style.display = 'none';
        document.getElementById('myBookingsNav').style.display = 'none';
        document.getElementById('adminNav').style.display = 'none';
    }
}

async function loadDestinations(search = '') {
    try {
        const response = await fetch(`/api/destinations?search=${search}`);
        const destinations = await response.json();
        
        const grid = document.getElementById('destinationsGrid');
        grid.innerHTML = destinations.map(dest => `
            <div class="col-md-4 col-lg-3">
                <div class="card">
                    <img src="${dest.image}" class="card-img-top" alt="${dest.name}">
                    <div class="card-body">
                        <h5 class="card-title">${dest.name}</h5>
                        <p class="card-text">${dest.description.substring(0, 80)}...</p>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge bg-primary">${dest.duration}</span>
                            <span class="badge bg-warning text-dark"><i class="fas fa-star"></i> ${dest.rating}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="text-primary mb-0">₹${dest.price}</h5>
                            <button class="btn btn-primary btn-sm" onclick="openBookingModal('package', ${dest.id}, ${dest.price})">Book Now</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading destinations:', error);
    }
}

async function loadHotels(location = '') {
    try {
        const response = await fetch(`/api/hotels?location=${location}`);
        const hotels = await response.json();
        
        const grid = document.getElementById('hotelsGrid');
        grid.innerHTML = hotels.map(hotel => `
            <div class="col-md-4 col-lg-3">
                <div class="card">
                    <img src="${hotel.image}" class="card-img-top" alt="${hotel.name}">
                    <div class="card-body">
                        <h5 class="card-title">${hotel.name}</h5>
                        <p class="card-text"><i class="fas fa-map-marker-alt text-primary"></i> ${hotel.location}</p>
                        <div class="mb-3">
                            ${hotel.amenities.map(a => `<span class="badge bg-secondary me-1">${a}</span>`).join('')}
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="text-primary mb-0">₹${hotel.price}</h5>
                                <small class="text-muted">per night</small>
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="openBookingModal('hotel', ${hotel.id}, ${hotel.price})">Book Now</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading hotels:', error);
    }
}

async function loadFlights(from = '', to = '') {
    try {
        const response = await fetch(`/api/flights?from=${from}&to=${to}`);
        const flights = await response.json();
        
        const grid = document.getElementById('flightsGrid');
        grid.innerHTML = flights.map(flight => `
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0">${flight.airline}</h5>
                            <span class="badge bg-info">${flight.duration}</span>
                        </div>
                        <div class="row text-center mb-3">
                            <div class="col-5">
                                <h4>${flight.from}</h4>
                                <p class="mb-0 text-muted">${flight.departure}</p>
                            </div>
                            <div class="col-2">
                                <i class="fas fa-plane fa-2x text-primary"></i>
                            </div>
                            <div class="col-5">
                                <h4>${flight.to}</h4>
                                <p class="mb-0 text-muted">${flight.arrival}</p>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <h4 class="text-primary mb-0">₹${flight.price}</h4>
                            <button class="btn btn-primary" onclick="openBookingModal('flight', ${flight.id}, ${flight.price})">Book Flight</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading flights:', error);
    }
}

function openBookingModal(type, itemId, price) {
    if (!currentUser) {
        showAlert('Please login to book', 'warning');
        new bootstrap.Modal(document.getElementById('loginModal')).show();
        return;
    }
    
    document.getElementById('bookingType').value = type;
    document.getElementById('bookingItemId').value = itemId;
    document.getElementById('bookingPrice').value = price;
    document.getElementById('bookingTravelers').value = 1;
    updateBookingTotal();
    
    new bootstrap.Modal(document.getElementById('bookingModal')).show();
}

function updateBookingTotal() {
    const price = parseFloat(document.getElementById('bookingPrice').value);
    const travelers = parseInt(document.getElementById('bookingTravelers').value);
    const total = price * travelers;
    document.getElementById('bookingTotal').textContent = total.toLocaleString('en-IN');
}

async function handleBooking(e) {
    e.preventDefault();
    
    const bookingData = {
        type: document.getElementById('bookingType').value,
        itemId: parseInt(document.getElementById('bookingItemId').value),
        travelers: parseInt(document.getElementById('bookingTravelers').value),
        checkIn: document.getElementById('bookingCheckIn').value,
        checkOut: document.getElementById('bookingCheckOut').value,
        totalPrice: parseFloat(document.getElementById('bookingTotal').textContent.replace(/,/g, ''))
    };
    
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        
        const data = await response.json();
        if (data.success) {
            bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
            showAlert('Booking confirmed! Check your bookings page.', 'success');
        } else {
            showAlert(data.error || 'Booking failed', 'danger');
        }
    } catch (error) {
        showAlert('Booking failed', 'danger');
    }
}

async function loadBookings() {
    try {
        const response = await fetch('/api/bookings');
        const bookings = await response.json();
        
        const content = document.getElementById('bookingsContent');
        if (bookings.length === 0) {
            content.innerHTML = '<p class="text-center">No bookings yet. Start exploring!</p>';
            return;
        }
        
        content.innerHTML = bookings.map(booking => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h5>Booking #${booking.id}</h5>
                            <p><strong>Type:</strong> ${booking.type}</p>
                            <p><strong>Travelers:</strong> ${booking.travelers}</p>
                            <p><strong>Check-in:</strong> ${booking.checkIn}</p>
                            <p><strong>Check-out:</strong> ${booking.checkOut}</p>
                        </div>
                        <div class="col-md-4 text-end">
                            <h4 class="text-primary">₹${booking.totalPrice.toLocaleString('en-IN')}</h4>
                            <span class="badge bg-success">${booking.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

async function loadAdminDashboard() {
    try {
        const [statsResponse, bookingsResponse] = await Promise.all([
            fetch('/api/admin/stats'),
            fetch('/api/bookings')
        ]);
        
        const stats = await statsResponse.json();
        const bookings = await bookingsResponse.json();
        
        document.getElementById('adminStats').innerHTML = `
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3>${stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3>${stats.totalBookings}</h3>
                        <p>Total Bookings</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3>₹${stats.totalRevenue.toLocaleString('en-IN')}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3>${stats.totalDestinations}</h3>
                        <p>Destinations</p>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('adminBookings').innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Type</th>
                            <th>Travelers</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(b => `
                            <tr>
                                <td>${b.id}</td>
                                <td>${b.userId}</td>
                                <td>${b.type}</td>
                                <td>${b.travelers}</td>
                                <td>₹${b.totalPrice.toLocaleString('en-IN')}</td>
                                <td><span class="badge bg-success">${b.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}