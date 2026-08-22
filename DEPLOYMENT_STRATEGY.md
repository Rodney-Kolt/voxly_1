# Voxly Deployment Strategy

## Current Approach: OpenNext + Cloudflare Workers (Recommended)

After evaluating both static export and OpenNext deployment approaches, we're using **OpenNext + Cloudflare Workers** because:

### Why Not Static Export (`output: 'export'`)?
- ❌ Dynamic route `/poll/[pollId]` requires `generateStaticParams()` to pre-render all poll IDs
- ❌ We don't have a list of all poll IDs at build time
- ❌ Static export requires all pages to be fully renderable at build time (no dynamic content)

### Why OpenNext + Cloudflare Workers?
- ✅ Supports dynamic routes and server-side rendering at request time
- ✅ Uses Cloudflare Workers for the runtime (edge compute)
- ✅ Firebase client-side integration works seamlessly
- ✅ Can fetch polls dynamically based on route params
- ✅ Better performance with edge caching

## Deployment Steps

### Current Status
- All code committed to `main` branch
- `wrangler.jsonc` configured with OpenNext settings
- `open-next.config.ts` configured for Cloudflare with correct wrapper/converter
- `package.json` scripts updated with `npm run deploy`
- `package-lock.json` includes all dependencies

### What Needs to Happen Next

**On Cloudflare Dashboard:**
1. Go to **Pages** → Your project settings
2. Update **Deploy command** to:
   ```bash
   npm run deploy
   ```
3. Trigger a new deployment
4. Monitor build logs for successful completion

### Build Output
OpenNext will create:
- `.open-next/worker.js` - The Cloudflare Worker entry point
- `.open-next/assets/` - Static assets (CSS, JS, images)
- Wrangler will deploy both to Cloudflare

### After Successful Deploy
- Site will be live at `https://voxly-1.pages.dev`
- Test all features:
  - Google Sign-In with Firebase
  - Create polls (writes to Firestore)
  - Vote on polls (real-time updates)
  - View profile
  - Dark theme display
- Set up custom domain (optional)

## Files Modified
- `next.config.js` - Removed static export setting
- `app/page.tsx` and other pages - Restored `export const dynamic = 'force-dynamic'`
- `open-next.config.ts` - OpenNext configuration
- `package.json` - Added deploy/preview scripts
- `wrangler.jsonc` - Cloudflare Workers config

## Troubleshooting

If deployment fails:
1. Check Cloudflare build log for specific errors
2. Ensure deploy command is `npm run deploy` (not `npx wrangler deploy`)
3. Verify `package-lock.json` is committed
4. Ensure Firebase env vars are in `.env.local` (already present)

## Architecture
```
Voxly (Next.js 15.5.23)
    ↓
OpenNext (Cloudflare adapter)
    ↓
Cloudflare Workers (Runtime)
    ↓
Firebase (Client-side SDK)
    ↓
Firestore + Authentication
```

---

**Status:** Ready for Cloudflare deployment. Update deploy command and trigger build.
