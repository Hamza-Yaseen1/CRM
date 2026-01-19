# 📚 Library Documentation

This folder contains all shared utilities, types, and constants used throughout the CRM application.

## 📁 Folder Structure

```
lib/
├── enums/
│   └── index.ts          # All enum definitions
├── types/
│   └── index.ts          # TypeScript interfaces and types
├── constants/
│   └── index.ts          # Business rules and constants
└── utils/
    └── validators.ts      # Validation helper functions
```

## 🎯 Purpose

The `lib` folder serves as the **single source of truth** for:
- Data structure definitions
- Business logic rules
- Validation functions
- Type safety across the application

## 📖 Usage

### Import Enums
```typescript
import { UserRole, LeadStatus, ActivityAction } from '@/lib/enums';
```

### Import Types
```typescript
import { User, Lead, CreateLeadInput } from '@/lib/types';
```

### Import Constants
```typescript
import { STATUS_TRANSITIONS, ROLE_PERMISSIONS } from '@/lib/constants';
```

### Import Validators
```typescript
import { isValidPhoneNumber, validateLeadInput } from '@/lib/utils/validators';
```

## 🔍 What's Inside

### 1. Enums (`enums/index.ts`)
Defines all possible values for categorical data:
- `UserRole` - admin, marketer, sales
- `LeadStatus` - new, assigned, called, etc.
- `InterestStatus` - interested, not_interested
- `WebsiteStatus` - yes, no
- `ActivityAction` - created, assigned, called, etc.

**Why?** Prevents typos and provides type safety.

### 2. Types (`types/index.ts`)
Defines the exact structure of all data:
- `User` - User document in Firestore
- `Lead` - Lead document in Firestore
- `UserReference` - Embedded user info
- `CallStatus` - Call tracking structure
- `Note` - Note structure
- `ActivityLogEntry` - Audit log entry
- Form input types
- Analytics types

**Why?** TypeScript knows exactly what shape your data should be.

### 3. Constants (`constants/index.ts`)
Defines business rules:
- `STATUS_TRANSITIONS` - Which status can change to which
- `ROLE_PERMISSIONS` - What each role can do
- `PHONE_REGEX` - Phone number validation pattern
- `COLLECTIONS` - Firestore collection names
- `ACTIVITY_MESSAGES` - Audit log templates

**Why?** Business rules in one place, easy to update.

### 4. Validators (`utils/validators.ts`)
Helper functions for validation:
- `isValidPhoneNumber()` - Check phone format
- `normalizePhoneNumber()` - Standardize phone
- `isValidStatusTransition()` - Check if transition allowed
- `validateLeadInput()` - Validate complete form
- `hasPermission()` - Check role permissions
- And more...

**Why?** Validate data before saving to Firestore.

## 🎨 Design Principles

### 1. Single Source of Truth
All definitions in one place. Change once, update everywhere.

### 2. Type Safety
TypeScript catches errors at compile time, not runtime.

### 3. Reusability
Import and use anywhere in the application.

### 4. Maintainability
Easy to find and update business rules.

### 5. Documentation
Code serves as documentation.

## 🚀 Best Practices

### ✅ DO:
- Import from `@/lib/*` in all components
- Use enums instead of string literals
- Validate data before Firestore operations
- Check permissions before UI actions

### ❌ DON'T:
- Hard-code status strings like `"assigned"`
- Skip validation
- Duplicate business logic
- Ignore TypeScript errors

## 📝 Examples

See `lib/examples.ts` for detailed usage patterns.

## 🔄 Updates

When adding new features:
1. Add enum values if needed
2. Update types to match Firestore structure
3. Add validation functions
4. Update constants if business rules change

## 🎓 Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Type Guards in TypeScript](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## 📞 Questions?

Review:
- `DAY_1_QUICK_REFERENCE.md` for code examples
- `DAY_1_DIAGRAMS.md` for visual explanations
- `lib/examples.ts` for detailed patterns
