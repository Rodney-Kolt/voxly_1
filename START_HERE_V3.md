# 🚀 Voxly V3 - Poll Boosting with Pesapal Payments

Welcome to **Voxly V3** - the enhanced polling platform with monetization!

## What's New in V3?

✨ **Poll Boosting Feature**
- Users can now pay **KES 100** to boost their polls to the top for 24 hours
- Boosted polls get maximum visibility with a "Featured" badge
- Integrated with Pesapal for secure one-time payments

## Quick Links

### 📖 Getting Started
Start here based on your needs:

1. **🏃 I want to set up locally for testing**
   → Read: `V3_SETUP_GUIDE.md`

2. **🎯 I want to understand what was built**
   → Read: `V3_COMPLETION_SUMMARY.md`

3. **🔒 I want to understand the security**
   → Read: `PESAPAL_SECURITY_RULES.md`

4. **🔧 I want to deploy to production**
   → Follow: `V3_SETUP_GUIDE.md` → Production Deployment section

### 📁 Key Files Structure

```
voxly/
├── lib/
│   ├── pesapal.ts                 ← Pesapal OAuth, orders, transactions
│   └── firestore.ts               ← Updated with boost functions
│
├── app/
│   ├── api/pesapal/
│   │   ├── checkout/route.ts      ← Payment initiation
│   │   └── ipn/route.ts           ← Payment verification
│   │
│   ├── components/
│   │   ├── BoostButton.tsx        ← Boost button component
│   │   └── BoostedPolls.tsx       ← Featured polls grid
│   │
│   ├── payment/result/page.tsx    ← Payment result page
│   └── page.tsx                   ← Updated homepage
│
├── .env.local.example             ← Environment template
├── PESAPAL_SECURITY_RULES.md      ← Firestore security rules
├── V3_SETUP_GUIDE.md              ← Complete setup guide
└── V3_COMPLETION_SUMMARY.md       ← Full documentation
```

---

## 5-Minute Setup

### Prerequisites
- Node.js 18+
- Pesapal account (free at pesapal.com)
- Firebase project (already set up from V2)

### Step 1: Configure Environment

```bash
# Copy template
cp .env.local.example .env.local

# Edit .env.local and add:
# - Firebase credentials (already have from V2)
# - Pesapal demo credentials (from pesapal.com/developer/console)
# - Set PESAPAL_ENV=demo
# - Set NEXT_PUBLIC_URL=http://localhost:3000
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Test Boosting

1. Visit http://localhost:3000
2. Sign in with Google
3. Create a poll
4. View poll details
5. Click "Boost Poll - KES 100"
6. Use Pesapal demo M-Pesa: `254722111111` / PIN: `1234`
7. Complete payment
8. Redirected to success page
9. Poll now appears in "Featured Polls" on homepage! 🎉

**Full guide:** `V3_SETUP_GUIDE.md`

---

## Feature Overview

### 🎯 Poll Boosting

**What it does:**
- Users click "Boost Poll" on any poll detail page
- Redirected to Pesapal payment
- Pay KES 100
- Poll appears at top of homepage for 24 hours
- Increased visibility = More votes!

**For users:**
- One-click boost with secure payment
- See boost status with yellow "Featured" badge
- Redirects back to homepage after payment

**For developers:**
- Server-side payment processing
- Secure token verification
- Idempotent IPN handling
- Protected payment records

### 💳 Payment Flow

```
Click "Boost"
  ↓
Verify user is signed in
  ↓
POST /api/pesapal/checkout
  ↓
Create Pesapal order → Get payment redirect URL
  ↓
Redirect to Pesapal
  ↓
User completes payment
  ↓
Pesapal IPN notification to /api/pesapal/ipn
  ↓
Verify payment + Update poll + Record payment
  ↓
Redirect back with status
  ↓
Poll boosted! ✨
```

---

## Environment Variables

**Required for Pesapal:**

```env
# Firebase (from Firebase Console - same as V2)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
[... other Firebase vars]

# Firebase Admin (for server-side operations)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Pesapal (from pesapal.com/developer/console)
PESAPAL_ENV=demo              # or 'live' for production
PESAPAL_CONSUMER_KEY=your_key
PESAPAL_CONSUMER_SECRET=your_secret
PESAPAL_IPN_ID=               # Fill after IPN registration

# App URL
NEXT_PUBLIC_URL=http://localhost:3000
```

See `.env.local.example` for full list.

---

## Testing Locally

### Without ngrok (Quick Test)
```bash
npm run dev
# Visit http://localhost:3000
# Test create poll, boost button appears
# NOTE: IPN won't work without public URL
```

### With ngrok (Full Payment Flow)

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start ngrok tunnel
ngrok http 3000
# Copy forwarding URL, e.g., https://1234-56-78-90-123.ngrok.io

# Update .env.local
# NEXT_PUBLIC_URL=https://1234-56-78-90-123.ngrok.io

# Register IPN in Pesapal Console with ngrok URL
# Then test full payment flow
```

