#!/usr/bin/env node

// This script checks if environment variables are available during build
console.log('\n🔍 Checking Environment Variables...\n');

const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_MEASUREMENT_ID',
    'VITE_ADMIN_EMAIL'
];

let allPresent = true;

requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
        console.log(`❌ ${varName}: NOT FOUND`);
        allPresent = false;
    }
});

console.log('\n');

if (!allPresent) {
    console.error('⚠️  Some environment variables are missing!');
    console.error('Please check your Netlify environment variables configuration.');
} else {
    console.log('✅ All environment variables are present!');
}
