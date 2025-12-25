# Caretrip Travel Platform - Admin Panel Guide

## 🔐 Admin Access

**Admin Panel URL:** `/admin.html`

### Default Login Credentials:
- **Username:** `admin`
- **Password:** `123456`

---

## 📋 Admin Panel Features

### 1. **Dashboard** 📊
- Real-time statistics overview
- Total Users count
- Total Bookings count
- Total Revenue (₹)
- Total Destinations count
- Recent activity monitoring

### 2. **Website Settings** ⚙️

#### **Company Information**
Manage your company's basic information:
- **Company Name** - Display name across the website
- **Tagline** - Company motto/tagline
- **Logo Upload** - Upload custom logo (PNG recommended)
- **Logo URL** - Alternative: Use direct URL to logo

**How Logo Works:**
- Upload a file OR paste a URL
- Logo appears in navbar (top)
- Logo appears in footer (bottom)
- Supports transparent PNG for best results

#### **Contact Information**
Manage all contact details:
- **Phone Number** - Main contact number
- **WhatsApp Number** - WhatsApp business number
- **Email Address** - Primary email
- **Office Address** - Full business address

**Where It Appears:**
- Top bar (phone number)
- Footer (all contact info)
- Contact sections throughout site

#### **Social Media Links**
Connect your social media profiles:
- **Facebook** - Facebook page URL
- **Instagram** - Instagram profile URL
- **YouTube** - YouTube channel URL
- **Twitter/X** - Twitter profile URL
- **LinkedIn** - LinkedIn company page URL

**Where It Appears:**
- Footer social icons
- Clickable links to your profiles
- Auto-updates across entire website

### 3. **Destinations Management** 🗺️
*(Coming Soon)*
- Add new destinations
- Edit existing packages
- Set pricing and duration
- Upload destination images
- Manage descriptions

### 4. **Hotels Management** 🏨
*(Coming Soon)*
- Add hotel listings
- Update hotel details
- Manage amenities
- Set room prices
- Upload hotel photos

### 5. **Flights Management** ✈️
*(Coming Soon)*
- Add flight routes
- Update schedules
- Manage pricing
- Set airline details

### 6. **Bookings Management** 🎫
View and manage all bookings:
- Booking ID and details
- User information
- Booking type (destination/hotel/flight)
- Number of travelers
- Check-in/Check-out dates
- Payment amount
- Booking status
- Actions: View, Delete

### 7. **Users Management** 👥
Manage registered users:
- User ID and details
- Name and email
- User role (Admin/User)
- Actions: Edit, Delete
- Cannot delete admin users

---

## 🎨 How Settings Work

### Logo Management:
1. Go to **Website Settings** → **Company Information**
2. **Option A:** Upload file
   - Click "Choose File"
   - Select your logo (PNG/JPG)
   - Logo preview appears instantly
3. **Option B:** Use URL
   - Paste direct image URL
   - Logo updates automatically
4. Click **Save Company Info**
5. Logo updates across entire website!

### Contact Info Updates:
1. Go to **Website Settings** → **Contact Information**
2. Update any field (phone, email, address)
3. Click **Save Contact Info**
4. Changes reflect in:
   - Top bar
   - Footer
   - Contact sections

### Social Links Updates:
1. Go to **Website Settings** → **Social Media Links**
2. Paste your social media URLs
3. Leave blank to hide that social icon
4. Click **Save Social Links**
5. Footer icons update automatically!

---

## 💾 Data Storage

**Current Setup:**
- Settings stored in browser localStorage
- Persists across sessions
- Survives page refreshes
- Specific to each browser

**Production Recommendation:**
- Move to database storage
- Use server-side API
- Enable multi-admin access
- Sync across all devices

---

## 🔒 Security Features

- ✅ Login required for access
- ✅ Session-based authentication
- ✅ Admin-only routes
- ✅ Auto-logout on session end
- ✅ Protected API endpoints
- ✅ Role-based access control

---

## 📱 Responsive Design

- ✅ Works on desktop
- ✅ Works on tablets
- ✅ Works on mobile
- ✅ Touch-friendly interface
- ✅ Mobile-optimized sidebar

---

## 🎯 Quick Start Guide

### First Time Setup:

1. **Login to Admin Panel**
   ```
   URL: http://localhost:3000/admin.html
   Username: admin
   Password: 123456
   ```

2. **Update Company Info**
   - Navigate to "Website Settings"
   - Update company name and tagline
   - Upload your logo
   - Save changes

3. **Update Contact Details**
   - Fill in phone, WhatsApp, email
   - Add your office address
   - Save changes

4. **Add Social Links**
   - Paste your social media URLs
   - Save changes
   - Check footer on main website

5. **Verify Changes**
   - Open main website (index.html)
   - Check navbar logo
   - Check footer information
   - Test social media links

---

## 🚀 Advanced Features

### Logo Best Practices:
- **Format:** PNG with transparent background
- **Size:** 200x60 pixels recommended
- **File Size:** Under 100KB for fast loading
- **Colors:** Dark logo for light backgrounds

### Contact Info Tips:
- Use international format for phone (+91...)
- WhatsApp number without spaces
- Professional email address
- Complete address with pincode

### Social Media Tips:
- Use full URLs (https://...)
- Verify links work before saving
- Keep profiles active and updated
- Use business/professional accounts

---

## 🔄 Future Enhancements

### Planned Features:
- [ ] Bulk upload destinations
- [ ] Image gallery management
- [ ] Email template editor
- [ ] Analytics dashboard
- [ ] Customer reviews management
- [ ] Payment gateway integration
- [ ] Booking calendar view
- [ ] Export reports (PDF/Excel)
- [ ] Multi-language support
- [ ] SEO settings management
- [ ] Blog post management
- [ ] Newsletter management

---

## 📞 Support

**Need Help?**
- Email: info@caretrip.in
- Phone: +91 7666917917
- WhatsApp: +91 7666917917

**Technical Issues?**
- Check browser console for errors
- Clear browser cache
- Try different browser
- Contact technical support

---

## 🎓 Training Resources

### Video Tutorials:
*(Coming Soon)*
- Admin panel overview
- Logo upload guide
- Settings management
- Booking management

### Documentation:
- This README file
- Inline help tooltips
- API documentation
- Developer guide

---

## ⚠️ Important Notes

1. **Backup Settings:** Export settings before major changes
2. **Test Changes:** Preview on main site before going live
3. **Image Sizes:** Optimize images for web
4. **URL Format:** Always use https:// for links
5. **Browser Support:** Works best on Chrome, Firefox, Safari
6. **Mobile Access:** Fully functional on mobile devices
7. **Session Timeout:** Re-login after 24 hours
8. **Data Persistence:** Settings saved in browser storage

---

## 🛠️ Troubleshooting

### Logo Not Showing?
- Check image URL is accessible
- Verify image format (PNG/JPG)
- Clear browser cache
- Try re-uploading

### Changes Not Saving?
- Check internet connection
- Verify you're logged in
- Check browser console for errors
- Try different browser

### Can't Login?
- Verify credentials (admin/123456)
- Clear browser cookies
- Try incognito mode
- Check caps lock is off

---

## 📊 System Requirements

**Browser:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Screen Resolution:**
- Minimum: 1024x768
- Recommended: 1920x1080

**Internet:**
- Stable connection required
- Minimum 1 Mbps

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Status:** Production Ready