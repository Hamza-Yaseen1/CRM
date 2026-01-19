'use client';

/**
 * DAY 3: Add Lead Page - Professional UI/UX Redesign
 * 
 * Allows marketers to add new leads with duplicate phone detection.
 * Design: Clean form with clear labels, validation states, and helpful feedback
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { createLead, checkPhoneDuplicate } from '@/lib/services/leads';
import { validateLeadInput } from '@/lib/utils/validators';
import { WebsiteStatus } from '@/lib/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Building2,
    Phone,
    MapPin,
    Briefcase,
    Globe,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';

export default function AddLeadPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        clientName: '',
        phone: '',
        address: '',
        businessType: '',
        hasWebsite: WebsiteStatus.NO,
        websiteUrl: ''
    });

    const [loading, setLoading] = useState(false);
    const [checkingDuplicate, setCheckingDuplicate] = useState(false);
    const [duplicateFound, setDuplicateFound] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Reset duplicate check when phone changes
        if (name === 'phone') {
            setDuplicateFound(false);
        }
    };

    const handlePhoneBlur = async () => {
        if (!formData.phone) return;

        setCheckingDuplicate(true);
        setDuplicateFound(false);

        try {
            const duplicate = await checkPhoneDuplicate(formData.phone);
            if (duplicate) {
                setDuplicateFound(true);
                toast.error(`Phone number already exists for ${duplicate.clientName}`);
            }
        } catch (error) {
            console.error('Error checking duplicate:', error);
        } finally {
            setCheckingDuplicate(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must be logged in');
            return;
        }

        // Validate form data
        const errors = validateLeadInput(formData);
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        if (duplicateFound) {
            toast.error('Please use a different phone number');
            return;
        }

        setLoading(true);

        try {
            // Check for duplicate one more time
            const duplicate = await checkPhoneDuplicate(formData.phone);
            if (duplicate) {
                toast.error(`Phone number already exists for ${duplicate.clientName}`);
                setDuplicateFound(true);
                setLoading(false);
                return;
            }

            // Create lead
            await createLead(formData, {
                uid: user.uid,
                name: user.name
            });

            toast.success('Lead added successfully!');
            router.push('/marketer/leads');
        } catch (error: any) {
            console.error('Error creating lead:', error);
            toast.error(error.message || 'Failed to add lead');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Leads
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Add New Lead</h1>
                        <p className="mt-1 text-sm text-gray-600">Fill in the details to add a new lead to your pipeline</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Client Name */}
                        <div>
                            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                                Client Name <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="clientName"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="ABC Corporation"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={handlePhoneBlur}
                                    required
                                    className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${duplicateFound
                                            ? 'border-red-300 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                                        }`}
                                    placeholder="+1 (234) 567-8900"
                                />
                                {checkingDuplicate && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                                    </div>
                                )}
                                {!checkingDuplicate && duplicateFound && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                    </div>
                                )}
                            </div>
                            {checkingDuplicate && (
                                <p className="mt-2 text-sm text-indigo-600 flex items-center gap-1.5">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Checking for duplicates...
                                </p>
                            )}
                            {duplicateFound && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                                    <AlertCircle className="w-4 h-4" />
                                    This phone number already exists in the system
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                Address <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                                    placeholder="123 Main St, City, State, ZIP"
                                />
                            </div>
                        </div>

                        {/* Business Type */}
                        <div>
                            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                                Business Type <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="businessType"
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="Retail, Technology, Healthcare, etc."
                                />
                            </div>
                        </div>

                        {/* Has Website */}
                        <div>
                            <label htmlFor="hasWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                                Does the client have a website? <span className="text-red-600">*</span>
                            </label>
                            <select
                                id="hasWebsite"
                                name="hasWebsite"
                                value={formData.hasWebsite}
                                onChange={handleChange}
                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            >
                                <option value={WebsiteStatus.NO}>No</option>
                                <option value={WebsiteStatus.YES}>Yes</option>
                            </select>
                        </div>

                        {/* Website URL (conditional) */}
                        {formData.hasWebsite === WebsiteStatus.YES && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                    Website URL <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Globe className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        id="websiteUrl"
                                        name="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={handleChange}
                                        required={formData.hasWebsite === WebsiteStatus.YES}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Info Box */}
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-indigo-900">
                                    <p className="font-medium mb-1">Duplicate Detection Enabled</p>
                                    <p className="text-indigo-700">
                                        We'll automatically check if this phone number already exists in the system to prevent duplicates.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || checkingDuplicate || duplicateFound}
                                className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {loading ? 'Adding Lead...' : 'Add Lead'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        All fields marked with <span className="text-red-600">*</span> are required
                    </p>
                </div>
            </div>
        </div>
    );
}
