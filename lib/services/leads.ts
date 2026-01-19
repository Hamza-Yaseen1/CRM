/**
 * Leads Service
 * 
 * All Firestore operations for leads collection.
 * Includes duplicate detection and business rule enforcement.
 */

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    DocumentData,
    QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase';
import { Lead, CreateLeadInput, UserReference } from '../types';
import { LeadStatus, ActivityAction, WebsiteStatus } from '../enums';
import { COLLECTIONS } from '../constants';
import { normalizePhoneNumber } from '../utils/validators';

/**
 * Check if phone number already exists
 * Returns the existing lead if found, null otherwise
 */
export async function checkPhoneDuplicate(phone: string): Promise<Lead | null> {
    const normalized = normalizePhoneNumber(phone);

    const q = query(
        collection(db, COLLECTIONS.LEADS),
        where('phone', '==', normalized),
        where('deleted', '==', false)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const leadData = snapshot.docs[0].data() as Lead;
        return { ...leadData, id: snapshot.docs[0].id };
    }

    return null;
}

/**
 * Create a new lead
 */
export async function createLead(
    input: CreateLeadInput,
    addedBy: UserReference
): Promise<string> {
    // Check for duplicate phone
    const duplicate = await checkPhoneDuplicate(input.phone);
    if (duplicate) {
        throw new Error('Phone number already exists');
    }

    const newLead: Omit<Lead, 'id'> = {
        clientName: input.clientName,
        phone: normalizePhoneNumber(input.phone),
        address: input.address,
        businessType: input.businessType,
        hasWebsite: input.hasWebsite,
        websiteUrl: input.websiteUrl,

        status: LeadStatus.NEW,

        addedBy,
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
                by: addedBy.name,
                at: Timestamp.now()
            }
        ],

        deleted: false,
        deletedAt: null,
        deletedBy: null,

        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.LEADS), newLead);
    return docRef.id;
}

/**
 * Get leads for a marketer (only their own leads)
 */
export async function getMarketerLeads(marketerId: string): Promise<Lead[]> {
    const q = query(
        collection(db, COLLECTIONS.LEADS),
        where('addedBy.uid', '==', marketerId),
        where('deleted', '==', false),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Lead));
}

/**
 * Get leads assigned to a sales person
 */
export async function getSalesLeads(salesId: string): Promise<Lead[]> {
    const q = query(
        collection(db, COLLECTIONS.LEADS),
        where('assignedTo.uid', '==', salesId),
        where('deleted', '==', false)
    );

    const snapshot = await getDocs(q);
    const leads = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Lead));

    // Client-side sort to avoid index issues
    return leads.sort((a, b) => a.status.localeCompare(b.status));
}

/**
 * Get all leads (admin only)
 */
export async function getAllLeads(includeDeleted: boolean = false): Promise<Lead[]> {
    const constraints: QueryConstraint[] = [];

    if (!includeDeleted) {
        constraints.push(where('deleted', '==', false));
    }

    // constraints.push(orderBy('createdAt', 'desc'));

    const q = query(collection(db, COLLECTIONS.LEADS), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Lead));
}

/**
 * Get a single lead by ID
 */
export async function getLeadById(leadId: string): Promise<Lead | null> {
    const docRef = doc(db, COLLECTIONS.LEADS, leadId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as Lead;
    }

    return null;
}

/**
 * Assign lead to sales person (admin only)
 */
export async function assignLead(
    leadId: string,
    assignedTo: UserReference,
    adminName: string
): Promise<void> {
    const leadRef = doc(db, COLLECTIONS.LEADS, leadId);
    const leadSnap = await getDoc(leadRef);

    if (!leadSnap.exists()) {
        throw new Error('Lead not found');
    }

    const lead = leadSnap.data() as Lead;

    await updateDoc(leadRef, {
        status: LeadStatus.ASSIGNED,
        assignedTo,
        activityLog: [
            ...lead.activityLog,
            {
                action: ActivityAction.ASSIGNED,
                by: adminName,
                at: Timestamp.now(),
                details: assignedTo.name
            }
        ],
        updatedAt: Timestamp.now()
    });
}

/**
 * Mark lead as called (sales only)
 */
