# 🚀 Voxly V3 Deployment Guide - Vercel

Complete step-by-step guide to deploy Voxly V3 to Vercel with Firebase Auth, Firestore, and Pesapal payments.

---

## ✅ Pre-Deployment Checklist

- [x] Code pushed to GitHub: https://github.com/Rodney-Kolt/voxly_1.git
- [ ] Firebase setup for production (authorized domains, security rules)
- [ ] Pesapal configuration (demo or live keys)
- [ ] Environment variables ready
- [ ] Vercel account created

---

## Step 1: Firebase Production Setup

### 1.1 Add Vercel Domain to Authorized Domains

1. Go to **Firebase Console** > Your project (voxly-c75e8)
2. Navigate to **Authentication** > **Settings** tab
3. Scroll to **Authorized domains**
4. Click **Add domain**
5. Enter your Vercel domain (will be assigned after first deployment):
   - Default: `voxly-1.vercel.app` (Vercel suggests based on repo name)
   - Or custom domain if you have one

> **Note:** You can update this after deployment if the domain is different

### 1.2 Publish Firestore Security Rules

1. Go to **Firestore Database** > **Rules** tab
2. Copy the rules from `PESAPAL_SECURITY_RULES.md` (or from V2/V3 setup)
3. Replace all content in the Rules editor
4. Click **Publish**

**Key security rules:**
```
// Payments collection - Server only
match /payments/{document=**} {
  allow read, write: if false;
}

// Polls and other collections
match /polls/{document=**} {
  allow read: if true;
  allow create: if request.auth.uid != null;
  allow update, delete: if resource.data.userId == request.auth.uid;
}
```

### 1.3 Verify Firebase Configuration

Your Firebase project is: **voxly-c75e8**

The public Firebase config (already in your app):
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB_-HshVbfifw42ACFf5l1RLKBM9Pdurng
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=voxly-c75e8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=voxly-c75e8
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=voxly-c75e8.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=682251077393
NEXT_PUBLIC_FIREBASE_APP_ID=1:682251077393:web:9e804159c92540b219eeb0
```

---

## Step 2: Pesapal Configuration

### Option A: Use Demo Environment (Safe for Testing)

Keep your current demo credentials:
```
PESAPAL_ENV=demo
PESAPAL_CONSUMER_KEY=ITAzmBWNN9Pp9g/I3ByGpebq09O9mQ5r
PESAPAL_CONSUMER_SECRET=lZ0MEPc6SUGyq+3zZB3tIXHRVWE=
```

**Demo M-Pesa test number:** `254722111111` / PIN: `1234`

### Option B: Use Live Environment (Production Payments)

If you want to accept real payments:

1. Go to Pesapal Console: https://pesapal.com/developer/console
2. Switch to **Live** environment (not Demo)
3. Ensure your business account is verified
4. Create a Live App or use existing one
5. Get Live Consumer Key and Secret
6. Use those credentials in Vercel

### 2.1 Register IPN URL (Important!)

The IPN (Instant Payment Notification) URL tells Pesapal where to send payment confirmations.

**After deploying to Vercel (Step 5), register the IPN URL:**

1. Go to Pesapal Console
2. Select your App > **Settings** > **IPN**
3. Click **Add IPN URL**
4. Enter your production IPN URL:
   ```
   https://voxly-1.vercel.app/api/pesapal/ipn
   ```
   (Replace `voxly-1` with your actual Vercel project name)
5. Click **Register**
6. Copy the **IPN ID** returned
7. Update Vercel environment variables with `PESAPAL_IPN_ID`

---

## Step 3: Create Vercel Project

### 3.1 Go to Vercel

1. Visit https://vercel.com
2. Sign in with GitHub (or create account)
3. Click **Add New...** > **Project**

### 3.2 Import GitHub Repository

1. Search for: `voxly_1`
2. Click **Import**
3. Vercel auto-detects Next.js - no build config needed
4. Click **Deploy** (we'll add env vars next)

---

## Step 4: Add Environment Variables to Vercel

**IMPORTANT:** Before deployment completes, add all environment variables.

### 4.1 Environment Variables to Add

In **Vercel Dashboard** > Your Project > **Settings** > **Environment Variables**:

#### Firebase Config (Public)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB_-HshVbfifw42ACFf5l1RLKBM9Pdurng
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=voxly-c75e8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=voxly-c75e8
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=voxly-c75e8.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=682251077393
NEXT_PUBLIC_FIREBASE_APP_ID=1:682251077393:web:9e804159c92540b219eeb0
```

