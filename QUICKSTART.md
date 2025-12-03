# Quick Start Guide

## First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Add Your Logo**
   - Place your SNACK BOX logo file as `logo.png` in the `public/` folder
   - Supported formats: PNG, JPG, SVG
   - Recommended size: 200x60px or similar aspect ratio

3. **Configure Payment**
   - Open `src/components/QRCode.jsx`
   - Find the line: `const upiId = 'snackbox@paytm';`
   - Replace with your actual UPI ID

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   - The app will open at http://localhost:3000

## Admin Access

- **Default Password**: `admin123`
- Click the "⚙️ Admin" button in the header to access admin features
- To change password, edit `src/components/Login.jsx` (line 9)

## Features Overview

### Customer Features
- Browse menu by categories
- Search menu items
- Add items to cart with one click
- View and manage cart
- Checkout and payment
- Print bills

### Admin Features
- **Menu Management**: Add, edit, delete menu items
- **Sales Reports**: View monthly sales statistics
- Password-protected access

## Menu Categories

- 🍰 BAKE TREATS (Brownies, Cookies, Cakes, Cupcakes)
- 🍔 SNACKS & BITES (Burgers, Sandwiches, Fries, Momos, Noodles, Rice)
- 🥤 DRINKS & SHAKES (Milkshakes, Cold Coffee, Fresh Juices, Falooda)
- 🍨 ICE CREAM & MORE (Ice Cream, Kulfi)
- ⭐ SPECIALS (Cream Bowls)

## Data Storage

All data is stored in browser localStorage:
- Menu items persist across sessions
- Cart is session-based
- Orders are saved for sales reports

**Note**: For production, consider migrating to a backend database.

## Troubleshooting

### Logo not showing?
- Make sure `logo.png` is in the `public/` folder
- Check file name is exactly `logo.png` (case-sensitive)
- The app will work without logo, showing only text

### QR Code not generating?
- Check that `qrcode.react` package is installed
- Verify the UPI ID is correctly set in `QRCode.jsx`

### Admin login not working?
- Default password is `admin123`
- Check browser console for errors
- Try clearing browser localStorage and reloading

## Production Build

```bash
npm run build
```

The built files will be in the `dist/` folder, ready to deploy to any static hosting service.

