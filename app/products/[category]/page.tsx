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
import { ArrowRight, Layers, HelpCircle, ShieldCheck, Factory, Globe } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateCollectionSchema, generateFAQPageSchema, getCanonicalUrl } from '@/lib/seo/schema';
import { categorySeoMap } from '@/data/categorySeo';

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) return { title: 'Category Not Found' };

  const seoData = categorySeoMap[category.slug];
  const canonicalUrl = getCanonicalUrl(`/products/${category.slug}`);

  return {
    title: seoData ? seoData.title : `${category.name} | Architectural Hardware Catalog | Radiance`,
    description: seoData ? seoData.manufacturingOverview : category.description,
    keywords: [
      category.name,
      ...category.subcategories.map((s) => s.name),
      'Architectural Hardware Manufacturer',
      'Brass Hardware Manufacturer',
      'Hardware Exporter India',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `${category.name} | Radiance Architectural Hardware Foundry`,
      description: category.description,
      images: [
        {
          url: category.heroImage,
          width: 1200,
          height: 630,
          alt: `${category.name} Architectural Range`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Radiance Hardware`,
      description: category.description,
      images: [category.heroImage],
    },
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
  const seoData = categorySeoMap[category.slug];

  const collectionSchema = generateCollectionSchema(
    category.name,
    category.description,
    `/products/${category.slug}`,
    categoryProducts
  );

  const faqSchema = seoData?.faqs ? generateFAQPageSchema(seoData.faqs) : null;

  return (
    <div className="space-y-12 pb-16 font-sans">
      <JsonLd data={faqSchema ? [collectionSchema, faqSchema] : collectionSchema} />
      
      {/* Category Hero Banner */}
      <section className="relative min-h-[35vh] flex items-center bg-[#F4F2ED] text-[#222222] overflow-hidden border-b border-[#E5E2DA]">
        <Image
          src={category.heroImage}
          alt={`${category.name} Architectural Hardware Range`}
          fill
          priority
          className="object-cover object-center opacity-15 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-4">
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: category.name },
            ]}
          />

          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-sans font-medium uppercase tracking-[0.20em] text-[#B08D57]">
              Foundry Category
            </span>
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#222222] tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-[#666666] font-sans font-normal leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Subcategory Grid Cards Section */}
      {category.subcategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#B08D57]" />
            <h2 className="font-serif font-bold text-lg text-[#222222] tracking-tight">
              {category.name} Subcategories ({category.subcategories.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/products/${category.slug}/${sub.slug}`}
                className="group p-3 bg-[#F4F2ED] rounded-[8px] border border-[#E5E2DA] hover:border-[#B08D57] transition-colors text-center flex flex-col justify-between h-full"
              >
                <div className="space-y-1">
                  <h3 className="font-serif font-semibold text-xs text-[#222222] group-hover:text-[#B08D57] transition-colors line-clamp-1">
                    {sub.name}
                  </h3>
                  <p className="text-[10px] text-[#666666] font-sans font-normal line-clamp-2">
                    {sub.description}
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-sans font-medium text-[#B08D57] uppercase flex items-center justify-center gap-1">
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

      {/* 400-700 WORD UNIQUE CATEGORY SEO GUIDE & SPECIFICATION SECTION */}
      {seoData && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
          <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 sm:p-10 space-y-8">
            <div className="space-y-2 border-b border-[#E5E2DA] pb-6">
              <span className="text-xs font-sans font-medium uppercase tracking-widest text-[#B08D57]">
                Technical Manufacturing & Trade Guide
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#222222]">
                {category.name} Manufacturing Specifications & Export Capabilities
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#666666] leading-relaxed">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#222222] font-serif font-bold text-sm">
                  <Factory className="w-4 h-4 text-[#B08D57]" />
                  <h3>Manufacturing & Foundry Overview</h3>
                </div>
                <p>{seoData.manufacturingOverview}</p>

                <div className="flex items-center gap-2 text-[#222222] font-serif font-bold text-sm pt-4">
                  <ShieldCheck className="w-4 h-4 text-[#B08D57]" />
                  <h3>Metallurgy & Materials Used</h3>
                </div>
                <p>{seoData.materialsUsed}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#222222] font-serif font-bold text-sm">
                  <Globe className="w-4 h-4 text-[#B08D57]" />
                  <h3>Global Export & Container Logistics</h3>
                </div>
                <p>{seoData.exportCapabilities}</p>

                <div className="flex items-center gap-2 text-[#222222] font-serif font-bold text-sm pt-4">
                  <Layers className="w-4 h-4 text-[#B08D57]" />
                  <h3>Architectural Applications & Target Industries</h3>
                </div>
                <p>{seoData.applications}</p>
                <p className="text-[11px] text-[#666666] italic">{seoData.industriesServed}</p>
              </div>
            </div>

            {/* Why Choose Radiance Highlight */}
            <div className="p-4 bg-[#FAF9F6] rounded-[8px] border border-[#E5E2DA] text-xs text-[#222222]">
              <strong className="font-serif block mb-1">Why Choose SB PATTERN WORKS Aligarh Foundry:</strong>
              <span className="text-[#666666]">{seoData.whyChooseSBPatternWorks}</span>
            </div>
          </div>

          {/* UNIQUE CATEGORY FAQs */}
          {seoData.faqs && seoData.faqs.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E5E2DA] pb-4">
                <HelpCircle className="w-5 h-5 text-[#B08D57]" />
                <h3 className="font-serif font-bold text-xl text-[#222222]">
                  {category.name} Technical Trade FAQs
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seoData.faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 bg-[#F4F2ED] rounded-xl border border-[#E5E2DA] space-y-2">
                    <h4 className="font-serif font-semibold text-xs text-[#222222]">
                      {faq.question}
                    </h4>
                    <p className="text-[11px] text-[#666666] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

    </div>
  );
}
