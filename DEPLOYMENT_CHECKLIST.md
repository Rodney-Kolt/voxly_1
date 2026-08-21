# ✅ Voxly Deployment Checklist

Use this to track your progress through the 8 deployment tasks.

---

## Pre-Deployment

- [x] Code pushed to GitHub: https://github.com/Rodney-Kolt/voxly_1
- [x] Git configured and main branch created
- [ ] Vercel account created (free)
- [ ] Firebase Console access verified
- [ ] Pesapal Console access verified

---

## Task #1: Git & GitHub ✅ DONE

- [x] Repository initialized
- [x] Files added and committed
- [x] Remote added (GitHub)
- [x] Code pushed to main branch
- [x] All 75 files on GitHub

**Status:** ✅ COMPLETE

---

## Task #2: Firebase Production Setup

### Authorized Domains
- [ ] Go to: Firebase Console > voxly-c75e8 > Authentication > Settings
- [ ] Scroll to: Authorized domains
- [ ] Click: Add domain
- [ ] Enter: `voxly-1.vercel.app`
- [ ] Verify domain appears in list

### Security Rules
- [ ] Go to: Firestore Database > Rules
- [ ] Select all current text (Ctrl+A)
- [ ] Delete current rules
- [ ] Copy rules from `DEPLOYMENT_STEPS.md` (lines 254-310)
- [ ] Paste new rules
- [ ] Click: Publish button
- [ ] Verify: ✅ "Rules published successfully"

### Verification
- [ ] Authorized domains include `voxly-1.vercel.app`
- [ ] Security rules are published
- [ ] Payments collection is read/write = false

**Status:** [ ] TODO → [ ] IN PROGRESS → [x] COMPLETE

---

## Task #3: Pesapal Configuration

### Option: Demo Environment (Easier)
- [x] Pesapal credentials verified: ✅
  - Key: `ITAzmBWNN9Pp9g/I3ByGpebq09O9mQ5r`
  - Secret: `lZ0MEPc6SUGyq+3zZB3tIXHRVWE=`
- [x] Demo M-Pesa saved: `254722111111 / 1234`

### Option: Live Environment (Real Payments)
- [ ] Go to Pesapal Console
- [ ] Switch to: Live environment
- [ ] Verify: Business account is verified
- [ ] Get: Live Consumer Key and Secret
- [ ] Save: Credentials for Vercel

### IPN Registration (Do in Task #8)
- [ ] Will register after Vercel deployment
- [ ] IPN URL: `https://voxly-1.vercel.app/api/pesapal/ipn`

**Status:** [x] COMPLETE (using demo)

---

## Task #4: Create Vercel Project

### Create Project
- [ ] Go to: https://vercel.com
- [ ] Sign in: GitHub account
- [ ] Click: Add New > Project
- [ ] Search: `voxly_1`
- [ ] Select: `Rodney-Kolt/voxly_1`
- [ ] Click: Import

### Configure
- [ ] Vercel detects: Next.js ✅
- [ ] Project name: `voxly` (or default)
- [ ] Root directory: `./` (or default)
- [ ] Click: Deploy (will fail - expected)
- [ ] Save the URL for later: `https://voxly-1.vercel.app`

**Status:** [ ] TODO → [ ] IN PROGRESS → [ ] COMPLETE

---

## Task #5: Add Environment Variables to Vercel

### Go to Settings
- [ ] Vercel Dashboard > Your Project: `voxly`
- [ ] Click: Settings tab
- [ ] Click: Environment Variables (left menu)

### Add Firebase Public Variables
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY = `AIzaSyB_-HshVbfifw42ACFf5l1RLKBM9Pdurng`
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = `voxly-c75e8.firebaseapp.com`
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID = `voxly-c75e8`
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = `voxly-c75e8.appspot.com`
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = `682251077393`
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID = `1:682251077393:web:9e804159c92540b219eeb0`

### Add Firebase Admin Variables (Server-side)
- [ ] FIREBASE_ADMIN_PROJECT_ID = `voxly-c75e8`
- [ ] FIREBASE_ADMIN_CLIENT_EMAIL = `firebase-adminsdk-fbsvc@voxly-c75e8.iam.gserviceaccount.com`
- [ ] FIREBASE_ADMIN_PRIVATE_KEY = `"-----BEGIN PRIVATE KEY-----\n...entire private key...\n-----END PRIVATE KEY-----\n"`

### Add Pesapal Variables
- [ ] PESAPAL_ENV = `demo`
- [ ] PESAPAL_CONSUMER_KEY = `ITAzmBWNN9Pp9g/I3ByGpebq09O9mQ5r`
- [ ] PESAPAL_CONSUMER_SECRET = `lZ0MEPc6SUGyq+3zZB3tIXHRVWE=`
- [ ] PESAPAL_IPN_ID = (leave empty - update later)

### Add App Configuration
- [ ] NEXT_PUBLIC_URL = `https://voxly-1.vercel.app`

### Verification
- [ ] Total variables added: ~14
- [ ] All NEXT_PUBLIC_* visible in dashboard
- [ ] FIREBASE_ADMIN_PRIVATE_KEY marked as Secret
- [ ] All values auto-saved

**Status:** [ ] TODO → [ ] IN PROGRESS → [ ] COMPLETE

---

## Task #6: Deploy and Verify Build Success

### Trigger Deployment
- [ ] Go to: Vercel Dashboard > Deployments tab
- [ ] Click: Redeploy (on latest failed deployment)
- [ ] Or: Push code to GitHub and wait for auto-deploy