#### Firebase Admin SDK (Server-side - KEEP SECRET!)
```
FIREBASE_ADMIN_PROJECT_ID=voxly-c75e8
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@voxly-c75e8.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWvzL6gI5BMIkP\nLzrv+QmBVMbOwuWwd5+nKeNpAriG+Hn+ArmDhKGEe62XZjS/zEzRi4XsfQxugZFz\n1mK3Ba44+YQYIY3Oi6OJnKFqDqdwNb9i6kpWGh9t6cPT0RU8vlaYkB35XlVVghoZ\nNK4iih1A8SIUm0jEVIC2pW4Rb81N80eHluF954Q8yNhWanRQg91WZmBPQcFvGOAZ\nsqiBzMUfoh87f4jyU1751BLMF0CHC7KSZZTO5Gb1v6DeYhZVQcUKVsHaWoz1b/uu\nKk+5eg4NxiZkrgDZA0zMWvUcUA6HfvjxdpdImjU51X1C48rLSh9/hU8DY2II72Z+\nBFup9CJrAgMBAAECggEAAYK0zBhNZ938iNPPOVLqIzPCdj/et8APqnBb/igbvi9P\nRF8miOtM646nKPJ6GoNIYwz1MzWp+bkFmef/J8Rtdk8jA7xwr+xBiT1F0WYq/VoT\nb5GwViy23eIQE5Rb7uJz33zcCR4FwaU5o8XAF9Qa4pMPp090UpU5lo9RV+QOcKbr\nIXfjORKCjzsHKS/IDPM2Ccl3AHhH/vRb781cy5tJlcNMlGMTEoSNPPa9SxEW1Z5B\nBlKIJ9G1VgJ2vZbZRf786wx+7se71hmu8SCNN+UbmKkrYSSVCPwgvVznZwtYBWs4\nrNxnwJXWmUT+rU9tWh7y5d50rxam4/LUsOCBuHMgIQKBgQD++wLEd3J3INdGngs7\n+FevDeeGukZX+Uhitq5TbpB+vL8m2iqTnTmipIszdBwg3CmctotDLu/XcyRRX5ms\nbCQj19kJUDdlyLrhzDGASc14ck3sob/7LD5mijHwLrqEHRaCp4JfQIIH2vt3EsEI\nr0IBpCOpwwJHKDgiyZN+2q2IkQKBgQDXmwGuijcPeXcuwUn8hQH7wCoBC6mFpnwk\ncmZKipUE1MpYn7gaw9EgAOOplfa8bb/arOW3DW2Icp0dfMon6hTK001rMpU0mCZc\noCu1FqSJhNTw139qbV9uCbdPXnQvedJ5kzX19FSatSav8eH5ViwznYuK2XWp0MQ8\npeSXa2eZOwKBgEvBKcZTMqfgEvWBGRddJjf1KpdlmmaiwnXJjqttCvMMgsI5STMI\nIEqJFm5YDc9Zeed8eI2iUVGyfNTMUWzfyDD5/Rp+Qac05wkU0JQr2Sby1uH6AH7Q\nW029uy5/w5xixABXYi2IjdllnxZ2dPFumG7CZHIYZQHdGiiDuRWURMBxAoGBANdF\n8dvwLSHKSfHpFJKJy30uVcJNfqnvnSxW/UOYM0prnM34S76NnhSyTp5ZGc7yVgll\ncMfhJGiE59M1cjOASdpqOHa8PrYQ5Ny/IGTjgs28T1FaGeKN6ibYlKsuyBtPK5Qw\nJES7/G2sSkCK5vIp1GCFAXtVvWIdDJLxoNh/aSVZAoGAEb3xSmkNi76/++QFnHPQ\nr10KkAUusVUXYAwiYNRAKrOI2tkb6Thq8gkQEZW/bTiXyP9bbZzn+Kf8sODyPC2t\nlf+8+a8QceNbwCB0pT7R1/OYFyRcieDym1dh65XTWdHf3cZ/RyJaFJiPJY8fnq6e\nZDIxhHmrX9RsasQ7jiSlLVc=\n-----END PRIVATE KEY-----\n"
```

#### Pesapal Config
```
PESAPAL_ENV=demo
PESAPAL_CONSUMER_KEY=ITAzmBWNN9Pp9g/I3ByGpebq09O9mQ5r
PESAPAL_CONSUMER_SECRET=lZ0MEPc6SUGyq+3zZB3tIXHRVWE=
PESAPAL_IPN_ID=  # Leave empty for now, update after IPN registration
```

#### App Configuration
```
NEXT_PUBLIC_URL=https://voxly-1.vercel.app
```
(Replace `voxly-1` with your actual Vercel project name)

### 4.2 Add Variables in Vercel UI

1. Go to **Settings** > **Environment Variables**
2. Click **Add New**
3. Paste each variable name and value
4. Make sure `FIREBASE_ADMIN_PRIVATE_KEY` is set to all environments (Production, Preview, Development)
5. Click **Save**

---

## Step 5: Deploy and Verify

### 5.1 Trigger Deployment

After adding all environment variables:

1. Go to **Deployments** tab
2. Click **Redeploy** (or push new code to GitHub)
3. Wait for build to complete (takes 2-5 minutes)
4. You should see: **✅ Production Deployment Successful**

### 5.2 Verify Build Success

Check the Deployment logs:
- Should see "▲ Next.js 14.2.35"
- Should see "✓ Built successfully"
- No red errors

### 5.3 Get Your Vercel URL

