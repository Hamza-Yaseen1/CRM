'use client';

/**
 * DAY 3: Marketer Leads Page - Professional UI/UX Redesign
 * 
 * Shows all leads added by the logged-in marketer.
 * Design: Clean, readable table with strong visual hierarchy
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getMarketerLeads } from '@/lib/services/leads';
import { Lead } from '@/lib/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatPhoneForDisplay } from '@/lib/utils/validators';
import {
    Plus,
    FileText,
    TrendingUp,
    UserCheck,
    CheckCircle2,
    Search,
    Calendar
} from 'lucide-react';

export default function MarketerLeadsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

        if (user) {
            loadLeads();
        }
    }, [user, authLoading, router]);

    const loadLeads = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const data = await getMarketerLeads(user.uid);
            setLeads(data);
        } catch (error) {
            console.error('Error loading leads:', error);
            toast.error('Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    // Filter leads by search
    const filteredLeads = leads.filter(lead =>
        lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.businessType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            new: 'bg-indigo-100 text-indigo-800',
            assigned: 'bg-amber-100 text-amber-800',
            called: 'bg-purple-100 text-purple-800',
            interested: 'bg-emerald-100 text-emerald-800',
            not_interested: 'bg-red-100 text-red-800',
            closed: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };



    const stats = [
        {
            label: 'Total Leads',
            value: leads.length,
            icon: FileText,
            color: 'text-gray-700',
            bgColor: 'bg-gray-100'
        },
        {
            label: 'New',
            value: leads.filter(l => l.status === 'new').length,
            icon: TrendingUp,
            color: 'text-indigo-700',
            bgColor: 'bg-indigo-50'
        },
        {
            label: 'Assigned',
            value: leads.filter(l => l.status === 'assigned').length,
            icon: UserCheck,
            color: 'text-amber-700',
            bgColor: 'bg-amber-50'
        },
        {
            label: 'Closed',
            value: leads.filter(l => l.status === 'closed').length,
            icon: CheckCircle2,
            color: 'text-emerald-700',
            bgColor: 'bg-emerald-50'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">My Leads</h1>
                            <p className="mt-1 text-sm text-gray-600">Track and manage your lead pipeline</p>
                        </div>
                        <button
                            onClick={() => router.push('/marketer/add-lead')}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Lead
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
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

                {/* Search Bar */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by client name, phone, or business type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Leads Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                >
                    {filteredLeads.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'No leads found' : 'No leads yet'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                                {searchTerm
                                    ? 'Try adjusting your search terms to find what you\'re looking for.'
                                    : 'Get started by adding your first lead to the system.'
                                }
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => router.push('/marketer/add-lead')}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Your First Lead
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Client Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Business Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Assigned To
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredLeads.map((lead, index) => (
                                        <motion.tr
                                            key={lead.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="hover:bg-gray-50 transition cursor-pointer"
                                            onClick={() => router.push(`/marketer/leads/${lead.id}`)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{lead.clientName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{formatPhoneForDisplay(lead.phone)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{lead.businessType}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                                    {lead.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{lead.assignedTo?.name || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {lead.createdAt.toDate().toLocaleDateString()}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Results count */}
                {filteredLeads.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600 text-center">
                        Showing {filteredLeads.length} of {leads.length} leads
                    </div>
                )}
            </div>
        </div>
    );
}
