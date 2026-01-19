'use client';

/**
 * DAY 5: Admin Dashboard - Professional UI/UX Redesign
 * 
 * Shows all leads, allows assignment, deletion, and restoration.
 * Design: Modern SaaS dashboard with clean hierarchy and strong contrast
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getAllLeads, assignLead, softDeleteLead, restoreLead } from '@/lib/services/leads';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Lead, User } from '@/lib/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { COLLECTIONS } from '@/lib/constants';
import {
    Users,
    FileText,
    CheckCircle2,
    Trash2,
    UserPlus,
    RotateCcw,
    Eye,
    EyeOff,
    Search,
    AlertTriangle,
    RefreshCw,
    ShieldCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [leads, setLeads] = useState<Lead[]>([]);
    const [salesUsers, setSalesUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorString, setErrorString] = useState<string | null>(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [selectedSales, setSelectedSales] = useState('');
    const [showDeleted, setShowDeleted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        // We strictly check role here
        if (user && user.role !== 'admin') {
            toast.error('Access denied: You are not an admin');
            router.push('/dashboard');
            return;
        }

        if (user) {
            loadData();
        }
    }, [user, authLoading, router, showDeleted]);

    const loadData = async () => {
        setLoading(true);
        setErrorString(null);
        try {
            const leadsData = await getAllLeads(showDeleted);
            setLeads(leadsData);

            const salesQuery = query(
                collection(db, COLLECTIONS.USERS),
                where('role', '==', 'sales')
            );
            const salesSnapshot = await getDocs(salesQuery);
            const salesData = salesSnapshot.docs.map(doc => doc.data() as User);
            setSalesUsers(salesData);
        } catch (error: any) {
            console.error('Error loading data:', error);
            setErrorString(error.message || 'Unknown error');
            toast.error('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignLead = async () => {
        if (!user || !selectedLead || !selectedSales) return;

        const salesUser = salesUsers.find(s => s.uid === selectedSales);
        if (!salesUser) return;

        try {
            await assignLead(selectedLead.id!, {
                uid: salesUser.uid,
                name: salesUser.name
            }, user.name);

            toast.success(`Lead assigned to ${salesUser.name}`);
            setShowAssignModal(false);
            setSelectedLead(null);
            setSelectedSales('');
            loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to assign lead');
        }
    };

    const handleDeleteLead = async (lead: Lead) => {
        if (!user) return;

        if (!confirm(`Are you sure you want to delete ${lead.clientName}?`)) return;

        try {
            await softDeleteLead(lead.id!, user.name);
            toast.success('Lead deleted');
            loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete lead');
        }
    };

    const handleRestoreLead = async (lead: Lead) => {
        if (!user) return;

        try {
            await restoreLead(lead.id!, user.name);
            toast.success('Lead restored');
            loadData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to restore lead');
        }
    };

    // Filter leads by search term
    const filteredLeads = leads.filter(lead =>
        lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.businessType.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    // Debug View for Errors (Critical for fixing "Failed to load")
    if (errorString) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full border-t-4 border-red-500">
                    <div className="flex items-center gap-3 mb-4 text-red-600">
                        <AlertTriangle className="w-8 h-8" />
                        <h2 className="text-xl font-bold">Failed to Load Dashboard</h2>
                    </div>

                    <p className="text-gray-600 mb-4">
                        We encountered an error while trying to fetch the admin data.
                    </p>

                    <div className="bg-gray-100 p-4 rounded-md font-mono text-xs text-red-800 break-words mb-6">
                        {errorString}
                    </div>

                    {/* User Debug Info */}
                    <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-100">
                        <h4 className="text-xs font-bold text-blue-800 uppercase mb-2 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Debug Info
                        </h4>
                        <p className="text-xs text-blue-700"><strong>User ID:</strong> {user?.uid}</p>
                        <p className="text-xs text-blue-700"><strong>Role:</strong> {user?.role || 'UNDEFINED'}</p>
                        <p className="text-xs text-blue-700 mt-1">If 'Role' is undefined, click 'Go to Setup' to fix your account.</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Troubleshooting Steps:</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-6">
                            <li>If the "index" link appears in the error above, CLICK IT!</li>
                            <li>If it says <strong>"permission denied"</strong>, ensure your Role says <strong>'admin'</strong> above.</li>
                            <li>If the role is correct but it still fails, the Firestore Index is likely still "Building" (wait 2 mins).</li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            <RefreshCw className="w-4 h-4" /> Try Again
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                        >
                            Go to Setup
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const activeLeads = leads.filter(l => !l.deleted);
    const deletedLeads = leads.filter(l => l.deleted);
    const newLeads = activeLeads.filter(l => l.status === 'new');
    const assignedLeads = activeLeads.filter(l => l.status === 'assigned');
    const closedLeads = activeLeads.filter(l => l.status === 'closed');

    const stats = [
        {
            label: 'Total Leads',
            value: activeLeads.length,
            icon: FileText,
            color: 'text-gray-700',
            bgColor: 'bg-gray-100'
        },
        {
            label: 'New',
            value: newLeads.length,
            icon: Users,
            color: 'text-indigo-700',
            bgColor: 'bg-indigo-50'
        },
        {
            label: 'Assigned',
            value: assignedLeads.length,
            icon: UserPlus,
            color: 'text-amber-700',
            bgColor: 'bg-amber-50'
        },
        {
            label: 'Closed',
            value: closedLeads.length,
            icon: CheckCircle2,
            color: 'text-emerald-700',
            bgColor: 'bg-emerald-50'
        },
        {
            label: 'Deleted',
            value: deletedLeads.length,
            icon: Trash2,
            color: 'text-red-700',
            bgColor: 'bg-red-50'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                            <p className="mt-1 text-sm text-gray-600">Manage all leads and assign to sales team</p>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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

                {/* Filters Bar */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, phone, or business type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Toggle Deleted */}
                        <button
                            onClick={() => setShowDeleted(!showDeleted)}
                            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${showDeleted
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {showDeleted ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            {showDeleted ? 'Hide Deleted' : 'Show Deleted'}
                        </button>
                    </div>
                </div>

                {/* Leads Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Added By
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assigned To
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm font-medium text-gray-900">No leads found</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {searchTerm ? 'Try adjusting your search' : 'Leads will appear here once added'}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            className={`hover:bg-gray-50 transition ${lead.deleted ? 'bg-red-50' : ''}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{lead.clientName}</div>
                                                    <div className="text-sm text-gray-500">{lead.businessType}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{lead.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.deleted ? 'bg-red-100 text-red-800' :
                                                        lead.status === 'new' ? 'bg-indigo-100 text-indigo-800' :
                                                            lead.status === 'assigned' ? 'bg-amber-100 text-amber-800' :
                                                                lead.status === 'called' ? 'bg-purple-100 text-purple-800' :
                                                                    lead.status === 'interested' ? 'bg-emerald-100 text-emerald-800' :
                                                                        lead.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {lead.deleted ? 'DELETED' : lead.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {lead.addedBy.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {lead.assignedTo?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!lead.deleted && !lead.assignedTo && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedLead(lead);
                                                                setShowAssignModal(true);
                                                            }}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                                                        >
                                                            <UserPlus className="w-3.5 h-3.5" />
                                                            Assign
                                                        </button>
                                                    )}
                                                    {!lead.deleted && (
                                                        <button
                                                            onClick={() => handleDeleteLead(lead)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            Delete
                                                        </button>
                                                    )}
                                                    {lead.deleted && (
                                                        <button
                                                            onClick={() => handleRestoreLead(lead)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition"
                                                        >
                                                            <RotateCcw className="w-3.5 h-3.5" />
                                                            Restore
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Assign Modal */}
            {showAssignModal && selectedLead && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl max-w-md w-full"
                    >
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Assign Lead</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Assign <span className="font-medium text-gray-900">{selectedLead.clientName}</span> to a sales person
                            </p>
                        </div>

                        <div className="px-6 py-4">
                            <label htmlFor="sales-select" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Sales Person
                            </label>
                            <select
                                id="sales-select"
                                value={selectedSales}
                                onChange={(e) => setSelectedSales(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Choose a sales person...</option>
                                {salesUsers.map((sales) => (
                                    <option key={sales.uid} value={sales.uid}>
                                        {sales.name} ({sales.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex gap-3">
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedLead(null);
                                    setSelectedSales('');
                                }}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignLead}
                                disabled={!selectedSales}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Assign Lead
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
