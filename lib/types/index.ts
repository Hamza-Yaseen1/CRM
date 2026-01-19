/**
 * DAY 1: TypeScript Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the CRM.
 * These match exactly with our Firestore data structure.
 */

import { Timestamp } from 'firebase/firestore';
import { UserRole, LeadStatus, InterestStatus, WebsiteStatus, ActivityAction } from '../enums';

// Re-export enums for easier importing
export { UserRole, LeadStatus, InterestStatus, WebsiteStatus, ActivityAction };

// User who added or was assigned to a lead
export interface UserReference {
    uid: string;
    name: string;
}

// Call status tracking
export interface CallStatus {
    called: boolean;
    calledAt: Timestamp | null;
    calledBy: UserReference | null;
}

// Note added to a lead
export interface Note {
    text: string;
    addedBy: string;  // User name
    createdAt: Timestamp;
}

// Activity log entry for audit trail
export interface ActivityLogEntry {
    action: ActivityAction;
    by: string;  // User name
    at: Timestamp;
    details?: string;  // Optional additional context
}

// User document in Firestore
export interface User {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Timestamp;
}

// Lead document in Firestore
export interface Lead {
    // Basic Information
    id?: string;  // Document ID (optional, set by Firestore)
    clientName: string;
    phone: string;  // Must be unique globally
    address: string;
    businessType: string;
    hasWebsite: WebsiteStatus;
    websiteUrl: string;

    // Status Management
    status: LeadStatus;

    // Ownership Tracking
    addedBy: UserReference;
    assignedTo: UserReference | null;

    // Call Tracking (CRITICAL: Once called, never call again)
    callStatus: CallStatus;

    // Interest Tracking
    interestStatus: InterestStatus | null;

    // Notes and Communication
    notes: Note[];

    // Audit Trail
    activityLog: ActivityLogEntry[];

    // Soft Delete
    deleted: boolean;
    deletedAt: Timestamp | null;
    deletedBy: string | null;  // User name

    // Timestamps
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Form data for creating a new lead (before Firestore conversion)
export interface CreateLeadInput {
    clientName: string;
    phone: string;
    address: string;
    businessType: string;
    hasWebsite: WebsiteStatus;
    websiteUrl: string;
}

// Form data for updating lead status
export interface UpdateLeadStatusInput {
    leadId: string;
    newStatus: LeadStatus;
    note?: string;
}

// Form data for assigning a lead
export interface AssignLeadInput {
    leadId: string;
    salesUserId: string;
    salesUserName: string;
}

// Analytics data structure
export interface LeadAnalytics {
    total: number;
    byStatus: Record<LeadStatus, number>;
    byMarketer: Record<string, number>;
    bySales: Record<string, number>;
    conversionRate: number;
}
