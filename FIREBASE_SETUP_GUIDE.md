# 🔥 Firebase Authentication Setup Guide

## ⚠️ IMPORTANT: Enable Email/Password Authentication

If users are not being stored in Firebase Authentication, it's likely because **Email/Password sign-in is not enabled** in your Firebase Console.

## 📋 Step-by-Step Instructions

### 1. Go to Firebase Console
- Open your browser and go to: https://console.firebase.google.com/
- Select your project: **mimo-99372**

### 2. Navigate to Authentication
- In the left sidebar, click on **"Build"** or **"Authentication"**
- Click on **"Authentication"** if it's under Build

### 3. Enable Email/Password Sign-in Method
- Click on the **"Sign-in method"** tab at the top
- You should see a list of sign-in providers
- Find **"Email/Password"** in the list
- Click on **"Email/Password"**
- Toggle the **"Enable"** switch to ON
- Click **"Save"**

### 4. (Optional) Enable Email Verification
- While in the Email/Password settings, you can also enable email verification
- This is recommended for production apps

### 5. Set Up Firestore Database (if not already done)
- In the left sidebar, click on **"Firestore Database"**
- If you haven't created a database yet:
  - Click **"Create database"**
  - Choose **"Start in test mode"** (for development)
  - Select your preferred location
  - Click **"Enable"**

### 6. Configure Firestore Security Rules (Important!)
- Once Firestore is created, go to the **"Rules"** tab
- Replace the default rules with these (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow all authenticated users to read all users (for admin dashboard)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
  }
}
```

### 7. Test the Application
- Go back to your application: http://localhost:5173
- Open the browser console (F12)
- Try to sign up with a new email
- You should see detailed logs in the console showing the signup process
- Check Firebase Console > Authentication > Users to see if the user was created

## 🐛 Troubleshooting

### If you see error: "auth/operation-not-allowed"
✅ **Solution**: Enable Email/Password authentication in Firebase Console (see steps above)

### If you see error: "auth/network-request-failed"
✅ **Solution**: Check your internet connection and Firebase project configuration

### If you see error: "Missing or insufficient permissions"
✅ **Solution**: Update your Firestore security rules (see step 6 above)

### If users are created but not showing in Firebase Console
1. Make sure you're looking at the correct Firebase project
2. Refresh the Firebase Console page
3. Check the "Authentication" > "Users" tab

## 📊 Verify Everything is Working

After enabling Email/Password authentication:

1. **Sign Up Test**:
   - Open http://localhost:5173/signup
   - Fill in the form with a test email
   - Click "Sign Up"
   - Check browser console for success messages
   - Check Firebase Console > Authentication > Users

2. **Login Test**:
   - Go to http://localhost:5173/login
   - Use the email and password you just created
   - You should be logged in successfully

3. **Firestore Test**:
   - Go to Firebase Console > Firestore Database
   - You should see a "users" collection
   - Inside, you should see a document with your user data

## 🎯 Current Firebase Project Details

- **Project ID**: mimo-99372
- **Auth Domain**: mimo-99372.firebaseapp.com
- **Console URL**: https://console.firebase.google.com/project/mimo-99372

## 📝 Next Steps After Setup

Once Email/Password authentication is enabled:

1. ✅ Test signup with a new email
2. ✅ Test login with the created account
3. ✅ Verify user appears in Firebase Console
4. ✅ Check Firestore for user document
5. ✅ Test the admin features (making users admin)

## 🔐 Security Recommendations for Production

When you're ready to deploy:

1. **Update Firestore Rules**: Change from test mode to production rules
2. **Enable Email Verification**: Require users to verify their email
3. **Add Password Reset**: Implement forgot password functionality
4. **Set up App Check**: Protect your app from abuse
5. **Monitor Usage**: Set up billing alerts in Firebase Console

---

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. Check the browser console for detailed error messages
2. Verify your Firebase project configuration
3. Make sure you're using the correct API key
4. Try creating a test user directly in Firebase Console to verify the project is set up correctly

The application now has detailed console logging, so you'll see exactly where the process fails!
