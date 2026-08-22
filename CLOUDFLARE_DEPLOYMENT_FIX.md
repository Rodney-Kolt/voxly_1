# Cloudflare Deployment Fix - Worker Name Mismatch

## Problem
The Wrangler deploy failed with:
```
Service binding 'WORKER_SELF_REFERENCE' references Worker 'voxly' which was not found.
```

## Root Cause
- OpenNext creates a service binding to a Worker named `voxly`
- Cloudflare auto-generated a Worker named `voxly-1` (Pages auto-naming)
- Name mismatch prevents deployment

## Solution

### Step 1: Rename Worker in Cloudflare Dashboard ✅ REQUIRED
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Workers**
3. Find the Worker named `voxly-1`
4. Click on the Worker to open details
5. Go to **Settings** → **General Settings**
6. Under "Worker name", change `voxly-1` to `voxly`
7. Save changes

### Step 2: Verify Configuration (Optional but recommended)
In Cloudflare Dashboard under the Worker's **Settings**:
- Verify `compatibility_date` is `2026-08-22`
- Verify environment variables are set:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `NEXT_PUBLIC_URL` = `https://voxly.nenlink.online`

### Step 3: Deploy
Once the Worker is renamed in Cloudflare, trigger a new deployment:

**Option A: Manual deploy from Cloudflare Pages**
1. Go to **Pages** → Find your project
2. Click **Deployments**
3. Click the latest deployment → **View Build Log** → **Retry Deployment**

**Option B: Push to trigger auto-deploy**
```bash
git commit --allow-empty -m "Trigger Cloudflare deploy after Worker rename"
git push origin main
```

**Option C: Deploy locally (if preferred)**
```bash
npm run deploy
```

## What Changed in This Session
- Updated `wrangler.jsonc`:
  - `compatibility_date`: `2024-12-31` → `2026-08-22`
  - `NEXT_PUBLIC_URL`: `https://voxly-1.pages.dev` → `https://voxly.nenlink.online`
  - Ensured `"name": "voxly"` matches the service binding

## Expected Result After Fix
- ✅ Worker renamed from `voxly-1` to `voxly` in Cloudflare
- ✅ Service binding `WORKER_SELF_REFERENCE` resolves to correct Worker
- ✅ Deployment succeeds
- ✅ Site live at `https://voxly.nenlink.online` (after custom domain setup)

## Fallback: If Manual Rename Doesn't Work
If Cloudflare doesn't allow renaming existing Workers via Dashboard, delete and recreate:
1. Delete the existing `voxly-1` Worker
2. Trigger new deploy from Pages (will create fresh Worker)
3. Or manually create a new Worker named `voxly` and link it

---

**Status:** Awaiting manual Cloudflare Dashboard action to rename Worker from `voxly-1` → `voxly`
