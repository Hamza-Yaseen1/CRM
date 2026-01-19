'use client';

/**
 * Unified Dashboard Router
 * 
 * Automatically routes users to their role-specific dashboard.
 * Includes a fallback manual selection if auto-routing is delayed.
 * Includes a REPAIR ACCOUNT feature for users with missing Firestore data.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Loader2, ShieldAlert, LayoutDashboard, Users, Phone, Wrench } from 'lucide-react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserRole } from '@/lib/types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, firebaseUser } = useAuth();
  const [redirecting, setRedirecting] = useState(true);
  const [repairing, setRepairing] = useState(false);

  useEffect(() => {
    // If auth is done loading and no user, send to login
    if (!loading && !user && !firebaseUser) {
      router.push('/login');
      return;
    }

    if (user && user.role) {
      // Attempt auto-redirect
      const routeUser = () => {
        switch (user.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'marketer':
            router.push('/marketer/leads');
            break;
          case 'sales':
            router.push('/sales/dashboard');
            break;
          default:
            setRedirecting(false); // Unknown role, show manual options
        }
      };

      routeUser();

      // If still here after 2 seconds, show options
      const timer = setTimeout(() => {
        setRedirecting(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (!loading) {
      // User loaded but has no role or no user doc?
      setRedirecting(false);
    }
  }, [user, loading, router, firebaseUser]);

  // Repair function to fix missing Firestore data
  const handleRepairAccount = async (role: string) => {
    if (!firebaseUser) return;

    setRepairing(true);
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);

      // Check if doc exists
      const docSnap = await getDoc(userRef);

      // Data to save
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        role: role as UserRole,
        createdAt: docSnap.exists() ? docSnap.data().createdAt : Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(userRef, userData, { merge: true });

      toast.success(`Account repaired! Role set to ${role}. Please refresh.`);
      window.location.reload(); // Hard reload to force auth context to re-fetch

    } catch (error: any) {
      console.error('Repair failed:', error);
      toast.error('Repair failed: ' + error.message);
    } finally {
      setRepairing(false);
    }
  };

  // Loading State
  if (loading || redirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-sm font-medium text-gray-600">
            {loading ? 'Verifying authentication...' : 'Redirecting to your dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  // Fallback UI (if auto-redirect is slow or fails)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <LayoutDashboard className="h-6 w-6 text-indigo-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Portal</h2>

        {/* Normal Navigation (if role logic worked but redirect failed) */}
        {user?.role && (
          <>
            <p className="text-gray-600 mb-8">
              Welcome back, <strong>{user.name}</strong>. Select your dashboard:
            </p>
            <div className="space-y-3">
              <NavButton
                role="admin"
                currentRole={user?.role}
                icon={ShieldAlert}
                label="Admin Dashboard"
                desc="Manage all leads & users"
                color="purple"
                onClick={() => router.push('/admin/dashboard')}
              />
              <NavButton
                role="marketer"
                currentRole={user?.role}
                icon={Users}
                label="Marketer Dashboard"
                desc="Add & manage your leads"
                color="blue"
                onClick={() => router.push('/marketer/leads')}
              />
              <NavButton
                role="sales"
                currentRole={user?.role}
                icon={Phone}
                label="Sales Dashboard"
                desc="Call leads & close deals"
                color="green"
                onClick={() => router.push('/sales/dashboard')}
              />
            </div>
          </>
        )}

        {/* REPAIR MODE (If user exists but role is missing) */}
        {(!user || !user.role) && firebaseUser && (
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="text-amber-800 font-bold flex items-center justify-center gap-2 mb-2">
              <Wrench className="w-4 h-4" /> Account Needs Setup
            </h3>
            <p className="text-sm text-amber-700 mb-4">
              Your login works, but your role profile is missing. Please select your role to fix your account:
            </p>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleRepairAccount('admin')}
                disabled={repairing}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-medium"
              >
                Set as Admin
              </button>
              <button
                onClick={() => handleRepairAccount('marketer')}
                disabled={repairing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
              >
                Set as Marketer
              </button>
              <button
                onClick={() => handleRepairAccount('sales')}
                disabled={repairing}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
              >
                Set as Sales Rep
              </button>
            </div>
            {repairing && <p className="mt-2 text-xs text-gray-500 animate-pulse">Repairing...</p>}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
          <p>Email: {user?.email || firebaseUser?.email}</p>
          <p>UID: {(user?.uid || firebaseUser?.uid)?.slice(0, 8)}...</p>
        </div>
      </div>
    </div>
  );
}

function NavButton({ role, currentRole, icon: Icon, label, desc, color, onClick }: any) {
  if (currentRole !== role) return null;

  const colors: any = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200 group"
    >
      <div className="flex items-center gap-3">
        <div className={`${colors[color]} p-2 rounded-lg group-hover:bg-white transition`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
    </button>
  );
}
