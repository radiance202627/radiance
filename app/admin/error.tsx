'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Panel Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 bg-stone-950 text-stone-100 font-sans">
      <div className="max-w-md w-full bg-stone-900 border border-stone-800 p-8 rounded-2xl shadow-2xl text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold font-serif text-stone-100">Admin Section Error</h2>
          <p className="text-stone-400 text-xs leading-relaxed">
            {error?.message || 'An error occurred while loading this admin view.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2.5 bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold hover:bg-amber-300 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2.5 bg-stone-800 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-700 transition flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
