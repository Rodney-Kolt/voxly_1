# Voxly Setup Guide

Complete step-by-step instructions to get Voxly running locally and deploy to Vercel.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Local Development](#local-development)
4. [Deployment to Vercel](#deployment-to-vercel)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you start, ensure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm, yarn, or pnpm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **GitHub account** (for pushing code)
- **Firebase account** - [Create one](https://console.firebase.google.com/)
- **Vercel account** - [Create one](https://vercel.com/signup)

Verify installation:
```bash
node --version      # Should be v18 or higher
npm --version       # Should be v9 or higher
git --version       # Any recent version is fine
```

---

## Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: `voxly` (or your preferred name)
4. Accept the terms and click **"Continue"**
5. **Disable** Google Analytics (not needed for V1) and click **"Create project"**
6. Wait for the project to initialize, then click **"Continue"**

### Step 2: Register Your Web App

1. In the Firebase Console, look for the 💻 Web icon or click **"Create app"**
2. Select **"Web"** and enter app nickname: `voxly-web`
3. Check **"Also set up Firebase Hosting"** (optional, but recommended)
4. Click **"Register app"**

### Step 3: Copy Firebase Configuration

1. After registration, you'll see your Firebase configuration
2. Copy the following values and save them somewhere temporarily:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

**Example Firebase config block:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBmKf8N9gP2z3xY4aB5cD6eF7gH8iJ9kL0",
  authDomain: "voxly-12345.firebaseapp.com",
  projectId: "voxly-12345",
  storageBucket: "voxly-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Step 4: Enable Google Sign-In

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click the **"Get started"** button if this is your first time
3. Click on the **"Sign-in method"** tab
4. Click **"Google"** and toggle it **ON**
5. Enter your project support email and click **"Save"**
6. Verify the status shows **"Enabled"**

**Important:** By default, only Google is enabled. Other sign-in methods (email, phone, etc.) are disabled, which is what we want for V1.

### Step 5: Set Authorized Domains (Local Dev)

1. In **Authentication** > **Settings**, scroll to **Authorized domains**
2. You should see `localhost` already added for development
3. Later, when deploying to Vercel, add your Vercel domain here too

---

## Local Development

### Step 1: Clone or Extract the Project

```bash
# Navigate to your workspace
cd c:\poll opinion

# If cloning from GitHub:
git clone <your-github-repo> voxly
cd voxly

# If using extracted files, just navigate to:
cd voxly
```

### Step 2: Install Dependencies

```bash
npm install
# or yarn install, pnpm install
```

This will install all required packages including:
- Next.js 14
- React & React DOM
- Firebase
- Tailwind CSS
- Lucide React icons

### Step 3: Configure Environment Variables

1. Open `.env.local` in the root directory
2. Fill in your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBmKf8N9gP2z3xY4aB5cD6eF7gH8iJ9kL0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=voxly-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=voxly-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=voxly-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**Save the file** and the dev server will automatically detect the changes.

### Step 4: Start Development Server

```bash
npm run dev
```

You should see:
```
> voxly@0.1.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

Ready in 1234ms
```

### Step 5: Test Locally

1. Open http://localhost:3000 in your browser
2. You should see the Voxly landing page
3. Click **"Sign in with Google"** button
4. Google sign-in popup should appear
5. Sign in with your Google account
6. After signing in, you'll be redirected to `/profile`
7. On the profile page, you should see your name, email, and avatar
8. Try the **"Sign Out"** button
9. You should be redirected back to the home page

**If you encounter issues, see [Troubleshooting](#troubleshooting) below.**

---

## Deployment to Vercel

### Step 1: Push Code to GitHub

1. Initialize Git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Voxly V1"
```

2. Create a new repository on [GitHub](https://github.com/new)
   - Name: `voxly`
   - Description: "Your voice, amplified"
   - Public or Private (your choice)
   - Do NOT initialize with README (you have one)
   - Click **"Create repository"**

3. Connect local repo to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/voxly.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** > **"Project"**
3. Click **"Import Git Repository"**
4. Search for `voxly` and select your repository
5. Click **"Import"**

### Step 3: Add Environment Variables

1. In the import dialog, you should see an **"Environment Variables"** section
2. Add each Firebase configuration variable:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBmKf8...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `voxly-12345.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `voxly-12345` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `voxly-12345.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123456789012:web:...` |

3. Click **"Deploy"**

The build will start automatically. Wait for it to complete (usually 2-3 minutes).

### Step 4: Add Vercel Domain to Firebase

1. After deployment completes, copy your Vercel domain (e.g., `https://voxly.vercel.app`)
2. Go to Firebase Console > **Authentication** > **Settings**
3. Scroll to **Authorized domains** and click **"Add domain"**
4. Paste your Vercel domain and click **"Add"**
5. Save changes

### Step 5: Test Production Deployment

1. Open your Vercel domain in a browser
2. Test the full sign-in flow
3. Verify the profile page works correctly
4. Test sign-out functionality

**Congratulations! Your app is live! 🎉**

---

## Troubleshooting

### "Firebase is not initialized"

**Problem:** Error about Firebase configuration not being found.

**Solution:**
- Check that `.env.local` exists in the root directory
- Verify all Firebase variables are filled in correctly
- Ensure variable names match exactly (case-sensitive)
- Restart the dev server: `npm run dev`

### "Google Sign-In not working"

**Problem:** Clicking sign-in button does nothing or shows error.

**Solution:**
- Verify Google Sign-In is **enabled** in Firebase Console > **Authentication**
- Check that `localhost` is in **Authorized domains**
- Clear browser cache and cookies
- Try in an incognito/private browser window
- Check browser console for error messages (F12 > Console tab)

### "Profile page redirects to home"

**Problem:** After signing in, you're redirected back to home instead of going to profile.

**Solution:**
- Check browser console for errors (F12 > Console)
- Verify auth context is properly initialized
- Try signing out and signing in again
- Check that Firebase is properly configured

### "Deployment on Vercel says 'build failed'"

**Problem:** Vercel deployment fails during build.

**Solution:**
- Check the build logs in Vercel dashboard
- Verify all environment variables are added correctly
- Ensure `package.json` and `package-lock.json` are committed to Git
- Try rebuilding: Go to Vercel project > **Deployments** > Click **...** > **Redeploy**

### "Sign-in works locally but not on Vercel"

**Problem:** Works on `localhost:3000` but fails on Vercel domain.

**Solution:**
- Add your Vercel domain to Firebase **Authorized domains**
- Wait a few minutes for Firebase to propagate the change
- Clear browser cache
- Try in an incognito window

### "Can't find module 'firebase'"

**Problem:** Error like "Cannot find module 'firebase'".

**Solution:**
```bash
# Delete node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

---

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm start

# Run linter
npm run lint

# Clean build cache
rm -rf .next
```

---

## Environment Variables Cheat Sheet

Save these variable names for reference:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

**Remember:** Variables prefixed with `NEXT_PUBLIC_` are safe to expose in the browser and are required for client-side Firebase operations.

---

## Next Steps (For V2+)

Once you have the foundation working:

- [ ] Add poll creation feature
- [ ] Build poll display and voting interface
- [ ] Implement real-time updates
- [ ] Add comment system
- [ ] Create poll analytics
- [ ] Add more authentication methods
- [ ] Implement user settings page
- [ ] Add notification system
- [ ] Deploy backend (if needed)

---

## Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Firebase Docs:** https://firebase.google.com/docs/auth
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

**Happy coding! Questions? Feel free to open an issue in the repository.** 🚀
