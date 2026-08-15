'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF9F6] text-[#222222] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#F4F2ED] border border-[#E5E2DA] p-8 rounded-2xl shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500 font-mono text-xl font-bold">
            !
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#222222]">Application Error</h2>
            <p className="text-[#666666] text-xs leading-relaxed">
              {error?.message || 'A critical error occurred.'}
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#B08D57] text-[#FAF9F6] rounded-xl text-xs font-semibold hover:bg-[#9A7B4B] transition shadow-sm"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
