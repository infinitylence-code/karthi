# Netlify Deployment Setup Guide

## Environment Variables Configuration

To deploy this application on Netlify, you **MUST** configure the following environment variables in your Netlify dashboard.

### Steps to Add Environment Variables:

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site (karthi)
3. Navigate to **Site settings** → **Environment variables**
4. Click **Add a variable** and add each of the following:

### Required Environment Variables:

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

### Important Notes:

- ⚠️ **DO NOT** commit the `.env` file to Git (it's already in `.gitignore`)
- ✅ Environment variables must be set in Netlify's dashboard for production
- 🔄 After adding environment variables, trigger a new deployment
- 🔒 These are public Firebase config values (safe to use in frontend)

### After Adding Variables:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for the build to complete
4. Your site should now work correctly!

## Build Settings:

The `netlify.toml` file is already configured with:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirects for React Router

## Troubleshooting:

If you still see Firebase configuration errors:
1. Verify all environment variables are spelled correctly (case-sensitive)
2. Make sure they all start with `VITE_` prefix
3. Clear cache and redeploy
4. Check the build logs for any errors
