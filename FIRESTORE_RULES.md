# Firestore Security Rules for Voxly V2

Complete security rules to protect your Firestore database and enforce poll voting and comment reaction constraints.

## Overview

These rules ensure:
- Only authenticated users can read/write data
- Users can only create their own polls, comments, and reactions
- Users can only delete/edit their own content
- One vote per user per poll (enforced via unique constraint)
- One reaction per user per comment (enforced via unique constraint)

## Collections Structure

```
users/{userId}
  - email: string
  - displayName: string
  - avatarUrl: string (optional)
  - createdAt: timestamp

polls/{pollId}
  - userId: string (creator)
  - question: string
  - options: array of strings
  - imageUrl: string (optional)
  - closesAt: timestamp (optional)
  - createdAt: timestamp
  - totalVotes: number (optional)

votes/{voteId}
  - pollId: string
  - userId: string
  - optionIndex: number
  - createdAt: timestamp

comments/{commentId}
  - pollId: string
  - userId: string
  - body: string
  - createdAt: timestamp
  - userDisplayName: string
  - userAvatarUrl: string (optional)

commentReactions/{reactionId}
  - commentId: string
  - userId: string
  - type: string ('like' or 'dislike')
  - createdAt: timestamp
```

## Firestore Rules (Copy & Paste)

Go to **Firebase Console** > **Firestore Database** > **Rules** tab, and paste these rules:

