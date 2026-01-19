/**
 * DAY 1: Validation Utilities
 * 
 * This file contains helper functions for validating data.
 * These ensure data integrity before saving to Firestore.
 */

import { LeadStatus, UserRole, WebsiteStatus } from '../enums';
import { STATUS_TRANSITIONS, PHONE_REGEX, ROLE_PERMISSIONS } from '../constants';

/**
 * Validate phone number format
 * Returns true if phone number is valid
 */
export function isValidPhoneNumber(phone: string): boolean {
    if (!phone || phone.trim().length === 0) {
        return false;
    }
    return PHONE_REGEX.test(phone.trim());
}

/**
 * Normalize phone number (remove spaces, dashes, etc.)
 * This ensures consistent storage format
 */
export function normalizePhoneNumber(phone: string): string {
    return phone.replace(/[\s\-\(\)\.]/g, '');
}

/**
 * Check if a status transition is allowed
 * Example: NEW -> ASSIGNED is allowed, but CLOSED -> NEW is not
 */
export function isValidStatusTransition(
    currentStatus: LeadStatus,
    newStatus: LeadStatus
): boolean {
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus];
    return allowedTransitions.includes(newStatus);
}

/**
 * Check if user role is valid
 */
export function isValidUserRole(role: string): role is UserRole {
    return Object.values(UserRole).includes(role as UserRole);
}

/**
 * Check if lead status is valid
 */
export function isValidLeadStatus(status: string): status is LeadStatus {
    return Object.values(LeadStatus).includes(status as LeadStatus);
}

/**
 * Check if website status is valid
 */
export function isValidWebsiteStatus(status: string): status is WebsiteStatus {
    return Object.values(WebsiteStatus).includes(status as WebsiteStatus);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    if (!url || url.trim().length === 0) {
        return true; // Empty URL is valid if hasWebsite is 'no'
    }

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if user has permission to perform an action
 */
export function hasPermission(
    userRole: UserRole,
    permission: keyof typeof ROLE_PERMISSIONS[UserRole]
): boolean {
    return ROLE_PERMISSIONS[userRole][permission];
}

/**
 * Validate lead creation input
 * Returns array of error messages (empty if valid)
 */
export function validateLeadInput(input: {
    clientName: string;
    phone: string;
    address: string;
    businessType: string;
    hasWebsite: string;
    websiteUrl: string;
}): string[] {
    const errors: string[] = [];

    // Client name validation
    if (!input.clientName || input.clientName.trim().length === 0) {
        errors.push('Client name is required');
    }

    // Phone validation
    if (!isValidPhoneNumber(input.phone)) {
        errors.push('Invalid phone number format');
    }

    // Address validation
    if (!input.address || input.address.trim().length === 0) {
        errors.push('Address is required');
    }

    // Business type validation
    if (!input.businessType || input.businessType.trim().length === 0) {
        errors.push('Business type is required');
    }

    // Website status validation
    if (!isValidWebsiteStatus(input.hasWebsite)) {
        errors.push('Invalid website status');
    }

    // Website URL validation (only if they have a website)
    if (input.hasWebsite === WebsiteStatus.YES) {
        if (!input.websiteUrl || input.websiteUrl.trim().length === 0) {
            errors.push('Website URL is required when website exists');
        } else if (!isValidUrl(input.websiteUrl)) {
            errors.push('Invalid website URL format');
        }
    }

    return errors;
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
}

/**
 * Format phone number for display
 * Example: +1234567890 -> +1 (234) 567-890
 */
export function formatPhoneForDisplay(phone: string): string {
    const normalized = normalizePhoneNumber(phone);

    // Basic formatting for display (can be enhanced)
    if (normalized.length === 10) {
        return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
    }

    return phone; // Return original if not standard format
}
