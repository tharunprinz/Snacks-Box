# Excel Integration Guide

This application uses Excel files to store menu data and user login data. The Excel files are stored in the `public/data/` directory and are automatically synced with the application.

## Excel File Structure

### 1. Menu Data (`menu_data.xlsx`)

The menu Excel file should have the following columns:

| Column Name | Description | Example |
|------------|-------------|---------|
| ID | Unique identifier for the item | 1 |
| Name | Item name | Chocolate Cake |
| Price | Item price in ₹ | 150 |
| Category | Item category | BAKE TREATS |
| Subcategory | Optional subcategory | Cakes |
| Image URL | URL or base64 image | https://example.com/image.jpg |
| Available | Yes/No | Yes |
| Is Offer | Yes/No | Yes |
| Is New Arrival | Yes/No | No |

**Example Row:**
```
ID: 1
Name: Chocolate Cake
Price: 150
Category: BAKE TREATS
Subcategory: Cakes
Image URL: https://example.com/cake.jpg
Available: Yes
Is Offer: Yes
Is New Arrival: No
```

### 2. Users Data (`users_data.xlsx`)

The users Excel file should have the following columns:

| Column Name | Description | Example |
|------------|-------------|---------|
| User ID | Unique identifier | 1234567890 |
| Name | Customer full name | John Doe |
| Email | Customer email | john@example.com |
| Phone | Customer phone number | +919876543210 |
| Address | Delivery address | 123 Main St, City |
| WhatsApp Opt In | Yes/No | Yes |
| Registered At | Registration timestamp | 2024-01-15T10:30:00.000Z |
| Last Login | Last login timestamp | 2024-01-20T14:45:00.000Z |
| Login Count | Number of logins | 5 |

**Example Row:**
```
User ID: 1234567890
Name: John Doe
Email: john@example.com
Phone: +919876543210
Address: 123 Main St, City
WhatsApp Opt In: Yes
Registered At: 2024-01-15T10:30:00.000Z
Last Login: 2024-01-20T14:45:00.000Z
Login Count: 5
```

## Setup Instructions

### 1. Create Excel Files

1. Create a `data` folder in the `public` directory:
   ```bash
   mkdir -p public/data
   ```

2. Create two Excel files:
   - `public/data/menu_data.xlsx`
   - `public/data/users_data.xlsx`

3. Use the column structure provided above.

### 2. Initial Data

You can start with empty Excel files, and the application will use localStorage as a fallback. When you add items through the admin dashboard, they will be synced to Excel.

### 3. Excel File Updates

- **Menu Updates**: When you add, edit, or delete items in the admin dashboard, the Excel file is automatically updated.
- **User Updates**: When customers register or update their profile, the Excel file is automatically updated.

### 4. Reading from Excel

The application reads from Excel files on startup:
- Menu data is loaded from `menu_data.xlsx`
- User data is loaded from `users_data.xlsx`
- If Excel files are not found, it falls back to localStorage

### 5. Writing to Excel

The application writes to Excel files when:
- Admin adds/edits/deletes menu items
- Customer registers or updates profile
- Customer places an order (updates user data)

**Note**: In a browser environment, Excel files are downloaded to the user's Downloads folder. For production, you'll need a backend API to handle Excel file operations.

## Backend Integration (Production)

For production, you'll need a backend API to:
1. Read Excel files from the server
2. Write Excel files to the server
3. Sync data between Excel and database

Example backend endpoint:
```javascript
// GET /api/menu/excel
// Returns menu data from Excel file

// POST /api/menu/excel
// Updates menu data in Excel file

// GET /api/users/excel
// Returns user data from Excel file

// POST /api/users/excel
// Updates user data in Excel file
```

## Troubleshooting

1. **Excel files not found**: The app will use localStorage as fallback. Check that files are in `public/data/` directory.

2. **Excel format errors**: Ensure column names match exactly (case-sensitive).

3. **Data not syncing**: Check browser console for errors. Excel operations may fail silently in some browsers.

## Git Ignore

Excel files are automatically ignored by git (see `.gitignore`):
```
data/menu_data.xlsx
data/users_data.xlsx
*.xlsx
*.xls
```

This ensures sensitive user data is not committed to the repository.

