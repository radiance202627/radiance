'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category, Collection } from '@/lib/types';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';
import { FilterDrawer } from '@/components/catalog/FilterDrawer';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
  collections: Collection[];
  initialCategory?: string;
  initialSubcategory?: string;
  initialCollection?: string;
  initialQuery?: string;
}

export const CatalogClient: React.FC<CatalogClientProps> = ({
  initialProducts,
  categories,
  collections,
  initialCategory = '',
  initialSubcategory = '',
  initialCollection = '',
  initialQuery = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedFinish, setSelectedFinish] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'name-asc' | 'name-desc' | 'sku'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedMaterial('');
    setSelectedFinish('');
    setSelectedSize('');
    setSelectedStyle('');
    setSelectedCollection('');
    setSearchQuery('');
    setSortBy('featured');
  };

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }
    if (selectedSubcategory) {
      result = result.filter((p) => p.subcategorySlug === selectedSubcategory);
    }
    if (selectedCollection) {
      result = result.filter((p) => p.collections.includes(selectedCollection));
    }
    if (selectedMaterial) {
      result = result.filter((p) =>
        p.material.toLowerCase().includes(selectedMaterial.toLowerCase())
      );
    }
    if (selectedFinish) {
      result = result.filter((p) =>
        p.finishes.some((f) => f.toLowerCase().includes(selectedFinish.toLowerCase()))
      );
    }
    if (selectedSize) {
      result = result.filter((p) =>
        p.sizes.some((s) => s.toLowerCase().includes(selectedSize.toLowerCase()))
      );
    }
    if (selectedStyle) {
      result = result.filter((p) =>
        p.styles.some((st) => st.toLowerCase().includes(selectedStyle.toLowerCase()))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.subcategoryName.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'sku') {
      result.sort((a, b) => a.sku.localeCompare(b.sku));
    }

    return result;
  }, [
    initialProducts,
    selectedCategory,
    selectedSubcategory,
    selectedCollection,
    selectedMaterial,
    selectedFinish,
    selectedSize,
    selectedStyle,
    searchQuery,
    sortBy,
  ]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Products Catalog', href: '/products' },
          ...(activeCategoryObj ? [{ label: activeCategoryObj.name }] : []),
        ]}
      />

      {/* Page Header Banner */}
      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 sm:p-8 shadow-sm">
        <SectionHeading
          subtitle="B2B Architectural Hardware Catalog"
          title={activeCategoryObj ? activeCategoryObj.name : 'All Architectural Products'}
          description={
            activeCategoryObj
              ? activeCategoryObj.description
              : 'Browse our full export catalog of solid brass, forged iron, stainless steel, and decorative hardware fittings.'
          }
        />
      </div>

      {/* Main Catalog Layout (Sidebar + Main Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            categories={categories}
            collections={collections}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            selectedFinish={selectedFinish}
            setSelectedFinish={setSelectedFinish}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search Bar & Mobile Filter Trigger Bar */}
          <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666666]" />
              <input
                type="text"
                placeholder="Search products or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-[#FAF9F6] text-[#222222] text-xs font-semibold uppercase tracking-wider rounded-xl border border-[#E5E2DA]"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#B08D57]" />
                <span>Filters</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#666666] hidden sm:inline" />
                <span className="text-[#666666] font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF9F6] border border-[#E5E2DA] text-[#222222] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#B08D57] font-medium"
                >
                  <option value="featured">Featured First</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="sku">SKU Code</option>
                </select>
              </div>
            </div>

          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-[#666666] px-1">
            <span>
              Showing <strong>{filteredProducts.length}</strong> architectural products
            </span>
            {(selectedCategory || selectedMaterial || selectedFinish || searchQuery) && (
              <button
                onClick={resetFilters}
                className="text-[#B08D57] font-semibold hover:underline"
              >
                Clear all active filters
              </button>
            )}
          </div>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} />

        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categories}
        collections={collections}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        selectedMaterial={selectedMaterial}
        setSelectedMaterial={setSelectedMaterial}
        selectedFinish={selectedFinish}
        setSelectedFinish={setSelectedFinish}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
        onResetFilters={resetFilters}
      />
    </div>
  );
};
