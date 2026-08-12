import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-stone-950 text-stone-100 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <span className="text-6xl font-bold font-serif text-amber-400">404</span>
          <h1 className="text-2xl font-bold font-serif text-stone-100">Page Not Found</h1>
          <p className="text-stone-400 text-sm">
            The requested architectural hardware page or resource could not be found.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold hover:bg-amber-300 transition flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
          <Link
            href="/products"
            className="px-5 py-2.5 bg-stone-900 border border-stone-800 text-stone-300 rounded-xl text-xs font-semibold hover:bg-stone-800 transition flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
