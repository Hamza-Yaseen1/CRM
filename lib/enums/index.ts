/**
 * DAY 1: Enums Definition
 * 
 * This file contains all enum definitions used throughout the CRM.
 * Enums ensure type safety and prevent typos in status/role names.
 */

// User roles in the system
export enum UserRole {
    ADMIN = 'admin',
    MARKETER = 'marketer',
    SALES = 'sales'
}

// Lead lifecycle statuses
export enum LeadStatus {
    NEW = 'new',                      // Just added by marketer
    ASSIGNED = 'assigned',            // Assigned to sales by admin
    CALLED = 'called',                // Sales has called the lead
    INTERESTED = 'interested',        // Lead showed interest
    NOT_INTERESTED = 'not_interested', // Lead not interested
    CLOSED = 'closed',                // Deal closed successfully
    DELETED = 'deleted'               // Soft deleted by admin
}

// Interest status for leads
export enum InterestStatus {
    INTERESTED = 'interested',
    NOT_INTERESTED = 'not_interested'
}

// Website availability
export enum WebsiteStatus {
    YES = 'yes',
    NO = 'no'
}

// Activity log action types
export enum ActivityAction {
    CREATED = 'created',
    ASSIGNED = 'assigned',
    CALLED = 'called',
    STATUS_CHANGED = 'status_changed',
    NOTE_ADDED = 'note_added',
    DELETED = 'deleted',
    RESTORED = 'restored'
}
