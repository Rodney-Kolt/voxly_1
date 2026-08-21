# Voxly V2 - Quick Reference Card

**Print this or bookmark it!**

---

## 🚀 Get Started in 20 Minutes

### 1. Enable Firestore (5 min)
```
Firebase Console > Build > Firestore Database > Create Database
- Select "Production mode"
- Region: us-central1
- Wait for initialization
```

### 2. Add Security Rules (3 min)
```
Firebase Console > Firestore > Rules tab > Edit Rules
Copy & paste rules from FIRESTORE_RULES.md (simplified version)
Click Publish
```

### 3. Run App (2 min)
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Test Features (10 min)
- Sign in with Google
- Click "Create Poll"
- Fill form and submit
- Vote on poll
- Add comment
- React to comment

---

## 📍 Key Routes

| Route | Purpose | Auth Required |
|-------|---------|---|
| `/` | Home (recent polls) | ❌ |
| `/create` | Create new poll | ✅ |
| `/poll/[pollId]` | View poll & vote | ✅ |
| `/profile` | Your profile & polls | ✅ |

---

## 🔥 Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server locally
npm start

# Check code quality
npm run lint
```

---

## 📁 New V2 Files

### Pages & Components
```
app/create/page.tsx              - Create poll form
app/poll/[pollId]/page.tsx       - Poll detail + voting + comments
app/components/PollList.tsx      - Recent polls grid
app/components/PollVoting.tsx    - Voting UI
app/components/CommentsSection.tsx - Comments list
app/components/CommentItem.tsx   - Comment with reactions
```

### Backend
```
lib/firestore.ts                 - All Firestore operations
lib/firebase.ts                  - Firebase config (updated)
```

---

## 🗂️ Firestore Collections

```
users/{userId}
polls/{pollId}
votes/{voteId}
comments/{commentId}
commentReactions/{reactionId}
```

---

## ⚡ Real-time Features

- ✅ Votes update live (no refresh needed)
- ✅ Comments appear instantly
- ✅ Reactions update in real-time
- ✅ Multiple users can interact simultaneously

---

## 🔒 Security Enforced

- ✅ One vote per user per poll
- ✅ One reaction per user per comment
- ✅ Users can only edit/delete own content
- ✅ Authentication required for all operations

---

## 📊 Data Model

### Poll
```typescript
{
  id: string                    // Document ID
  userId: string                // Creator
  question: string              // Required
  options: string[]             // 2-5 options
  imageUrl?: string             // Optional
  closesAt?: Timestamp          // Optional
  createdAt: Timestamp
  totalVotes: number
}
```

### Vote
```typescript
{
  id: string
  pollId: string
  userId: string
  optionIndex: number           // 0, 1, 2, ...
  createdAt: Timestamp
}
```

### Comment
```typescript
{
  id: string
  pollId: string
  userId: string
  body: string                  // Max 500 chars
  createdAt: Timestamp
  userDisplayName: string
  userAvatarUrl?: string
}
```

### CommentReaction
```typescript
{
  id: string
  commentId: string
  userId: string
  type: 'like' | 'dislike'
  createdAt: Timestamp
}
```

---

## 🎨 Key UI Components

### PollCard
- Shows question, author, vote count
- Clickable to view details
- Grid layout on home page

### PollVoting
- Shows options as buttons
- Real-time results with percentages
- Vote once only (enforced)

### CommentItem
- Shows author avatar/name
- Comment text
- Like/dislike buttons
- Timestamp

---

## 🔧 Firestore Functions (lib/firestore.ts)

### Polls
```typescript
createPoll(question, options, imageUrl?, closesAt?)
getPoll(pollId)
getAllPolls(limitCount)
getUserPolls(userId)
subscribeToPoll(pollId, callback)
```

### Voting
```typescript
castVote(pollId, optionIndex)
getUserVoteForPoll(pollId, userId)
getVotesByOption(pollId)
subscribeToVotes(pollId, callback)
```

### Comments
```typescript
postComment(pollId, body)
getComments(pollId)
subscribeToComments(pollId, callback)
deleteComment(commentId)
```

### Reactions
```typescript
toggleReaction(commentId, type)
getUserReactionForComment(commentId, userId)
getReactionCounts(commentId)
subscribeToReactions(commentId, callback)
```

---

## ⚙️ Hooks & Context

### useAuth()
```typescript
const { user, loading, signOutUser } = useAuth()

