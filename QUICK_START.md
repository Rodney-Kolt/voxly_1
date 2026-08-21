# Voxly Quick Start Checklist

Get Voxly running in 5 minutes! Follow these steps in order.

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd voxly
npm install
```

### 2. Get Firebase Credentials

Go to [Firebase Console](https://console.firebase.google.com/):
1. Create a new project (or use existing)
2. Click the Web app icon (</> symbol)
3. Copy these 6 values from the configuration

### 3. Add Environment Variables

Edit `.env.local` and paste your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=paste_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=paste_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=paste_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=paste_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=paste_here
NEXT_PUBLIC_FIREBASE_APP_ID=paste_here
```

### 4. Enable Google Sign-In in Firebase

In Firebase Console:
1. Go to **Authentication** → **Sign-in method**
2. Click **Google** and toggle **ON**
3. Click **Save**

### 5. Start the Dev Server

```bash
npm run dev
```

Open http://localhost:3000 and you're done! 🎉

---

## 📋 What You Get

✅ Beautiful responsive landing page  
✅ Google Sign-In integration  
✅ User profile page  
✅ Mobile-optimized design  
✅ Ready for Vercel deployment  

---

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Go to [Vercel](https://vercel.com/) and import the repo
3. Add the same 6 environment variables
4. Add your Vercel domain to Firebase **Authorized domains**
5. Done!

---

## 📚 Full Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **README.md** - Project overview and architecture
- **NEXT_PUBLIC_* variables** are safe to expose (that's Firebase design)

---

## ✨ Demo Features

- Landing page with hero section
- Features showcase
- How it works section
- Navigation with responsive mobile menu
- Google Sign-In button
- Protected /profile page
- User avatar, name, email display
- Sign out functionality

---

## 🎨 Customization

**Colors** - Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: '#3B82F6',        // Change blue
  secondary: '#1F2937',      // Change dark gray
  accent: '#8B5CF6',         // Change purple
}
```

**Content** - Edit these files:
- `app/components/Hero.tsx` - Landing copy & CTA
- `app/components/Features.tsx` - Features list
- `app/components/HowItWorks.tsx` - 3-step process

**Logo** - Replace the "V" badge in:
- `app/components/Navigation.tsx`
- `app/components/Footer.tsx`

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Firebase not initialized | Check `.env.local` is filled correctly |
| Sign-in not working | Enable Google in Firebase > Authentication |
| Profile redirects to home | Check Firebase config in `.env.local` |
| Localhost 403 error | Add `localhost` to Firebase Authorized domains |

---

## 📞 Next Steps

After successful setup:
- Read `SETUP_GUIDE.md` for detailed explanations
- Explore the component structure in `app/components/`
- Deploy to Vercel for a live URL
- Plan V2 features (polls, voting, comments)

**Questions?** Check the SETUP_GUIDE.md or open an issue! 🚀

---

**Made with ❤️ - Voxly V1**
