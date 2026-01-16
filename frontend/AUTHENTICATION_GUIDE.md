# Authentication System - MIMO E-Commerce

## Overview
The MIMO e-commerce application now has a complete authentication system with login and signup functionality. Users must authenticate before accessing the shopping dashboard.

## Features Implemented

### 1. **Login Page** (`Login.jsx`)
- Email and password authentication
- Form validation (email format, password length)
- Error handling for invalid credentials
- Smooth animations and transitions
- Responsive design for all devices

### 2. **Signup Page** (`Signup.jsx`)
- User registration with name, email, and password
- Password confirmation validation
- Duplicate email detection
- Automatic login after successful signup
- Beautiful gradient background with animations

### 3. **Authentication Flow**
- **First Visit**: Users see the login page
- **No Account**: Can switch to signup page
- **After Login/Signup**: Redirected to shopping dashboard
- **Session Persistence**: User stays logged in even after page refresh
- **Logout**: Returns to login page and clears session

### 4. **User Profile**
- Profile button in header shows user icon
- Hover to see dropdown menu with:
  - User's full name
  - Email address
  - Logout button
- Logout clears cart and wishlist

## Data Storage
- Uses **localStorage** for data persistence
- Stored data:
  - `users`: Array of all registered users
  - `currentUser`: Currently logged-in user
- Data persists across browser sessions

## User Flow

```
1. Open Application
   ↓
2. Login Page (default)
   ↓
   ├─→ Have Account? → Login → Dashboard
   │
   └─→ No Account? → Click "Sign up" → Signup Page → Auto Login → Dashboard
   
3. Dashboard (Shopping)
   ↓
   └─→ Click Profile → Hover → See User Info → Click Logout → Login Page
```

## Validation Rules

### Login
- Email: Required, must be valid email format
- Password: Required, minimum 6 characters

### Signup
- Name: Required, minimum 2 characters
- Email: Required, valid format, must be unique
- Password: Required, minimum 6 characters
- Confirm Password: Must match password

## Testing the System

### To Create a Test Account:
1. Open the application
2. Click "Sign up" on the login page
3. Fill in:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
4. Click "Sign Up"
5. You'll be automatically logged in and see the dashboard

### To Login:
1. Use the credentials you created during signup
2. Email: john@example.com
3. Password: password123
4. Click "Login"

### To Logout:
1. Hover over the profile icon (👤) in the header
2. Click "Logout"
3. You'll be redirected to the login page

## Styling
- Beautiful gradient backgrounds (purple to violet)
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)
- Modern glassmorphism effects
- Professional form design

## Security Notes
⚠️ **Important**: This is a frontend-only authentication system for demonstration purposes.

For production use, you should:
- Implement backend authentication
- Use secure password hashing (bcrypt, etc.)
- Add JWT tokens for session management
- Implement HTTPS
- Add rate limiting
- Use proper database instead of localStorage

## Files Created
1. `Login.jsx` - Login component
2. `Signup.jsx` - Signup component
3. `Auth.css` - Authentication styles
4. `App.jsx` - Updated with auth logic

## Currency
All prices are displayed in Indian Rupees (₹) instead of dollars ($).
