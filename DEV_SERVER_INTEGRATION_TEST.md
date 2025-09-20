# Development Server Integration Test Guide

This guide helps you test the Laravel-Vite React integration to ensure everything is working correctly.

## Prerequisites

1. Make sure all dependencies are installed:
   ```bash
   composer install
   npm install
   ```

2. Set up your environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

## Testing Steps

### 1. Start the Development Servers

Open two terminal windows:

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```
This should start Laravel on `http://localhost:8000`

**Terminal 2 - Vite Development Server:**
```bash
npm run dev
```
This should start Vite on `http://localhost:5173`

### 2. Run the Integration Test

In a third terminal, run:
```bash
npm run test:dev-server
```

This will check if both servers are running and test API communication.

### 3. Manual Testing

#### Test 1: Laravel Serving React App
1. Visit `http://localhost:8000`
2. You should see the React application
3. The HMR Test component should be visible on the homepage
4. Check browser console for any errors

#### Test 2: Vite Development Server
1. Visit `http://localhost:5173`
2. You should see the same React application
3. This version has Hot Module Replacement (HMR) enabled

#### Test 3: Hot Module Replacement (HMR)
1. Keep `http://localhost:5173` open in your browser
2. Open `resources/js/src/components/HMRTest.jsx` in your editor
3. Change the message text (e.g., "HMR Test Component" to "HMR is Working!")
4. Save the file
5. The browser should update WITHOUT a full page refresh
6. The component state (counter value) should be preserved

#### Test 4: API Communication
1. Look for the "API Integration Test" component on the homepage
2. It should show "API Connection Successful" if everything is working
3. Open browser developer tools (Network tab)
4. Click "Test API Again" button and verify the network request succeeds
5. Check that API calls to `/api/*` endpoints work correctly
6. Verify CORS headers are present in responses

#### Test 5: React Router
1. Navigate between different pages using the navigation
2. Use browser back/forward buttons
3. Refresh the page on any route - it should still work (no 404 errors)

## Expected Results

### ✅ Success Indicators

1. **Both servers start without errors**
2. **React app loads at both URLs**
3. **HMR works on localhost:5173**
4. **API calls succeed**
5. **No CORS errors in console**
6. **React Router works correctly**
7. **Page refreshes work on any route**

### ❌ Common Issues and Solutions

#### Issue: "Can't detect preamble" error
- **Solution**: Check that `@vitejs/plugin-react` is properly configured in `vite.config.js`

#### Issue: CORS errors
- **Solution**: Verify `config/cors.php` includes both localhost:5173 and localhost:8000

#### Issue: API calls fail
- **Solution**: Check that API routes are not caught by the SPA route in `routes/web.php`

#### Issue: 404 on page refresh
- **Solution**: Ensure the catch-all route in `routes/web.php` excludes API routes

#### Issue: HMR not working
- **Solution**: Make sure you're accessing the app via localhost:5173, not localhost:8000

## Configuration Files Modified

The following files have been updated for proper integration:

1. **`routes/web.php`** - Updated to exclude API routes from SPA catch-all
2. **`vite.config.js`** - Added proxy configuration and enhanced server settings
3. **`config/cors.php`** - Added Vite dev server to allowed origins
4. **`resources/js/src/services/api.js`** - Enhanced to handle both dev and production environments
5. **`resources/js/main.jsx`** - Added CSRF initialization

## Cleanup

After testing, you can remove the test components:

1. Remove the imports and usage from `resources/js/src/Pages/Homepage.jsx`
2. Delete `resources/js/src/components/HMRTest.jsx`
3. Delete `resources/js/src/components/APITest.jsx`
4. Delete `test-dev-server.js` and `DEV_SERVER_INTEGRATION_TEST.md`

## Troubleshooting

If you encounter issues:

1. Check Laravel logs: `tail -f storage/logs/laravel.log`
2. Check browser console for JavaScript errors
3. Verify network requests in browser dev tools
4. Ensure all environment variables are set correctly
5. Try clearing caches: `php artisan cache:clear` and `npm run build`