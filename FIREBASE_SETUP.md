# 🔥 Firebase Setup Guide

## Step-by-Step Firebase Configuration

Follow these steps to set up Firebase for your CRM system.

---

## 1️⃣ Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., "crm-system")
4. Disable Google Analytics (optional)
5. Click **"Create project"**

---

## 2️⃣ Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Click on **"Email/Password"** tab
4. Enable **"Email/Password"**
5. Click **"Save"**

---

## 3️⃣ Create Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules next)
4. Choose a location (e.g., us-central1)
5. Click **"Enable"**

---

## 4️⃣ Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click the **Web icon** (`</>`)
4. Register your app (e.g., "CRM Web App")
5. Copy the configuration object

---

## 5️⃣ Create Environment Variables

Create a file named `.env.local` in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Important**: Replace the values with your actual Firebase config!

---

## 6️⃣ Deploy Firestore Security Rules

### Option A: Using Firebase CLI (Recommended)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init firestore
```
- Select your project
- Use `firestore.rules` for rules file
- Use `firestore.indexes.json` for indexes file

4. Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### Option B: Using Firebase Console

1. Go to **Firestore Database** → **Rules**
2. Copy the contents of `firestore.rules` file
3. Paste into the rules editor
4. Click **"Publish"**

---

## 7️⃣ Create Firestore Indexes

### Option A: Using Firebase CLI (Recommended)

```bash
firebase deploy --only firestore:indexes
```

### Option B: Using Firebase Console

Go to **Firestore Database** → **Indexes** → **Composite** and create these indexes:

#### Index 1: Phone Uniqueness
- **Collection ID**: `leads`
- **Fields**:
  - `phone` - Ascending
  - `deleted` - Ascending
- **Query scope**: Collection

#### Index 2: Marketer Leads
- **Collection ID**: `leads`
- **Fields**:
  - `addedBy.uid` - Ascending
  - `deleted` - Ascending
  - `createdAt` - Descending
- **Query scope**: Collection

#### Index 3: Sales Leads
- **Collection ID**: `leads`
- **Fields**:
  - `assignedTo.uid` - Ascending
  - `deleted` - Ascending
  - `status` - Ascending
- **Query scope**: Collection

#### Index 4: Admin Leads
- **Collection ID**: `leads`
- **Fields**:
  - `deleted` - Ascending
  - `status` - Ascending
  - `createdAt` - Descending
- **Query scope**: Collection

---

## 8️⃣ Create Collections

Firestore will automatically create collections when you add the first document.

### Collections Needed:
1. **users** - Stores user profiles
2. **leads** - Stores lead data

These will be created automatically when you register your first user and add your first lead.

---

## 9️⃣ Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Go to `http://localhost:3000`

3. Click **"Get Started"** or **"Register"**

4. Create a test account:
   - Name: Test Admin
   - Email: admin@test.com
   - Password: test123
   - Role: Admin

5. Check Firebase Console:
   - Go to **Authentication** → **Users** - You should see the new user
   - Go to **Firestore Database** → **Data** - You should see the `users` collection

---

## 🔟 Verify Security Rules

Test that security rules are working:

1. Try to access Firestore directly without authentication - Should fail
2. Login as Marketer - Should only see own leads
3. Login as Sales - Should only see assigned leads
4. Login as Admin - Should see all leads

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Environment variables configured in `.env.local`
- [ ] Security rules deployed
- [ ] Indexes created
- [ ] Test user created successfully
- [ ] User appears in Firebase Console
- [ ] Can login and logout
- [ ] Role-based access working

---

## 🐛 Troubleshooting

### Error: "Missing or insufficient permissions"
**Solution**: Deploy Firestore rules
```bash
firebase deploy --only firestore:rules
```

### Error: "The query requires an index"
**Solution**: Create the missing index
- Click the link in the error message, OR
- Manually create indexes as described in Step 7

### Error: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Check your `.env.local` file
- Ensure all values are correct
- Restart dev server after changing `.env.local`

### Error: "Firebase: Error (auth/network-request-failed)"
**Solution**: Check internet connection and Firebase project status

### Can't see environment variables
**Solution**: 
- File must be named `.env.local` (not `.env`)
- Restart dev server: `npm run dev`
- Variables must start with `NEXT_PUBLIC_`

---

## 📝 Important Notes

1. **Never commit `.env.local`** - It's in `.gitignore` for security
2. **Production deployment** - Set environment variables in your hosting platform
3. **Firestore costs** - Monitor usage in Firebase Console
4. **Security rules** - Always test before deploying to production
5. **Indexes** - May take a few minutes to build

---

## 🚀 Next Steps

After Firebase is set up:

1. ✅ Test user registration
2. ✅ Test user login
3. ✅ Add a test lead (as Marketer)
4. ✅ Assign lead (as Admin)
5. ✅ Call lead (as Sales)
6. ✅ Verify all features work

---

## 📞 Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Setup Time**: ~15-20 minutes  
**Difficulty**: Beginner-Friendly  
**Cost**: Free (Firebase Spark Plan)
