// Admin credentials (in production, this should be server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '123456'
};

// Check if admin is logged in
function checkAdminAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
        loadDashboardData();
    } else {
        showLoginPage();
    }
}

// Show login page
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
}

// Show alert message
function showAlert(message, type = 'danger') {
    const alertDiv = document.getElementById('loginAlert');
    alertDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

// Login form handler
document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Validate credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUsername', username);
        showAlert('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            showDashboard();
            loadDashboardData();
        }, 1000);
    } else {
        showAlert('Invalid username or password!', 'danger');
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    showLoginPage();
    document.getElementById('adminLoginForm').reset();
});

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load stats
        const statsResponse = await fetch('/api/admin/stats');
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
            document.getElementById('totalBookings').textContent = stats.totalBookings || 0;
            document.getElementById('totalRevenue').textContent = `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`;
            document.getElementById('totalDestinations').textContent = stats.totalDestinations || 0;
        }

        // Load bookings
        const bookingsResponse = await fetch('/api/bookings');
        if (bookingsResponse.ok) {
            const bookings = await bookingsResponse.json();
            displayBookings(bookings);
        }

        // Load users
        loadUsers();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Display bookings in table
function displayBookings(bookings) {
    const tbody = document.getElementById('bookingsTable');
    
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No bookings yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td><strong>#${booking.id}</strong></td>
            <td>User ${booking.userId}</td>
            <td><span class="badge bg-info">${booking.type}</span></td>
            <td>${booking.travelers}</td>
            <td>${new Date(booking.checkIn).toLocaleDateString('en-IN')}</td>
            <td>${new Date(booking.checkOut).toLocaleDateString('en-IN')}</td>
            <td><strong>₹${booking.totalPrice.toLocaleString('en-IN')}</strong></td>
            <td><span class="badge bg-success">${booking.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary btn-action" onclick="viewBooking(${booking.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action" onclick="deleteBooking(${booking.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load users (mock data for now)
function loadUsers() {
    const users = [
        { id: 1, name: 'Admin User', email: 'admin@caretrip.com', role: 'admin' },
        { id: 2, name: 'John Doe', email: 'user@example.com', role: 'user' }
    ];
    
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td><strong>#${user.id}</strong></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}">${user.role}</span></td>
            <td>
                <button class="btn btn-sm btn-info btn-action" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                ${user.role !== 'admin' ? `
                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// View booking details
function viewBooking(id) {
    alert(`View booking #${id} - Feature coming soon!`);
}

// Delete booking
async function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        // In production, make API call to delete
        alert(`Booking #${id} deleted successfully!`);
        loadDashboardData();
    }
}

// Edit user
function editUser(id) {
    alert(`Edit user #${id} - Feature coming soon!`);
}

// Delete user
function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        alert(`User #${id} deleted successfully!`);
        loadUsers();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
});