# Excel Data Files Directory

This directory should contain the following Excel files:

1. **menu_data.xlsx** - Menu items data
2. **users_data.xlsx** - User login data

## Setup Instructions

1. Create Excel files with the structure described in `EXCEL_INTEGRATION.md`
2. Place the files in this directory
3. The application will automatically read from these files on startup

## Note

These files are in `.gitignore` and will not be committed to the repository for security reasons.

## Initial Setup

If you don't have Excel files yet:
- The application will use localStorage as a fallback
- When you add items through the admin dashboard, they will be synced to Excel
- Excel files will be downloaded to your Downloads folder (browser limitation)

For production, use a backend API to handle Excel file operations.