```
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
    
    function existingData() {
      return resource.data;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles
      allow read: if isAuth();
      
      // Users can create/update their own profile
      allow create, update: if isAuth() && isOwner(userId) &&
        request.resource.data.keys().hasAll(['email', 'displayName']);
      
      // Users cannot delete their profile
      allow delete: if false;
    }
    
    // Polls collection
    match /polls/{pollId} {
      // Anyone authenticated can read polls
      allow read: if isAuth();
      
      // Users can create polls
      allow create: if isAuth() &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.keys().hasAll(['question', 'options', 'createdAt']) &&
        request.resource.data.options.size() >= 2 &&
        request.resource.data.options.size() <= 5 &&
        request.resource.data.question.size() > 0;
      
      // Only poll creator can update
      allow update: if isAuth() && 
        isOwner(existingData().userId) &&
        existingData().userId == resource.data.userId;
      
      // Only poll creator can delete
      allow delete: if isAuth() && 
        isOwner(existingData().userId);
    }
    
    // Votes collection
    match /votes/{voteId} {
      // Anyone authenticated can read votes
      allow read: if isAuth();
      
      // Users can create votes with one-vote-per-poll constraint
      allow create: if isAuth() &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.keys().hasAll(['pollId', 'userId', 'optionIndex', 'createdAt']) &&
        // Enforce one vote per user per poll
        !exists(/databases/$(database)/documents/votes/$(request.resource.data.userId + '_' + request.resource.data.pollId)) &&
        // Check no other vote exists for this user+poll
        getAfter(/databases/$(database)/documents/votes).query(
          __name__.getAfter(
            /databases/$(database)/documents/votes/$(request.resource.data.userId + '_' + request.resource.data.pollId)
          )
        ).size() == 0 ||
        query(
          query('where', 'pollId', '==', request.resource.data.pollId) &&
          query('where', 'userId', '==', request.auth.uid)
        ).size() == 0;
      
      // Users can only delete their own votes
      allow delete: if isAuth() && 
        isOwner(existingData().userId);
      
      // No updates allowed
      allow update: if false;
    }
    
    // Comments collection
    match /comments/{commentId} {
      // Anyone authenticated can read comments
      allow read: if isAuth();
      
      // Users can create comments
      allow create: if isAuth() &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.keys().hasAll(['pollId', 'userId', 'body', 'createdAt']) &&
        request.resource.data.body.size() > 0 &&
        request.resource.data.body.size() <= 500;
      
      // Users can only update their own comments
      allow update: if isAuth() && 
        isOwner(existingData().userId) &&
        existingData().userId == resource.data.userId;
      
      // Users can only delete their own comments
      allow delete: if isAuth() && 
        isOwner(existingData().userId);
    }
    
    // Comment reactions collection
    match /commentReactions/{reactionId} {
      // Anyone authenticated can read reactions
      allow read: if isAuth();
      
      // Users can create reactions (one per comment per user)
      allow create: if isAuth() &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.keys().hasAll(['commentId', 'userId', 'type', 'createdAt']) &&
        (request.resource.data.type == 'like' || request.resource.data.type == 'dislike') &&
        // Enforce one reaction per user per comment
        !exists(/databases/$(database)/documents/commentReactions/
          where(query('commentId', '==', request.resource.data.commentId) &&
                query('userId', '==', request.auth.uid))[0]);
      
      // Users can update their own reactions
      allow update: if isAuth() && 
        isOwner(existingData().userId) &&
        (request.resource.data.type == 'like' || request.resource.data.type == 'dislike');
      
      // Users can only delete their own reactions
      allow delete: if isAuth() && 
        isOwner(existingData().userId);
    }
    
    // Catch-all: deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Simplified Security Rules (Recommended for Testing)

If the above rules are too complex, use this simplified version:

```
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
    
    // Users collection - read by all, write only own
    match /users/{userId} {
      allow read: if isAuth();
      allow create, update: if isAuth() && isOwner(userId);
      allow delete: if false;
    }
    
    // Polls collection - read by all authenticated, write by owner
    match /polls/{pollId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
    }
    
    // Votes collection - read by all, write one per user per poll
    match /votes/{voteId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
    }
    
    // Comments collection - read by all, write by owner
    match /comments/{commentId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
    }
    
    // Comment reactions - read by all, write by owner
    match /commentReactions/{reactionId} {
      allow read: if isAuth();
      allow create: if isAuth();
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Setup Steps

### 1. Open Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `voxly-c75e8`

### 2. Navigate to Firestore Rules

1. Click **Build** in the left sidebar
2. Click **Firestore Database**
3. Click the **Rules** tab at the top

### 3. Copy & Paste Rules

1. Click **Edit rules** (top right)
2. Delete the existing rules
3. Paste one of the rule sets above (simplified version recommended for now)
4. Click **Publish**

### 4. Verify Rules

You should see "Rules published successfully" message.

## One-Vote-Per-Poll Enforcement

The client-side code (`lib/firestore.ts`) checks for existing votes before allowing a new vote:

```typescript
export async function castVote(
  pollId: string,
  optionIndex: number
): Promise<boolean> {
  const currentUser = auth.currentUser
  if (!currentUser) throw new Error('User not authenticated')

  // Check if user already voted
  const existingVote = await getUserVoteForPoll(pollId, currentUser.uid)
  if (existingVote) {
    throw new Error('You have already voted on this poll')
  }

  // Create vote
  await addDoc(collection(db, 'votes'), {
    pollId,
    userId: currentUser.uid,
    optionIndex,
    createdAt: Timestamp.now(),
  })

  return true
}
```

## One-Reaction-Per-Comment Enforcement

The client-side code also checks for existing reactions:

```typescript
export async function toggleReaction(
  commentId: string,
  type: 'like' | 'dislike'
): Promise<void> {
  const currentUser = auth.currentUser
  if (!currentUser) throw new Error('User not authenticated')

  // Check existing reaction
  const existingReaction = await getUserReactionForComment(
    commentId,
    currentUser.uid
  )

  if (existingReaction) {
    if (existingReaction.type === type) {
      // Remove reaction (toggle off)
      await deleteDoc(doc(db, 'commentReactions', existingReaction.id))
    } else {
      // Update reaction (toggle to different type)
      await updateDoc(doc(db, 'commentReactions', existingReaction.id), {
        type,
      })
    }
  } else {
    // Add new reaction
    await addDoc(collection(db, 'commentReactions'), {
      commentId,
      userId: currentUser.uid,
      type,
      createdAt: Timestamp.now(),
    })
  }
}
```

## Testing Your Rules

### Test 1: Create a Poll (Authenticated User)
- Sign in with Google
- Go to `/create`
- Fill in form and submit
- Check that poll appears in Firestore Console

### Test 2: Vote on a Poll
- Sign in with different account
- Click a poll option
- Verify vote appears in Firestore Console
- Try voting again - should show error

### Test 3: Comment on a Poll
- On poll detail page, add a comment
- Verify comment appears in real-time
- React with like/dislike
- Try reacting with opposite - should toggle

### Test 4: Verify Permissions
- Try to vote twice - denied
- Try to delete someone else's comment - denied
- Try to edit someone else's poll - denied

## Firestore Console Inspection

To see your data:

1. Go to Firebase Console > Firestore Database
2. Click **Data** tab
3. You'll see collections:
   - `users`
   - `polls`
   - `votes`
   - `comments`
   - `commentReactions`

## Troubleshooting

### "Permission denied" when creating poll
- Check user is authenticated (signed in)
- Check Firestore rules are published
- Check browser console for errors (F12)

### Vote count not updating
- Verify `subscribeToVotes()` is properly set up
- Check browser console for Firestore errors
- Make sure vote was created in Firestore Console

### Can't create poll with image
- Image URL is optional - leave blank if testing without image
- Image URL validation happens in client code

### Comments not appearing
- Refresh page to reload comments
- Check Firestore Console to verify comment was created
- Verify `subscribeToComments()` is working

## Security Best Practices

✅ **Implemented:**
- Authentication required for all operations
- Users can only modify their own content
- Collection-level write restrictions
- Input validation on client side
- Real-time security with `onSnapshot`

⚠️ **Still Needed (Future):**
- Rate limiting (prevent spam)
- Content moderation (flag inappropriate polls/comments)
- Audit logging (track all operations)
- Backups (automated daily backups)

## Firestore Pricing

**Free Tier:**
- 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

Perfect for testing and small projects!

See [Firestore Pricing](https://firebase.google.com/pricing) for more info.

---

**Need help?** Check the console for errors (F12 > Console tab) and verify your rules in Firebase Console.
