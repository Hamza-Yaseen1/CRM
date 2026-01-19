# 🚀 Production-Grade CRM System

A complete, production-ready CRM system built with Next.js, TypeScript, and Firebase.

## ✨ Features

- **Role-Based Access Control**: Admin, Marketer, and Sales roles
- **Lead Management**: Complete lead lifecycle tracking
- **Duplicate Detection**: Automatic phone number duplicate checking
- **Call Tracking**: One-call-per-lead rule enforcement
- **Soft Delete**: Never lose data with soft delete and restore
- **Activity Logging**: Complete audit trail for compliance
- **Real-time Updates**: Powered by Firebase Firestore
- **Type-Safe**: Built with TypeScript for reliability
- **Beautiful UI**: Gradient designs with Framer Motion animations

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## 📦 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Firebase

Follow the detailed guide in [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md)

Quick steps:
1. Create Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Copy config to `.env.local`
5. Deploy security rules
6. Create indexes

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## 👥 User Roles

### Admin
- View all leads
- Assign leads to sales team
- Delete and restore leads
- View analytics

### Marketer
- Add new leads
- View own leads
- Track lead status
- Duplicate phone detection

### Sales
- View assigned leads
- Mark leads as called
- Update interest status
- Add call notes
- Close deals

## 📚 Documentation

- **[Implementation Guide](./IMPLEMENTATION_COMPLETE.md)** - Complete feature overview
- **[Firebase Setup](./FIREBASE_SETUP.md)** - Step-by-step Firebase configuration
- **[Quick Reference](./DAY_1_QUICK_REFERENCE.md)** - Code examples and patterns
- **[Architecture Diagrams](./DAY_1_DIAGRAMS.md)** - Visual system architecture
- **[Progress Tracker](./PROGRESS.md)** - Development timeline

## 🔒 Security

- Firestore security rules enforce role-based access
- Phone number uniqueness at database level
- Input validation and sanitization
- Type-safe operations throughout
- Complete audit trail

## 🎯 Business Rules

1. **Phone Uniqueness**: Each phone number can only exist once
2. **One Call Rule**: Leads can only be called once
3. **Soft Delete**: No hard deletes, only soft delete
4. **Status Transitions**: Only valid transitions allowed
5. **Role Permissions**: Enforced at database level
6. **Audit Trail**: Every action is logged

## 📊 Lead Lifecycle

```
NEW → ASSIGNED → CALLED → INTERESTED → CLOSED
                    ↓
              NOT_INTERESTED
                    ↓
                 DELETED
```

## 🗂️ Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── marketer/          # Marketer pages
│   ├── sales/             # Sales dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── dashboard/         # Unified dashboard
│
├── lib/                    # Shared library
│   ├── enums/             # Enum definitions
│   ├── types/             # TypeScript types
│   ├── constants/         # Business rules
│   ├── utils/             # Utilities
│   ├── services/          # Firestore operations
│   ├── firebase.ts        # Firebase config
│   └── auth-context.tsx   # Auth provider
│
├── firestore.rules         # Security rules
├── firestore.indexes.json  # Database indexes
└── .env.local             # Environment variables
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

Works with any Next.js hosting:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted

## 🔧 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📝 Usage

### For Marketers
1. Register as Marketer
2. Add leads with client details
3. System checks for duplicate phones
4. Track lead status updates

### For Sales
1. Register as Sales
2. View assigned leads
3. Call leads (once only!)
4. Mark interest and add notes
5. Close deals

### For Admins
1. Register as Admin
2. View all leads
3. Assign leads to sales team
4. Manage deleted leads
5. View analytics

## 🎨 Customization

### Add New Status
1. Update `lib/enums/index.ts`
2. Update `lib/constants/index.ts`
3. Update `firestore.rules`
4. Update UI components

### Add New Role
1. Update `lib/enums/index.ts`
2. Update `lib/constants/index.ts`
3. Update `firestore.rules`
4. Create role dashboard

## 🐛 Troubleshooting

See [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) for common issues and solutions.

## 📄 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## ⭐ Show Your Support

If you find this helpful, please give it a star!

---

**Built with ❤️ using Next.js, TypeScript, and Firebase**

**Status**: ✅ Production Ready  
**Last Updated**: 2026-01-19
