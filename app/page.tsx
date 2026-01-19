'use client';

/**
 * Home Page / Landing Page
 * 
 * Welcome page for the CRM system.
 * Design: Modern SaaS landing page with hero, features, and clear CTA.
 */

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                Now Production Ready v1.0
              </span>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
                The CRM built for <br />
                <span className="text-indigo-600">modern sales teams</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                Stop losing leads. Start closing deals. Our role-based CRM helps you track, manage, and convert leads with military precision.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition font-semibold text-lg shadow-sm"
                >
                  Live Demo
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Decorative */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl opacity-50" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to grow</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help your team focus on what matters most—closing deals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />}
              title="Role-Based Security"
              description="Granular permissions for Admins, Marketers, and Sales reps. Everyone sees only what they need to see."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-indigo-600" />}
              title="Lead Management"
              description="Track leads through the entire lifecycle. From 'New' to 'Closed', never lose track of a prospect."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-indigo-600" />}
              title="Smart Automation"
              description="Automatic duplicate detection and status validation ensures your data stays clean and reliable."
            />
          </div>
        </div>
      </div>

      {/* Trust/Security Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2 gap-12 p-12 md:p-20 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Security built into the core
                </h2>
                <p className="text-indigo-100 mb-8 text-lg">
                  We take data security seriously. Your customer data is protected with enterprise-grade security rules.
                </p>
                <div className="space-y-4">
                  <CheckItem text="Firestore Security Rules" />
                  <CheckItem text="Role-Based Access Control (RBAC)" />
                  <CheckItem text="Complete Audit Logs" />
                  <CheckItem text="Soft Delete & Data Recovery" />
                </div>
              </div>
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-4 font-mono text-sm text-indigo-200">
                    <div className="flex gap-4">
                      <span className="text-purple-400">allow read:</span>
                      <span>if request.auth != null;</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-purple-400">allow write:</span>
                      <span>if hasPermission(role);</span>
                    </div>
                    <div className="text-gray-400">// Automatic enforcement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center opacity-60">
            <p className="text-gray-600 text-sm">
              © 2026 CRM Pro System. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
      <div className="bg-indigo-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-white">
      <div className="bg-green-500/20 p-1 rounded-full">
        <CheckCircle2 className="w-5 h-5 text-green-400" />
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
}
