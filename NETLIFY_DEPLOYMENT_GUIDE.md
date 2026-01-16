# Netlify Deployment Guide for MIMO

## The Issue
You were getting a "Page not found" error because Netlify didn't know how to handle client-side routing for your React SPA (Single Page Application).

## The Solution
I've created `netlify.toml` configuration files and ensured your `_redirects` file is properly set up.

---

## Manual Deployment Steps

### Option 1: Deploy the `dist` folder directly

1. **Build your application** (already done):
   ```bash
   cd frontend
   npm run build
   ```

2. **Go to Netlify**:
   - Visit https://app.netlify.com/
   - Click "Add new site" → "Deploy manually"

3. **Drag and drop**:
   - Drag the entire `frontend/dist` folder into the Netlify drop zone
   - **IMPORTANT**: Deploy the `dist` folder, NOT the `frontend` folder

4. **Wait for deployment** to complete

5. **Your site should now work!**

---

### Option 2: Deploy from Git (Recommended for continuous deployment)

1. **Push your code to GitHub** (we'll need to fix the GitHub repo issue first)

2. **Connect to Netlify**:
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select your `MIMO` repository

3. **Configure build settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   
   (These are already configured in `netlify.toml`, so Netlify should auto-detect them)

4. **Add environment variables** (if you have any):
   - Go to Site settings → Environment variables
   - Add your Firebase config and any other API keys

5. **Deploy!**

---

## What I Fixed

### 1. Created `netlify.toml` (in both root and frontend directories)
This file tells Netlify:
- Where your code is (`base = "frontend"`)
- How to build it (`command = "npm run build"`)
- Where the built files are (`publish = "dist"`)
- How to handle routing (redirect all requests to `index.html`)

### 2. Verified `_redirects` file
Located at `frontend/public/_redirects`, this ensures all routes go to `index.html`:
```
/*    /index.html   200
```

### 3. Built your application successfully
The production build is ready in `frontend/dist/`

---

## Environment Variables

Don't forget to add your environment variables in Netlify:

1. Go to: Site settings → Environment variables
2. Add the following (from your `.env` file):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`

---

## Troubleshooting

### Still getting 404 errors?
1. Make sure you deployed the `dist` folder, not the `frontend` folder
2. Check that `_redirects` file exists in the deployed site
3. Clear your browser cache and try again

### Build fails on Netlify?
1. Check that all dependencies are in `package.json`
2. Verify Node version (should be 18 or higher)
3. Check build logs for specific errors

### Environment variables not working?
1. Make sure they start with `VITE_` prefix
2. Redeploy after adding environment variables
3. Check that you're using `import.meta.env.VITE_*` in your code

---

## Quick Deploy Checklist

- [x] Build completed successfully
- [x] `netlify.toml` created
- [x] `_redirects` file in place
- [ ] Deploy `frontend/dist` folder to Netlify
- [ ] Add environment variables in Netlify dashboard
- [ ] Test all routes after deployment

---

## Need Help?

If you're still having issues:
1. Check the Netlify deploy logs
2. Verify the published directory contains `index.html` and `_redirects`
3. Make sure all environment variables are set correctly
