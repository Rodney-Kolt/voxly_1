# Voxly - Cloudflare Pages Deployment Guide

This guide explains how to deploy Voxly to Cloudflare Pages with a custom domain.

## Prerequisites

- GitHub repository with Voxly code pushed
- Cloudflare account (free tier works fine)
- Custom domain registered with Cloudflare (or use Cloudflare's nameservers)
- Firebase project already configured (for authentication and database)

## Quick Start: Deploy to Cloudflare Pages

### Step 1: Connect Your GitHub Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Workers & Pages** → **Pages**
3. Click **Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Select your Voxly repository
6. Click **Begin setup**

### Step 2: Configure Build Settings

On the build configuration screen:

- **Framework preset**: Select `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: Leave blank (or `/` if required)

### Step 3: Set Environment Variables

Click **Environment variables** and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_URL=https://your-domain.com
```

Get these values from your Firebase project:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your Voxly project
3. Click **Settings** ⚙️ → **Project settings**
4. Scroll down to **Your apps** and select your web app
5. Copy all the config values

### Step 4: Deploy

Click **Save and Deploy**. Cloudflare will:
1. Clone your repository
2. Install dependencies
3. Run `npm run build`
4. Deploy to `your-site.pages.dev`

The deployment typically completes in 2-5 minutes.

### Step 5: Configure Custom Domain (Optional)

If you have a custom domain:

1. In Cloudflare Pages settings, click **Custom domain**
2. Enter your domain (e.g., `voxly.example.com`)
3. Cloudflare will verify DNS configuration
4. Once verified, your site is live at your custom domain

## How Voxly Works on Cloudflare Pages

### Architecture

Voxly uses:
- **Frontend**: Next.js with React (client-side rendered)
- **Database**: Firebase Firestore (all data operations)
- **Authentication**: Firebase Auth (Google sign-in)
- **Real-time Updates**: Firestore onSnapshot listeners
- **Deployment**: Cloudflare Pages (hybrid rendering)

### Page Types

1. **Static Pages** (pre-rendered at build time):
   - Home page (`/`) - displays polls from Firebase
   - About/help pages (if added)

2. **Dynamic Pages** (rendered on-demand):
   - Poll detail (`/poll/[pollId]`) - fetches specific poll from Firebase
   - Create poll (`/create`) - requires authentication
   - Dashboard (`/dashboard`) - user-specific content
   - User profile (`/profile`) - user settings

3. **Client-Side Navigation**:
   - All pages use Next.js client-side navigation
   - Firebase SDK handles authentication state
   - Real-time updates via Firestore listeners

### Environment Variables

Only `NEXT_PUBLIC_*` variables are included in the frontend bundle (visible in browser). These are safe to expose:

- `NEXT_PUBLIC_FIREBASE_*` - Firebase web app config (must be public)
- `NEXT_PUBLIC_URL` - Your app's domain

Server-only variables (if needed) are not supported on Cloudflare Pages static hosting. For payment processing or other backend features, use Cloudflare Workers (see optional section below).

## Troubleshooting

### Build Fails with Firebase Errors

**Problem**: Build log shows `FirebaseError: auth/invalid-api-key`

**Solution**: This is expected during build. The error occurs because Firestore operations happen during page pre-rendering. Since most pages are client-side rendered, these errors don't prevent deployment. The app works fine at runtime.

### Pages Don't Load or Show Blank Screen

**Problem**: Site deploys but shows nothing

**Possible Causes**:
1. Firebase API key not set in environment variables
2. Firebase security rules blocking anonymous access
3. Browser console errors (check DevTools → Console)

**Solutions**:
1. Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set correctly in Cloudflare Pages settings
2. Go to Firebase Console → Firestore → Rules and ensure rules allow public read access:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
       }
       match /polls/{pollId} {
         allow write: if request.auth != null;
       }
     }
   }
   ```
3. Open DevTools (F12 → Console tab) and check for errors

### Changes Not Reflecting After Push

**Problem**: You pushed code but Cloudflare hasn't deployed yet

**Solution**: Deployments trigger automatically when you push to `main` branch. Check:
1. In Cloudflare Dashboard → Pages → Voxly project
2. Look at **Deployments** tab
3. Wait for the new deployment to finish (usually 2-5 min)
4. Clear browser cache (Ctrl+Shift+Delete) and refresh

### Real-Time Updates Not Working

**Problem**: Polls don't update when voting in another window

**Solution**: This requires Firestore's real-time listeners (`onSnapshot`). Ensure:
1. Firestore security rules allow read access (see above)
2. Browser has JavaScript enabled
3. Firebase is initialized correctly (check browser DevTools → Application → Storage)

## Optional: Backend Services with Cloudflare Workers

If you need backend functionality (payments, email, webhooks):

### Pesapal Payments Integration

To add Pesapal payment processing:

1. Create a Cloudflare Worker for `/api/checkout` and `/api/ipn`
2. Store `PESAPAL_CONSUMER_SECRET` in Worker environment (not exposed to frontend)
3. Worker handles OAuth with Pesapal, returns session token to frontend
4. Frontend redirects user to Pesapal checkout

**Example Worker** (not included in this migration):
```javascript
export default {
  async fetch(request) {
    if (request.pathname === '/api/checkout') {
      // Call Pesapal OAuth endpoint
      // Return session token to frontend
    }
    if (request.pathname === '/api/ipn') {
      // Validate Pesapal IPN callback
      // Update order status in Firestore
    }
  }
}
```

See [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/) for setup.

## Monitoring & Analytics

### Check Deployment Status

- **Cloudflare Dashboard**: Pages → Voxly → Deployments
- **Real-time Logs**: Click a deployment to see build logs

### Monitor Performance

- **Cloudflare Analytics**: Dashboard → Analytics & Logs → Page Rules
- **Google Analytics**: Add to your site (optional)

### Monitor Firestore Usage

- **Firebase Console**: Project → Firestore Database → Usage
- **Warnings**: Monitor read/write quota to avoid charges

## Redeploy / Rollback

### Manual Redeploy

1. Go to Cloudflare Pages → Voxly project
2. Click **Deployments**
3. Find a previous deployment
4. Click **Rollback** to revert, or re-run the latest build

### Automatic Rollback

Every deployment is automatically linked to a Git commit. To revert:
1. In GitHub, revert the problematic commit
2. Push to `main`
3. Cloudflare automatically deploys the new commit

## Removing Vercel

Voxly is now fully migrated from Vercel to Cloudflare Pages:

- ✅ All Vercel-specific files removed
- ✅ Environment configured for Cloudflare
- ✅ Build tested locally
- ✅ Next.js configured for hybrid rendering
- ✅ Firebase remains the single source of truth

You can safely:
1. Delete the Vercel project from Vercel Dashboard (or leave it as backup)
2. Update any marketing/docs that reference `voxly-1.vercel.app` to your new domain
3. Remove `NEXT_PUBLIC_URL=https://voxly-1.vercel.app` from anywhere it's referenced

## Support & Resources

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Next.js on Cloudflare**: https://developers.cloudflare.com/pages/framework-guides/nextjs/
- **Firebase Security Rules**: https://firebase.google.com/docs/firestore/security/start
- **Cloudflare Workers**: https://developers.cloudflare.com/workers/

## FAQ

**Q: Is there a cost to use Cloudflare Pages?**
A: Cloudflare Pages is free! You pay only for additional services (custom Workers, etc.).

**Q: Can I use a subdomain like `poll.example.com`?**
A: Yes, enter `poll.example.com` in the Custom Domain setting.

**Q: What if I want to use my root domain `example.com`?**
A: Yes, just enter `example.com` in Custom Domain. Cloudflare will configure DNS.

**Q: Can I deploy from a different branch?**
A: Yes, in Cloudflare Pages settings, change the **Production branch** from `main` to another branch.

**Q: How do I add a staging environment?**
A: Deployments on non-production branches are automatically created at `branch-name.your-site.pages.dev`.

**Q: Can I use Cloudflare's free domain?**
A: Yes, but you'll get a `.pages.dev` subdomain. Custom domains are recommended for production.

---

**Last Updated**: August 2026  
**Voxly Version**: 0.1.0  
**Deployment Platform**: Cloudflare Pages
