# 🐐 Create Sample Poll - Ronaldo vs Messi

Quick guide to create a sample poll and test all features including poll boosting with Pesapal!

## Prerequisites

✅ Dev server running (`npm run dev`)
✅ Signed in with Google
✅ Pesapal credentials in `.env.local`

## Option 1: Create Sample Poll via Web Page (Recommended)

### Step 1: Navigate to Seed Page

Visit: **http://localhost:3001/admin/seed**

(If port is different, adjust accordingly)

### Step 2: Click "Create Sample Poll"

The page will:
- ✅ Create a poll: "Who is the GOAT? Ronaldo or Messi?"
- ✅ Add 8 sample votes (5 Ronaldo, 3 Messi)
- ✅ Add 4 sample comments from different users
- ✅ Display the poll ID

### Step 3: View Your Poll

Click **"View Poll →"** button to go directly to the poll, OR manually visit:

```
http://localhost:3001/poll/[pollId]
```

## Option 2: Create Poll Manually

### Step 1: Go to Homepage

Visit: http://localhost:3001

### Step 2: Click "Create Poll"

Enter:
- **Question:** "Who is the GOAT? Ronaldo or Messi?"
- **Options:**
  - Cristiano Ronaldo
  - Lionel Messi
- **Click Submit**

### Step 3: View Poll Details

Click on your newly created poll to view it.

---

## Test the Poll Features

Once your poll is created, you can test:

### 🗳️ 1. Real-Time Voting
- Click on an option to vote
- See the vote count update in real-time
- Vote counts show in percentage

### 💬 2. Comments
- Scroll to comments section
- Type a comment and click "Post"
- See comments appear instantly

### 🔥 3. Comment Reactions
- Hover over a comment
- Click the 👍 (like) or 👎 (dislike) button
- See reaction count update

### 💳 4. Poll Boosting (V3 NEW!)
- **Look for:** "Boost Poll - KES 100" button
- **Click it:** Opens Pesapal payment
- **Pay with demo M-Pesa:** 254722111111 / PIN: 1234
- **After payment:** Poll appears in "Featured Polls" section on homepage
- **Duration:** Featured for 24 hours

---

## Testing Payment Flow (V3)

### What You Need

- ✅ Dev server running
- ✅ ngrok installed (for IPN webhook)
- ✅ Pesapal credentials in `.env.local`

### Step 1: Start ngrok Tunnel

```bash
ngrok http 3001
```

Copy the forwarding URL, e.g., `https://1234-56-78-90-123.ngrok.io`

### Step 2: Update Environment

Edit `.env.local`:

```env
NEXT_PUBLIC_URL=https://1234-56-78-90-123.ngrok.io
```

Restart dev server: `npm run dev`

### Step 3: Register IPN in Pesapal

1. Go to Pesapal Console: https://pesapal.com/developer/console
2. Select **Demo** environment
3. Go to your app > **Settings** > **IPN**
4. Click **Add IPN URL**
5. Enter: `https://1234-56-78-90-123.ngrok.io/api/pesapal/ipn`
6. Click **Register**
7. Copy the **IPN ID** and add to `.env.local`:

```env
PESAPAL_IPN_ID=your_ipn_id
```

### Step 4: Test Payment

1. Visit your poll
2. Click **"Boost Poll - KES 100"**
3. On Pesapal page, select **M-Pesa**
4. Enter:
   - **Phone:** 254722111111
   - **PIN:** 1234
5. Click **Confirm**
6. You'll see: **"Payment Successful!"**
7. Go back to home page
8. Poll appears in **"Featured Polls"** section! 🎉

### Step 5: Verify in Firestore

Go to Firebase Console > Firestore:
- In `polls` collection, find your poll
- Check fields:
  - `isBoosted: true` ✅
  - `boostedUntil: [24 hours from now]` ✅
- In `payments` collection, see your payment record ✅

---

## Sample Poll Data

### Question
**"Who is the GOAT? Ronaldo or Messi?"**

### Options
1. Cristiano Ronaldo
2. Lionel Messi

### Sample Votes (if created via web page)
- **Ronaldo:** 5 votes (62%)
- **Messi:** 3 votes (38%)

### Sample Comments (if created via web page)
1. "Ronaldo is the most complete player ever!" - John
2. "Messi is pure magic on the field" - Maria
3. "Ronaldo has more goals and trophies" - Ahmed
4. "Messi won the World Cup though!" - Sofia

---

## Troubleshooting

### Poll doesn't appear after creation?
- Refresh the page
- Check if you're signed in
- Verify Firebase credentials

### Boost button missing?
- Sign out and sign in again
- Clear browser cache
- Check if signed in with Google

### Payment fails?
- Verify Pesapal credentials in `.env.local`
- Restart dev server after env changes
- Check if ngrok URL is registered in Pesapal

### IPN not processing?
- Verify ngrok is running and URL is registered
- Check Firefox/Chrome console for errors
- Look at Next.js server logs

### "Permission denied" on payments collection?
- This is expected! Payments are server-only
- Client cannot directly access payments
- Only verified via IPN webhook

---

## Next Steps

✅ **Created sample poll?** Great!

Now you can:
1. Test voting and comments
2. Test poll boosting with Pesapal
3. Deploy to production
4. Create more polls
5. Build analytics on top

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Start ngrok tunnel (in another terminal)
ngrok http 3001

# View logs
# Check Firefox/Chrome DevTools > Console

# Reset database
# Go to Firebase Console > Firestore > Delete collections
```

---

## URLs

| Page | URL |
|------|-----|
| Home | http://localhost:3001 |
| Create Poll | http://localhost:3001/create |
| Sample Poll Creator | http://localhost:3001/admin/seed |
| Poll Detail | http://localhost:3001/poll/[pollId] |
| Profile | http://localhost:3001/profile |

---

## Support

- See `START_HERE_V3.md` for general setup
- See `V3_SETUP_GUIDE.md` for deployment
- Check Pesapal docs: https://developer.pesapal.com/

---

**Ready to test?** Visit http://localhost:3001/admin/seed 🚀
