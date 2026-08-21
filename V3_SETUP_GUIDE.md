# Voxly V3 Setup Guide - Pesapal Payment Integration

This guide walks you through setting up the Pesapal payment integration for poll boosting in Voxly V3.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Admin SDK Setup](#firebase-admin-sdk-setup)
3. [Pesapal Developer Console Setup](#pesapal-developer-console-setup)
4. [Environment Variables Configuration](#environment-variables-configuration)
5. [Local Testing with ngrok](#local-testing-with-ngrok)
6. [Testing the Payment Flow](#testing-the-payment-flow)
7. [Firestore Security Rules](#firestore-security-rules)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm or yarn package manager
- ✅ Git installed
- ✅ Voxly V3 project cloned and dependencies installed (`npm install`)
- ✅ Firebase project already created
- ✅ Google authentication configured (from V1/V2 setup)
- ✅ Polls, comments, and voting features working

### For Local Testing
- ✅ ngrok installed (`brew install ngrok` or download from https://ngrok.com)
- ✅ A test M-Pesa number (provided by Pesapal in demo environment)

---

## Firebase Admin SDK Setup

The checkout and IPN endpoints require Firebase Admin SDK credentials to:
- Verify user authentication tokens
- Update polls in Firestore with boost information
- Write payment records

### Step 1: Get Service Account Key

1. Go to **Firebase Console** > Your project
2. Click **⚙️ Settings** (top left) > **Project Settings**
3. Go to **Service Accounts** tab
4. Click **Generate New Private Key** button
5. A JSON file will download automatically

### Step 2: Extract Credentials

Open the downloaded JSON file. You'll see:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  ...
}
```

### Step 3: Store in .env.local

Copy these values to `.env.local` (see [Environment Variables Configuration](#environment-variables-configuration)):

```
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**⚠️ IMPORTANT: Keep this key secure!**
- Never commit to git
- Never share publicly
- Treat it like a password

---

## Pesapal Developer Console Setup

### Step 1: Create a Pesapal Account

1. Go to https://pesapal.com
2. Click **Sign Up** (or log in if you have an account)
3. Complete registration and verify email

### Step 2: Access Developer Console

1. Log in to Pesapal
2. Go to https://pesapal.com/developer/console
3. You'll see the **Demo** and **Live** environments

For now, we'll use **Demo** to test.

### Step 3: Create an App (Demo Environment)

1. In the Demo environment, click **Create App**
2. Fill in:
   - **App Name**: "Voxly - Poll Boosting" (or similar)
   - **Description**: "App for boosting polls to top of homepage"
3. Click **Create**
4. You'll get:
   - **Consumer Key**
   - **Consumer Secret**

### Step 4: Copy Credentials

Copy the Consumer Key and Secret to `.env.local`:

```
PESAPAL_CONSUMER_KEY=your_consumer_key
PESAPAL_CONSUMER_SECRET=your_consumer_secret
PESAPAL_ENV=demo
```

### Step 5: Register IPN (Instant Payment Notification)

The IPN URL is how Pesapal notifies your app when a payment is completed.

**For Local Testing (using ngrok):**
We'll do this after setting up ngrok.

**For Production:**
```
https://yourdomain.com/api/pesapal/ipn
```

---

## Environment Variables Configuration

### Copy Template

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your values:

```bash
# Firebase Config (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=voxly.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=voxly-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=voxly-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...

# Firebase Admin SDK (from Service Account JSON)
FIREBASE_ADMIN_PROJECT_ID=voxly-project
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@voxly-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Pesapal Configuration
PESAPAL_ENV=demo
PESAPAL_CONSUMER_KEY=your_key_here
PESAPAL_CONSUMER_SECRET=your_secret_here
PESAPAL_IPN_ID=  # Leave empty for now, will fill after ngrok setup

# App URL
NEXT_PUBLIC_URL=http://localhost:3000
```

### Verify Setup

Run the app:
```bash
npm run dev
```

Visit http://localhost:3000 and check:
- ✅ Home page loads
- ✅ Create poll works
- ✅ Poll detail page loads
- ✅ Boost button appears

---

## Local Testing with ngrok

For Pesapal to send IPN notifications to your local development machine, we need a public HTTPS URL. ngrok provides this.

### Step 1: Install ngrok

```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Start ngrok Tunnel

In a new terminal:

```bash
ngrok http 3000
```

You'll see:

```
ngrok                                       (Ctrl+C to quit)

Session Status                connecting
Account                    user@example.com
Version                    3.3.5
Region                     United States (us)
Web Interface              http://127.0.0.1:4040
Forwarding                 https://1234-56-78-90-123.ngrok.io -> http://localhost:3000

Connections                ttl    opn    rt1    rt2    rt3
                            0      0      0      0      0
```

Copy the **Forwarding URL** (e.g., `https://1234-56-78-90-123.ngrok.io`)

### Step 3: Update .env.local

Replace `NEXT_PUBLIC_URL`:

```
NEXT_PUBLIC_URL=https://1234-56-78-90-123.ngrok.io
```

**Note:** The ngrok URL changes every time you restart. Update `.env.local` each time.

### Step 4: Register IPN with Pesapal

Now we need to tell Pesapal where to send payment notifications.

Option A: **Manual Registration (Recommended for Testing)**

1. Go to Pesapal Developer Console
2. Go to your Demo App > **Settings** > **IPN**
3. Click **Add IPN URL**
4. Enter: `https://1234-56-78-90-123.ngrok.io/api/pesapal/ipn`
5. Click **Register**
6. You'll get an **IPN ID** like `123456`
7. Copy this to `.env.local`:
   ```
   PESAPAL_IPN_ID=123456
   ```

Option B: **Automatic Registration (Optional)**

The checkout endpoint can auto-register IPN on first use (see `registerIPN()` in `lib/pesapal.ts`).

### Step 5: Restart App

Stop and restart your dev server:

```bash
# Stop: Ctrl+C
# Restart:
npm run dev
```

---

## Testing the Payment Flow

### Pesapal Demo Test Numbers

Pesapal provides test M-Pesa numbers. Use these to test payments without real charges:

**M-Pesa (Demo):**
- Account: `254722111111`
- PIN: `1234`
- Amount: Any amount (tested with 100)
- Reference: Auto-generated

### Complete Payment Flow Test

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   Terminal 1: Running on http://localhost:3000

2. **Start ngrok Tunnel**
   ```bash
   ngrok http 3000
   ```
   Terminal 2: Forwarding to https://xxx.ngrok.io

3. **Open App**
   - Visit http://localhost:3000
   - Sign in with Google

4. **Create a Test Poll**
   - Click "Create Poll"
   - Question: "Which is better?"
   - Options: "Option A", "Option B"
   - Submit

5. **View Poll Details**
   - Click on the poll
   - You should see a **"Boost Poll - KES 100"** button

6. **Click Boost Button**
   - Redirected to Pesapal payment page

7. **Complete Demo Payment**
   - On Pesapal page, select M-Pesa
   - Enter phone: `254722111111`
   - Enter PIN: `1234`
   - Confirm payment

8. **Verify Success**
   - Redirected to `/payment/result?status=success`
   - You should see: "Payment Successful!"
   - Return to poll - it should show "Poll is Boosted"

9. **Check Database**
   - Go to **Firebase Console > Firestore**
   - In `polls` collection, find your poll
   - Verify: `isBoosted: true`, `boostedUntil: [24 hours from now]`
   - Check `payments` collection - new payment record exists

10. **Check Homepage**
    - Go to home page
    - Boosted poll appears in "Featured Polls" section at top

### Test Failure Cases

1. **Cancel Payment**
   - Repeat steps 1-5
   - On Pesapal page, click "Cancel"
   - Should redirect to `/payment/result?status=cancelled`

2. **Invalid Token**
   - Modify boost button code to send invalid token
   - Should return 401 error

3. **Duplicate IPN**
   - Manually send IPN twice with same OrderTrackingId
   - Should handle gracefully (idempotent)

---

## Firestore Security Rules

### Update Rules in Firebase Console

1. Go to **Firebase Console > Firestore Database > Rules**
2. Replace all content with rules from `PESAPAL_SECURITY_RULES.md`
3. Click **Publish**

### Key Changes for V3

- ✅ `payments` collection: `allow read: if false; allow write: if false`
- ✅ Only Admin SDK can access payments
- ✅ `polls` collection: Updated for boosting fields
- ✅ Server-side IPN can update poll boost status

### Verify Rules Work

Test that payments collection is protected:

```javascript
// In browser console (should fail)
db.collection('payments').get()
  .catch(err => console.log('Good! Access denied:', err.code))
```

---

## Production Deployment

### Before Going Live

- [ ] Test entire payment flow locally with ngrok
- [ ] Verify IPN is working correctly
- [ ] Check that payments are idempotent
- [ ] Confirm security rules are published

### Step 1: Deploy to Vercel (or Your Host)

```bash
git add .
git commit -m "Add Pesapal V3 integration"
git push origin main
```

Vercel auto-deploys on push.

### Step 2: Add Production Environment Variables

In **Vercel Dashboard > Settings > Environment Variables**, add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
[all other Firebase and Pesapal vars]
NEXT_PUBLIC_URL=https://yourdomain.com

# Use LIVE Pesapal credentials (not demo)
PESAPAL_ENV=live
PESAPAL_CONSUMER_KEY=your_live_key
PESAPAL_CONSUMER_SECRET=your_live_secret
```

### Step 3: Register Production IPN

In **Pesapal Console > Live Environment > Your App > Settings > IPN**:

Add URL: `https://yourdomain.com/api/pesapal/ipn`

Note the IPN ID and add to environment variables.

### Step 4: Update Pesapal App URL

In **Pesapal Console > Your App > Settings > URLs**:

- Redirect URL: `https://yourdomain.com/payment/result`
- Callback URL: `https://yourdomain.com/api/pesapal/ipn`

### Step 5: Go Live

1. Update `PESAPAL_ENV=live`
2. Use real Pesapal credentials
3. Test a small payment to verify

---

## Troubleshooting

### "Missing Pesapal credentials" Error

**Problem:** Checkout endpoint returns error

**Solution:**
- Check `.env.local` has `PESAPAL_CONSUMER_KEY` and `PESAPAL_CONSUMER_SECRET`
- Restart dev server after updating `.env.local`
- Verify credentials from Pesapal Console

### "Token request failed" Error

**Problem:** OAuth token generation fails

**Solution:**
- Verify Pesapal credentials are correct (copy-paste exactly)
- Check network connectivity to Pesapal API
- Check if credentials are for wrong environment (demo vs live)

### IPN Not Received

**Problem:** Payment completes but poll doesn't get boosted

**Solution:**
- Verify ngrok is running and forwarding
- Check ngrok URL is in `.env.local`
- Verify IPN URL is registered in Pesapal Console
- Check Firebase Admin credentials in `.env.local`
- Look at server logs for errors in `/api/pesapal/ipn`

### "Permission denied" on payments collection

**Problem:** Getting access errors when testing client code

**Solution:**
- This is expected! Payments collection should only be accessible server-side
- Don't try to read/write payments from client
- All payment operations go through API routes

### Payment amount always KES 100

**Problem:** Can't change boost amount

**Solution:**
- Update `BOOST_AMOUNT` in `lib/pesapal.ts`
- Or make it configurable via environment variable (future enhancement)

### ngrok URL Changes After Restart

**Problem:** Every time ngrok restarts, URL changes

**Solution:**
- This is normal - ngrok free tier gives new URLs each time
- Update `.env.local` with new URL
- For production, use ngrok's paid tier for static URLs (or deploy to production directly)

---

## FAQ

**Q: Can I use live Pesapal credentials for local testing?**
A: Not recommended. Use demo credentials for development. Live keys will process real payments.

**Q: What happens if IPN is received twice?**
A: The IPN handler checks if payment already exists and skips duplicate. This is idempotent.

**Q: Can I boost multiple polls?**
A: Yes, each boost is a separate payment. Each poll has its own `boostedUntil` timestamp.

**Q: What happens after 24 hours?**
A: Poll stays in database but `boostedUntil` is in the past, so it's no longer shown in "Featured Polls" section.

**Q: Can users see payment details?**
A: No. Security rules prevent access to `payments` collection. Users only see if their poll is boosted.

**Q: How do I refund a payment?**
A: Manual refund via Pesapal Console (future feature to add: refund API endpoint).

---

## Next Steps

✅ V3 Complete with Pesapal Integration!

**Optional Enhancements:**
- [ ] Add boost tier system (KES 50, 100, 200)
- [ ] Send email confirmation on successful boost
- [ ] Create admin dashboard to monitor payments
- [ ] Track boost ROI (votes before/after)
- [ ] Add refund handling
- [ ] Implement boost extension (extend boost for +24 hours)

---

**Questions?** Check Firebase and Pesapal official docs or contact support.

**Ready to boost polls!** 🚀
