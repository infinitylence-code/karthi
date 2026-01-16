# Netlify Environment Variables Setup Guide

## ❌ Error You're Getting

```
FirebaseError: Installations: Missing App configuration value: "projectId"
```

This means Netlify doesn't have your Firebase environment variables configured.

---

## ✅ Solution: Add Environment Variables in Netlify

### **Step 1: Go to Netlify Dashboard**

1. Visit: https://app.netlify.com/
2. Sign in to your account
3. Click on your **MIMO** site

### **Step 2: Navigate to Environment Variables**

1. Click **"Site configuration"** (or **"Site settings"**) in the top menu
2. In the left sidebar, click **"Environment variables"**
3. You should see a page with a button **"Add a variable"** or **"Add environment variables"**

### **Step 3: Add Each Variable**

Click **"Add a variable"** and add these **ONE BY ONE**:

#### **Firebase Configuration Variables:**

| Variable Name | Value |
|--------------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyA8tyZ77zUkdrXIaiHYDIAGu9vS1DtqeNE` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `mimo-99372.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `mimo-99372` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `mimo-99372.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `10953368450` |
| `VITE_FIREBASE_APP_ID` | `1:10953368450:web:2df7a962038f5ac48de59b` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-N38JRV17T3` |

#### **Admin Configuration:**

| Variable Name | Value |
|--------------|-------|
| `VITE_ADMIN_EMAIL` | `Karthi@gmail.com` |

### **Step 4: Important - Scopes**

When adding each variable, make sure to select:
- ✅ **All scopes** (or at least "Production" and "Deploy Previews")

### **Step 5: REDEPLOY Your Site** ⚠️ **CRITICAL STEP**

**Environment variables are ONLY applied during the build process!**

After adding all variables:

1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** button
3. Select **"Clear cache and deploy site"**
4. Wait for the deployment to complete

---

## 🔍 How to Verify Environment Variables Were Added

### **Method 1: Check in Netlify Dashboard**

1. Go to Site configuration → Environment variables
2. You should see all 8 variables listed

### **Method 2: Check Build Logs**

1. Go to Deploys → Click on the latest deploy
2. Scroll through the build logs
3. Look for the build command output - it should complete successfully

### **Method 3: Check Browser Console (After Redeploy)**

1. Open your deployed site
2. Open browser DevTools (F12)
3. Check the Console tab
4. If you still see errors, they will now be more descriptive thanks to the validation I added

---

## 📋 Quick Copy-Paste Format

If Netlify allows bulk import, use this format:

```
VITE_FIREBASE_API_KEY=AIzaSyA8tyZ77zUkdrXIaiHYDIAGu9vS1DtqeNE
VITE_FIREBASE_AUTH_DOMAIN=mimo-99372.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mimo-99372
VITE_FIREBASE_STORAGE_BUCKET=mimo-99372.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=10953368450
VITE_FIREBASE_APP_ID=1:10953368450:web:2df7a962038f5ac48de59b
VITE_FIREBASE_MEASUREMENT_ID=G-N38JRV17T3
VITE_ADMIN_EMAIL=Karthi@gmail.com
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ **Mistake 1: Not Redeploying**
- Adding environment variables is NOT enough
- You MUST redeploy for them to take effect
- Use "Clear cache and deploy site" option

### ❌ **Mistake 2: Wrong Variable Names**
- Must be EXACTLY as shown (case-sensitive)
- Must start with `VITE_` prefix
- No extra spaces or quotes

### ❌ **Mistake 3: Wrong Scope**
- Make sure variables are enabled for "Production"
- If testing deploy previews, enable for those too

### ❌ **Mistake 4: Typos in Values**
- Copy-paste the values exactly
- Don't add quotes around the values in Netlify UI

---

## 🎯 Step-by-Step Visual Guide

### Adding a Single Variable:

1. Click **"Add a variable"**
2. **Key**: Enter the variable name (e.g., `VITE_FIREBASE_PROJECT_ID`)
3. **Value**: Enter the value (e.g., `mimo-99372`)
4. **Scopes**: Select "All scopes" or at least "Production"
5. Click **"Create variable"** or **"Save"**
6. Repeat for all 8 variables

### After Adding All Variables:

1. Click **"Deploys"** in the top menu
2. Click **"Trigger deploy"** dropdown button
3. Select **"Clear cache and deploy site"**
4. Wait 2-3 minutes for build to complete
5. Visit your site - it should work now! ✅

---

## 🐛 Still Not Working?

### Check These:

1. **Are all 8 variables added?**
   - Go to Site configuration → Environment variables
   - Count them - should be 8 total

2. **Did you redeploy AFTER adding them?**
   - Check Deploys tab
   - Latest deploy should be AFTER you added the variables
   - Check the timestamp

3. **Check the build logs:**
   - Go to Deploys → Click latest deploy
   - Look for any errors in the build process
   - The build should complete successfully

4. **Check browser console:**
   - Open your deployed site
   - Press F12 to open DevTools
   - Look at Console tab
   - You should see helpful error messages now

---

## 📞 Need More Help?

If you're still stuck:

1. **Screenshot the Environment Variables page** in Netlify (showing all 8 variables)
2. **Screenshot the latest Deploy log** (showing any errors)
3. **Screenshot the browser console** (showing any errors)
4. Share these screenshots for further debugging

---

## ✅ Success Checklist

- [ ] Added all 8 environment variables in Netlify
- [ ] Variables are enabled for "Production" scope
- [ ] Triggered a new deployment (Clear cache and deploy)
- [ ] Deployment completed successfully (no build errors)
- [ ] Visited the deployed site
- [ ] Site loads without Firebase errors
- [ ] Can log in and use the app

Once all checkboxes are complete, your app should be working! 🎉
