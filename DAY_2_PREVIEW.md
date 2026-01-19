# Firebase Setup Preview (For Day 2)

## 📋 What You'll Need for Day 2

Day 2 will focus on **Firestore Security Rules**. Here's what we'll configure:

## 🔥 Firestore Collections Structure

### Collection: `users`
```
users/
  {userId}/
    - name: string
    - email: string
    - role: "admin" | "marketer" | "sales"
    - createdAt: timestamp
```

**Index Required:** None for Day 2

### Collection: `leads`
```
leads/
  {leadId}/
    - clientName: string
    - phone: string (must be unique)
    - address: string
    - businessType: string
    - hasWebsite: "yes" | "no"
    - websiteUrl: string
    - status: string
    - addedBy: { uid, name }
    - assignedTo: { uid, name } | null
    - callStatus: { called, calledAt, calledBy }
    - interestStatus: string | null
    - notes: array
    - activityLog: array
    - deleted: boolean
    - deletedAt: timestamp | null
    - deletedBy: string | null
    - createdAt: timestamp
    - updatedAt: timestamp
```

**Indexes Required:**
1. **Phone Uniqueness Check**
   - Collection: `leads`
   - Fields: `phone` (Ascending), `deleted` (Ascending)
   - Query scope: Collection

2. **Marketer's Leads**
   - Collection: `leads`
   - Fields: `addedBy.uid` (Ascending), `deleted` (Ascending), `createdAt` (Descending)
   - Query scope: Collection

3. **Sales Assigned Leads**
   - Collection: `leads`
   - Fields: `assignedTo.uid` (Ascending), `deleted` (Ascending), `status` (Ascending)
   - Query scope: Collection

## 🔒 Security Rules Preview

On Day 2, we'll implement these rules:

### Rule 1: User Authentication
```javascript
// Only authenticated users can access
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId;
}
```

### Rule 2: Role-Based Lead Access
```javascript
match /leads/{leadId} {
  // Admin can see all leads
  allow read: if getUserRole() == 'admin';
  
  // Marketer can see only their leads
  allow read: if getUserRole() == 'marketer' 
    && resource.data.addedBy.uid == request.auth.uid;
  
  // Sales can see only assigned leads
  allow read: if getUserRole() == 'sales' 
    && resource.data.assignedTo.uid == request.auth.uid;
}
```

### Rule 3: Phone Uniqueness
```javascript
// Prevent duplicate phone numbers
allow create: if !exists(/databases/$(database)/documents/leads/$(phoneDoc))
  where phoneDoc matches phone number;
```

### Rule 4: Once Called, Never Call Again
```javascript
// Prevent changing callStatus.called from true to false
allow update: if !resource.data.callStatus.called 
  || request.resource.data.callStatus.called == true;
```

## 🎯 Firebase Console Setup Steps (Day 2)

### Step 1: Create Indexes
1. Go to Firebase Console → Firestore → Indexes
2. Click "Create Index"
3. Add the three indexes listed above

### Step 2: Update Security Rules
1. Go to Firebase Console → Firestore → Rules
2. Replace existing rules with Day 2 rules
3. Publish rules

### Step 3: Test Rules
1. Use Firebase Emulator Suite (recommended)
2. Or test in production with test accounts

## 📝 No Action Needed Today

**Day 1 is complete!** No Firebase changes are needed today.

We only created TypeScript definitions. Firebase configuration happens on Day 2.

## ✅ Day 1 Checklist

- ✅ Created all TypeScript types
- ✅ Created all enums
- ✅ Created business constants
- ✅ Created validation utilities
- ✅ Build successful (no TypeScript errors)
- ✅ Documentation complete

## 🚀 Ready for Day 2?

When ready, say: **"Continue to Day 2"**

Day 2 will cover:
- Complete Firestore security rules
- Phone uniqueness enforcement
- Role-based access control
- Status transition validation
- Testing security rules
