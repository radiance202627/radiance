import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getCategories } from '@/lib/services/categoryService';
import { getProducts } from '@/lib/services/productService';
import { getCollections } from '@/lib/services/collectionService';
import { CatalogClient } from '../CatalogClient';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ArrowRight, Layers } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) return { title: 'Category Not Found' };
  return {
    title: `${category.name} | B2B Architectural Hardware Catalog`,
    description: category.description,
  };
}

export const revalidate = 3600;

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();

  const allProducts = await getProducts();
  const categories = await getCategories();
  const collections = await getCollections();

  const categoryProducts = allProducts.filter((p) => p.categorySlug === category.slug);

  return (
    <div className="space-y-12 pb-16 font-sans">
      
      {/* Category Hero Banner */}
      <section className="relative min-h-[40vh] flex items-center bg-brand-dark text-white overflow-hidden">
        <Image
          src={category.heroImage}
          alt={category.name}
          fill
          priority
          className="object-cover object-center opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-4">
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: category.name },
            ]}
          />

          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-display font-semibold uppercase tracking-widest text-brand-brass">
              Category
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Subcategory Grid Cards Section */}
      {category.subcategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-brass" />
            <h2 className="font-display font-bold text-lg text-brand-dark uppercase tracking-wider">
              {category.name} Subcategories ({category.subcategories.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/products/${category.slug}/${sub.slug}`}
                className="group p-3 bg-white rounded border border-brand-border hover:border-brand-brass hover:shadow-md transition-all text-center flex flex-col justify-between h-full"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-semibold text-xs text-brand-dark group-hover:text-brand-brass transition-colors line-clamp-1">
                    {sub.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-light line-clamp-2">
                    {sub.description}
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-semibold text-brand-brass uppercase flex items-center justify-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Browse</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Catalog Filter & Products Grid */}
      <section>
        <CatalogClient
          initialProducts={categoryProducts}
          categories={categories}
          collections={collections}
          initialCategory={category.slug}
        />
      </section>

    </div>
  );
}
