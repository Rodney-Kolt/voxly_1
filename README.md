# Voxly - Your Voice, Amplified

A modern, responsive polling platform with real-time voting, discussions, and monetization through Pesapal payment integration.

## Features

✨ **V1 Scope:**
- Beautiful, responsive marketing landing page
- Firebase Authentication with Google Sign-In
- User profile page (protected route)
- Modern, clean UI with Tailwind CSS

✨ **V2 Scope:**
- Create and manage polls with 2-5 options
- Real-time voting with live result updates
- Comments and discussions on polls
- Comment reactions (like/dislike)
- User poll history
- Real-time Firestore integration

✨ **V3 Scope (NEW):**
- **Poll Boosting** - Pay KES 100 to feature polls for 24 hours
- Pesapal one-time payment integration
- "Featured Polls" section on homepage
- Payment verification via Pesapal IPN
- Secure server-side payment processing
- Idempotent payment handling

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Authentication (Google Sign-In)
- **Database:** Firestore
- **Payments:** Pesapal API v3
- **Icons:** Lucide React
- **Deployment:** Vercel

## Project Structure

```
voxly/
├── app/
│   ├── api/pesapal/
│   │   ├── checkout/route.ts     # Payment initiation (V3)
│   │   └── ipn/route.ts          # Payment verification (V3)
│   │
│   ├── components/
│   │   ├── BoostButton.tsx       # Boost button (V3)
│   │   ├── BoostedPolls.tsx      # Featured polls grid (V3)
│   │   ├── PollVoting.tsx        # Real-time voting (V2)
│   │   ├── CommentsSection.tsx   # Comments (V2)
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── Footer.tsx
│   │
│   ├── payment/result/page.tsx   # Payment result page (V3)
│   ├── create/page.tsx           # Create poll (V2)
│   ├── poll/[pollId]/page.tsx    # Poll detail (V2)
│   ├── profile/page.tsx          # User profile
│   ├── context/
│   │   └── AuthContext.tsx       # Auth state
│   └── page.tsx                  # Homepage
│
├── lib/
│   ├── pesapal.ts                # Pesapal utilities (V3)
│   ├── firestore.ts              # Firestore operations
│   └── firebase.ts               # Firebase config
│
├── .env.local.example            # Environment template
├── V3_SETUP_GUIDE.md             # Setup & deployment (V3)
├── V3_COMPLETION_SUMMARY.md      # Technical docs (V3)
├── PESAPAL_SECURITY_RULES.md     # Security rules (V3)
├── START_HERE_V3.md              # Quick start (V3)
└── README.md                     # This file
```

## Getting Started

### 👉 For V3 (Latest - Poll Boosting with Pesapal)

**START HERE:** `START_HERE_V3.md` - 5-minute quick start

**Detailed guides:**
- `V3_SETUP_GUIDE.md` - Complete setup for local development and production
- `V3_COMPLETION_SUMMARY.md` - Technical documentation and architecture
- `PESAPAL_SECURITY_RULES.md` - Firestore security rules and best practices

### For V2 (Polls, Voting, Comments)

See `V2_SETUP_GUIDE.md` for full polling functionality

### For V1 (Authentication & Landing Page)

See `SETUP_GUIDE.md` for basic authentication setup

---

## Quick Start (V3)

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project (with V2 polls setup)
- Pesapal account (free at pesapal.com)
- For local testing: ngrok (free at ngrok.com)

### 1. Clone and Install

```bash
git clone <your-repo>
cd voxly
npm install
```

### 2. Configure Environment

Copy the template and add your credentials:

