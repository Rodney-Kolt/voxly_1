# Voxly V2 Setup Guide - Full Poll Functionality

Complete guide to set up Voxly V2 with Firestore, polls, voting, comments, and reactions.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Enable Firestore](#enable-firestore)
4. [Set Firestore Security Rules](#set-firestore-security-rules)
5. [Run Locally](#run-locally)
6. [Create Your First Poll](#create-your-first-poll)
7. [Deploy to Vercel](#deploy-to-vercel)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

You need:
- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **Voxly V1 already running** - If not, follow V1 setup first
- ✅ **Firebase project** - `voxly-c75e8` (from V1)
- ✅ **Firebase credentials in `.env.local`** - Should already be set

---

## Firebase Setup

### Your Firebase Project

**Project Name:** `voxly-c75e8`  
**Auth Domain:** `voxly-c75e8.firebaseapp.com`  
**Project ID:** `voxly-c75e8`

Go to: https://console.firebase.google.com/project/voxly-c75e8/overview

---

## Enable Firestore

### Step 1: Open Firestore

1. In Firebase Console, click **Build** (left sidebar)
2. Click **Firestore Database**
3. You should see "Firestore Database" in the title

### Step 2: Create Database

If Firestore is not yet created:

1. Click **Create database**
2. Select **Start in production mode** (we'll set rules next)
3. Choose **US (us-central1)** region
4. Click **Create**

Wait 1-2 minutes for database to initialize.

### Step 3: Verify Firestore is Ready

You should see:
- Database tab showing "Firestore Database"
- Collections list (empty, that's ok)
- Data, Rules, Backups, Indexes tabs at top

---

## Set Firestore Security Rules

### Step 1: Open Rules Tab

1. In Firestore Database, click **Rules** tab (next to Data)
2. Click **Edit rules** button

### Step 2: Delete Default Rules

Clear the existing rules in the editor.

### Step 3: Copy & Paste New Rules

Use the **Simplified Rules** from [FIRESTORE_RULES.md](./FIRESTORE_RULES.md#simplified-security-rules-recommended-for-testing):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuth() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read: if isAuth();
      allow create, update: if isAuth() && isOwner(userId);
      allow delete: if false;
    }
    
    match /polls/{pollId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
    }
    
    match /votes/{voteId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
    }
    
    match /comments/{commentId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
    }
    
    match /commentReactions/{reactionId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 4: Publish Rules

1. Click **Publish** button (top right)
2. Wait for confirmation: "Rules published successfully"

✅ **Firestore is now ready!**

---

## Run Locally

### Step 1: Start Dev Server

```bash
cd c:\poll opinion\voxly
npm run dev
```

You should see:
```
✓ Ready in 1234ms
- Local: http://localhost:3000
```

### Step 2: Open App

Go to **http://localhost:3000** in your browser.

You should see:
- Voxly landing page
- "Recent Polls" section (empty for now)
- Navigation bar with "Create Poll" button (if signed in)

### Step 3: Sign In

1. Click **Sign in with Google** button
2. Complete Google sign-in
3. You're redirected to `/profile`

### Step 4: Create First Poll

1. In navbar, click **Create Poll**
2. Fill in form:
   - **Question:** "What's your favorite framework?"
   - **Option 1:** React
   - **Option 2:** Vue
   - **Option 3:** Svelte
   - Leave image and close date empty for now
3. Click **Create Poll**
4. You're redirected to poll detail page

### Step 5: Vote on Poll

1. On poll detail page, click an option button
2. You should see results appear with percentage bars
3. Vote count updates in real-time

### Step 6: Add Comment

1. Scroll to "Comments" section
2. Type a comment: "I love React!"
3. Click **Post Comment**
4. Your comment appears immediately

### Step 7: React to Comment

1. On your comment, click **👍** (like) button
2. Button should highlight blue
3. Click again to remove like
4. Click **👎** (dislike) to switch reaction

### Step 8: View Your Polls

1. In navbar, click on your avatar/name
2. Go to Profile page
3. See "Your Polls" section showing the poll you created

✅ **All features working!**

---

## Test Multiple Users

### Test Voting Restriction

1. Open app in **incognito window** (Ctrl+Shift+N)
2. Sign in with **different Google account**
3. Go back to poll
4. Try to vote - you can vote once
5. Try to vote again - should show error message
6. Vote is stored in Firestore

### Test Poll Creation

1. In incognito window, click "Create Poll"
2. Create a new poll with different question
3. Close incognito window
4. In main window, refresh home page
5. Both polls appear in "Recent Polls"
6. Click the new poll to view it

### Test Comment Reactions

1. In different accounts, comment on same poll
2. Like/dislike each other's comments
3. Reactions appear in real-time
4. Try to like+dislike same comment
   - First like, then click dislike → should toggle to dislike
   - Can't have both reactions

---

## Create Your First Poll

### Poll Ideas to Test

```
1. Quick Poll (2 options)
   Q: "iOS or Android?"
   Options: iOS, Android

2. Medium Poll (4 options)
   Q: "Favorite programming language?"
   Options: JavaScript, Python, Rust, Go

3. With Image
   Q: "Which design looks better?"
   Options: Design A, Design B
   Image: https://via.placeholder.com/400x300

4. With Close Date
   Q: "What should our next feature be?"
   Options: Dark mode, Notifications, Export polls, Themes
   Close date: 24 hours from now
```

---

## Deploy to Vercel

After testing locally, deploy to production.

### Step 1: Push to GitHub

```bash
cd c:\poll opinion\voxly
git add .
git commit -m "feat: Add Voxly V2 with polls, voting, comments, reactions"
git push origin main
```

### Step 2: Redeploy on Vercel

If you already deployed V1:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your `voxly` project
3. Click **Redeploy** (or click the latest deployment and redeploy)

Wait 2-3 minutes for deployment to complete.

### Step 3: Test Firestore on Production

1. Go to your Vercel URL (e.g., `https://voxly.vercel.app`)
2. Sign in and create a poll
3. Check Firestore Console to see poll was created
4. Vote and comment
5. Verify data appears in Firestore

✅ **V2 is live!**

---

## Firestore Console Inspection

### View Your Data

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `voxly-c75e8`
3. Click **Firestore Database**
4. Click **Data** tab

You'll see collections:

```
users/
  └─ {userId}/
     └─ email, displayName, avatarUrl, createdAt

polls/
  └─ {pollId}/
     └─ userId, question, options, imageUrl, closesAt, createdAt, totalVotes

votes/
  └─ {voteId}/
     └─ pollId, userId, optionIndex, createdAt

comments/
  └─ {commentId}/
     └─ pollId, userId, body, createdAt, userDisplayName, userAvatarUrl

commentReactions/
  └─ {reactionId}/
     └─ commentId, userId, type, createdAt
```

### Query Examples

To see all polls:
1. Click `polls` collection
2. See all documents
3. Click a poll to see its data

To see votes for a poll:
1. Click `votes` collection
2. See all votes (each shows pollId, userId, optionIndex)

---

## Troubleshooting

### "Permission denied" Error

**Problem:** Getting permission denied when creating poll or voting.

**Solution:**
1. Check you're signed in (Google sign-in)
2. Check Firestore rules are published in Firebase Console
3. Refresh page (Ctrl+R)
4. Try incognito window (Ctrl+Shift+N)

### Firestore Not Initializing

**Problem:** Error like "Firestore is not initialized".

**Solution:**
1. Check `.env.local` has all 6 Firebase credentials
2. Restart dev server: `npm run dev`
3. Check Firebase credentials are correct:
   ```
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=voxly-c75e8
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=voxly-c75e8.firebaseapp.com
   ```

### Polls Not Appearing

**Problem:** No polls showing on home page.

**Solution:**
1. Check Firestore Console > Data > polls collection
2. If empty, create a poll via `/create` page
3. Refresh home page (Ctrl+R)
4. Check browser console (F12) for errors

### Real-time Updates Not Working

**Problem:** Comments or votes not updating in real-time.

**Solution:**
1. Close and reopen the poll detail page
2. Check Firestore Console shows new comments/votes
3. Check browser console (F12 > Console tab) for errors
4. Verify network tab (F12 > Network) shows Firestore requests

### Can't Vote Twice

**Problem:** Getting error "You have already voted on this poll".

**Solution:**
- This is expected! Each user can only vote once per poll
- Try viewing poll in incognito window with different account
- Or try a different poll

### Image Not Loading

**Problem:** Uploaded image URL not displaying.

**Solution:**
1. Use a valid image URL (must be HTTPS)
2. Test URL in browser to verify it works
3. Some URLs may be blocked by CORS policy
4. Try different image hosting (imgur.com, unsplash.com, etc.)

---

## Performance Tips

### Reduce Firestore Costs

- Recent polls limited to 20 (see PollList.tsx)
- Vote counts computed from votes collection
- Real-time subscriptions only on active pages
- Comments cached when viewing poll

### Monitor Usage

1. Go to Firebase Console > **Usage** tab
2. See daily reads/writes
3. Free tier allows 50K reads, 20K writes per day
4. Current app uses ~100 reads per user per session

---

## What's Next (V3+)

Features planned:
- [ ] Poll search and filtering
- [ ] User profiles (see user's polls)
- [ ] Trending polls
- [ ] Poll categories
- [ ] Email notifications
- [ ] Report inappropriate content
- [ ] Poll analytics and insights
- [ ] Export poll results

---

## Environment Variables

No new variables needed for V2! Same Firebase config as V1:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB_-HshVbfifw42ACFf5l1RLKBM9Pdurng
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=voxly-c75e8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=voxly-c75e8
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=voxly-c75e8.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=682251077393
NEXT_PUBLIC_FIREBASE_APP_ID=1:682251077393:web:9e804159c92540b219eeb0
```

---

## Quick Reference

| Feature | Route | Status |
|---------|-------|--------|
| Home / Recent Polls | `/` | ✅ |
| Create Poll | `/create` | ✅ |
| Poll Detail | `/poll/[pollId]` | ✅ |
| Vote on Poll | `/poll/[pollId]` | ✅ |
| Comment on Poll | `/poll/[pollId]` | ✅ |
| React to Comment | `/poll/[pollId]` | ✅ |
| User Profile | `/profile` | ✅ |
| View My Polls | `/profile` | ✅ |
| Sign In | Auth | ✅ |
| Sign Out | Auth | ✅ |

---

## Resources

- **Firebase Docs:** https://firebase.google.com/docs/firestore
- **Firestore Best Practices:** https://firebase.google.com/docs/firestore/best-practices
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev/

---

## Support

For issues:
1. Check browser console (F12 > Console tab)
2. Check Firestore Console > Data tab
3. Check Firebase Console > Logs
4. Read FIRESTORE_RULES.md for security rule issues
5. Verify .env.local has correct Firebase credentials

---

**Voxly V2 is ready! Happy polling!** 🗳️

Made with ❤️ - Voxly Team
