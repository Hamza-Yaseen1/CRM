# ⚡ QUICK START GUIDE

Get your CRM system running in 5 minutes!

---

## 🎯 Prerequisites

- Node.js 18+ installed
- Firebase account (free)
- Code editor (VS Code recommended)

---

## 🚀 5-MINUTE SETUP

### Step 1: Install Dependencies (1 minute)

```bash
npm install
```

✅ All dependencies are already in `package.json`

---

### Step 2: Create Firebase Project (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "crm-system"
4. Click "Create project"

---

### Step 3: Enable Firebase Services (1 minute)

**Enable Authentication:**
1. Go to Build → Authentication
2. Click "Get started"
3. Enable "Email/Password"
4. Click "Save"

**Create Firestore:**
1. Go to Build → Firestore Database
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location
5. Click "Enable"

---

### Step 4: Get Firebase Config (30 seconds)

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click Web icon (`</>`)
4. Copy the config object

---

### Step 5: Create Environment File (30 seconds)

Create `.env.local` in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Replace with your actual values!**

---

### Step 6: Deploy Firestore Rules (30 seconds)

**Option A: Using Firebase CLI (Recommended)**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

**Option B: Manual (Easier for beginners)**

1. Go to Firestore → Rules
2. Copy contents from `firestore.rules`
3. Paste and publish

---

### Step 7: Run the App! (10 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ VERIFICATION

### Test Registration
1. Click "Get Started"
2. Fill in:
   - Name: Test Admin
   - Email: admin@test.com
   - Password: test123
   - Role: Admin
3. Click "Create Account"

### Check Firebase
1. Go to Firebase Console
2. Authentication → Users
3. You should see your new user!

---

## 🎉 YOU'RE DONE!

Your CRM is now running!

### Next Steps:

1. **Create test users:**
   - 1 Admin
   - 1 Marketer  
   - 1 Sales

2. **Test workflows:**
   - Marketer: Add a lead
   - Admin: Assign lead to sales
   - Sales: Call lead and mark interest

3. **Explore features:**
   - Duplicate phone detection
   - Soft delete & restore
   - Activity logs
   - Analytics

---

## 🐛 Troubleshooting

### "Missing or insufficient permissions"
**Fix**: Deploy Firestore rules (Step 6)

### "Firebase: Error (auth/invalid-api-key)"
**Fix**: Check `.env.local` file has correct values

### "The query requires an index"
**Fix**: Deploy indexes or click the link in error message

### Environment variables not working
**Fix**: 
- Restart dev server
- File must be named `.env.local`
- Variables must start with `NEXT_PUBLIC_`

---

## 📚 Full Documentation

For detailed guides, see:
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Complete Firebase setup
- **[README.md](./README.md)** - Full documentation
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - All features

---

## 🎯 Test Scenarios

### Scenario 1: Marketer Workflow
```
1. Login as Marketer
2. Click "Add New Lead"
3. Fill in client details
4. Try duplicate phone → Should show error
5. Submit with unique phone → Success!
6. View in "My Leads"
```

### Scenario 2: Admin Workflow
```
1. Login as Admin
2. Go to Admin Dashboard
3. See all leads
4. Click "Assign" on a new lead
5. Select sales person
6. Lead status changes to "Assigned"
```

### Scenario 3: Sales Workflow
```
1. Login as Sales
2. See assigned leads
3. Click "Mark as Called"
4. Try to call again → Should be disabled
5. Click "Mark Interested"
6. Add a note
7. Click "Close Deal"
```

---

## ⚡ Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Deploy Firebase rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

---

## 🎨 Default Credentials (After Registration)

Create these test accounts:

```
Admin:
Email: admin@test.com
Password: admin123
Role: Admin

Marketer:
Email: marketer@test.com
Password: marketer123
Role: Marketer

Sales:
Email: sales@test.com
Password: sales123
Role: Sales
```

---

## 🚀 Production Deployment

### Vercel (Easiest)
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Netlify
1. Push to GitHub
2. Import in Netlify
3. Add environment variables
4. Deploy!

---

## 📞 Need Help?

1. Check [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
2. Review error messages carefully
3. Check Firebase Console for issues
4. Ensure all environment variables are set

---

## ✨ Features to Try

- ✅ Duplicate phone detection
- ✅ Real-time updates
- ✅ Role-based dashboards
- ✅ Soft delete & restore
- ✅ Activity logging
- ✅ Beautiful animations
- ✅ Toast notifications

---

**Setup Time**: 5 minutes  
**Difficulty**: Beginner-friendly  
**Cost**: Free (Firebase Spark plan)

🎉 **ENJOY YOUR CRM!** 🎉