After deployment, Vercel provides a URL like:
```
https://voxly-1.vercel.app
```

Visit it to verify the app loads! 🎉

---

## Step 6: Post-Deployment Setup

### 6.1 Add Vercel Domain to Firebase

1. Go to **Firebase Console** > **Authentication** > **Settings**
2. Add your Vercel domain to **Authorized domains**:
   ```
   voxly-1.vercel.app
   ```

### 6.2 Register Pesapal IPN URL

1. Go to **Pesapal Console**
2. Select your app > **Settings** > **IPN**
3. Click **Add IPN URL**
4. Enter:
   ```
   https://voxly-1.vercel.app/api/pesapal/ipn
   ```
5. Click **Register**
6. Copy the **IPN ID** (e.g., `123456`)
7. Update in **Vercel** > **Settings** > **Environment Variables**:
   ```
   PESAPAL_IPN_ID=123456
   ```
8. Redeploy from Vercel

### 6.3 Update NEXT_PUBLIC_URL

Verify in Vercel env vars:
```
NEXT_PUBLIC_URL=https://voxly-1.vercel.app
```

---

## Step 7: Test Production Deployment

### 7.1 Test Google Sign-In

1. Visit https://voxly-1.vercel.app
2. Click **Sign in with Google**
3. Should redirect to Google, then back to profile page ✅

### 7.2 Test Poll Features

1. Click **Create Poll**
2. Create a test poll (e.g., "Which is better? A or B?")
3. Submit and verify poll appears on homepage ✅
4. Click poll to view details
5. Try voting, commenting, reacting ✅

### 7.3 Test Poll Boosting (Optional)

1. On poll detail page, click **Boost Poll - KES 100**
2. Should redirect to Pesapal payment page ✅
3. Complete demo payment with M-Pesa: `254722111111` / `1234`
4. Should redirect to success page ✅
5. Poll should appear in "Featured Polls" on homepage ✅
6. Check Firebase console - payment should be recorded ✅

### 7.4 Test API Routes

- `POST /api/pesapal/checkout` - Payment initiation (tested via boost button)
- `GET /api/pesapal/ipn` - IPN verification (automatic on payment)

---

## Step 8: Optional - Custom Domain

If you have a custom domain:

### 8.1 Add Domain to Vercel

1. Go to **Settings** > **Domains**
2. Click **Add**
3. Enter your domain (e.g., `voxly.com`)
4. Follow DNS instructions

### 8.2 Update Configuration

Update these in **Vercel** > **Environment Variables**:
```
NEXT_PUBLIC_URL=https://voxly.com
```

Add domain to **Firebase** > **Authentication** > **Authorized domains**

Re-register **Pesapal IPN URL**:
```
https://voxly.com/api/pesapal/ipn
```

---

## Troubleshooting

### Build Failed?

Check the build logs:
1. Go to **Deployments**
2. Click the failed deployment
3. See detailed error messages
4. Common issues:
   - Missing environment variable
   - Syntax error in code
   - Module not found

**Solution:** Fix the error, commit to GitHub, push. Vercel auto-redeploys.

### Sign-in fails?

1. Verify Vercel domain is in Firebase Authorized Domains
2. Check NEXT_PUBLIC_FIREBASE_* variables are correct
3. Check browser console for specific error

### Payment page shows error?

1. Verify PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET
2. Check PESAPAL_ENV is set correctly
3. Verify NEXT_PUBLIC_URL matches deployment URL

### IPN not working?

1. Verify IPN URL is registered in Pesapal Console
2. Check PESAPAL_IPN_ID in Vercel env vars
3. Look at server logs for errors
4. Check Firebase Firestore for payment records

### Custom domain not working?

1. Verify DNS records are configured per Vercel instructions
2. Wait 24-48 hours for DNS propagation
3. Clear browser cache and cookies
4. Try in incognito window

---

## Quick Reference

| Component | Value |
|-----------|-------|
| GitHub | https://github.com/Rodney-Kolt/voxly_1 |
| Vercel Domain | https://voxly-1.vercel.app |
| Firebase Project | voxly-c75e8 |
| Pesapal Environment | demo (or live) |
| Demo M-Pesa | 254722111111 / 1234 |

---

## Deployment Checklist

- [x] Code pushed to GitHub
- [ ] Firebase authorized domains updated
- [ ] Firebase security rules published
- [ ] Pesapal credentials ready
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Google Sign-in tested
- [ ] Polls created and voted on
- [ ] Poll boosting tested (optional)
- [ ] IPN registered and working
- [ ] Production app verified

---

## Next Steps

✅ **Deployment Complete!**

Now you can:
- Share https://voxly-1.vercel.app with users
- Monitor deployments in Vercel Dashboard
- Track payments in Firebase Firestore
- Monitor server logs in Vercel Logs
- Update Pesapal to live if ready for real payments

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Pesapal Docs:** https://developer.pesapal.com/
- **Next.js Docs:** https://nextjs.org/docs

---

**Voxly is now live! 🚀**
