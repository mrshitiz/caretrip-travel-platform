# Caretrip - PHP Conversion Guide

## Converting Node.js to PHP for Hostinger

### Step 1: Database Setup

Create MySQL database in Hostinger cPanel:

```sql
CREATE DATABASE caretrip_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(2,1),
    duration VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(2,1),
    amenities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_city VARCHAR(100) NOT NULL,
    to_city VARCHAR(100) NOT NULL,
    airline VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    departure VARCHAR(50),
    arrival VARCHAR(50),
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('package', 'hotel', 'flight') NOT NULL,
    item_id INT NOT NULL,
    travelers INT NOT NULL,
    check_in DATE,
    check_out DATE,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert demo admin user (password: admin123)
INSERT INTO users (email, password, name, role) VALUES 
('admin@caretrip.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin');
```

### Step 2: Create config.php

```php
<?php
// config.php
session_start();

$db_host = 'localhost';
$db_user = 'your_db_username';
$db_pass = 'your_db_password';
$db_name = 'caretrip_db';

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>
```

### Step 3: Create API Files

**api/login.php:**
```php
<?php
require_once '../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = $conn->real_escape_string($data['email']);
$password = $data['password'];

$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => $user['role']
            ]
        ]);
    } else {
        echo json_encode(['error' => 'Invalid credentials']);
    }
} else {
    echo json_encode(['error' => 'Invalid credentials']);
}
?>
```

**api/register.php:**
```php
<?php
require_once '../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = $conn->real_escape_string($data['email']);
$name = $conn->real_escape_string($data['name']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);

$check = $conn->query("SELECT id FROM users WHERE email = '$email'");
if ($check->num_rows > 0) {
    echo json_encode(['error' => 'Email already exists']);
    exit;
}

$sql = "INSERT INTO users (email, name, password) VALUES ('$email', '$name', '$password')";
if ($conn->query($sql)) {
    $user_id = $conn->insert_id;
    $_SESSION['user_id'] = $user_id;
    $_SESSION['user_role'] = 'user';
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $user_id,
            'email' => $email,
            'name' => $name,
            'role' => 'user'
        ]
    ]);
} else {
    echo json_encode(['error' => 'Registration failed']);
}
?>
```

**api/destinations.php:**
```php
<?php
require_once '../config.php';
header('Content-Type: application/json');

$search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';

$sql = "SELECT * FROM destinations";
if ($search) {
    $sql .= " WHERE name LIKE '%$search%'";
}

$result = $conn->query($sql);
$destinations = [];

while ($row = $result->fetch_assoc()) {
    $destinations[] = $row;
}

echo json_encode($destinations);
?>
```

### Step 4: Update Frontend

Change API URLs in `public/app.js`:
- `/api/login` → `/api/login.php`
- `/api/register` → `/api/register.php`
- etc.

### Step 5: .htaccess for Clean URLs

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/$1.php [L]
```

### Step 6: Upload to Hostinger

1. Upload all PHP files via File Manager/FTP
2. Import SQL database via phpMyAdmin
3. Update `config.php` with your database credentials
4. Set folder permissions (755 for folders, 644 for files)

### Step 7: Test

Visit your domain and test:
- Registration
- Login
- Booking flow
- Admin dashboard

## Need Help?

Contact support or check Hostinger documentation for Node.js/PHP hosting.