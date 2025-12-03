# SNACK BOX - Food & Chats Store

A modern food ordering website built with React and Vite.

## Features

✅ Menu display with categories (BAKE TREATS, SNACKS & BITES, DRINKS & SHAKES, ICE CREAM & MORE, SPECIALS)
✅ Shopping cart functionality (add, remove, update quantities)
✅ Billing and payment with QR code
✅ Bill printing functionality
✅ Menu management (CRUD operations) - Admin panel
✅ Monthly sales reports - Admin panel
✅ Professional animations using Framer Motion
✅ Responsive design for mobile and desktop
✅ Search and filter menu items
✅ Password-protected admin access

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your logo:
   - Place your SNACK BOX logo as `logo.png` in the `public` folder
   - The logo will automatically display in the header
   - If no logo is found, only the text "SNACK BOX" will be displayed

3. Configure payment QR code:
   - Edit `src/components/QRCode.jsx`
   - Update the `upiId` variable with your actual UPI ID
   - The QR code will generate automatically with payment details

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Admin Access

- Default password: `admin123`
- Access admin panel by clicking the "⚙️ Admin" button in the header
- Admin features:
  - Menu Management: Add, edit, delete menu items
  - Sales Reports: View monthly sales statistics and top-selling items
- To change the admin password, edit `src/components/Login.jsx`

## Color Scheme

- Primary Yellow: `rgb(237, 201, 79)` / `#EDC94F`
- Primary Brown: `rgb(173, 112, 60)` / `#AD703C`

## Project Structure

- `src/components/` - React components (Header, Menu, Cart, Billing, Admin, etc.)
- `src/context/` - React Context providers (Cart, Menu)
- `src/data/` - Initial menu data
- `src/utils/` - Utility functions (storage, sales, print)
- `src/styles/` - CSS stylesheets
- `public/` - Static assets (logo, etc.)

## Usage

1. **Browse Menu**: View all available food items organized by categories
2. **Add to Cart**: Click any item to add it to your cart
3. **View Cart**: Click the cart icon in the header to view and manage your cart
4. **Checkout**: Proceed to checkout from the cart
5. **Payment**: Click "Pay Now" to see the QR code for payment
6. **Print Bill**: After placing an order, you can print the bill

## Data Storage

All data is stored in browser localStorage:
- Menu items (editable via admin panel)
- Cart items (session-based)
- Order history (for sales reports)

Note: Data will be cleared if the user clears their browser data. For production use, consider migrating to a backend database.

