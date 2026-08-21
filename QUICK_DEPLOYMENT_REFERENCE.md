# ⚡ Quick Deployment Reference Card

Fast checklist for deploying Voxly to Vercel. See `DEPLOYMENT_STEPS.md` for detailed steps.

---

## Task #2: Firebase Setup (5 min)

### Authorized Domains
- Firebase Console > Authentication > Settings
- Add domain: `voxly-1.vercel.app`

### Security Rules
- Firestore > Rules
- Replace all with rules from `DEPLOYMENT_STEPS.md`
- Click Publish

✅ Done

---

## Task #3: Pesapal Config (2 min)

### Keep Demo? (Easiest)
```
PESAPAL_ENV=demo
PESAPAL_CONSUMER_KEY=ITAzmBWNN9Pp9g/I3ByGpebq09O9mQ5r
PESAPAL_CONSUMER_SECRET=lZ0MEPc6SUGyq+3zZB3tIXHRVWE=
```

### Or Switch to Live?
- Pesapal Console > Live environment
- Get live credentials
- Use instead of demo above

✅ Done

---

## Task #4: Create Vercel Project (3 min)

1. https://vercel.com
2. Sign in with GitHub
3. Add New > Project
4. Import: `Rodney-Kolt/voxly_1`
5. Click Deploy (will fail - expected)

✅ Done

---

## Task #5: Add Environment Variables to Vercel (5 min)

**Firebase Public:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB_-HshVbfifw42ACFf5l1RLKBM9Pdurng
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=voxly-c75e8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=voxly-c75e8
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=voxly-c75e8.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=682251077393
NEXT_PUBLIC_FIREBASE_APP_ID=1:682251077393:web:9e804159c92540b219eeb0
```

**Firebase Admin (Server-side):**
```
FIREBASE_ADMIN_PROJECT_ID=voxly-c75e8
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@voxly-c75e8.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[...full key from DEPLOYMENT_STEPS.md...]-----END PRIVATE KEY-----\n"
```

**Pesapal:**
```
PESAPAL_ENV=demo
PESAPAL_CONSUMER_KEY=ITAzmBWNN9Pp9g/I3ByGpebq09O9mQ5r
PESAPAL_CONSUMER_SECRET=lZ0MEPc6SUGyq+3zZB3tIXHRVWE=
PESAPAL_IPN_ID=  (leave empty - update later)
```

**App:**
```
NEXT_PUBLIC_URL=https://voxly-1.vercel.app
```

✅ Done

---

## Task #6: Deploy (2-5 min)

1. Vercel Dashboard > Deployments
2. Click Redeploy
3. Wait for build (shows progress)
4. Should see: ✅ "Production Deployment Successful"

✅ Done

---

## Task #7: Test (5-10 min)

1. Visit: https://voxly-1.vercel.app ✅
2. Sign in with Google ✅
3. Create poll ✅
4. Vote ✅
5. Comment ✅
6. Try boost (optional) ✅

---

## Task #8: Register IPN (5 min)

1. Pesapal Console > Demo > Your app > Settings > IPN
2. Add IPN URL: `https://voxly-1.vercel.app/api/pesapal/ipn`
3. Get IPN ID returned
4. Vercel > Environment Variables > `PESAPAL_IPN_ID=<new_id>`
5. Redeploy

✅ Done

---

## Credentials Summary

| Service | Project | Value |
|---------|---------|-------|
| GitHub | voxly_1 | https://github.com/Rodney-Kolt/voxly_1 |
| Firebase | voxly-c75e8 | https://console.firebase.google.com/ |
| Vercel | voxly | https://vercel.com/ |
| Pesapal | Demo App | https://pesapal.com/developer/console |

---

## Key URLs

| Page | URL |
|------|-----|
| Live App | https://voxly-1.vercel.app |
| GitHub | https://github.com/Rodney-Kolt/voxly_1 |
| Firebase | https://console.firebase.google.com/project/voxly-c75e8 |
| Vercel | https://vercel.com/dashboard |
| Pesapal | https://pesapal.com/developer/console |

---

## Test Payment

- **M-Pesa:** 254722111111
- **PIN:** 1234
- **Amount:** Any (tested with 100)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check logs for which env var is missing |
| Sign-in fails | Add Vercel domain to Firebase authorized domains |
| Payment fails | Verify Pesapal credentials, check PESAPAL_ENV=demo |
| IPN not working | Verify IPN URL is registered in Pesapal, wait 5 min |

---

## Total Time: ~30 minutes ⏱️

- Firebase Setup: 5 min
- Pesapal Config: 2 min
- Vercel Project: 3 min
- Env Variables: 5 min
- Deploy: 5 min
- Testing: 5 min
- IPN Registration: 5 min

---

**See `DEPLOYMENT_STEPS.md` for detailed steps with screenshots.**

**Your app will be live at:** https://voxly-1.vercel.app 🚀
