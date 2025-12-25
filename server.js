const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'caretrip-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Mock Database
let users = [
  { id: 1, email: 'admin@caretrip.com', password: bcrypt.hashSync('admin123', 10), name: 'Admin User', role: 'admin' },
  { id: 2, email: 'user@example.com', password: bcrypt.hashSync('user123', 10), name: 'John Doe', role: 'user' }
];

let destinations = [
  { id: 1, name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', price: 1299, rating: 4.8, duration: '7 Days', description: 'Explore the City of Light with guided tours of Eiffel Tower, Louvre, and more.' },
  { id: 2, name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', price: 899, rating: 4.9, duration: '5 Days', description: 'Tropical paradise with beaches, temples, and vibrant culture.' },
  { id: 3, name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', price: 1599, rating: 4.7, duration: '6 Days', description: 'Modern metropolis meets ancient traditions.' },
  { id: 4, name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', price: 1199, rating: 4.9, duration: '5 Days', description: 'Stunning sunsets and white-washed buildings.' },
  { id: 5, name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', price: 1099, rating: 4.6, duration: '4 Days', description: 'Luxury shopping, ultramodern architecture.' },
  { id: 6, name: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', price: 1399, rating: 4.8, duration: '6 Days', description: 'The city that never sleeps.' }
];

let hotels = [
  { id: 1, name: 'Grand Hotel Paris', location: 'Paris, France', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', price: 250, rating: 4.7, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'] },
  { id: 2, name: 'Bali Beach Resort', location: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', price: 180, rating: 4.8, amenities: ['Beach', 'Pool', 'Spa', 'Bar'] },
  { id: 3, name: 'Tokyo Imperial Hotel', location: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', price: 300, rating: 4.9, amenities: ['WiFi', 'Gym', 'Restaurant'] }
];

let flights = [
  { id: 1, from: 'NYC', to: 'Paris', airline: 'Air France', price: 650, departure: '08:00 AM', arrival: '10:00 PM', duration: '7h 30m' },
  { id: 2, from: 'LA', to: 'Tokyo', airline: 'Japan Airlines', price: 850, departure: '11:00 AM', arrival: '3:00 PM +1', duration: '11h 30m' },
  { id: 3, from: 'London', to: 'Dubai', airline: 'Emirates', price: 550, departure: '02:00 PM', arrival: '11:30 PM', duration: '6h 30m' }
];

let bookings = [];
let bookingIdCounter = 1;

// Auth Routes
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, email, password: hashedPassword, name, role: 'user' };
  users.push(newUser);
  req.session.userId = newUser.id;
  res.json({ success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  req.session.userId = user.id;
  res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/user', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  const user = users.find(u => u.id === req.session.userId);
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

// Data Routes
app.get('/api/destinations', (req, res) => {
  const { search } = req.query;
  let filtered = [...destinations];
  if (search) filtered = filtered.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  res.json(filtered);
});

app.get('/api/hotels', (req, res) => {
  const { location } = req.query;
  let filtered = [...hotels];
  if (location) filtered = filtered.filter(h => h.location.toLowerCase().includes(location.toLowerCase()));
  res.json(filtered);
});

app.get('/api/flights', (req, res) => {
  const { from, to } = req.query;
  let filtered = [...flights];
  if (from) filtered = filtered.filter(f => f.from.toLowerCase().includes(from.toLowerCase()));
  if (to) filtered = filtered.filter(f => f.to.toLowerCase().includes(to.toLowerCase()));
  res.json(filtered);
});

// Bookings
app.post('/api/bookings', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Please login to book' });
  const { type, itemId, travelers, checkIn, checkOut, totalPrice } = req.body;
  const booking = {
    id: bookingIdCounter++, userId: req.session.userId, type, itemId, travelers,
    checkIn, checkOut, totalPrice, status: 'confirmed', bookingDate: new Date().toISOString()
  };
  bookings.push(booking);
  res.json({ success: true, booking });
});

app.get('/api/bookings', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  const user = users.find(u => u.id === req.session.userId);
  const userBookings = user.role === 'admin' ? bookings : bookings.filter(b => b.userId === req.session.userId);
  res.json(userBookings);
});

// Admin
app.get('/api/admin/stats', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  const user = users.find(u => u.id === req.session.userId);
  if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  res.json({
    totalUsers: users.length,
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
    totalDestinations: destinations.length
  });
});

app.listen(PORT, () => console.log(`Caretrip running on port ${PORT}`));