export async function markLeadCalled(
    leadId: string,
    calledBy: UserReference
): Promise<void> {
    const leadRef = doc(db, COLLECTIONS.LEADS, leadId);
    const leadSnap = await getDoc(leadRef);

    if (!leadSnap.exists()) {
        throw new Error('Lead not found');
    }

    const lead = leadSnap.data() as Lead;

    // CRITICAL: Check if already called
    if (lead.callStatus.called) {
        throw new Error('Lead has already been called');
    }

    await updateDoc(leadRef, {
        status: LeadStatus.CALLED,
        'callStatus.called': true,
        'callStatus.calledAt': Timestamp.now(),
        'callStatus.calledBy': calledBy,
        activityLog: [
            ...lead.activityLog,
            {
                action: ActivityAction.CALLED,
                by: calledBy.name,
                at: Timestamp.now()
            }
        ],
        updatedAt: Timestamp.now()
    });
}

/**
 * Update lead interest status (sales only)
 */
export async function updateLeadInterest(
    leadId: string,
    interested: boolean,
    salesName: string
): Promise<void> {
    const leadRef = doc(db, COLLECTIONS.LEADS, leadId);
    const leadSnap = await getDoc(leadRef);

    if (!leadSnap.exists()) {
        throw new Error('Lead not found');
    }

    const lead = leadSnap.data() as Lead;
    const newStatus = interested ? LeadStatus.INTERESTED : LeadStatus.NOT_INTERESTED;

    await updateDoc(leadRef, {
        status: newStatus,
        interestStatus: interested ? 'interested' : 'not_interested',
        activityLog: [
            ...lead.activityLog,
            {
                action: ActivityAction.STATUS_CHANGED,
                by: salesName,
                at: Timestamp.now(),
                details: newStatus
            }
        ],
        updatedAt: Timestamp.now()
    });
}

/**
 * Add note to lead
 */
export async function addLeadNote(
    leadId: string,
    noteText: string,
    addedBy: string
): Promise<void> {
    const leadRef = doc(db, COLLECTIONS.LEADS, leadId);
    const leadSnap = await getDoc(leadRef);

    if (!leadSnap.exists()) {
        throw new Error('Lead not found');
    }

    const lead = leadSnap.data() as Lead;

    await updateDoc(leadRef, {
        notes: [
            ...lead.notes,
            {
                text: noteText,
                addedBy,
                createdAt: Timestamp.now()
            }
        ],
        activityLog: [
            ...lead.activityLog,
            {
                action: ActivityAction.NOTE_ADDED,
                by: addedBy,
                at: Timestamp.now()
            }
        ],
        updatedAt: Timestamp.now()
    });
}

/**
 * Soft delete lead (admin only)
 */
export async function softDeleteLead(
    leadId: string,
    deletedBy: string
): Promise<void> {
    const leadRef = doc(db, COLLECTIONS.LEADS, leadId);
    const leadSnap = await getDoc(leadRef);

    if (!leadSnap.exists()) {
        throw new Error('Lead not found');
    }

    const lead = leadSnap.data() as Lead;

    await updateDoc(leadRef, {
        deleted: true,
        deletedAt: Timestamp.now(),
        deletedBy,
        activityLog: [
            ...lead.activityLog,
            {
                action: ActivityAction.DELETED,
                by: deletedBy,
                at: Timestamp.now()
            }
        ],
        updatedAt: Timestamp.now()
    });
}

/**
 * Restore deleted lead (admin only)
 */
export async function restoreLead(
    leadId: string,
    restoredBy: string
): Promise<void> {
    const leadRef = doc(db, COLLECTIONS.LEADS, leadId);
    const leadSnap = await getDoc(leadRef);

    if (!leadSnap.exists()) {
        throw new Error('Lead not found');
    }

    const lead = leadSnap.data() as Lead;

    await updateDoc(leadRef, {
        deleted: false,
        deletedAt: null,
        deletedBy: null,
        activityLog: [
            ...lead.activityLog,
            {
                action: ActivityAction.RESTORED,
                by: restoredBy,
                at: Timestamp.now()
            }
        ],
        updatedAt: Timestamp.now()
    });
}

/**
 * Close lead (mark as closed)
 */
export async function closeLead(
    leadId: string,
    closedBy: string
): Promise<void> {
    const leadRef = doc(db, COLLECTIONS.LEADS, leadId);
    const leadSnap = await getDoc(leadRef);

    if (!leadSnap.exists()) {
        throw new Error('Lead not found');
    }

    const lead = leadSnap.data() as Lead;

    await updateDoc(leadRef, {
        status: LeadStatus.CLOSED,
        activityLog: [
            ...lead.activityLog,
            {
                action: ActivityAction.STATUS_CHANGED,
                by: closedBy,
                at: Timestamp.now(),
                details: LeadStatus.CLOSED
            }
        ],
        updatedAt: Timestamp.now()
    });
}
