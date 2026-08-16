'use client';

import React from 'react';
import { Category, Collection } from '@/lib/types';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
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

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  collections,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedMaterial,
  setSelectedMaterial,
  selectedFinish,
  setSelectedFinish,
  selectedSize,
  setSelectedSize,
  selectedStyle,
  setSelectedStyle,
  selectedCollection,
  setSelectedCollection,
  onResetFilters,
}) => {
  const materials = ['Solid Brass', 'Forged Iron', '316 Stainless Steel', 'Cast Bronze', 'Machined Brass'];
  const finishes = ['Antique Brass', 'Polished Brass', 'Satin Chrome', 'Matt Black', 'Oil Rubbed Bronze', 'Aged Nickel'];
  const sizes = ['96mm CTC', '128mm CTC', '160mm CTC', '250mm', '300mm'];
  const styles = ['Contemporary', 'Heritage', 'Victorian', 'Minimalist', 'Industrial', 'Rustic'];

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const subcategoryList = activeCategoryObj ? activeCategoryObj.subcategories : [];

  return (
    <aside className="w-full bg-[#F4F2ED] border border-[#E5E2DA] rounded-2xl p-5 shadow-sm space-y-6 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DA]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#B08D57]" />
          <h3 className="font-display font-semibold text-sm text-[#222222] uppercase tracking-wider">
            Refine Catalog
          </h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] text-[#666666] hover:text-[#B08D57] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider font-display">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubcategory('');
          }}
          aria-label="Filter by Category"
          className="w-full text-xs bg-[#FAF9F6] border border-[#E5E2DA] text-[#222222] rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B08D57]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Filter (If Category Selected) */}
      {selectedCategory && subcategoryList.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider font-display">
            Subcategory
          </label>
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            aria-label="Filter by Subcategory"
            className="w-full text-xs bg-[#FAF9F6] border border-[#E5E2DA] text-[#222222] rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B08D57]"
          >
            <option value="">All Subcategories</option>
            {subcategoryList.map((sub) => (
              <option key={sub.id} value={sub.slug}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Collection Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider font-display">
          Collection
        </label>
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
          aria-label="Filter by Collection"
          className="w-full text-xs bg-[#FAF9F6] border border-[#E5E2DA] text-[#222222] rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B08D57]"
        >
          <option value="">All Collections</option>
          {collections.map((col) => (
            <option key={col.id} value={col.slug}>
              {col.name}
            </option>
          ))}
        </select>
      </div>

      {/* Material Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider font-display">
          Base Material
        </label>
        <select
          value={selectedMaterial}
          onChange={(e) => setSelectedMaterial(e.target.value)}
          aria-label="Filter by Base Material"
          className="w-full text-xs bg-[#FAF9F6] border border-[#E5E2DA] text-[#222222] rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B08D57]"
        >
          <option value="">All Materials</option>
          {materials.map((mat) => (
            <option key={mat} value={mat}>
              {mat}
            </option>
          ))}
        </select>
      </div>

      {/* Finish Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider font-display">
          Architectural Finish
        </label>
        <select
          value={selectedFinish}
          onChange={(e) => setSelectedFinish(e.target.value)}
          aria-label="Filter by Architectural Finish"
          className="w-full text-xs bg-[#FAF9F6] border border-[#E5E2DA] text-[#222222] rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B08D57]"
        >
          <option value="">All Finishes</option>
          {finishes.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Size Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider font-display">
          Dimensions / Size
        </label>
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          aria-label="Filter by Dimensions or Size"
          className="w-full text-xs bg-[#FAF9F6] border border-[#E5E2DA] text-[#222222] rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B08D57]"
        >
          <option value="">All Sizes</option>
          {sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Style Filter */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#222222] uppercase tracking-wider font-display">
          Design Style
        </label>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          aria-label="Filter by Design Style"
          className="w-full text-xs bg-[#FAF9F6] border border-[#E5E2DA] text-[#222222] rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B08D57]"
        >
          <option value="">All Styles</option>
          {styles.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};
