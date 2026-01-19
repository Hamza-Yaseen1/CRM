# DAY 1 — Quick Reference Guide

## Import Statements

```typescript
// Import enums
import { UserRole, LeadStatus, WebsiteStatus, ActivityAction } from '@/lib/enums';

// Import types
import { User, Lead, CreateLeadInput, UserReference } from '@/lib/types';

// Import constants
import { STATUS_TRANSITIONS, ROLE_PERMISSIONS, COLLECTIONS } from '@/lib/constants';

// Import validators
import { 
  isValidPhoneNumber, 
  normalizePhoneNumber,
  validateLeadInput,
  hasPermission 
} from '@/lib/utils/validators';
```

## Common Usage Patterns

### 1. Check User Permission
```typescript
import { hasPermission } from '@/lib/utils/validators';
import { UserRole } from '@/lib/enums';

const userRole = UserRole.MARKETER;

if (hasPermission(userRole, 'canAddLeads')) {
  // Allow lead creation
}
```

### 2. Validate Phone Number
```typescript
import { isValidPhoneNumber, normalizePhoneNumber } from '@/lib/utils/validators';

const phone = '+1 (234) 567-8900';

if (isValidPhoneNumber(phone)) {
  const normalized = normalizePhoneNumber(phone); // '+1234567890'
  // Save to Firestore
}
```

### 3. Validate Lead Form
```typescript
import { validateLeadInput } from '@/lib/utils/validators';
import { WebsiteStatus } from '@/lib/enums';

const formData = {
  clientName: 'ABC Corp',
  phone: '+1234567890',
  address: '123 Main St',
  businessType: 'Retail',
  hasWebsite: WebsiteStatus.YES,
  websiteUrl: 'https://abc.com'
};

const errors = validateLeadInput(formData);

if (errors.length === 0) {
  // Save lead
} else {
  // Show errors to user
  console.log(errors);
}
```

### 4. Check Status Transition
```typescript
import { isValidStatusTransition } from '@/lib/utils/validators';
import { LeadStatus } from '@/lib/enums';

const currentStatus = LeadStatus.NEW;
const newStatus = LeadStatus.ASSIGNED;

if (isValidStatusTransition(currentStatus, newStatus)) {
  // Update status
} else {
  // Show error: invalid transition
}
```

### 5. Create Type-Safe Lead Object
```typescript
import { Lead, UserReference } from '@/lib/types';
import { LeadStatus, WebsiteStatus, ActivityAction } from '@/lib/enums';
import { Timestamp } from 'firebase/firestore';

const currentUser: UserReference = {
  uid: 'user123',
  name: 'John Doe'
};

const newLead: Lead = {
  clientName: 'ABC Corp',
  phone: '+1234567890',
  address: '123 Main St',
  businessType: 'Retail',
  hasWebsite: WebsiteStatus.YES,
  websiteUrl: 'https://abc.com',
  
  status: LeadStatus.NEW,
  
  addedBy: currentUser,
  assignedTo: null,
  
  callStatus: {
    called: false,
    calledAt: null,
    calledBy: null
  },
  
  interestStatus: null,
  notes: [],
  activityLog: [
    {
      action: ActivityAction.CREATED,
      by: currentUser.name,
      at: Timestamp.now()
    }
  ],
  
  deleted: false,
  deletedAt: null,
  deletedBy: null,
  
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
};
```

## Business Rules Reference

### Status Flow
```
NEW → ASSIGNED → CALLED → INTERESTED → CLOSED
                    ↓
              NOT_INTERESTED
                    ↓
                 DELETED
```

### Role Capabilities Matrix

| Action | Admin | Marketer | Sales |
|--------|-------|----------|-------|
| View All Leads | ✅ | ❌ | ❌ |
| View Own Leads | ✅ | ✅ | ✅ |
| Add Leads | ✅ | ✅ | ❌ |
| Assign Leads | ✅ | ❌ | ❌ |
| Call Leads | ❌ | ❌ | ✅ |
| Delete Leads | ✅ | ❌ | ❌ |
| Restore Leads | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ❌ | ❌ |

### Critical Rules

1. **Phone Uniqueness**: Each phone number can only exist once
2. **One Call Only**: Once `callStatus.called = true`, lead can NEVER be called again
3. **No Hard Delete**: Use `deleted: true` instead
4. **Audit Everything**: Every action must create an activity log entry
5. **Status Transitions**: Only allowed transitions can be made

## File Structure

```
my-app/
├── lib/
│   ├── enums/
│   │   └── index.ts          ← All enums
│   ├── types/
│   │   └── index.ts          ← All TypeScript types
│   ├── constants/
│   │   └── index.ts          ← Business rules
│   └── utils/
│       └── validators.ts      ← Validation functions
```

## Next: Day 2

Day 2 will implement:
- Firestore security rules based on these types
- Role-based access control
- Phone uniqueness enforcement
- Duplicate prevention
