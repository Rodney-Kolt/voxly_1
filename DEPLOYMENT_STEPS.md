# 🚀 Voxly Deployment - Action Steps (Tasks #2-#8)

Complete checklist with exact steps for deploying to Vercel.

---

## Task #2: Firebase Production Setup ✋ DO THIS FIRST

### Step 1: Add Vercel Domain to Firebase Authorized Domains

1. **Go to Firebase Console**
   - URL: https://console.firebase.google.com/
   - Select project: **voxly-c75e8**

2. **Navigate to Authentication Settings**
   - Left menu: **Authentication** (or Build > Authentication)
   - Click **Settings** tab (top right)

3. **Add Authorized Domain**
   - Scroll down to **Authorized domains**
   - Click **Add domain**
   - Enter: `voxly-1.vercel.app`
   - ✅ Save

> **Note:** After Vercel deploys, you'll know the exact domain. If it's different (like `voxly-xyz.vercel.app`), update this here.

---

### Step 2: Publish Firestore Security Rules

1. **Go to Firestore Database**
   - Left menu: **Firestore Database** (or Build > Firestore)

2. **Go to Rules Tab**
   - Click **Rules** tab (top navigation)

3. **Clear and Replace**
   - Select all current text (Ctrl+A)
   - Delete

4. **Paste Production Rules**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow public read access to polls
       match /polls/{pollId} {
         allow read: if true;
         allow create: if request.auth.uid != null;
         allow update: if resource.data.userId == request.auth.uid;
         allow delete: if resource.data.userId == request.auth.uid;
       }

       // Allow voting for authenticated users
       match /votes/{voteId} {
         allow read: if true;
         allow create: if request.auth.uid != null;
         allow delete: if resource.data.userId == request.auth.uid;
       }

       // Allow comments for authenticated users
       match /comments/{commentId} {
         allow read: if true;
         allow create: if request.auth.uid != null;
         allow delete: if resource.data.userId == request.auth.uid;
       }

       // Allow comment reactions
       match /reactions/{reactionId} {
         allow read: if true;
         allow create: if request.auth.uid != null;
         allow delete: if resource.data.userId == request.auth.uid;
       }

       // Payments collection - Server only (NO CLIENT ACCESS)
       match /payments/{paymentId} {
         allow read: if false;
         allow write: if false;
       }

       // Users profile data
       match /users/{userId} {
         allow read: if true;
         allow create, update: if request.auth.uid == userId;
         allow delete: if false;
       }
     }
   }
   ```

5. **Publish**
   - Click **Publish** button
   - Confirm dialog: Click **Publish**
   - Should see: ✅ "Rules published successfully"

✅ **Task #2 Complete!**

---

## Task #3: Pesapal Production Setup

### Option A: Keep Demo Environment (Recommended for Testing)

No action needed - your current credentials work fine.

**Demo Credentials:**
```
PESAPAL_ENV=demo
PESAPAL_CONSUMER_KEY=ITAzmBWNN9Pp9g/I3ByGpebq09O9mQ5r
PESAPAL_CONSUMER_SECRET=lZ0MEPc6SUGyq+3zZB3tIXHRVWE=
```

**Demo M-Pesa:** `254722111111` / PIN: `1234`

### Option B: Switch to Live Environment (For Real Payments)

1. **Go to Pesapal Console**
   - URL: https://pesapal.com/developer/console
   - Log in with your Pesapal account

2. **Switch to Live Environment**
   - Top right: Select **Live** (not Demo)

3. **Verify Business Account**
   - Ensure account is verified/approved
   - Add bank account if needed

4. **Get Live Credentials**
   - Create or select a Live App
   - Get Consumer Key and Secret
   - Note these down

5. **Use in Vercel**
   - When adding env vars (Task #5), use:
   ```
   PESAPAL_ENV=live
   PESAPAL_CONSUMER_KEY=your_live_key
   PESAPAL_CONSUMER_SECRET=your_live_secret
   ```

### IPN Registration (Do After Deployment - Task #8)

You'll register the IPN URL AFTER Vercel deployment:
```
https://voxly-1.vercel.app/api/pesapal/ipn
```

✅ **Task #3 Complete!**

---

## Task #4: Create Vercel Project

### Step 1: Go to Vercel

1. Visit: https://vercel.com
2. Sign in with GitHub (if you don't have account, create one)

### Step 2: Create New Project

1. Click **Add New** > **Project**
2. Search for: `voxly_1`
3. Select: `Rodney-Kolt/voxly_1`
4. Click **Import**

### Step 3: Configure Project

- **Project Name:** `voxly` (or keep default)
- **Framework:** Should auto-detect `Next.js`
- **Root Directory:** `./` (or leave default)
- **Environment Variables:** We'll add these in Task #5
- **Click:** Don't deploy yet! Add env vars first.

Actually, **go ahead and click Import/Deploy**, but know it will fail without env vars - we'll fix that in Task #5.

After clicking Deploy:
- Vercel will start building
- It will fail (expected, missing env vars)
- You'll see a **Deployments** page

✅ **Task #4 Complete!**

---

## Task #5: Add Environment Variables to Vercel

### Step 1: Access Project Settings

1. In Vercel dashboard, click your project: `voxly`
2. Click **Settings** tab (top navigation)
3. Click **Environment Variables** (left menu)

### Step 2: Add Variables (One by One)

Click **Add New** for each variable below:

#### Firebase Public Config
```
NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyB_-HshVbfifw42ACFf5l1RLKBM9Pdurng

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: voxly-c75e8.firebaseapp.com

NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: voxly-c75e8

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: voxly-c75e8.appspot.com

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 682251077393

NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:682251077393:web:9e804159c92540b219eeb0
```

#### Firebase Admin SDK (Server-side - KEEP SECRET!)
```
FIREBASE_ADMIN_PROJECT_ID
Value: voxly-c75e8

FIREBASE_ADMIN_CLIENT_EMAIL
Value: firebase-adminsdk-fbsvc@voxly-c75e8.iam.gserviceaccount.com

FIREBASE_ADMIN_PRIVATE_KEY
Value: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWvzL6gI5BMIkP\nLzrv+QmBVMbOwuWwd5+nKeNpAriG+Hn+ArmDhKGEe62XZjS/zEzRi4XsfQxugZFz\n1mK3Ba44+YQYIY3Oi6OJnKFqDqdwNb9i6kpWGh9t6cPT0RU8vlaYkB35XlVVghoZ\nNK4iih1A8SIUm0jEVIC2pW4Rb81N80eHluF954Q8yNhWanRQg91WZmBPQcFvGOAZ\nsqiBzMUfoh87f4jyU1751BLMF0CHC7KSZZTO5Gb1v6DeYhZVQcUKVsHaWoz1b/uu\nKk+5eg4NxiZkrgDZA0zMWvUcUA6HfvjxdpdImjU51X1C48rLSh9/hU8DY2II72Z+\nBFup9CJrAgMBAAECggEAAYK0zBhNZ938iNPPOVLqIzPCdj/et8APqnBb/igbvi9P\nRF8miOtM646nKPJ6GoNIYwz1MzWp+bkFmef/J8Rtdk8jA7xwr+xBiT1F0WYq/VoT\nb5GwViy23eIQE5Rb7uJz33zcCR4FwaU5o8XAF9Qa4pMPp090UpU5lo9RV+QOcKbr\nIXfjORKCjzsHKS/IDPM2Ccl3AHhH/vRb781cy5tJlcNMlGMTEoSNPPa9SxEW1Z5B\nBlKIJ9G1VgJ2vZbZRf786wx+7se71hmu8SCNN+UbmKkrYSSVCPwgvVznZwtYBWs4\nrNxnwJXWmUT+rU9tWh7y5d50rxam4/LUsOCBuHMgIQKBgQD++wLEd3J3INdGngs7\n+FevDeeGukZX+Uhitq5TbpB+vL8m2iqTnTmipIszdBwg3CmctotDLu/XcyRRX5ms\nbCQj19kJUDdlyLrhzDGASc14ck3sob/7LD5mijHwLrqEHRaCp4JfQIIH2vt3EsEI\nr0IBpCOpwwJHKDgiyZN+2q2IkQKBgQDXmwGuijcPeXcuwUn8hQH7wCoBC6mFpnwk\ncmZKipUE1MpYn7gaw9EgAOOplfa8bb/arOW3DW2Icp0dfMon6hTK001rMpU0mCZc\noCu1FqSJhNTw139qbV9uCbdPXnQvedJ5kzX19FSatSav8eH5ViwznYuK2XWp0MQ8\npeSXa2eZOwKBgEvBKcZTMqfgEvWBGRddJjf1KpdlmmaiwnXJjqttCvMMgsI5STMI\nIEqJFm5YDc9Zeed8eI2iUVGyfNTMUWzfyDD5/Rp+Qac05wkU0JQr2Sby1uH6AH7Q\nW029uy5/w5xixABXYi2IjdllnxZ2dPFumG7CZHIYZQHdGiiDuRWURMBxAoGBANdF\n8dvwLSHKSfHpFJKJy30uVcJNfqnvnSxW/UOYM0prnM34S76NnhSyTp5ZGc7yVgll\ncMfhJGiE59M1cjOASdpqOHa8PrYQ5Ny/IGTjgs28T1FaGeKN6ibYlKsuyBtPK5Qw\nJES7/G2sSkCK5vIp1GCFAXtVvWIdDJLxoNh/aSVZAoGAEb3xSmkNi76/++QFnHPQ\nr10KkAUusVUXYAwiYNRAKrOI2tkb6Thq8gkQEZW/bTiXyP9bbZzn+Kf8sODyPC2t\nlf+8+a8QceNbwCB0pT7R1/OYFyRcieDym1dh65XTWdHf3cZ/RyJaFJiPJY8fnq6e\nZDIxhHmrX9RsasQ7jiSlLVc=\n-----END PRIVATE KEY-----\n"
```

#### Pesapal Config
```
PESAPAL_ENV
Value: demo

