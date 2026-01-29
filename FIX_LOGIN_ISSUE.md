# Fix "Forbidden Resource" Error

If you're getting a "Forbidden Resource" error when trying to add products, follow these steps:

## Solution: Clear Browser Storage

1. **Open Browser Developer Tools**
   - Press `F12` or `Right-click` > `Inspect`
   - Or use `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

2. **Go to Console Tab**

3. **Run this command**:
   ```javascript
   localStorage.clear(); window.location.href = '/admin/login';
   ```

4. **Login Again** with:
   - **Email**: `admin@test-agency.com`
   - **Password**: `SecureAdminPassword123!`

## Why This Happens

The authentication token was issued before we fixed the password in the database. Clearing localStorage removes the old token and forces a fresh login with the correct credentials.

## Alternative Method

1. Open Application/Storage tab in Developer Tools
2. Find "Local Storage" in the left sidebar
3. Click on your localhost URL
4. Delete all items (accessToken, refreshToken, user)
5. Refresh the page
6. Login again
