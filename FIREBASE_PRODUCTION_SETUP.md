# Firebase Production Setup Guide for Voxly

This guide covers the manual Firebase Console configurations required to make Voxly fully operational in production.

---

## 1. Create Composite Index for Boosted Polls Query

**Issue**: The `getAllBoostedPolls()` function queries with multiple `where` conditions on the `polls` collection:
- `where('isBoosted', '==', true)`
- `where('boostedUntil', '>', Timestamp.fromDate(now))`
- `orderBy('boostedUntil', 'desc')`

Firestore requires a **composite index** for this query pattern. Without it, the query fails silently and returns no results.

### Steps to Create the Index:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **voxly-c75e8**
3. Navigate to: **Firestore Database** → **Indexes** tab
4. Click **Create Index**
5. Fill in the form:
   - **Collection ID**: `polls`
   - **Query Scope**: Collection
   - Add two fields in order:
     - **Field 1**: `isBoosted` (Type: Ascending)
     - **Field 2**: `boostedUntil` (Type: Descending)
6. Click **Create Index**

**Wait for Index to Build**: This usually takes 1-5 minutes. You'll see a checkmark when done.

**Verify**: After creation, you should see:
```
Collection: polls
Fields: isBoosted (Ascending), boostedUntil (Descending)
Status: ✓ Enabled
```

---

## 2. Add Firebase Authorized Domains

**Issue**: Users signing in via Google OAuth may get redirected back to the app but fail to authenticate because the domain isn't authorized in Firebase.

### Steps to Add Domain:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **voxly-c75e8**
3. Navigate to: **Authentication** → **Sign-in method** tab
4. Scroll down to **Authorized domains**
5. Click **Add domain**
6. Enter: `voxly-1.vercel.app`
7. Click **Add**

**Verify**: The domain should now appear in the authorized domains list.

**Additional Domains** (if applicable):
- If you use a custom domain (e.g., `voxly.example.com`), add it here as well.
- For local testing, `localhost` is already included by default.

---

## 3. Verify Firestore Security Rules Are Deployed

**Issue**: Firestore rules control who can read/write data. If rules are too restrictive or not deployed correctly, pages will hang or show permission errors.

### Steps to Check Rules:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **voxly-c75e8**
3. Navigate to: **Firestore Database** → **Rules** tab
4. Check the current rules (they should be similar to the simplified ruleset below)

### Recommended Firestore Rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuth() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users collection - users can only read/write their own profile
    match /users/{userId} {
      allow read: if isAuth();
      allow create, update: if isOwner(userId);
      allow delete: if false; // Prevent account deletion
    }
    
    // Polls collection - all authenticated users can read and create polls
    match /polls/{pollId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
      
      // Nested votes, comments
      match /votes/{voteId} {
        allow read: if isAuth();
        allow create: if isAuth();
        allow delete: if isAuth() && isOwner(resource.data.userId);
      }
      
      match /comments/{commentId} {
        allow read: if isAuth();
        allow create, update, delete: if isAuth() && isOwner(resource.data.userId);
        
        // Nested reactions
        match /reactions/{reactionId} {
          allow read: if isAuth();
          allow create: if isAuth();
          allow delete: if isAuth() && isOwner(resource.data.userId);
        }
      }
    }
    
    // Top-level votes collection (if used)
    match /votes/{voteId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow delete: if isAuth() && isOwner(resource.data.userId);
    }
    
    // Top-level comments collection (if used)
    match /comments/{commentId} {
      allow read: if isAuth();
      allow create, update, delete: if isAuth() && isOwner(resource.data.userId);
    }
    
    // Top-level reactions collection (if used)
    match /commentReactions/{reactionId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow delete: if isAuth() && isOwner(resource.data.userId);
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**How to Deploy Rules**:

1. Open the **Rules** tab in Firestore
2. Copy the rules above (or your custom rules)
3. Paste into the rule editor
4. Click **Publish** (top right)
5. Confirm the deployment

**Rule Explanation**:
- `isAuth()`: Only authenticated users can access data
- `isOwner(userId)`: Only the user who owns the resource can update/delete it
- Polls are readable by all authenticated users (public polls)
- Comments and reactions are owned by their creators
- All other access is denied by default

---

## 4. Environment Variables on Vercel

Ensure these variables are set in **Vercel → Project Settings → Environment Variables**:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB_-HshVbfifw42ACFf5l1RLKBM9Pdurng
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=voxly-c75e8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=voxly-c75e8
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=voxly-c75e8.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=682251077393
NEXT_PUBLIC_FIREBASE_APP_ID=1:682251077393:web:9e804159c92540b219eeb0
FIREBASE_ADMIN_PROJECT_ID=voxly-c75e8
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@voxly-c75e8.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_URL=https://voxly-1.vercel.app
PESAPAL_ENV=demo
PESAPAL_CONSUMER_KEY=ITAzmBWNN9Pp9g/I3ByGpebq09O9mQ5r
PESAPAL_CONSUMER_SECRET=lZ0MEPc6SUGyq+3zZB3tIXHRVWE=
```

**Critical**: 
- `NEXT_PUBLIC_URL` must be `https://voxly-1.vercel.app` (not localhost)
- `FIREBASE_ADMIN_PRIVATE_KEY` must be on a single line with literal `\n` for newlines (already in Vercel format)

---

## 5. Troubleshooting

### Profile Page Still Slow After Fixes

**Symptom**: Profile page takes several seconds to load

**Cause**: Even with parallel vote fetching, polling many votes is slow

**Solutions**:
1. Add client-side caching: Cache vote counts in React state for 30 seconds
2. Use Firestore aggregation query (if available in your region)
3. Store vote counts on polls document and update in real-time using Cloud Functions

### Boosted Polls Section Shows Nothing

**Symptom**: Boosted polls section is blank, home page loads fine

**Cause**: Composite index not yet created, or index is still building

**Fix**:
1. Check [Firebase Firestore Indexes](https://console.firebase.google.com/project/voxly-c75e8/firestore/indexes/composite)
2. Create the composite index if missing (see Step 1 above)
3. Wait 1-5 minutes for the index to build
4. Reload the app

### Permission Denied Errors in Console

**Symptom**: Browser console shows `FirebaseError: PERMISSION_DENIED: Missing or insufficient permissions`

**Cause**: Firestore rules are blocking the read/write

**Fix**:
1. Check Firestore Rules are published (Step 3)
2. Verify the rule logic matches your app's data access patterns
3. Check that `isAuth()` helper is present and working
4. Temporarily use permissive rules to verify the fix works, then tighten

### Google Sign-In Redirects But Doesn't Work

**Symptom**: Click "Sign in with Google", authorize the app, but get redirected back without logging in

**Cause**: Domain not in authorized domains list

**Fix**:
1. Go to Firebase → Authentication → Authorized Domains
2. Add `voxly-1.vercel.app`
3. Wait a few minutes for the change to propagate
4. Try signing in again

---

## 6. Testing Checklist

After completing all steps:

- [ ] Visit https://voxly-1.vercel.app
- [ ] Sign in with Google
- [ ] Navigate to Profile → My Polls (should load quickly)
- [ ] Create a new poll
- [ ] Go to home page → check "Boosted Polls" section (should show any boosted polls)
- [ ] Vote on a poll
- [ ] Add a comment
- [ ] Test boost payment (if needed)

---

## Additional Resources

- [Firebase Composite Indexes Docs](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Authentication for Web](https://firebase.google.com/docs/auth/web/manage-users)

---

**Last Updated**: August 21, 2026
**Project**: Voxly V3 (Next.js 14 + Firebase + Pesapal)