user: User | null         // Firebase User object
loading: boolean          // Auth state loading
signOutUser(): Promise    // Sign out function
```

---

## 🐛 Debugging

### Check Firestore Data
```
Firebase Console > Firestore Database > Data tab
See all collections and documents
```

### Check Errors
```
Browser: F12 > Console tab
Server: npm run dev output
```

### Check Votes
```
Look in votes collection for pollId matches
Each vote has userId + optionIndex
```

### Check Comments
```
Look in comments collection for pollId matches
Each comment has userId + body
```

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Permission denied" | Check Firestore rules published |
| Can't create poll | Make sure you're signed in |
| Can't vote twice | Expected! One vote per user |
| No real-time updates | Refresh page or check console |
| Image not loading | Use valid HTTPS URL |
| Comments not appearing | Check Firestore Console for data |

---

## 📱 Responsive Breakpoints

```
Mobile:  < 640px   (single column)
Tablet:  640-1024px (2 columns)
Desktop: > 1024px   (3+ columns)
```

---

## 💾 Environment Variables

Already set from V1, no changes needed:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=voxly-c75e8
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## 📈 Firestore Limits

**Free Tier:**
- 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

**With ~100 users/day:**
- ~500-1000 reads/day (safe)
- ~200-500 writes/day (safe)

---

## 🎯 Testing Features

### Poll Creation
✅ Create with 2-5 options  
✅ With optional image  
✅ With optional close date  
✅ Form validation  

### Voting
✅ Vote once per poll  
✅ See real-time results  
✅ Can't vote twice  
✅ Results show percentages  

### Comments
✅ Post comments  
✅ See in real-time  
✅ Delete own  
✅ View timestamps  

### Reactions
✅ Like comments  
✅ Dislike comments  
✅ Toggle on/off  
✅ Switch types  

---

## 🚀 Deployment

### To Vercel
```bash
git add .
git commit -m "feat: Add Voxly V2"
git push origin main
# Auto-deploys! Check Vercel Dashboard
```

### Test Production
1. Go to Vercel URL
2. Sign in with Google
3. Create poll
4. Check Firestore Console
5. Verify real-time updates

---

## 📚 Key Files to Read

| File | Purpose |
|------|---------|
| V2_SETUP_GUIDE.md | Complete setup (20 min read) |
| FIRESTORE_RULES.md | Security rules (5 min read) |
| V2_COMPLETION_SUMMARY.md | Full overview (10 min read) |
| lib/firestore.ts | All backend functions |

---

## ✅ V2 Checklist

- [ ] Firestore database created
- [ ] Security rules published
- [ ] `npm run dev` works locally
- [ ] Can sign in with Google
- [ ] Can create poll
- [ ] Can vote on poll
- [ ] Can comment
- [ ] Can react to comments
- [ ] See real-time updates
- [ ] Mobile layout works
- [ ] Deployed to Vercel
- [ ] Production testing done

---

## 💡 Pro Tips

1. **Test with incognito window** - Different user/browser
2. **Use placeholder images** - `https://via.placeholder.com/400x300`
3. **Check Firestore Console first** - Before debugging code
4. **Use browser DevTools** - F12 for network/console issues
5. **Restart dev server** - After env var changes
6. **Clear cache** - Ctrl+Shift+Delete if stale data

---

## 🎯 Performance Tips

- Polls limited to 20 on home page
- Real-time subscriptions cleaned up
- Vote counts computed from query
- Comments cached on component load
- Images lazy-loaded

---

## 🔐 Security Reminders

- ✅ Never commit `.env.local`
- ✅ Never expose private keys
- ✅ Always require auth for writes
- ✅ Validate input on client AND server
- ✅ Use security rules in Firebase

---

## 📞 Support

**Before asking for help:**
1. Check browser console (F12)
2. Check Firestore Console data
3. Verify Firestore rules published
4. Read V2_SETUP_GUIDE.md
5. Check FIRESTORE_RULES.md

---

## 🎉 You're Ready!

Print this card, bookmark the guides, and start polling!

**Happy building!** 🚀

Made with ❤️ - Voxly Team
