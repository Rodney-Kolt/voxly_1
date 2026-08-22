# Fix: Voxly Static Export Build Error

## Problem
Firebase client SDK initializes during server-side rendering, causing `FirebaseError: auth/invalid-api-key` during Cloudflare Pages static export build.

## Root Cause
Firebase must only run in the browser, not during static pre-rendering. The build fails when Next.js tries to render pages with Firebase code at build time.

---

## Solution

### Step 1: Verify Environment Variables in Cloudflare Pages

Go to **Cloudflare Dashboard → Workers & Pages → Pages → [Project] → Settings → Environment variables**

Ensure these variables are set (values from your Firebase web app config):

```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyB_-HshVbfifw42ACFf5l1RLKBM9Pdurng
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = voxly-c75e8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = voxly-c75e8
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = voxly-c75e8.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 682251077393
NEXT_PUBLIC_FIREBASE_APP_ID = 1:682251077393:web:9e804159c92540b219eeb0
NEXT_PUBLIC_URL = https://your-domain.com
```

If missing, add them and trigger a redeploy.

---

### Step 2: Make All Firebase Pages Client-Only

Add `"use client"` directive to pages that use Firebase:

- ✅ `app/page.tsx` - home feed
- ✅ `app/create/page.tsx` - create poll page
- ✅ `app/dashboard/page.tsx` - user dashboard
- ✅ `app/profile/page.tsx` - user profile
- ✅ `app/admin/seed/page.tsx` - seed data
- ✅ `app/payment/result/page.tsx` - payment result
- ✅ `app/poll/[pollId]/page.tsx` - dynamic poll detail

#### Option A: Use Dynamic Rendering (Current Implementation)

Add to each page:

```typescript
export const dynamic = 'force-dynamic'
```

This tells Next.js to render the page **on-demand** (skip static pre-rendering).

#### Option B: Use Dynamic Imports with ssr: false (Fallback)

For components that use Firebase heavily:

```typescript
import dynamic from 'next/dynamic'

const PollFeed = dynamic(() => import('@/components/PollFeed'), { 
  ssr: false  // Don't render on server
})

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="min-h-screen bg-voxly-bg">
      <div className="pt-20 md:pt-24">
        <PollFeed />
      </div>
    </main>
  )
}
```

---

### Step 3: Ensure Firebase Operations are Client-Only

✅ **Already implemented:**

- All client components marked with `'use client'`
- AuthProvider initializes Firebase in `useEffect` (not at top level)
- PollFeed queries Firestore in `useEffect` (not at top level)
- No firebase-admin imports in client code
- No API routes using Firebase

✅ **Verification:**

- `app/context/AuthContext.tsx` - `'use client'`, Firebase in `useEffect`
- `app/components/PollFeed.tsx` - `'use client'`, Firestore queries in `useEffect`
- No `getServerSideProps`, `getStaticProps`, or `generateStaticParams` using Firebase
- All Firebase imports are from `firebase` package (not `firebase-admin`)

---

### Step 4: Remove Server-Only Firebase Code

✅ **Already done:**

- ❌ `app/api/` folder removed (no API routes)
- ❌ `firebase-admin` dependency removed
- ❌ No server-side Firebase usage

---

### Step 5: Test Locally

```bash
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Generating static pages (9/9)
```

✅ **Current status:** Build passes locally with all 9 pages

---

### Step 6: Deploy on Cloudflare Pages

```bash
git add .
git commit -m "Fix: Firebase static export with dynamic rendering"
git push origin main
```

Cloudflare Pages will automatically rebuild on push.

---

## Current Implementation Status

### ✅ Completed

- `export const dynamic = 'force-dynamic'` added to:
  - `app/page.tsx`
  - `app/create/page.tsx`
  - `app/dashboard/page.tsx`
  - `app/profile/page.tsx`
  - `app/admin/seed/page.tsx`
  - `app/poll/[pollId]/page.tsx`

- All components marked `'use client'`:
  - `app/context/AuthContext.tsx`
  - `app/context/PollContext.tsx`
  - `app/components/PollFeed.tsx`
  - All page components

- All Firebase operations moved to `useEffect`:
  - Auth state listening in `AuthProvider`
  - Firestore queries in `PollFeed`
  - User creation in context

- API routes deleted:
  - Removed `app/api/pesapal/`
  - Removed `app/api/seed/`

- Environment variables cleaned:
  - Only `NEXT_PUBLIC_*` vars in `.env.local`
  - Firebase credentials properly configured

### 📋 Testing Checklist

After deployment, verify:

- [ ] Build completes without Firebase errors
- [ ] Static files generated in `.next` folder
- [ ] App loads at https://voxly-1.pages.dev
- [ ] Google Sign-In works
- [ ] Can create a new poll
- [ ] Can vote on polls
- [ ] Can view user profile
- [ ] Can view dashboard
- [ ] Real-time updates work (multi-tab sync)
- [ ] Dark theme renders correctly
- [ ] Responsive grid layout (1/2/3 columns) works

---

## Troubleshooting

### If Build Still Fails

**Symptom:** `FirebaseError: auth/invalid-api-key` during build

**Solutions (in order):**

1. **Check environment variables** - Ensure all `NEXT_PUBLIC_*` vars are set in Cloudflare Pages
2. **Verify `'use client'` directives** - All page files must have `'use client'` at top
3. **Check for top-level Firebase** - Search for Firebase imports outside `useEffect`
4. **Use dynamic imports** - Apply Option B (dynamic imports with `ssr: false`)
5. **Check for generateStaticParams** - Remove if using Firebase
6. **Review context providers** - Ensure they're client components with `'use client'`

### If Sign-In Doesn't Work

1. Add domain to Firebase Console → Authentication → Authorized domains:
   - `voxly-1.pages.dev`
   - `app.nenlink.online` (custom domain)

2. Verify Firebase config in `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - etc.

3. Check browser console for errors

### If Real-Time Updates Don't Work

1. Verify Firestore rules allow client-side reads/writes
2. Check browser console for Firestore errors
3. Verify user is authenticated before fetching data

---

## Why This Works

- **`export const dynamic = 'force-dynamic'`** - Next.js renders page on-demand (not at build time)
- **`'use client'`** - Next.js treats component as client-side (though it still SSR unless prevented)
- **`dynamic(..., { ssr: false })`** - Component is completely skipped during build, only loads in browser
- **`useEffect` initialization** - Firebase SDK only runs after page loads in browser
- **No firebase-admin** - Server-side Firebase removed, only client SDK used

This is the standard pattern for using Firebase with static export on Cloudflare Pages.

---

## Commits

- **4211b7e** - Fix: Add dynamic=force-dynamic to skip pre-rendering for Firebase pages
- **7809037** - Fix: Add dynamic=force-dynamic to poll detail page

**Result:** Build succeeds. All 9 pages generate. Ready for Cloudflare Pages deployment.
