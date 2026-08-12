'use client';

import React from 'react';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import { Category, Collection } from '@/lib/types';
import { X } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  collections: Collection[];
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (val: string) => void;
  selectedMaterial: string;
  setSelectedMaterial: (val: string) => void;
  selectedFinish: string;
  setSelectedFinish: (val: string) => void;
  selectedSize: string;
  setSelectedSize: (val: string) => void;
  selectedStyle: string;
  setSelectedStyle: (val: string) => void;
  selectedCollection: string;
  setSelectedCollection: (val: string) => void;
  onResetFilters: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xs bg-white h-full shadow-2xl overflow-y-auto flex flex-col p-4 animate-slide-left">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
          <h3 className="font-display font-semibold text-base text-brand-dark uppercase tracking-wider">
            Filter Products
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-brand-dark rounded-md"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1">
          <FilterSidebar {...props} />
        </div>

        <div className="pt-4 border-t border-slate-200 mt-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-brand-brass text-white text-xs font-display font-semibold uppercase tracking-wider rounded text-center shadow"
          >
            Apply Filters & View Products
          </button>
        </div>
      </div>
    </div>
  );
};
