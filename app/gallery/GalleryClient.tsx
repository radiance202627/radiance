'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Search, Images, ArrowRight, Filter, Eye, Sparkles } from 'lucide-react';
import { GALLERY_CATEGORIES } from '@/lib/services/galleryService';

interface GalleryAlbumItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  projectType?: string | null;
  featuredImage?: string | null;
  items: { url: string; title?: string | null; caption?: string | null }[];
  createdAt: string | Date;
}

interface GalleryClientProps {
  initialData: {
    albums: GalleryAlbumItem[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export const GalleryClient: React.FC<GalleryClientProps> = ({ initialData }) => {
  const [albums, setAlbums] = useState<GalleryAlbumItem[]>(initialData.albums || []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialData.page || 1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);

  const fetchFilteredAlbums = async (cat: string, q: string, p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: 'PUBLISHED',
        page: p.toString(),
        limit: '12',
      });
      if (cat !== 'All') params.append('category', cat);
      if (q.trim()) params.append('search', q.trim());

      const res = await fetch(`/api/gallery?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAlbums(data.albums || []);
        setTotalPages(data.totalPages || 1);
        setPage(p);
      }
    } catch (err) {
      console.error('Filter error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    fetchFilteredAlbums(cat, searchQuery, 1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredAlbums(selectedCategory, searchQuery, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      <Breadcrumbs items={[{ label: 'Manufacturing & Project Gallery' }]} />

      {/* Header Banner */}
      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-8 sm:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B08D57]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF9F6] text-[#B08D57] border border-[#B08D57]/30 rounded-md">
            <Images className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Foundry & Craft Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#222222] tracking-tight leading-tight">
            Factory, Manufacturing & Custom Project Gallery
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Visual tour of SB PATTERN WORKS operations: virgin brass founding, multi-axis CNC machining, patination workshops, export packaging, and installed architectural projects.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-4 flex items-center gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by project type, facility, or showcase..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] text-xs font-medium uppercase tracking-wider rounded-xl transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-[#B08D57] shrink-0 mr-1" />
          {['All', ...GALLERY_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-full transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#B08D57] text-[#FAF9F6] shadow-sm font-semibold'
                  : 'bg-[#F4F2ED] text-[#666666] hover:bg-[#E5E2DA] border border-[#E5E2DA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Album Grid */}
      <div className="space-y-6">
        <SectionHeading
          title="Featured Showcase Albums"
          subtitle={`Displaying ${albums.length} albums in ${selectedCategory} category`}
        />

        {loading ? (
          <div className="py-16 text-center text-xs text-[#666666]">Loading gallery albums...</div>
        ) : albums.length === 0 ? (
          <div className="py-16 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] text-center space-y-2">
            <p className="text-sm font-serif font-bold text-[#222222]">No gallery albums found</p>
            <p className="text-xs text-[#666666]">Try choosing a different category or clearing your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] overflow-hidden shadow-sm flex flex-col group hover:border-[#B08D57]/50 transition duration-300"
              >
                {/* Featured Thumbnail */}
                <div className="relative h-56 w-full bg-[#FAF9F6] overflow-hidden">
                  <Image
                    src={album.featuredImage || album.items[0]?.url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop'}
                    alt={album.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-[#FAF9F6]/90 backdrop-blur-md text-[#222222] text-[10px] font-semibold uppercase tracking-wider rounded-md border border-[#E5E2DA]">
                      {album.category || 'Manufacturing'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 bg-[#B08D57] text-[#FAF9F6] text-[10px] font-bold rounded-full">
                      {album.items?.length || 0} Photos
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-serif font-bold text-[#222222] group-hover:text-[#B08D57] transition-colors leading-snug">
                      <Link href={`/gallery/${album.slug}`}>{album.title}</Link>
                    </h3>
                    {album.description && (
                      <p className="text-xs text-[#666666] leading-relaxed line-clamp-2">
                        {album.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E5E2DA] flex items-center justify-between">
                    <span className="text-[11px] text-[#666666]">
                      {album.projectType || 'Factory Showcase'}
                    </span>

                    <Link
                      href={`/gallery/${album.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B08D57] uppercase tracking-wider hover:gap-2.5 transition-all"
                    >
                      <span>View Gallery</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-6 flex items-center justify-center gap-3 text-xs">
          <button
            disabled={page <= 1}
            onClick={() => fetchFilteredAlbums(selectedCategory, searchQuery, page - 1)}
            className="px-4 py-2 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl font-medium disabled:opacity-40 hover:bg-[#E5E2DA] transition"
          >
            Previous
          </button>
          <span className="text-[#666666] px-2">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => fetchFilteredAlbums(selectedCategory, searchQuery, page + 1)}
            className="px-4 py-2 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl font-medium disabled:opacity-40 hover:bg-[#E5E2DA] transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
