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
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#FAF9F6] text-[#222222] font-sans">
      <div className="max-w-md w-full bg-[#F4F2ED] border border-[#E5E2DA] p-8 rounded-2xl shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#B08D57]/10 border border-[#B08D57]/30 flex items-center justify-center mx-auto text-[#B08D57]">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-serif text-[#222222]">Something went wrong</h2>
          <p className="text-[#666666] text-xs leading-relaxed">
            {error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2.5 bg-[#B08D57] text-[#FAF9F6] rounded-xl text-xs font-semibold hover:bg-[#9A7B4B] transition flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2.5 bg-[#FAF9F6] text-[#222222] border border-[#E5E2DA] rounded-xl text-xs font-semibold hover:bg-[#E5E2DA] transition flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
