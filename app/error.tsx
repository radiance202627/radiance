'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-stone-950 text-stone-100 font-sans">
      <div className="max-w-md w-full bg-stone-900 border border-stone-800 p-8 rounded-2xl shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-serif text-stone-100">Something went wrong</h2>
          <p className="text-stone-400 text-xs leading-relaxed">
            {error?.message || 'An unexpected error occurred while loading this page.'}
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
            href="/"
            className="px-4 py-2.5 bg-stone-800 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-700 transition flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
