'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 fixed w-full z-10 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <Link href="/" className="font-bold text-xl text-gray-900 tracking-tight">
              CRM<span className="text-indigo-600">Pro</span>
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            {!loading && user ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mt-0.5">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 text-sm transition">
                  Sign In
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm hover:shadow">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
