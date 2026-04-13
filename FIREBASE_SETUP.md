# Firebase Authentication Setup Guide

This app uses Firebase Authentication with email/password and Google Sign-In. Follow these steps to set it up:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter your project name and complete the setup

## Step 2: Get Firebase Configuration

1. In Firebase Console, click on your project
2. Click the gear icon (Settings) → Project Settings
3. Scroll down to "Your apps" section
4. Click "Add app" → Web
5. Copy the configuration object

## Step 3: Update firebaseConfig.ts

Open `src/config/firebaseConfig.ts` and replace the placeholder values:

```typescript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## Step 4: Enable Authentication Methods

1. In Firebase Console, go to Authentication → Sign-in method
2. Click "Email/Password" and enable it
3. (Optional) Click "Google" and enable it

## Step 5: Set Up Google Sign-In (Optional)

1. In Firebase Console, go to Authentication → Sign-in method
2. Click "Google" and enable it
3. Go to your Google Cloud Project settings
4. Create an OAuth 2.0 Web Client ID
5. Update `googleWebClientId` in `src/config/firebaseConfig.ts`

## Step 6: Set Up Firestore Database (For User Profiles)

1. In Firebase Console, click "Firestore Database"
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Create a collection named "users"

## Step 7: Set Up Security Rules (Important for Production)

Update Firestore security rules in Firebase Console → Firestore Database → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Features Implemented

✅ Email/Password Registration
✅ Email/Password Login
✅ Google Sign-In (Ready for configuration)
✅ User Profile Management (Firestore)
✅ Theme Support (Light & Dark modes)
✅ Quiz App
✅ Logout functionality

## Testing Locally

For testing with Expo:

```bash
npm start
# Then press 'w' for web, 'i' for iOS, or 'a' for Android
```

**Note**: Google Sign-In on web requires HTTPS in production. For testing, Expo provides a local development environment.

## Common Issues

### Firebase not configured error
Make sure you've filled in all the Firebase config values in `src/config/firebaseConfig.ts`

### Google Sign-In not working
- Ensure your Web Client ID is correct
- Add your redirect URL to Google Cloud Console authorized JavaScript origins
- For web, add: `http://localhost:19000` (for Expo local testing)

### User profile not saving
- Check that Firestore Database is created and enabled
- Verify security rules allow your user's UID to write to `/users/{uid}` document
