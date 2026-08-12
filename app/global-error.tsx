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
      <body className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-stone-900 border border-stone-800 p-8 rounded-2xl shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 font-mono text-xl font-bold">
            !
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-stone-100">Application Error</h2>
            <p className="text-stone-400 text-xs leading-relaxed">
              {error?.message || 'A critical error occurred.'}
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold hover:bg-amber-300 transition"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
