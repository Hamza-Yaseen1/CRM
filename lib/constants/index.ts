/**
 * DAY 1: Business Constants
 * 
 * This file contains all business rules and constants.
 * These define what transitions are allowed and role permissions.
 */

import { UserRole, LeadStatus, ActivityAction } from '../enums';

// Status transition rules: which status can transition to which
export const STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
    [LeadStatus.NEW]: [LeadStatus.ASSIGNED, LeadStatus.DELETED],
    [LeadStatus.ASSIGNED]: [LeadStatus.CALLED, LeadStatus.DELETED],
    [LeadStatus.CALLED]: [LeadStatus.INTERESTED, LeadStatus.NOT_INTERESTED, LeadStatus.DELETED],
    [LeadStatus.INTERESTED]: [LeadStatus.CLOSED, LeadStatus.NOT_INTERESTED, LeadStatus.DELETED],
    [LeadStatus.NOT_INTERESTED]: [LeadStatus.DELETED],
    [LeadStatus.CLOSED]: [LeadStatus.DELETED],
    [LeadStatus.DELETED]: [] // Deleted leads cannot transition (but can be restored by admin)
};

// Role-based permissions for actions
export const ROLE_PERMISSIONS = {
    [UserRole.ADMIN]: {
        canViewAllLeads: true,
        canAssignLeads: true,
        canDeleteLeads: true,
        canRestoreLeads: true,
        canViewAnalytics: true,
        canAddLeads: true,
        canCallLeads: false,
        canEditOwnLeadsOnly: false
    },
    [UserRole.MARKETER]: {
        canViewAllLeads: false,
        canAssignLeads: false,
        canDeleteLeads: false,
        canRestoreLeads: false,
        canViewAnalytics: false,
        canAddLeads: true,
        canCallLeads: false,
        canEditOwnLeadsOnly: true
    },
    [UserRole.SALES]: {
        canViewAllLeads: false,
        canAssignLeads: false,
        canDeleteLeads: false,
        canRestoreLeads: false,
        canViewAnalytics: false,
        canAddLeads: false,
        canCallLeads: true,
        canEditOwnLeadsOnly: true
    }
};

// Statuses that indicate a lead has been worked on by sales
export const SALES_ACTIVE_STATUSES: LeadStatus[] = [
    LeadStatus.ASSIGNED,
    LeadStatus.CALLED,
    LeadStatus.INTERESTED,
    LeadStatus.NOT_INTERESTED,
    LeadStatus.CLOSED
];

// Statuses where marketer can still edit
export const MARKETER_EDITABLE_STATUSES: LeadStatus[] = [
    LeadStatus.NEW
];

// Phone number validation regex (basic international format)
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

// Collection names in Firestore
export const COLLECTIONS = {
    USERS: 'users',
    LEADS: 'leads'
} as const;

// Activity messages for audit log
export const ACTIVITY_MESSAGES: Record<ActivityAction, (details?: string) => string> = {
    [ActivityAction.CREATED]: () => 'Lead created',
    [ActivityAction.ASSIGNED]: (details) => `Assigned to ${details}`,
    [ActivityAction.CALLED]: () => 'Lead called',
    [ActivityAction.STATUS_CHANGED]: (details) => `Status changed to ${details}`,
    [ActivityAction.NOTE_ADDED]: () => 'Note added',
    [ActivityAction.DELETED]: () => 'Lead deleted',
    [ActivityAction.RESTORED]: () => 'Lead restored'
};

// Maximum allowed notes per lead
export const MAX_NOTES_PER_LEAD = 100;

// Maximum allowed activity log entries per lead
export const MAX_ACTIVITY_LOG_ENTRIES = 200;
