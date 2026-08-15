import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-[#FAF9F6] text-[#222222] font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <span className="text-6xl font-bold font-serif text-[#B08D57]">404</span>
          <h1 className="text-2xl font-bold font-serif text-[#222222]">Page Not Found</h1>
          <p className="text-[#666666] text-sm">
            The requested architectural hardware page or resource could not be found.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-[#B08D57] text-[#FAF9F6] rounded-xl text-xs font-semibold hover:bg-[#9A7B4B] transition flex items-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
          <Link
            href="/products"
            className="px-5 py-2.5 bg-[#F4F2ED] border border-[#E5E2DA] text-[#222222] rounded-xl text-xs font-semibold hover:bg-[#E5E2DA] transition flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
