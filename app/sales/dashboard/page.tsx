'use client';

/**
 * DAY 4: Sales Dashboard - Professional UI/UX Redesign
 * 
 * Shows assigned leads and allows sales to call and update status.
 * Design: Card-based layout with clear actions and visual feedback
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSalesLeads, markLeadCalled, updateLeadInterest, addLeadNote, closeLead } from '@/lib/services/leads';
import { Lead } from '@/lib/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    Phone,
    CheckCircle2,
    XCircle,
    MessageSquare,
    Building2,
    MapPin,
    Calendar,
    User,
    PhoneCall,
    TrendingUp,
    Award,
    Loader2
} from 'lucide-react';

export default function SalesDashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [note, setNote] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user && user.role !== 'sales') {
            toast.error('Access denied');
            router.push('/');
            return;
        }

        if (user) {
            loadLeads();
        }
    }, [user, authLoading, router]);

    const loadLeads = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const data = await getSalesLeads(user.uid);
            setLeads(data);
        } catch (error) {
            console.error('Error loading leads:', error);
            toast.error('Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkCalled = async (lead: Lead) => {
        if (!user) return;

        if (lead.callStatus.called) {
            toast.error('This lead has already been called');
            return;
        }

        setActionLoading(true);
        try {
            await markLeadCalled(lead.id!, { uid: user.uid, name: user.name });
            toast.success('Lead marked as called');
            loadLeads();
        } catch (error: any) {
            toast.error(error.message || 'Failed to mark as called');
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkInterested = async (lead: Lead, interested: boolean) => {
        if (!user) return;

        setActionLoading(true);
        try {
            await updateLeadInterest(lead.id!, interested, user.name);
            toast.success(`Lead marked as ${interested ? 'interested' : 'not interested'}`);
            loadLeads();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update interest');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCloseLead = async (lead: Lead) => {
        if (!user) return;

        setActionLoading(true);
        try {
            await closeLead(lead.id!, user.name);
            toast.success('Lead closed successfully!');
            loadLeads();
        } catch (error: any) {
            toast.error(error.message || 'Failed to close lead');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!user || !selectedLead || !note.trim()) return;

        try {
            await addLeadNote(selectedLead.id!, note, user.name);
            toast.success('Note added');
            setNote('');
            setShowNoteModal(false);
            loadLeads();
        } catch (error: any) {
            toast.error(error.message || 'Failed to add note');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const notCalledLeads = leads.filter(l => !l.callStatus.called);
    const interestedLeads = leads.filter(l => l.status === 'interested');
    const closedLeads = leads.filter(l => l.status === 'closed');

    const stats = [
        {
            label: 'Total Assigned',
            value: leads.length,
            icon: User,
            color: 'text-gray-700',
            bgColor: 'bg-gray-100'
        },
        {
            label: 'To Call',
            value: notCalledLeads.length,
            icon: PhoneCall,
            color: 'text-amber-700',
            bgColor: 'bg-amber-50'
        },
        {
            label: 'Interested',
            value: interestedLeads.length,
            icon: TrendingUp,
            color: 'text-emerald-700',
            bgColor: 'bg-emerald-50'
        },
        {
            label: 'Closed',
            value: closedLeads.length,
            icon: Award,
            color: 'text-indigo-700',
            bgColor: 'bg-indigo-50'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Sales Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage your assigned leads and close deals</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Leads List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">My Assigned Leads</h2>

                    {leads.length === 0 ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads assigned yet</h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto">
                                Your assigned leads will appear here. Contact your admin to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {leads.map((lead, index) => (
                                <motion.div
                                    key={lead.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    {/* Lead Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-indigo-100 text-indigo-700 p-2.5 rounded-lg">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{lead.clientName}</h3>
                                                    <div className="mt-1 space-y-1">
                                                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                                            <Phone className="w-4 h-4 text-gray-400" />
                                                            {lead.phone}
                                                        </p>
                                                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            {lead.businessType}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${lead.status === 'interested' ? 'bg-emerald-100 text-emerald-800' :
                                                lead.status === 'not_interested' ? 'bg-red-100 text-red-800' :
                                                    lead.status === 'closed' ? 'bg-indigo-100 text-indigo-800' :
                                                        lead.status === 'called' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-amber-100 text-amber-800'
                                            }`}>
                                            {lead.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Call Status */}
                                    {lead.callStatus.called && (
                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                                            <p className="text-sm text-purple-900 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                                                <span className="font-medium">Called on {lead.callStatus.calledAt?.toDate().toLocaleString()}</span>
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {!lead.callStatus.called && (
                                            <button
                                                onClick={() => handleMarkCalled(lead)}
                                                disabled={actionLoading}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PhoneCall className="w-4 h-4" />}
                                                Mark as Called
                                            </button>
                                        )}

                                        {lead.callStatus.called && lead.status === 'called' && (
                                            <>
                                                <button
                                                    onClick={() => handleMarkInterested(lead, true)}
                                                    disabled={actionLoading}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Mark Interested
                                                </button>
                                                <button
                                                    onClick={() => handleMarkInterested(lead, false)}
                                                    disabled={actionLoading}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Not Interested
                                                </button>
                                            </>
                                        )}

                                        {lead.status === 'interested' && (
                                            <button
                                                onClick={() => handleCloseLead(lead)}
                                                disabled={actionLoading}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                                            >
                                                <Award className="w-4 h-4" />
                                                Close Deal
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                setSelectedLead(lead);
                                                setShowNoteModal(true);
                                            }}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Add Note
                                        </button>
                                    </div>

                                    {/* Notes */}
                                    {lead.notes.length > 0 && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-gray-400" />
                                                Notes
                                            </p>
                                            <div className="space-y-2">
                                                {lead.notes.map((note, idx) => (
                                                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                                                        <p className="text-sm text-gray-900">{note.text}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {note.addedBy} • {note.createdAt.toDate().toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Note Modal */}
            {showNoteModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl max-w-md w-full"
                    >
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Add Note</h3>
                            <p className="mt-1 text-sm text-gray-600">Add a note to this lead</p>
                        </div>

                        <div className="px-6 py-4">
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                rows={4}
                                placeholder="Enter your note..."
                            />
                        </div>

                        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex gap-3">
                            <button
                                onClick={() => {
                                    setShowNoteModal(false);
                                    setNote('');
                                }}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddNote}
                                disabled={!note.trim()}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Add Note
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
