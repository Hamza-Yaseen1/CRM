/**
 * DAY 1: Usage Examples
 * 
 * This file demonstrates how to use the types, enums, and validators
 * we created today. This is for reference only - not used in production.
 */

import { Timestamp } from 'firebase/firestore';
import { UserRole, LeadStatus, WebsiteStatus, ActivityAction } from './enums';
import { Lead, User, CreateLeadInput, UserReference } from './types';
import {
    isValidPhoneNumber,
    normalizePhoneNumber,
    isValidStatusTransition,
    validateLeadInput,
    hasPermission
} from './utils/validators';

// ============================================
// EXAMPLE 1: Creating a User Object
// ============================================

const exampleUser: User = {
    uid: 'abc123',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.MARKETER,
    createdAt: Timestamp.now()
};

// ============================================
// EXAMPLE 2: Creating a Lead Object
// ============================================

const exampleLead: Lead = {
    // Basic info
    clientName: 'ABC Corporation',
    phone: '+1234567890',
    address: '123 Main St, City, State',
    businessType: 'Retail',
    hasWebsite: WebsiteStatus.YES,
    websiteUrl: 'https://abc-corp.com',

    // Status
    status: LeadStatus.NEW,

    // Ownership
    addedBy: {
        uid: 'abc123',
        name: 'John Doe'
    },
    assignedTo: null,

    // Call tracking
    callStatus: {
        called: false,
        calledAt: null,
        calledBy: null
    },

    // Interest
    interestStatus: null,

    // Notes
    notes: [],

    // Activity log
    activityLog: [
        {
            action: ActivityAction.CREATED,
            by: 'John Doe',
            at: Timestamp.now()
        }
    ],

    // Soft delete
    deleted: false,
    deletedAt: null,
    deletedBy: null,

    // Timestamps
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
};

// ============================================
// EXAMPLE 3: Validating Phone Number
// ============================================

function examplePhoneValidation() {
    const phone = '+1 (234) 567-8900';

    if (isValidPhoneNumber(phone)) {
        const normalized = normalizePhoneNumber(phone);
        console.log('Normalized phone:', normalized); // +1234567890
    } else {
        console.log('Invalid phone number');
    }
}

// ============================================
// EXAMPLE 4: Validating Status Transition
// ============================================

function exampleStatusTransition() {
    const currentStatus = LeadStatus.NEW;
    const newStatus = LeadStatus.ASSIGNED;

    if (isValidStatusTransition(currentStatus, newStatus)) {
        console.log('Transition allowed');
    } else {
        console.log('Transition not allowed');
    }
}

// ============================================
// EXAMPLE 5: Validating Lead Input
// ============================================

function exampleLeadValidation() {
    const input: CreateLeadInput = {
        clientName: 'Test Company',
        phone: '+1234567890',
        address: '123 Test St',
        businessType: 'Technology',
        hasWebsite: WebsiteStatus.YES,
        websiteUrl: 'https://test.com'
    };

    const errors = validateLeadInput(input);

    if (errors.length === 0) {
        console.log('Lead input is valid');
    } else {
        console.log('Validation errors:', errors);
    }
}

// ============================================
// EXAMPLE 6: Checking Permissions
// ============================================

function examplePermissionCheck() {
    const userRole = UserRole.MARKETER;

    if (hasPermission(userRole, 'canAddLeads')) {
        console.log('User can add leads');
    }

    if (!hasPermission(userRole, 'canViewAllLeads')) {
        console.log('User cannot view all leads');
    }
}

// ============================================
// EXAMPLE 7: Type-Safe Lead Update
// ============================================

function exampleLeadUpdate(lead: Lead, salesUser: UserReference) {
    // TypeScript will ensure we only use valid statuses
    const updatedLead: Lead = {
        ...lead,
        status: LeadStatus.ASSIGNED,
        assignedTo: salesUser,
        activityLog: [
            ...lead.activityLog,
            {
                action: ActivityAction.ASSIGNED,
                by: 'Admin User',
                at: Timestamp.now(),
                details: salesUser.name
            }
        ],
        updatedAt: Timestamp.now()
    };

    return updatedLead;
}

// ============================================
// EXAMPLE 8: Type-Safe Call Recording
// ============================================

function exampleRecordCall(lead: Lead, salesUser: UserReference) {
    // Ensure lead hasn't been called before (CRITICAL RULE)
    if (lead.callStatus.called) {
        throw new Error('Lead has already been called');
    }

    const updatedLead: Lead = {
        ...lead,
        status: LeadStatus.CALLED,
        callStatus: {
            called: true,
            calledAt: Timestamp.now(),
            calledBy: salesUser
        },
        activityLog: [
            ...lead.activityLog,
            {
                action: ActivityAction.CALLED,
                by: salesUser.name,
                at: Timestamp.now()
            }
        ],
        updatedAt: Timestamp.now()
    };

    return updatedLead;
}

export {
    examplePhoneValidation,
    exampleStatusTransition,
    exampleLeadValidation,
    examplePermissionCheck,
    exampleLeadUpdate,
    exampleRecordCall
};
