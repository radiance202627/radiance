'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Heading1,
  Heading2,
  List,
  Table,
  Code,
  Link as LinkIcon,
  CheckCircle,
} from 'lucide-react';
import { uploadImageToStorage } from '@/lib/storage';

export default function CreateBlogPostPage() {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [category, setCategory] = useState('Architectural Hardware');
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('SB Pattern Works');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'>('DRAFT');
  const [featured, setFeatured] = useState(false);
  const [publishDate, setPublishDate] = useState(new Date().toISOString().slice(0, 16));

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogImage, setOgImage] = useState('');

  const [uploading, setUploading] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToStorage(file, 'blog-images', 'posts');
      setFeaturedImage(url);
      if (!ogImage) setOgImage(url);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    setContent((prev) => prev + `\n${prefix}sample text${suffix}\n`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Title and Content are required!');
      return;
    }

    setSaving(true);
    try {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title,
        slug: slug || undefined,
        excerpt: excerpt || undefined,
        content,
        featuredImage: featuredImage || undefined,
        imageAlt: imageAlt || title,
        category,
        tags: parsedTags,
        author,
        status,
        featured,
        publishDate,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt || undefined,
        canonicalUrl: canonicalUrl || undefined,
        ogImage: ogImage || featuredImage || undefined,
      };

      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        window.location.href = '/admin/blog';
      } else {
        alert(data.error || 'Failed to create post');
      }
    } catch (err) {
      console.error('Error saving post:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-[#666666] hover:text-[#222222] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#222222]">Create New Article</h1>
            <p className="text-xs text-[#666666]">Write and publish rich markdown articles with SEO schemas.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl transition shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Details Card */}
          <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#B08D57] mb-1">
                Article Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Master Metallurgy: Sand Casting vs Gravity Die Casting"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-base font-serif font-bold text-[#222222] focus:outline-none focus:border-[#B08D57]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1">
                URL Slug (Auto Generated)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#666666] font-mono">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs font-mono text-[#222222] focus:outline-none focus:border-[#B08D57]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1">
                Excerpt / Summary
              </label>
              <textarea
                rows={3}
                placeholder="Brief 2-3 sentence overview for search engines and article list cards..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
              />
            </div>
          </div>

          {/* Markdown Content Editor */}
          <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition ${
                    activeTab === 'write'
                      ? 'bg-[#B08D57] text-[#FAF9F6]'
                      : 'text-[#666666] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                  Write Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition ${
                    activeTab === 'preview'
                      ? 'bg-[#B08D57] text-[#FAF9F6]'
                      : 'text-[#666666] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  Preview
                </button>
              </div>

              {/* Formatting Toolbar */}
              {activeTab === 'write' && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('## ')}
                    className="p-1.5 hover:bg-[#FAF9F6] text-[#666666] rounded-lg text-xs"
                    title="Heading 2"
                  >
                    <Heading1 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('### ')}
                    className="p-1.5 hover:bg-[#FAF9F6] text-[#666666] rounded-lg text-xs"
                    title="Heading 3"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('- ')}
                    className="p-1.5 hover:bg-[#FAF9F6] text-[#666666] rounded-lg text-xs"
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n| Column 1 | Column 2 |\n| --- | --- |\n| Data 1 | Data 2 |\n')}
                    className="p-1.5 hover:bg-[#FAF9F6] text-[#666666] rounded-lg text-xs"
                    title="Table"
                  >
                    <Table className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('```ts\n', '\n```')}
                    className="p-1.5 hover:bg-[#FAF9F6] text-[#666666] rounded-lg text-xs"
                    title="Code Block"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {activeTab === 'write' ? (
              <textarea
                rows={16}
                placeholder="Write your article content using Markdown format... Support headings, lists, tables, code blocks, blockquotes, and links."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs font-mono leading-relaxed text-[#222222] focus:outline-none focus:border-[#B08D57]"
                required
              />
            ) : (
              <div className="p-6 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] min-h-[350px] whitespace-pre-line leading-relaxed font-sans">
                {content || <em className="text-[#666666]">Nothing to preview yet...</em>}
              </div>
            )}
          </div>

          {/* SEO Metadata Card */}
          <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#222222]">SEO & Social Metadata</h3>

            <div>
              <label className="block text-[11px] font-medium text-[#666666] mb-1">SEO Meta Title</label>
              <input
                type="text"
                placeholder={title || 'Leave blank to fallback to Article Title'}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#666666] mb-1">SEO Meta Description</label>
              <textarea
                rows={2}
                placeholder={excerpt || 'Meta description for Google search snippets'}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[#666666] mb-1">Canonical URL</label>
                <input
                  type="text"
                  placeholder="https://sbpatternworks.com/blog/..."
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#666666] mb-1">OG Image URL</label>
                <input
                  type="text"
                  placeholder={featuredImage || 'Custom OpenGraph social image URL'}
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Configuration Area */}
        <div className="space-y-6">
          {/* Status & Schedule Card */}
          <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#222222]">Publish Settings</h3>

            <div>
              <label className="block text-[11px] font-medium text-[#666666] mb-1">Post Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] font-semibold"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="ARCHIVED">Archive</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#666666] mb-1">Publish Date</label>
              <input
                type="datetime-local"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="featuredToggle"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#B08D57]"
              />
              <label htmlFor="featuredToggle" className="text-xs font-semibold text-[#222222]">
                Mark as Featured Article
              </label>
            </div>
          </div>

          {/* Featured Image Uploader */}
          <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#222222]">Featured Image</h3>

            {featuredImage ? (
              <div className="space-y-2">
                <div className="relative h-40 rounded-xl overflow-hidden border border-[#E5E2DA] bg-black/5">
                  <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                </div>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-lg text-[11px] text-[#666666]"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#E5E2DA] rounded-xl p-6 text-center space-y-2 bg-[#FAF9F6]">
                <ImageIcon className="w-8 h-8 text-[#666666]/40 mx-auto" />
                <p className="text-xs text-[#666666]">Upload image to Supabase Storage</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B08D57] text-[#FAF9F6] text-[11px] font-semibold uppercase rounded-lg cursor-pointer hover:bg-[#9A7B4B] transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Browse File'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-[#666666] mb-1">Image Alt Text</label>
              <input
                type="text"
                placeholder="Descriptive alt text for accessibility & SEO"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
              />
            </div>
          </div>

          {/* Categorization Card */}
          <div className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] space-y-4">
            <h3 className="font-serif font-bold text-sm text-[#222222]">Category & Author</h3>

            <div>
              <label className="block text-[11px] font-medium text-[#666666] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
              >
                <option value="Architectural Hardware">Architectural Hardware</option>
                <option value="Metallurgy & Foundry">Metallurgy & Foundry</option>
                <option value="Custom OEM">Custom OEM</option>
                <option value="Design Trends">Design Trends</option>
                <option value="Export & Trade">Export & Trade</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#666666] mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                placeholder="Brass, Foundry, OEM, Hardware"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#666666] mb-1">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
