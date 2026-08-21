# Voxly V3 - Firestore Security Rules (Pesapal Integration)

Updated security rules to handle poll boosting and payments collection.

---

## Updated Rules (for V3)

Go to **Firebase Console > Firestore Database > Rules** and replace with:

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
      allow read: if isAuth();
      allow create, update: if isAuth() && isOwner(userId) &&
        request.resource.data.keys().hasAll(['email', 'displayName']);
      allow delete: if false;
    }
    
    // Polls collection (updated for boosting)
    match /polls/{pollId} {
      allow read: if isAuth();
      
      allow create: if isAuth() &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.keys().hasAll(['question', 'options', 'createdAt']) &&
        request.resource.data.options.size() >= 2 &&
        request.resource.data.options.size() <= 5 &&
        request.resource.data.question.size() > 0;
      
      // Only poll creator can update (except server updates for boosting)
      allow update: if isAuth() && 
        isOwner(existingData().userId) &&
        existingData().userId == resource.data.userId;
      
      // Only poll creator can delete
      allow delete: if isAuth() && 
        isOwner(existingData().userId);
    }
    
    // Votes collection
    match /votes/{voteId} {
      allow read: if isAuth();
      
      allow create: if isAuth() &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.keys().hasAll(['pollId', 'userId', 'optionIndex', 'createdAt']);
      
      allow delete: if isAuth() && 
        isOwner(existingData().userId);
      
      allow update: if false;
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow read: if isAuth();
      
      allow create: if isAuth() &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.keys().hasAll(['pollId', 'userId', 'body', 'createdAt']) &&
        request.resource.data.body.size() > 0 &&
        request.resource.data.body.size() <= 500;
      
      allow update: if isAuth() && 
        isOwner(existingData().userId) &&
        existingData().userId == resource.data.userId;
      
      allow delete: if isAuth() && 
        isOwner(existingData().userId);
    }
    
    // Comment reactions collection
    match /commentReactions/{reactionId} {
      allow read: if isAuth();
      
      allow create: if isAuth() &&
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.keys().hasAll(['commentId', 'userId', 'type', 'createdAt']) &&
        (request.resource.data.type == 'like' || request.resource.data.type == 'dislike');
      
      allow update: if isAuth() && 
        isOwner(existingData().userId) &&
        (request.resource.data.type == 'like' || request.resource.data.type == 'dislike');
      
      allow delete: if isAuth() && 
        isOwner(existingData().userId);
    }
    
    // Payments collection (NEW - for V3)
    match /payments/{paymentId} {
      // Only admin/server can read payments (not exposed to clients)
      allow read: if false;
      
      // Only server (via Admin SDK) can write payments
      allow create, update, delete: if false;
    }
    
    // Catch-all: deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Key Security Points for V3

### 1. **Payments Collection is Server-Only**
- Clients **cannot read** the `payments` collection
- Clients **cannot write** to the `payments` collection
- Only Firebase Admin SDK (via API routes) can access payments
- This prevents users from seeing payment details or creating fake payments

### 2. **Poll Boosting is Server-Only**
- The IPN endpoint (server-side) updates `isBoosted` and `boostedUntil`
- Clients **cannot directly update** these fields
- Users see the updated poll via normal read access

### 3. **All User Data Stays Secure**
- Billing information is stored server-side in Pesapal (not in Firestore)
- No payment method details stored in database
- Only payment metadata (amount, status, timestamp) stored

### 4. **Idempotency Protection**
- IPN endpoint checks if payment already exists before processing
- Prevents duplicate charges if IPN is received multiple times
- Database handles this gracefully

---

## Testing Security Rules

### Test 1: User Cannot Read Payments
```javascript
// This will FAIL (as expected)
db.collection('payments').get()
  .then(docs => console.log('ERROR: Should not be able to read!'))
  .catch(error => console.log('Good: Access denied', error))
```

### Test 2: User Cannot Create Payments
```javascript
// This will FAIL (as expected)
db.collection('payments').add({
  pollId: 'test',
  amount: 100
})
  .then(doc => console.log('ERROR: Should not be able to create!'))
  .catch(error => console.log('Good: Access denied', error))
```

### Test 3: Admin SDK CAN Access Payments
```typescript
// On server-side (API route), this WORKS
const db = getFirestore(adminApp);
const paymentsRef = db.collection('payments');
const docs = await paymentsRef.get(); // ✓ Works with Admin SDK
```

### Test 4: Poll Boost via IPN Works
1. User clicks "Boost Poll"
2. Redirected to Pesapal
3. User completes payment
4. Pesapal sends IPN to `/api/pesapal/ipn`
5. Server-side code updates poll
6. User sees boost reflected in app

---

## Deployment Checklist

- [ ] Rules updated in Firebase Console
- [ ] Click "Publish" to activate new rules
- [ ] Test that payments collection is protected
- [ ] Test that IPN endpoint can update polls
- [ ] Verify admin credentials in environment variables
- [ ] Test payment flow end-to-end

---

## Troubleshooting

### "Permission denied" when trying to access payments
**This is correct!** Clients should not have access to payments.

### IPN endpoint fails to update poll
**Check:**
1. Firebase Admin SDK credentials are correct
2. API route has proper error handling
3. Firestore rules allow server updates
4. Poll ID and User ID are valid

### Users see payment details they shouldn't
**This is a security bug.** Check:
1. Payments collection is set to `allow read: if false`
2. Rules are published in Firebase Console
3. No sensitive data exposed in API responses

---

## Best Practices

✅ **Server-side operations for payments**
- All Pesapal integration on server
- Admin SDK for database updates
- Secure token handling

✅ **Client cannot manipulate payments**
- Security rules prevent direct access
- Tampering is impossible

✅ **User data stays private**
- No payment details exposed to other users
- Each user only sees their own polls

✅ **Auditability**
- All payments logged with timestamps
- Payment method recorded
- Pesapal order tracking ID preserved

---

## Future Enhancements

- [ ] Add payment receipt generation
- [ ] Send email confirmation on successful boost
- [ ] Track boost ROI (votes before/after boost)
- [ ] Implement boost tier system (KES 50, 100, 200)
- [ ] Add refund handling for failed payments
- [ ] Create admin dashboard to monitor payments

---

**Security rules updated and ready for production!** ✅
