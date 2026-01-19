# Data Flow & Architecture Diagram

## Lead Lifecycle Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         LEAD LIFECYCLE                          │
└─────────────────────────────────────────────────────────────────┘

    MARKETER                 ADMIN                    SALES
       │                       │                        │
       │ 1. Add Lead          │                        │
       ├──────────────────────▶                        │
       │                       │                        │
       │                  [NEW LEAD]                    │
       │                  status: new                   │
       │                  addedBy: marketer             │
       │                  assignedTo: null              │
       │                       │                        │
       │                       │ 2. Assign to Sales     │
       │                       ├────────────────────────▶
       │                       │                        │
       │                 [ASSIGNED LEAD]                │
       │                 status: assigned               │
       │                 assignedTo: sales              │
       │                       │                        │
       │                       │                   3. Call Lead
       │                       │                        │
       │                       │                  [CALLED LEAD]
       │                       │                  status: called
       │                       │                  callStatus.called: true
       │                       │                        │
       │                       │              4. Mark Interest
       │                       │                        │
       │                       │              ┌─────────┴─────────┐
       │                       │              │                   │
       │                       │        [INTERESTED]      [NOT_INTERESTED]
       │                       │              │                   │
       │                       │         5. Close Deal            │
       │                       │              │                   │
       │                       │          [CLOSED]                │
       │                       │                                  │
       │                  6. Soft Delete (any status)             │
       │                       │                                  │
       │                   [DELETED]                              │
       │                   deleted: true                          │
       │                   deletedAt: timestamp                   │
       │                       │                                  │
       │                  7. Restore                              │
       │                       │                                  │
       │                  [RESTORED]                              │
       │                  deleted: false                          │
       │                                                          │
```

## Data Model Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        FIRESTORE STRUCTURE                      │
└─────────────────────────────────────────────────────────────────┘

users (collection)
├── {userId}
│   ├── name: string
│   ├── email: string
│   ├── role: "admin" | "marketer" | "sales"
│   └── createdAt: Timestamp

leads (collection)
├── {leadId}
│   ├── Basic Info
│   │   ├── clientName: string
│   │   ├── phone: string (UNIQUE)
│   │   ├── address: string
│   │   ├── businessType: string
│   │   ├── hasWebsite: "yes" | "no"
│   │   └── websiteUrl: string
│   │
│   ├── Status Management
│   │   └── status: LeadStatus
│   │
│   ├── Ownership
│   │   ├── addedBy: { uid, name }
│   │   └── assignedTo: { uid, name } | null
│   │
│   ├── Call Tracking (CRITICAL)
│   │   └── callStatus
│   │       ├── called: boolean
│   │       ├── calledAt: Timestamp | null
│   │       └── calledBy: { uid, name } | null
│   │
│   ├── Interest
│   │   └── interestStatus: "interested" | "not_interested" | null
│   │
│   ├── Notes
│   │   └── notes: [
│   │       ├── text: string
│   │       ├── addedBy: string
│   │       └── createdAt: Timestamp
│   │   ]
│   │
│   ├── Audit Trail
│   │   └── activityLog: [
│   │       ├── action: ActivityAction
│   │       ├── by: string
│   │       ├── at: Timestamp
│   │       └── details?: string
│   │   ]
│   │
│   ├── Soft Delete
│   │   ├── deleted: boolean
│   │   ├── deletedAt: Timestamp | null
│   │   └── deletedBy: string | null
│   │
│   └── Timestamps
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
```

## Role-Based Access Control

```
┌─────────────────────────────────────────────────────────────────┐
│                      ROLE PERMISSIONS MATRIX                    │
└─────────────────────────────────────────────────────────────────┘

                        ADMIN    MARKETER    SALES
                        ─────    ────────    ─────
View All Leads           ✅        ❌         ❌
View Own Leads           ✅        ✅         ✅
Add New Leads            ✅        ✅         ❌
Assign Leads             ✅        ❌         ❌
Call Leads               ❌        ❌         ✅
Mark Interest            ❌        ❌         ✅
Add Notes                ✅        ✅         ✅
Delete Leads             ✅        ❌         ❌
Restore Leads            ✅        ❌         ❌
View Analytics           ✅        ❌         ❌
Edit After Sales Start   ✅        ❌         ❌
```

## Status Transition Rules

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALLOWED STATUS TRANSITIONS                   │
└─────────────────────────────────────────────────────────────────┘

NEW
 ├─▶ ASSIGNED
 └─▶ DELETED

ASSIGNED
 ├─▶ CALLED
 └─▶ DELETED

CALLED
 ├─▶ INTERESTED
 ├─▶ NOT_INTERESTED
 └─▶ DELETED

INTERESTED
 ├─▶ CLOSED
 ├─▶ NOT_INTERESTED
 └─▶ DELETED

NOT_INTERESTED
 └─▶ DELETED

CLOSED
 └─▶ DELETED

DELETED
 └─▶ (Can be restored by admin, not a status transition)
```

## Data Validation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      VALIDATION PIPELINE                        │
└─────────────────────────────────────────────────────────────────┘

User Input
    │
    ▼
┌─────────────────────┐
│ Client-Side         │
│ Validation          │
│ (validators.ts)     │
└─────────────────────┘
    │
    ├─▶ Phone Format ✓
    ├─▶ Required Fields ✓
    ├─▶ URL Format ✓
    └─▶ Business Rules ✓
    │
    ▼
┌─────────────────────┐
│ Firestore Rules     │
│ (Day 2)             │
└─────────────────────┘
    │
    ├─▶ Role Permissions ✓
    ├─▶ Phone Uniqueness ✓
    ├─▶ Status Transitions ✓
    └─▶ Ownership ✓
    │
    ▼
┌─────────────────────┐
│ Save to Firestore   │
└─────────────────────┘
```

## Activity Log Example

```
Lead: ABC Corporation
Phone: +1234567890

Activity Log:
┌────────────────────────────────────────────────────────────┐
│ 2024-01-19 10:00 AM │ created        │ by John (Marketer) │
├────────────────────────────────────────────────────────────┤
│ 2024-01-19 11:30 AM │ assigned       │ by Admin to Sarah  │
├────────────────────────────────────────────────────────────┤
│ 2024-01-19 02:15 PM │ called         │ by Sarah (Sales)   │
├────────────────────────────────────────────────────────────┤
│ 2024-01-19 02:20 PM │ status_changed │ to interested      │
├────────────────────────────────────────────────────────────┤
│ 2024-01-19 02:25 PM │ note_added     │ "Follow up Monday" │
├────────────────────────────────────────────────────────────┤
│ 2024-01-20 09:00 AM │ status_changed │ to closed          │
└────────────────────────────────────────────────────────────┘
```
