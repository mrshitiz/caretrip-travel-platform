// Admin credentials (in production, this should be server-side)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '123456'
};

// Website settings storage key
const SETTINGS_KEY = 'caretrip_website_settings';

// Default settings
const defaultSettings = {
    companyName: 'Caretrip',
    companyTagline: 'We Care Your Travel',
    logoUrl: 'https://www.caretrip.in/siteimages/logo_dark.png?v=2',
    footerLogoUrl: 'https://www.caretrip.in/siteimages/logo_light.png?v=2', // NEW: Separate footer logo
    phoneNumber: '+91 7666917917',
    whatsappNumber: '+917666917917',
    emailAddress: 'info@caretrip.in',
    officeAddress: '1/7119, 4th Floor, Post Office Street, Shivaji Park, Shahdara, Delhi - 110032',
    facebookUrl: 'https://www.facebook.com/caretrip',
    instagramUrl: 'https://www.instagram.com/caretrip_in',
    youtubeUrl: 'https://www.youtube.com/@caretrip_in',
    twitterUrl: '',
    linkedinUrl: ''
};

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : defaultSettings;
}

// Save settings to localStorage
function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Check if admin is logged in
function checkAdminAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
        loadDashboardData();
        initializeSettings();
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

// Show success toast
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <i class="fas fa-check-circle me-2"></i> ${message}
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
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
            initializeSettings();
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

// Sidebar navigation
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.menu-link').forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const sectionId = link.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Initialize settings forms
function initializeSettings() {
    const settings = loadSettings();
    
    // Populate company info form
    document.getElementById('companyName').value = settings.companyName;
    document.getElementById('companyTagline').value = settings.companyTagline;
    document.getElementById('logoUrl').value = settings.logoUrl;
    document.getElementById('footerLogoUrl').value = settings.footerLogoUrl || settings.logoUrl; // NEW
    
    // Update logo preview
    const logoPreview = document.getElementById('logoPreview');
    logoPreview.innerHTML = `<img src="${settings.logoUrl}" alt="Logo">`;
    logoPreview.classList.remove('empty');
    
    // Update footer logo preview
    const footerLogoPreview = document.getElementById('footerLogoPreview');
    footerLogoPreview.innerHTML = `<img src="${settings.footerLogoUrl || settings.logoUrl}" alt="Footer Logo">`;
    footerLogoPreview.classList.remove('empty');
    
    // Populate contact info form
    document.getElementById('phoneNumber').value = settings.phoneNumber;
    document.getElementById('whatsappNumber').value = settings.whatsappNumber;
    document.getElementById('emailAddress').value = settings.emailAddress;
    document.getElementById('officeAddress').value = settings.officeAddress;
    
    // Populate social links form
    document.getElementById('facebookUrl').value = settings.facebookUrl;
    document.getElementById('instagramUrl').value = settings.instagramUrl;
    document.getElementById('youtubeUrl').value = settings.youtubeUrl;
    document.getElementById('twitterUrl').value = settings.twitterUrl || '';
    document.getElementById('linkedinUrl').value = settings.linkedinUrl || '';
}

// Logo file upload handler (Navbar)
document.getElementById('companyLogo').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const logoPreview = document.getElementById('logoPreview');
            logoPreview.innerHTML = `<img src="${event.target.result}" alt="Logo">`;
            logoPreview.classList.remove('empty');
            
            // Update logo URL field
            document.getElementById('logoUrl').value = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Footer Logo file upload handler (NEW)
document.getElementById('footerLogo').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const footerLogoPreview = document.getElementById('footerLogoPreview');
            footerLogoPreview.innerHTML = `<img src="${event.target.result}" alt="Footer Logo">`;
            footerLogoPreview.classList.remove('empty');
            
            // Update footer logo URL field
            document.getElementById('footerLogoUrl').value = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Company info form handler
document.getElementById('companyInfoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const settings = loadSettings();
    settings.companyName = document.getElementById('companyName').value;
    settings.companyTagline = document.getElementById('companyTagline').value;
    settings.logoUrl = document.getElementById('logoUrl').value;
    settings.footerLogoUrl = document.getElementById('footerLogoUrl').value; // NEW
    
    saveSettings(settings);
    showToast('Company information saved successfully!', 'success');
});

// Contact info form handler
document.getElementById('contactInfoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const settings = loadSettings();
    settings.phoneNumber = document.getElementById('phoneNumber').value;
    settings.whatsappNumber = document.getElementById('whatsappNumber').value;
    settings.emailAddress = document.getElementById('emailAddress').value;
    settings.officeAddress = document.getElementById('officeAddress').value;
    
    saveSettings(settings);
    showToast('Contact information saved successfully!', 'success');
});

// Social links form handler
document.getElementById('socialLinksForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const settings = loadSettings();
    settings.facebookUrl = document.getElementById('facebookUrl').value;
    settings.instagramUrl = document.getElementById('instagramUrl').value;
    settings.youtubeUrl = document.getElementById('youtubeUrl').value;
    settings.twitterUrl = document.getElementById('twitterUrl').value;
    settings.linkedinUrl = document.getElementById('linkedinUrl').value;
    
    saveSettings(settings);
    showToast('Social media links saved successfully!', 'success');
});

// Load dashboard data
async function loadDashboardData() {
    try {
        // Fetch stats from API
        const response = await fetch('/api/admin/stats');
        const stats = await response.json();
        
        // Update stats cards
        document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
        document.getElementById('totalBookings').textContent = stats.totalBookings || 0;
        document.getElementById('totalRevenue').textContent = `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`;
        document.getElementById('totalDestinations').textContent = stats.totalDestinations || 0;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set default values if API fails
        document.getElementById('totalUsers').textContent = '0';
        document.getElementById('totalBookings').textContent = '0';
        document.getElementById('totalRevenue').textContent = '₹0';
        document.getElementById('totalDestinations').textContent = '0';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
});