```bash
cp .env.local.example .env.local

# Edit .env.local:
# - Firebase credentials (from Firebase Console)
# - Pesapal credentials (from pesapal.com/developer/console)
# - Set PESAPAL_ENV=demo for testing
# - Set NEXT_PUBLIC_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Test Boosting Feature

1. Sign in with Google
2. Create a poll
3. View poll details
4. Click "Boost Poll - KES 100"
5. Use Pesapal demo M-Pesa test number: `254722111111` / PIN: `1234`
6. Complete payment
7. Poll appears in "Featured Polls" on homepage! 🎉

**Full setup guide:** `V3_SETUP_GUIDE.md`

---

## Environment Variables

### Firebase Config
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin SDK (server-side only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

### Pesapal Config
```env
PESAPAL_ENV=demo              # or 'live' for production
PESAPAL_CONSUMER_KEY=
PESAPAL_CONSUMER_SECRET=
PESAPAL_IPN_ID=               # Fill after IPN registration
```

### App Config
```env
NEXT_PUBLIC_URL=http://localhost:3000
```

See `.env.local.example` for complete list.

---

## Key Features

### 🎯 Poll Creation & Management
- Create polls with 2-5 options
- Add optional image and close date
- View poll creator info
- Track vote counts in real-time

### 🗳️ Real-Time Voting
- Live vote updates
- See results as they happen
- Firestore integration for sync

### 💬 Comments & Discussions
- Comment on polls
- Like/dislike comments
- Real-time comment updates
- Show comment author info

### 💳 Poll Boosting (V3)
- Pay KES 100 to feature poll for 24 hours
- Secure Pesapal payment integration
- Featured Polls section on homepage
- Yellow "Featured" badge on boosted polls

---

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Pesapal V3 integration"
   git push origin main
   ```

2. **Create Vercel Project**
   - Go to vercel.com
   - Import your GitHub repository
   - Click "Continue"

3. **Add Environment Variables**
   In Vercel dashboard > Settings > Environment Variables:
   - Add all variables from `.env.local`
   - Use production Pesapal credentials (not demo)

4. **Configure Firebase**
   - Add your Vercel domain to Firebase > Authentication > Authorized domains

5. **Register Production IPN**
   - In Pesapal Console > Live environment
   - Register IPN URL: `https://yourdomain.com/api/pesapal/ipn`

**Full deployment guide:** `V3_SETUP_GUIDE.md` → Production Deployment

---

## Security

✅ **Authentication**
- Firebase Auth with Google Sign-In
- Protected routes with AuthContext

✅ **Payments (V3)**
- Server-side payment processing
- Firebase Admin SDK for token verification
- Payments collection protected (server-only)
- Idempotent IPN handling

✅ **Database**
- Firestore security rules enforce access control
- Client cannot modify payment records
- Admin SDK has full access for server operations

**Full security details:** `PESAPAL_SECURITY_RULES.md`

---

## Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# ESLint
npm run lint
```

---

## Troubleshooting

### Boost button not appearing?
- Sign in with Google first
- Refresh the poll detail page

### Payment fails?
- Check Pesapal credentials in `.env.local`
- Restart dev server after updating env vars
- Verify Firebase Admin credentials

### IPN not processing?
- Ensure ngrok is running for local testing
- Register ngrok URL in Pesapal Console
- Check server logs for errors

**Full troubleshooting:** `V3_SETUP_GUIDE.md` → Troubleshooting

---

## Documentation

### V3 (Pesapal Payments)
- `START_HERE_V3.md` - Quick start guide
- `V3_SETUP_GUIDE.md` - Complete setup & deployment
- `V3_COMPLETION_SUMMARY.md` - Technical documentation
- `PESAPAL_SECURITY_RULES.md` - Security & Firestore rules

### V2 (Polls & Voting)
- `V2_SETUP_GUIDE.md` - Full polling setup
- `V2_COMPLETION_SUMMARY.md` - V2 documentation
- `V2_QUICK_REFERENCE.md` - Quick reference

### General
- `FIRESTORE_RULES.md` - Firestore security rules
- `PROJECT_STRUCTURE.md` - Project organization

---

## Future Enhancements

- [ ] Boost tier system (KES 50, 100, 200)
- [ ] Email confirmation on successful payment
- [ ] Boost ROI metrics
- [ ] Refund handling
- [ ] Admin dashboard
- [ ] Poll analytics
- [ ] More payment providers
- [ ] SMS notifications

---

## Support

For questions or issues:

1. Check relevant documentation (`START_HERE_V3.md`, `V3_SETUP_GUIDE.md`)
2. Review troubleshooting sections
3. Check Firebase and Pesapal docs
4. Open an issue on GitHub

---

## License

MIT License - feel free to use this project for personal or commercial use.

---

**Made with ❤️ by the Voxly team**

**Latest Version:** V3 with Pesapal Poll Boosting 🚀