PESAPAL_CONSUMER_KEY
Value: ITAzmBWNN9Pp9g/I3ByGpebq09O9mQ5r

PESAPAL_CONSUMER_SECRET
Value: lZ0MEPc6SUGyq+3zZB3tIXHRVWE=

PESAPAL_IPN_ID
Value: (leave blank for now - we'll update after IPN registration)
```

#### App Configuration
```
NEXT_PUBLIC_URL
Value: https://voxly-1.vercel.app
```

### Step 3: Verify All Variables

- Should have ~14 variables total
- FIREBASE_ADMIN_PRIVATE_KEY should be marked as "Secret" (not visible in UI)
- All NEXT_PUBLIC_* should be visible for security

### Step 4: Save

All variables auto-save as you add them.

✅ **Task #5 Complete!**

---

## Task #6: Deploy and Verify Build Success

### Step 1: Trigger Deployment

**Option A: Via Vercel UI**
1. Go to **Deployments** tab
2. Click **Redeploy** on the last failed deployment

**Option B: Via Git Push**
1. Make a small change locally (e.g., add a comment to README)
2. Commit: `git add . && git commit -m "Trigger deployment"`
3. Push: `git push origin main`
4. Vercel auto-deploys

### Step 2: Monitor Build

1. Go to **Deployments** tab
2. Click the new deployment to see logs
3. Watch for:
   - ✅ "Installing dependencies"
   - ✅ "Compiling application"
   - ✅ "Optimizing production build"
   - ✅ "Deployed successfully!"

### Step 3: Verify Success

Should see: **✅ Production Deployment Successful**

If you see errors:
- Check the logs
- Common issues:
  - Missing env variable (should list which one)
  - Syntax error in code
  - Module not found
- Fix the issue, commit, push to GitHub, Vercel auto-redeploys

### Step 4: Get Your Live URL

After successful deployment, you'll see a URL like:
```
https://voxly-1.vercel.app
```

Click it to visit your live app!

✅ **Task #6 Complete!**

---

## Task #7: Test Production Deployment

### Test 1: Homepage Loads

1. Visit: https://voxly-1.vercel.app
2. Should see:
   - Voxly homepage
   - "Sign in with Google" button
   - Navigation menu
   - ✅ No errors in browser console

### Test 2: Google Sign-In

1. Click **Sign in with Google**
2. Should redirect to Google login
3. Select your Google account
4. Should redirect back to profile page
5. Profile should show your name and email ✅

### Test 3: Create Poll

1. Click **Create Poll** (or "Create" in nav)
2. Fill in:
   - Question: "Test poll?"
   - Option 1: "Yes"
   - Option 2: "No"
3. Click **Create**
4. Should redirect to homepage
5. Your poll should appear in list ✅

### Test 4: Vote and Comment

1. Click your poll
2. Click an option to vote ✅
3. Vote count should update ✅
4. Scroll to comments, add a comment ✅
5. Comment should appear instantly ✅

### Test 5: Poll Boosting (Optional)

1. On poll detail page, look for **"Boost Poll - KES 100"** button
2. Click it
3. Should redirect to Pesapal payment page ✅
4. On Pesapal page:
   - Select **M-Pesa**
   - Phone: **254722111111**
   - PIN: **1234**
   - Click **Confirm**
5. Should redirect to success page ✅
6. Go back to homepage - poll should be in "Featured Polls" ✅

### Test 6: Check Firestore

1. Go to **Firebase Console** > **Firestore**
2. Check collections exist:
   - `polls` - should have your test poll
   - `votes` - should have your test vote
   - `comments` - should have your test comment
   - `payments` - should have payment record (if you did boost test)
3. Verify data looks correct ✅

✅ **Task #7 Complete!**

---

## Task #8: Post-Deployment Configuration

### Step 1: Verify Firebase Authorized Domain

1. Go to **Firebase Console** > **Authentication** > **Settings**
2. Check **Authorized domains** includes your Vercel domain
3. If not, add it now
4. Should show: `voxly-1.vercel.app` ✅

### Step 2: Register Pesapal IPN URL

1. **Go to Pesapal Console**
   - URL: https://pesapal.com/developer/console
   - Select: **Demo** (or **Live** if using live credentials)

2. **Select Your App**
   - Click on your app in the console

3. **Go to Settings**
   - Click **Settings** tab > **IPN** section

4. **Add IPN URL**
   - Click **Add IPN URL**
   - Paste: `https://voxly-1.vercel.app/api/pesapal/ipn`
   - Click **Register**

5. **Get IPN ID**
   - Pesapal should return an **IPN ID** (e.g., `123456`)
   - Copy this ID

6. **Update Vercel Environment Variable**
   - Go to **Vercel Dashboard** > Your project
   - **Settings** > **Environment Variables**
   - Find `PESAPAL_IPN_ID`
   - Update value to the IPN ID you received
   - Save (auto-saves)

7. **Redeploy**
   - Go to **Deployments** tab
   - Click **Redeploy** on latest
   - Vercel rebuilds with new IPN ID

### Step 3: Test IPN Registration

1. Create a new poll
2. Try boosting it
3. Complete a test payment (M-Pesa: 254722111111 / 1234)
4. After payment:
   - Should redirect to success page ✅
   - Poll should update to boosted in real-time ✅
   - Check Firebase - payment should be recorded ✅

### Step 4: Optional - Custom Domain

If you have a custom domain (e.g., voxly.com):

1. **Add Domain to Vercel**
   - **Settings** > **Domains**
   - Click **Add**
   - Enter your domain
   - Follow DNS setup instructions

2. **Update Firebase**
   - **Authentication** > **Settings**
   - Add your custom domain to **Authorized domains**

3. **Update Pesapal**
   - Re-register IPN URL with custom domain:
   - `https://voxly.com/api/pesapal/ipn`
   - Get new IPN ID

4. **Update Vercel Env Vars**
   - `NEXT_PUBLIC_URL=https://voxly.com`
   - `PESAPAL_IPN_ID=new_id_from_pesapal`
   - Redeploy

✅ **Task #8 Complete!**

---

## Summary - All Tasks Done! 🎉

| # | Task | Status |
|---|------|--------|
| 1 | Git & GitHub | ✅ |
| 2 | Firebase Setup | ✅ |
| 3 | Pesapal Config | ✅ |
| 4 | Vercel Project | ✅ |
| 5 | Env Variables | ✅ |
| 6 | Deploy | ✅ |
| 7 | Test | ✅ |
| 8 | Post-Deploy | ✅ |

---

## Your Live App

🎉 **Voxly is now live at:**
```
https://voxly-1.vercel.app
```

**Features Working:**
- ✅ Google Sign-In
- ✅ Create Polls
- ✅ Real-time Voting
- ✅ Comments & Reactions
- ✅ Poll Boosting with Pesapal
- ✅ Payment Verification via IPN

**Next Steps:**
- Share link with users
- Monitor in Vercel Dashboard
- Check Firestore for activity
- Monitor Pesapal payments

---

**Deployment Complete! 🚀**
