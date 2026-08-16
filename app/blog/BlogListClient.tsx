'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Search, Calendar, Clock, User, ArrowRight, BookOpen, Sparkles, Filter } from 'lucide-react';

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  imageAlt?: string | null;
  category?: string | null;
  author?: string | null;
  readingTime?: string | null;
  featured: boolean;
  publishDate?: string | Date | null;
  createdAt: string | Date;
}

interface BlogListClientProps {
  initialData: {
    posts: BlogPostItem[];
    total: number;
    page: number;
    totalPages: number;
  };
}

const CATEGORIES = [
  'All',
  'Architectural Hardware',
  'Metallurgy & Foundry',
  'Custom OEM',
  'Design Trends',
  'Export & Trade',
];

export const BlogListClient: React.FC<BlogListClientProps> = ({ initialData }) => {
  const [posts, setPosts] = useState<BlogPostItem[]>(initialData.posts || []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialData.page || 1);
  const [totalPages, setTotalPages] = useState(initialData.totalPages || 1);

  const fetchFilteredPosts = async (cat: string, q: string, p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: 'PUBLISHED',
        page: p.toString(),
        limit: '12',
      });
      if (cat !== 'All') params.append('category', cat);
      if (q.trim()) params.append('search', q.trim());

      const res = await fetch(`/api/blog?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
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
    fetchFilteredPosts(cat, searchQuery, 1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredPosts(selectedCategory, searchQuery, 1);
  };

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const regularPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      <Breadcrumbs items={[{ label: 'Blog & Articles' }]} />

      {/* Header Banner */}
      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-8 sm:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B08D57]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF9F6] text-[#B08D57] border border-[#B08D57]/30 rounded-md">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Industry Insights</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#222222] tracking-tight leading-tight">
            Architectural Hardware & Foundry Journal
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            In-depth guides on virgin brass metallurgy, custom CAD pattern making, gravity die casting, period hardware restoration, and export logistics.
          </p>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="pt-4 flex items-center gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles, topics, alloys..."
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
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-[#B08D57] shrink-0 mr-1" />
        {CATEGORIES.map((cat) => (
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

      {/* Featured Banner Post */}
      {featuredPost && page === 1 && !searchQuery && selectedCategory === 'All' && (
        <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0 group">
          <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[400px]">
            <Image
              src={featuredPost.featuredImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop'}
              alt={featuredPost.imageAlt || featuredPost.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-[#B08D57] text-[#FAF9F6] text-[10px] font-semibold uppercase tracking-widest rounded-md">
                Featured Article
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-semibold text-[#B08D57] uppercase tracking-wider">
                {featuredPost.category || 'Architectural Hardware'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222] leading-tight group-hover:text-[#B08D57] transition-colors">
                <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h2>
              <p className="text-xs text-[#666666] leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E2DA] flex items-center justify-between">
              <div className="flex items-center gap-4 text-[11px] text-[#666666]">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#B08D57]" />
                  {featuredPost.author || 'SB Pattern Works'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#B08D57]" />
                  {featuredPost.readingTime || '5 min read'}
                </span>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B08D57] uppercase tracking-wider hover:gap-2.5 transition-all"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Articles Grid */}
      <div className="space-y-6">
        <SectionHeading
          title="All Articles & Guides"
          subtitle={`Showing ${posts.length} published articles`}
        />

        {loading ? (
          <div className="py-16 text-center text-xs text-[#666666]">Loading articles...</div>
        ) : regularPosts.length === 0 ? (
          <div className="py-16 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] text-center space-y-2">
            <p className="text-sm font-serif font-bold text-[#222222]">No articles found</p>
            <p className="text-xs text-[#666666]">Try selecting a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] overflow-hidden shadow-sm flex flex-col group hover:border-[#B08D57]/50 transition duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-48 w-full bg-[#FAF9F6]">
                  <Image
                    src={post.featuredImage || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop'}
                    alt={post.imageAlt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-[#FAF9F6]/90 backdrop-blur-md text-[#222222] text-[10px] font-semibold uppercase tracking-wider rounded-md border border-[#E5E2DA]">
                      {post.category || 'Hardware'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-serif font-bold text-[#222222] group-hover:text-[#B08D57] transition-colors leading-snug line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs text-[#666666] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E2DA] flex items-center justify-between text-[11px] text-[#666666]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#B08D57]" />
                        {new Date(post.publishDate || post.createdAt).toLocaleDateString()}
                      </span>
                      <span>• {post.readingTime || '4 min read'}</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-[#B08D57] font-semibold hover:underline"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-6 flex items-center justify-center gap-3 text-xs">
          <button
            disabled={page <= 1}
            onClick={() => fetchFilteredPosts(selectedCategory, searchQuery, page - 1)}
            className="px-4 py-2 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl font-medium disabled:opacity-40 hover:bg-[#E5E2DA] transition"
          >
            Previous
          </button>
          <span className="text-[#666666] px-2">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => fetchFilteredPosts(selectedCategory, searchQuery, page + 1)}
            className="px-4 py-2 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl font-medium disabled:opacity-40 hover:bg-[#E5E2DA] transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