### Monitor Build
- [ ] Watch the deployment logs
- [ ] Should see: ✅ "Installing dependencies"
- [ ] Should see: ✅ "Compiling application"
- [ ] Should see: ✅ "Optimizing production build"
- [ ] Should see: ✅ "Deployed successfully!"

### Verify Success
- [ ] Deployment status: ✅ Production Deployment Successful
- [ ] No red error messages
- [ ] Vercel URL ready: https://voxly-1.vercel.app

### Get Live URL
- [ ] Copy URL from Deployment tab: https://voxly-1.vercel.app
- [ ] Verify it's accessible

**Status:** [ ] TODO → [ ] IN PROGRESS → [ ] COMPLETE

---

## Task #7: Test Production Deployment

### Test 1: App Loads
- [ ] Visit: https://voxly-1.vercel.app
- [ ] Page loads without errors
- [ ] Browser console has no red errors

### Test 2: Google Sign-In
- [ ] Click: "Sign in with Google"
- [ ] Redirect to Google login ✅
- [ ] Select your Google account ✅
- [ ] Redirect back to app ✅
- [ ] Profile page shows your name ✅

### Test 3: Create Poll
- [ ] Click: "Create Poll"
- [ ] Enter question: "Test?"
- [ ] Enter options: "Yes" and "No"
- [ ] Click: Create
- [ ] Poll appears on homepage ✅

### Test 4: Vote and Comment
- [ ] Click your poll
- [ ] Vote on an option (count updates) ✅
- [ ] Add a comment (appears instantly) ✅
- [ ] React to comment (like/dislike works) ✅

### Test 5: Poll Boosting (Optional)
- [ ] Click: "Boost Poll - KES 100" button
- [ ] Redirect to Pesapal ✅
- [ ] Select M-Pesa, enter 254722111111 / 1234 ✅
- [ ] Complete payment ✅
- [ ] Redirect to success page ✅
- [ ] Poll appears in "Featured Polls" on homepage ✅

### Test 6: Firebase Data
- [ ] Go to Firebase Console > Firestore
- [ ] Check: `polls` collection has your test poll
- [ ] Check: `votes` collection has your vote
- [ ] Check: `comments` collection has your comment
- [ ] Check: `payments` collection (if you boosted)

**Status:** [ ] TODO → [ ] IN PROGRESS → [ ] COMPLETE

---

## Task #8: Post-Deployment Configuration

### Firebase Authorized Domain
- [ ] Go to: Firebase Console > Authentication > Settings
- [ ] Verify: `voxly-1.vercel.app` is in Authorized domains
- [ ] If not, add it now

### Register Pesapal IPN URL
- [ ] Go to: https://pesapal.com/developer/console
- [ ] Select: Demo (or Live) environment
- [ ] Select: Your app
- [ ] Click: Settings > IPN
- [ ] Click: Add IPN URL
- [ ] Enter: `https://voxly-1.vercel.app/api/pesapal/ipn`
- [ ] Click: Register
- [ ] Copy: IPN ID returned (e.g., `123456`)

### Update Vercel with IPN ID
- [ ] Go to: Vercel Dashboard > Settings > Environment Variables
- [ ] Find: `PESAPAL_IPN_ID`
- [ ] Update value: (paste the IPN ID from Pesapal)
- [ ] Save (auto-saves)
- [ ] Go to: Deployments tab
- [ ] Click: Redeploy

### Test IPN
- [ ] Create a poll
- [ ] Try boosting it
- [ ] Complete test payment (M-Pesa: 254722111111 / 1234)
- [ ] Verify payment is received ✅
- [ ] Poll updates to "Boosted" ✅
- [ ] Check Firebase for payment record ✅

### Optional: Custom Domain
- [ ] Do you have a custom domain? [ ] Yes [ ] No
- [ ] If yes:
  - [ ] Add domain to Vercel > Settings > Domains
  - [ ] Follow DNS setup instructions
  - [ ] Update Firebase authorized domains
  - [ ] Update Pesapal IPN URL
  - [ ] Update `NEXT_PUBLIC_URL` in Vercel

**Status:** [ ] TODO → [ ] IN PROGRESS → [ ] COMPLETE

---

## Final Verification

- [ ] Homepage loads at https://voxly-1.vercel.app
- [ ] Google Sign-In works
- [ ] Create poll, vote, comment all work
- [ ] Poll boosting works (optional)
- [ ] Payment IPN processes correctly
- [ ] Firebase shows all data correctly
- [ ] No console errors
- [ ] No server errors

---

## Deployment Complete! 🎉

**Your Live App:**
```
https://voxly-1.vercel.app
```

**GitHub:**
```
https://github.com/Rodney-Kolt/voxly_1
```

**Features:**
- ✅ Google Authentication
- ✅ Create & Manage Polls
- ✅ Real-time Voting
- ✅ Comments & Reactions
- ✅ Poll Boosting with Pesapal
- ✅ Payment Verification via IPN

---

## Next Steps

1. **Share your app:** Send the URL to users
2. **Monitor activity:** Check Vercel Dashboard and Firestore
3. **Track payments:** Monitor Pesapal Console for transactions
4. **Iterate:** Add features, fix bugs, deploy updates

---

## Support

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Pesapal Docs: https://developer.pesapal.com/
- See `DEPLOYMENT_STEPS.md` for detailed instructions

---

**Deployment Status: ✅ READY TO DEPLOY**

Start with Task #2 and work through to Task #8. Total time: ~30 minutes.

Good luck! 🚀
