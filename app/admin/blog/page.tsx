'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  RefreshCw,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  Archive,
} from 'lucide-react';

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  author?: string;
  featured: boolean;
  status: string;
  readingTime?: string;
  createdAt: string;
  publishDate?: string;
  deletedAt?: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'TRASH'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        status: statusFilter,
        page: page.toString(),
        limit: '10',
      });
      if (search) query.append('search', search);

      const res = await fetch(`/api/blog?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error('Fetch blog posts error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const handleToggleFeatured = async (post: BlogPostItem) => {
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !post.featured }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, featured: !p.featured } : p))
        );
      }
    } catch (e) {
      console.error('Toggle featured error:', e);
    }
  };

  const handleDelete = async (id: string, permanent = false) => {
    if (!confirm(permanent ? 'Permanently delete this blog post?' : 'Move post to trash?')) return;

    try {
      const url = `/api/blog/${id}${permanent ? '?action=permanent' : ''}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchPosts();
      }
    } catch (e) {
      console.error('Delete blog post error:', e);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}?action=restore`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchPosts();
      }
    } catch (e) {
      console.error('Restore blog post error:', e);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1 w-max"><CheckCircle className="w-3 h-3"/> Published</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 rounded-full flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Draft</span>;
      case 'SCHEDULED':
        return <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 rounded-full flex items-center gap-1 w-max"><Calendar className="w-3 h-3"/> Scheduled</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-700 rounded-full flex items-center gap-1 w-max"><Archive className="w-3 h-3"/> Archived</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA]">
        <div>
          <div className="flex items-center gap-2 text-[#B08D57]">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Blog Management</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#222222] mt-1">Articles & News CMS</h1>
          <p className="text-xs text-[#666666] mt-0.5">Manage luxury manufacturer articles, guides, and SEO metadata.</p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Article</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F4F2ED] rounded-xl border border-[#E5E2DA] w-full md:w-auto overflow-x-auto">
          {(['ALL', 'PUBLISHED', 'DRAFT', 'SCHEDULED', 'TRASH'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition ${
                statusFilter === st
                  ? 'bg-[#FAF9F6] text-[#B08D57] shadow-sm font-semibold border border-[#E5E2DA]'
                  : 'text-[#666666] hover:text-[#222222]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, category, content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#F4F2ED] border border-[#E5E2DA] hover:bg-[#E5E2DA] text-[#222222] text-xs font-medium rounded-xl transition"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Articles Table */}
      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#666666] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#B08D57]" />
            <span>Loading articles...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-[#666666]/40 mx-auto" />
            <p className="text-sm font-medium text-[#222222]">No blog posts found</p>
            <p className="text-xs text-[#666666]">Try adjusting filters or create a new blog post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#222222]">
              <thead className="bg-[#FAF9F6] border-b border-[#E5E2DA] text-[10px] font-semibold text-[#666666] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Title & Slug</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2DA]">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#FAF9F6]/80 transition">
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-serif font-bold text-[#222222] truncate text-sm">{post.title}</p>
                      <p className="text-[10px] text-[#B08D57] font-mono truncate font-normal">/blog/{post.slug}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-[#FAF9F6] border border-[#E5E2DA] rounded-md text-[11px] font-medium text-[#666666]">
                        {post.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-4">{statusBadge(post.status)}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleFeatured(post)}
                        className={`p-1.5 rounded-lg border transition ${
                          post.featured
                            ? 'bg-[#B08D57]/15 border-[#B08D57]/40 text-[#B08D57]'
                            : 'bg-transparent border-transparent text-[#666666] hover:text-[#222222]'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${post.featured ? 'fill-[#B08D57]' : ''}`} />
                      </button>
                    </td>
                    <td className="py-4 px-4 text-[#666666] text-[11px]">
                      {new Date(post.publishDate || post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {statusFilter === 'TRASH' ? (
                          <>
                            <button
                              onClick={() => handleRestore(post.id)}
                              className="px-2.5 py-1 bg-[#B08D57]/15 text-[#B08D57] rounded-lg text-[10px] font-semibold uppercase hover:bg-[#B08D57]/25 transition"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => handleDelete(post.id, true)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-1.5 text-[#666666] hover:text-[#222222] hover:bg-[#FAF9F6] rounded-lg transition"
                              title="View Public Post"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/blog/${post.id}/edit`}
                              className="p-1.5 text-[#B08D57] hover:bg-[#B08D57]/10 rounded-lg transition"
                              title="Edit Article"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(post.id, false)}
                              className="p-1.5 text-[#666666] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Move to Trash"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#E5E2DA] bg-[#FAF9F6] flex items-center justify-between text-xs text-[#666666]">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 bg-[#F4F2ED] border border-[#E5E2DA] rounded-lg disabled:opacity-40 transition hover:bg-[#E5E2DA]"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 bg-[#F4F2ED] border border-[#E5E2DA] rounded-lg disabled:opacity-40 transition hover:bg-[#E5E2DA]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
