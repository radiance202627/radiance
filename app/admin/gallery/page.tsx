'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Images,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Upload,
  X,
  CheckCircle,
  Clock,
  Archive,
  Image as ImageIcon,
} from 'lucide-react';
import { uploadImageToStorage } from '@/lib/storage';
import { GALLERY_CATEGORIES } from '@/lib/services/galleryService';
import MediaUploader from '@/components/admin/MediaUploader';

interface GalleryItem {
  id?: string;
  url: string;
  title?: string;
  altText?: string;
  caption?: string;
  sortOrder?: number;
}

interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  projectType?: string;
  featuredImage?: string;
  sortOrder: number;
  status: string;
  items: GalleryItem[];
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'TRASH'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [saving, setSaving] = useState(false);

  // Modal Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Manufacturing');
  const [projectType, setProjectType] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('PUBLISHED');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        status: statusFilter,
        page: page.toString(),
        limit: '12',
      });
      if (categoryFilter !== 'All') query.append('category', categoryFilter);
      if (search) query.append('search', search);

      const res = await fetch(`/api/gallery?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAlbums(data.albums || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error('Fetch gallery albums error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, [categoryFilter, statusFilter, page]);

  const openCreateModal = () => {
    setEditingAlbum(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setCategory('Manufacturing');
    setProjectType('');
    setFeaturedImage('');
    setStatus('PUBLISHED');
    setItems([]);
    setIsModalOpen(true);
  };

  const openEditModal = (album: GalleryAlbum) => {
    setEditingAlbum(album);
    setTitle(album.title);
    setSlug(album.slug);
    setDescription(album.description || '');
    setCategory(album.category || 'Manufacturing');
    setProjectType(album.projectType || '');
    setFeaturedImage(album.featuredImage || '');
    setStatus((album.status as any) || 'PUBLISHED');
    setItems(album.items || []);
    setIsModalOpen(true);
  };

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const uploadedItems: GalleryItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImageToStorage(file, 'gallery-images', 'albums');
        uploadedItems.push({
          url,
          title: file.name.replace(/\.[^/.]+$/, ''),
          altText: title || 'Gallery Image',
          caption: '',
          sortOrder: items.length + i,
        });
      }

      setItems((prev) => [...prev, ...uploadedItems]);
      if (!featuredImage && uploadedItems.length > 0) {
        setFeaturedImage(uploadedItems[0].url);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Album title is required!');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        slug: slug || undefined,
        description: description || undefined,
        category,
        projectType: projectType || undefined,
        featuredImage: featuredImage || (items[0]?.url || undefined),
        status,
        items,
      };

      const url = editingAlbum ? `/api/gallery/${editingAlbum.id}` : '/api/gallery';
      const method = editingAlbum ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchAlbums();
      } else {
        alert(data.error || 'Failed to save album');
      }
    } catch (err) {
      console.error('Save album error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAlbum = async (id: string, permanent = false) => {
    if (!confirm(permanent ? 'Permanently delete this album?' : 'Move album to trash?')) return;

    try {
      const url = `/api/gallery/${id}${permanent ? '?action=permanent' : ''}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchAlbums();
      }
    } catch (e) {
      console.error('Delete album error:', e);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA]">
        <div>
          <div className="flex items-center gap-2 text-[#B08D57]">
            <Images className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">Gallery CMS</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#222222] mt-1">Photo & Project Albums</h1>
          <p className="text-xs text-[#666666] mt-0.5">Manage factory photos, installation projects, and trade show showcases.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Album</span>
        </button>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-[#B08D57] uppercase tracking-wider shrink-0 mr-2">Category:</span>
          {['All', ...GALLERY_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#B08D57] text-[#FAF9F6] font-semibold shadow-sm'
                  : 'bg-[#F4F2ED] text-[#666666] hover:bg-[#E5E2DA] border border-[#E5E2DA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Album Grid Display */}
      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#666666] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#B08D57]" />
            <span>Loading gallery albums...</span>
          </div>
        ) : albums.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ImageIcon className="w-10 h-10 text-[#666666]/40 mx-auto" />
            <p className="text-sm font-medium text-[#222222]">No gallery albums found</p>
            <p className="text-xs text-[#666666]">Click "Create Album" to add your first photo showcase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-[#FAF9F6] rounded-xl border border-[#E5E2DA] overflow-hidden shadow-sm flex flex-col group"
              >
                <div className="relative h-48 w-full bg-black/5">
                  {album.featuredImage ? (
                    <img
                      src={album.featuredImage}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#666666]">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#222222]/80 backdrop-blur-md text-[#FAF9F6] text-[10px] font-semibold uppercase tracking-wider rounded-md">
                      {album.category || 'General'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 bg-[#B08D57] text-[#FAF9F6] text-[10px] font-bold rounded-full">
                      {album.items?.length || 0} Photos
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#222222] line-clamp-1">{album.title}</h3>
                    {album.description && (
                      <p className="text-xs text-[#666666] line-clamp-2 mt-1 leading-relaxed">
                        {album.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E5E2DA] flex items-center justify-between">
                    <span className="text-[10px] uppercase font-semibold text-[#B08D57]">
                      Status: {album.status}
                    </span>

                    <div className="flex items-center gap-1">
                      <Link
                        href={`/gallery/${album.slug}`}
                        target="_blank"
                        className="p-1.5 text-[#666666] hover:text-[#222222] hover:bg-[#F4F2ED] rounded-lg transition"
                        title="View Album"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openEditModal(album)}
                        className="p-1.5 text-[#B08D57] hover:bg-[#B08D57]/10 rounded-lg transition"
                        title="Edit Album"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlbum(album.id, false)}
                        className="p-1.5 text-[#666666] hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Album"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Creating / Editing Album */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF9F6] border border-[#E5E2DA] rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-[#E5E2DA] bg-[#F4F2ED] flex items-center justify-between">
              <h2 className="font-serif font-bold text-lg text-[#222222]">
                {editingAlbum ? 'Edit Gallery Album' : 'Create New Album'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#666666] hover:text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#B08D57] mb-1">
                    Album Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Precision CNC Machining & Lathe Operations"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slug) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    className="w-full px-3.5 py-2 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
                  >
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] mb-1">
                  Album Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Overview of this project, installation site, or foundry showcase..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
                />
              </div>

              {/* Multi-Image MediaUploader */}
              <div>
                <MediaUploader
                  label="Gallery Album Photos"
                  value={items.map((i) => i.url)}
                  onChange={(urls) => {
                    const newUrls = Array.isArray(urls) ? urls : [urls];
                    setItems(
                      newUrls.map((url, idx) => ({
                        url,
                        title: `Photo ${idx + 1}`,
                        altText: title || 'Gallery Image',
                        sortOrder: idx + 1,
                      }))
                    );
                    if (newUrls.length > 0 && !featuredImage) {
                      setFeaturedImage(newUrls[0]);
                    }
                  }}
                  multiple={true}
                  folder="gallery"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E2DA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl text-xs font-semibold text-[#666666]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
