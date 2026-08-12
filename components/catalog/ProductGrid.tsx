import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/catalog/ProductCard';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyMessage = 'No architectural products matched your selected criteria.',
}) => {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-lg border border-dashed border-slate-300 p-8 my-6">
        <PackageSearch className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-display text-lg font-semibold text-brand-dark mb-1">
          No Products Found
        </h3>
        <p className="text-sm text-brand-text-muted max-w-md mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
