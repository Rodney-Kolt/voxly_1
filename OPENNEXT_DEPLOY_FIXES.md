# OpenNext Deployment Fixes

## Issues Fixed

### 1. Missing Entry-Point Error
**Error:** 
```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

**Cause:** Wrangler was being run directly instead of through OpenNext, which handles the build and deployment.

**Solution Applied:**
- Updated `package.json` scripts to use OpenNext:
  ```json
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview"
  ```

### 2. Service Binding Configuration
**Error:** 
```
Service binding 'WORKER_SELF_REFERENCE' references Worker 'voxly' which was not found.
```

**Cause:** Mismatch between Worker name and service binding reference.

**Solution Applied:**
- Updated `wrangler.jsonc` to:
  - Set `"name": "voxly"` (matches service binding)
  - Added `"main": ".open-next/worker.js"` (entry point)
  - Moved vars out of env section to top-level (OpenNext format)
  - Compatibility date: `2026-08-20`

### 3. Configuration Format
**Issue:** Old config used environment sections that OpenNext doesn't support.

**Solution Applied:**
```jsonc
// Before
"env": {
  "production": {
    "vars": { /* vars */ }
  }
}

// After
"vars": { /* vars */ }  // Top-level, works for all environments
```

## What Changed

### `wrangler.jsonc`
- Added `"$schema"` for validation
- Added `"main": ".open-next/worker.js"` (entry point)
- Added `"assets"` binding configuration
- Moved all environment variables to top-level `"vars"` section
- Updated compatibility date to `2026-08-20`
- Changed `NEXT_PUBLIC_URL` to `https://nenlink.online` (production domain)

### `package.json`
- Added `"deploy"` script: `opennextjs-cloudflare build && opennextjs-cloudflare deploy`
- Added `"preview"` script: `opennextjs-cloudflare build && opennextjs-cloudflare preview`

## Next Steps in Cloudflare Dashboard

### CRITICAL: Update Deploy Command
Go to your **Cloudflare Pages project** → **Settings** → **Builds & deployments**:

1. Find **"Deploy command"** setting
2. Change from: `npx wrangler deploy`
3. Change to: `npm run deploy`

This tells Cloudflare to use the OpenNext deploy script (not plain Wrangler).

### Optional: Verify Configuration
In **Cloudflare Dashboard** → **Workers** → **voxly**:
- Settings should show env vars are populated
- Entry point should resolve `.open-next/worker.js`

## Testing After Deploy

Once deployed, verify:
1. ✅ Site loads at `https://voxly-1.pages.dev` (temporary URL)
2. ✅ No 404 errors on routes
3. ✅ Firebase authentication works
4. ✅ Polls load and real-time updates work

## Custom Domain Setup (After Successful Deploy)
Once deployment works at the Pages dev URL, you can:
1. Add custom domain `nenlink.online` to the Pages project
2. Update DNS records to point to Cloudflare
3. Site will be live at `https://nenlink.online`

---

**Commits:**
- `b583ab8` - Fix: Update wrangler.jsonc for OpenNext + add deploy/preview scripts
- `b583ab8` - (Previous) Docs: Add Cloudflare Worker rename fix instructions
- `1880093` - Fix: Update wrangler.jsonc compatibility_date and NEXT_PUBLIC_URL

**Ready to deploy:** ✅ All code changes pushed to `main`
