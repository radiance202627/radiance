'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Search } from 'lucide-react';

interface SearchClientProps {
  products: Product[];
  query: string;
}

export const SearchClient: React.FC<SearchClientProps> = ({ products, query }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <Breadcrumbs items={[{ label: 'Search Results' }]} />

      <div className="bg-white rounded-lg border border-brand-border p-6 sm:p-8 shadow-sm space-y-6">
        <SectionHeading
          subtitle="Catalog Search"
          title={`Search Results for "${query}"`}
          description={`Found ${products.length} architectural hardware products matching your search term.`}
        />

        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product name, SKU (e.g., DH-LH-001), material, finish..."
              className="w-full pl-10 pr-4 py-2.5 bg-brand-slate border border-slate-200 text-sm text-brand-dark rounded focus:outline-none focus:border-brand-brass"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-brass hover:bg-brand-brass-dark text-white text-xs font-display font-semibold uppercase tracking-wider rounded shadow transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <ProductGrid
        products={products}
        emptyMessage={`No products matched "${query}". Try searching by SKU code (e.g. DH-LH-001), material (Solid Brass), or finish (Antique Brass).`}
      />
    </div>
  );
};
