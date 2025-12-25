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
  { id: 1, name: 'Goa, India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', price: 15999, rating: 4.8, duration: '5 Days', description: 'Beautiful beaches, Portuguese heritage, vibrant nightlife and water sports.' },
  { id: 2, name: 'Kerala, India', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', price: 18999, rating: 4.9, duration: '6 Days', description: 'Gods Own Country - backwaters, houseboats, hill stations and Ayurveda.' },
  { id: 3, name: 'Rajasthan, India', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', price: 22999, rating: 4.7, duration: '7 Days', description: 'Royal palaces, desert safaris, forts and rich cultural heritage.' },
  { id: 4, name: 'Manali, India', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', price: 12999, rating: 4.9, duration: '4 Days', description: 'Snow-capped mountains, adventure sports, Rohtang Pass and scenic valleys.' },
  { id: 5, name: 'Andaman, India', image: 'https://images.unsplash.com/photo-1589197331516-6c0c24e5e7c9?w=800', price: 28999, rating: 4.8, duration: '6 Days', description: 'Pristine beaches, coral reefs, water sports and tropical paradise.' },
  { id: 6, name: 'Ladakh, India', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', price: 24999, rating: 4.9, duration: '7 Days', description: 'High altitude desert, monasteries, Pangong Lake and adventure.' },
  { id: 7, name: 'Shimla, India', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800', price: 11999, rating: 4.6, duration: '4 Days', description: 'Colonial architecture, Mall Road, toy train and scenic hill station.' },
  { id: 8, name: 'Udaipur, India', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', price: 16999, rating: 4.8, duration: '5 Days', description: 'City of Lakes, royal palaces, Lake Pichola and romantic getaway.' }
];

let hotels = [
  { id: 1, name: 'Taj Exotica', location: 'Goa, India', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', price: 8500, rating: 4.8, amenities: ['Beach', 'Pool', 'Spa', 'Restaurant'] },
  { id: 2, name: 'Kumarakom Lake Resort', location: 'Kerala, India', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', price: 12000, rating: 4.9, amenities: ['Backwater', 'Pool', 'Ayurveda', 'Houseboat'] },
  { id: 3, name: 'The Oberoi Udaivilas', location: 'Udaipur, India', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', price: 25000, rating: 4.9, amenities: ['Lake View', 'Spa', 'Fine Dining', 'Heritage'] },
  { id: 4, name: 'Wildflower Hall', location: 'Shimla, India', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', price: 15000, rating: 4.7, amenities: ['Mountain View', 'Spa', 'Gym', 'Restaurant'] },
  { id: 5, name: 'The Grand Dragon', location: 'Ladakh, India', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', price: 6500, rating: 4.6, amenities: ['WiFi', 'Restaurant', 'Oxygen', 'Heating'] },
  { id: 6, name: 'Symphony Palms', location: 'Andaman, India', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', price: 9500, rating: 4.8, amenities: ['Beach', 'Pool', 'Water Sports', 'Bar'] }
];

let flights = [
  { id: 1, from: 'Delhi', to: 'Goa', airline: 'IndiGo', price: 4500, departure: '06:00 AM', arrival: '08:30 AM', duration: '2h 30m' },
  { id: 2, from: 'Mumbai', to: 'Kochi', airline: 'Air India', price: 5200, departure: '09:00 AM', arrival: '11:15 AM', duration: '2h 15m' },
  { id: 3, from: 'Delhi', to: 'Leh', airline: 'SpiceJet', price: 6800, departure: '05:30 AM', arrival: '07:00 AM', duration: '1h 30m' },
  { id: 4, from: 'Bangalore', to: 'Port Blair', airline: 'Vistara', price: 8500, departure: '10:00 AM', arrival: '01:30 PM', duration: '3h 30m' },
  { id: 5, from: 'Delhi', to: 'Udaipur', airline: 'IndiGo', price: 4200, departure: '07:00 AM', arrival: '08:30 AM', duration: '1h 30m' },
  { id: 6, from: 'Chandigarh', to: 'Shimla', airline: 'Air Taxi', price: 3500, departure: '08:00 AM', arrival: '08:45 AM', duration: '45m' }
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