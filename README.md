# Caretrip - Complete Travel Booking Platform

A full-featured travel website built with Node.js, Express, and vanilla JavaScript. Perfect for Hostinger shared hosting with MySQLi.

## Features

✈️ **Flight Booking** - Search and book flights  
🏨 **Hotel Reservations** - Browse and reserve hotels  
🌍 **Travel Packages** - Explore destination packages  
👤 **User Authentication** - Register, login, manage bookings  
📊 **Admin Dashboard** - Manage bookings, users, revenue  
🎨 **Responsive Design** - Works on all devices  

## Demo Credentials

**Admin Access:**
- Email: admin@caretrip.com
- Password: admin123

**Regular User:**
- Email: user@example.com
- Password: user123

## Installation

### For Hostinger Shared Hosting:

1. **Download the code:**
   ```bash
   git clone https://github.com/mrshitiz/caretrip-travel-platform.git
   cd caretrip-travel-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Upload to Hostinger:**
   - Use File Manager or FTP
   - Upload all files to `public_html` directory
   - Ensure Node.js is enabled in hosting panel

4. **Start the server:**
   ```bash
   npm start
   ```

### Local Development:

```bash
npm install
npm start
```

Visit: `http://localhost:3000`

## Project Structure

```
caretrip-travel-platform/
├── public/
│   ├── index.html      # Main HTML
│   ├── style.css       # Styling
│   └── app.js          # Frontend JS
├── server.js           # Express server
├── package.json        # Dependencies
└── README.md          # Documentation
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Data
- `GET /api/destinations` - Get destinations
- `GET /api/hotels` - Get hotels
- `GET /api/flights` - Get flights

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings

### Admin
- `GET /api/admin/stats` - Get statistics

## Converting to PHP/MySQLi

This Node.js version can be converted to PHP for Hostinger:

1. Replace Express routes with PHP files
2. Convert session management to PHP sessions
3. Replace in-memory data with MySQLi database
4. Use `.htaccess` for clean URLs

Need help converting? Let me know!

## Technologies

- **Backend:** Node.js, Express
- **Frontend:** HTML5, CSS3, JavaScript
- **UI:** Bootstrap 5, Font Awesome
- **Authentication:** bcryptjs, express-session

## Customization

### Add More Destinations:
Edit `server.js` - `destinations` array

### Change Colors:
Edit `public/style.css` - `:root` variables

### Add Payment Gateway:
Integrate Stripe/PayPal in booking flow

## Support

For issues or questions, open an issue on GitHub.

## License

MIT License - Free to use and modify

---

Built with ❤️ by Bhindi