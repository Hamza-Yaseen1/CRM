'use client';

/**
 * Lead Details Page for Marketers
 * 
 * Shows full details of a specific lead.
 * Design: Clean detail view with status timeline and information cards.
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getLeadById } from '@/lib/services/leads';
import { Lead } from '@/lib/types';
import toast from 'react-hot-toast';
import { formatPhoneForDisplay } from '@/lib/utils/validators';
import {
    ArrowLeft,
    Building2,
    Phone,
    MapPin,
    Briefcase,
    Globe,
    Calendar,
    User,
    Clock,
    CheckCircle2,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeadDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { user, loading: authLoading } = useAuth();

    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user && user.role !== 'marketer') {
            toast.error('Access denied');
            router.push('/');
            return;
        }

        if (user && params?.id) {
            loadLead(params.id as string);
        }
    }, [user, authLoading, params, router]);

    const loadLead = async (id: string) => {
        setLoading(true);
        try {
            const data = await getLeadById(id);
            if (!data) {
                toast.error('Lead not found');
                router.push('/marketer/leads');
                return;
            }

            // Verify ownership (security rule also enforces this, but good for UX)
            if (data.addedBy.uid !== user?.uid) {
                toast.error('You do not have permission to view this lead');
                router.push('/marketer/leads');
                return;
            }

            setLead(data);
        } catch (error) {
            console.error('Error loading lead:', error);
            toast.error('Failed to load lead details');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-sm text-gray-600">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!lead) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => router.push('/marketer/leads')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to My Leads
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                {lead.clientName}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                                Added on {lead.createdAt.toDate().toLocaleDateString()}
                            </p>
                        </div>

                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${lead.status === 'new' ? 'bg-indigo-100 text-indigo-800' :
                                lead.status === 'assigned' ? 'bg-amber-100 text-amber-800' :
                                    lead.status === 'called' ? 'bg-purple-100 text-purple-800' :
                                        lead.status === 'interested' ? 'bg-emerald-100 text-emerald-800' :
                                            lead.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                                'bg-gray-100 text-gray-800'
                            }`}>
                            {lead.status.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Main Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 space-y-6"
                    >
                        {/* Contact Info Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-gray-500" />
                                    Business Details
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
                                        <p className="mt-1 text-sm font-medium text-gray-900 flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            {formatPhoneForDisplay(lead.phone)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</label>
                                        <p className="mt-1 text-sm font-medium text-gray-900 flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-gray-400" />
                                            {lead.businessType}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</label>
                                    <p className="mt-1 text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {lead.address}
                                    </p>
                                </div>

                                {lead.websiteUrl && (
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Website</label>
                                        <a
                                            href={lead.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
                                        >
                                            <Globe className="w-4 h-4" />
                                            {lead.websiteUrl}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assessment Info */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                    Status Information
                                </h3>
                            </div>
                            <div className="p-6">
                                {lead.status === 'new' ? (
                                    <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                                        <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">Waiting for Assignment</p>
                                            <p className="text-sm text-blue-700 mt-1">
                                                This lead is currently in the queue and will be assigned to a sales representative by an admin.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-600">Assigned To</span>
                                            <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                {lead.assignedTo?.name || 'Pending'}
                                            </span>
                                        </div>

                                        {lead.callStatus.called && (
                                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                <span className="text-sm text-green-700">Call Status</span>
                                                <span className="text-sm font-medium text-green-800 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Called on {lead.callStatus.calledAt?.toDate().toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Timeline / Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                    Timeline
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-2">
                                    <div className="mb-8 relative">
                                        <div className="absolute -left-[21px] bg-indigo-600 h-4 w-4 rounded-full border-2 border-white ring-2 ring-indigo-100"></div>
                                        <div className="pl-4">
                                            <p className="text-sm font-medium text-gray-900">Lead Created</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {lead.createdAt.toDate().toLocaleDateString()} at {lead.createdAt.toDate().toLocaleTimeString()}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">by You</p>
                                        </div>
                                    </div>

                                    {lead.assignedTo && (
                                        <div className="mb-8 relative">
                                            <div className="absolute -left-[21px] bg-amber-500 h-4 w-4 rounded-full border-2 border-white ring-2 ring-amber-100"></div>
                                            <div className="pl-4">
                                                <p className="text-sm font-medium text-gray-900">Lead Assigned</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Assigned to {lead.assignedTo.name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {lead.callStatus.called && (
                                        <div className="mb-8 relative">
                                            <div className="absolute -left-[21px] bg-purple-500 h-4 w-4 rounded-full border-2 border-white ring-2 ring-purple-100"></div>
                                            <div className="pl-4">
                                                <p className="text-sm font-medium text-gray-900">Contact Added</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Sales team contacted the lead
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