**Full guide:** `V3_SETUP_GUIDE.md` → Local Testing with ngrok

---

## Database Changes (V3)

### Polls Collection
Added boost fields:
```javascript
{
  id: "pollId",
  userId: "uid",
  question: "...",
  options: ["...", "..."],
  isBoosted: true,              // NEW
  boostedUntil: Timestamp,      // NEW
  boostedBy: "userId",          // NEW
  totalVotes: 42,
  createdAt: Timestamp
}
```

### Payments Collection (NEW)
```javascript
{
  id: "userId_pollId_orderTrackingId",
  userId: "uid",
  pollId: "pollId",
  provider: "pesapal",
  amount: 100,
  currency: "KES",
  status: "completed",
  pesapalOrderTrackingId: "...",
  pesapalMerchantReference: "...",
  createdAt: Timestamp,
  boostedUntil: Timestamp
}
```

---

## Security

✅ **Server-side only:**
- Token verification on checkout
- Payment processing via Admin SDK
- IPN verification with Pesapal

✅ **Protected data:**
- Payments collection: Client cannot read/write (server-only)
- Only Admin SDK can access payments
- Security rules published to Firebase

✅ **Idempotent:**
- IPN handled gracefully even if received multiple times
- Duplicate payments prevented

**Full security details:** `PESAPAL_SECURITY_RULES.md`

---

## Common Tasks

### Change Boost Amount
Edit `lib/pesapal.ts`:
```typescript
export const BOOST_AMOUNT = 100  // Change to 50, 200, etc.
```

### Change Boost Duration
Edit `lib/pesapal.ts`:
```typescript
export const BOOST_DURATION_HOURS = 24  // Change duration
```

### Deploy to Production
1. Follow `V3_SETUP_GUIDE.md` → Production Deployment
2. Update Pesapal to Live environment
3. Add production environment variables to Vercel
4. Register production IPN URL

### Test Payment Flow
1. Start ngrok tunnel
2. Update `.env.local` with ngrok URL
3. Register IPN in Pesapal Console
4. Click Boost button
5. Use demo M-Pesa: `254722111111` / `1234`

---

## Troubleshooting

### Boost button doesn't appear
- [ ] Are you signed in? (Sign in with Google first)
- [ ] Does the poll detail page load? (Check `/poll/[pollId]`)

### Payment redirect fails
- [ ] Check Pesapal credentials in `.env.local`
- [ ] Restart dev server after updating `.env.local`
- [ ] Check Firebase Admin credentials

### IPN not processing
- [ ] Is ngrok running? (`ngrok http 3000`)
- [ ] Did you register ngrok URL in Pesapal Console?
- [ ] Check server logs for errors

### "Permission denied" on payments collection
- This is expected! Payments are server-only for security.

**More help:** `V3_SETUP_GUIDE.md` → Troubleshooting

---

## Next Steps

### 🎯 To Deploy
1. Read: `V3_SETUP_GUIDE.md` (Production Deployment)
2. Get Pesapal Live credentials
3. Deploy to Vercel
4. Update environment variables
5. Test real payment

### 🔧 To Enhance
- [ ] Add boost tiers (KES 50, 100, 200)
- [ ] Send email confirmation
- [ ] Track boost ROI
- [ ] Implement refund API
- [ ] Create admin dashboard

### 📚 To Learn More
- [Pesapal API Docs](https://developer.pesapal.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## Support

### Documentation
- `V3_SETUP_GUIDE.md` - Complete setup & deployment
- `V3_COMPLETION_SUMMARY.md` - Full technical documentation
- `PESAPAL_SECURITY_RULES.md` - Security & Firestore rules

### Issues
1. Check troubleshooting section above
2. Review `V3_SETUP_GUIDE.md` → Troubleshooting
3. Check Pesapal and Firebase documentation
4. Review server logs for errors

---

## Summary

**Voxly V3 is ready to go!** 🚀

✅ Poll creation & voting (V2)
✅ Comments & reactions (V2)
✅ **NEW: Poll boosting with Pesapal payments** (V3)

**To get started:**
1. Copy `.env.local.example` → `.env.local`
2. Add your credentials
3. Run `npm run dev`
4. Test boosting feature
5. Deploy to production

**Happy boosting!** 🎉

---

**Questions?** See `V3_SETUP_GUIDE.md` for detailed answers.

**Ready to go live?** Follow Production Deployment in `V3_SETUP_GUIDE.md`.
