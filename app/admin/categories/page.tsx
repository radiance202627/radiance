'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Search, RefreshCw, X, Save } from 'lucide-react';
import CategoryTree, { CategoryTreeNode } from '@/components/admin/CategoryTree';
import ImageUploader, { ImageItem } from '@/components/admin/ImageUploader';
import MediaUploader from '@/components/admin/MediaUploader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ToastNotification, { ToastMessage } from '@/components/admin/ToastNotification';
import { slugify } from '@/lib/utils/slug';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryTreeNode[]>([]);
  const [flatCategories, setFlatCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT' | 'ARCHIVED'>('ACTIVE');
  const [image, setImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // Confirm Modal & Toasts
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories?mode=admin');
      const data = await res.json();

      if (res.ok && data.success) {
        const raw: any[] = data.data || [];
        setFlatCategories(raw);

        // Build Tree structure (parents with children)
        const parents = raw.filter((c) => !c.parentId);
        const tree = parents.map((p) => ({
          ...p,
          children: raw.filter((child) => child.parentId === p.id),
        }));
        setCategories(tree);
      }
    } catch {
      addToast('error', 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = (presetParentId?: string) => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setParentId(presetParentId || '');
    setSortOrder(0);
    setStatus('ACTIVE');
    setImage('');
    setSeoTitle('');
    setSeoDescription('');
    setCanonicalUrl('');
    setShowModal(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setParentId(cat.parentId || '');
    setSortOrder(cat.sortOrder || 0);
    setStatus(cat.status || 'ACTIVE');
    setImage(cat.image || '');
    setSeoTitle(cat.seoTitle || '');
    setSeoDescription(cat.seoDescription || '');
    setCanonicalUrl(cat.canonicalUrl || '');
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) setSlug(slugify(val));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setSaving(true);

    const payload = {
      name,
      slug: slug || slugify(name),
      description,
      image,
      parentId: parentId || null,
      sortOrder: Number(sortOrder),
      status,
      seoTitle,
      seoDescription,
      canonicalUrl,
    };

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        addToast('success', editingCategory ? 'Category updated' : 'Category created');
        setShowModal(false);
        loadCategories();
      } else {
        addToast('error', data.error?.message || 'Failed to save category');
      }
    } catch {
      addToast('error', 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const res = await fetch(`/api/categories/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('success', 'Moved category to Trash');
        setDeleteTargetId(null);
        loadCategories();
      } else {
        addToast('error', 'Failed to delete category');
      }
    } catch {
      addToast('error', 'Error deleting category');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-100 flex items-center gap-3">
            <FolderTree className="w-6 h-6 text-emerald-400" />
            Categories & Subcategories
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Hierarchical tree structure, subcategories, sort ordering, and SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCategories}
            className="p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-400 hover:text-stone-100 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => openCreateModal()}
            className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-semibold hover:bg-emerald-400 transition shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Parent Category
          </button>
        </div>
      </div>

      {/* Category Tree Component */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        {loading ? (
          <div className="py-12 text-center text-stone-500">
            <span className="inline-block w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading category hierarchy...</p>
          </div>
        ) : categories.length > 0 ? (
          <CategoryTree
            categories={categories}
            onEdit={openEditModal}
            onDelete={(id) => setDeleteTargetId(id)}
            onAddSubcategory={(parentId) => openCreateModal(parentId)}
          />
        ) : (
          <div className="py-12 text-center text-stone-500 italic">
            No categories defined yet. Click "Add Parent Category" to create your first category.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="bg-stone-900 border border-stone-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4 relative overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-100">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create Category'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Category Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Door Hardware"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="door-hardware"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Parent Category (Optional for Subcategory)
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
                >
                  <option value="">None (Top-Level Parent)</option>
                  {flatCategories
                    .filter((c) => !editingCategory || c.id !== editingCategory.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Category overview and architectural application..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none"
                />
              </div>

              <div>
                <MediaUploader
                  label="Category Image"
                  value={image}
                  onChange={(url) => setImage(url as string)}
                  folder="categories"
                />
              </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

              {/* SEO Fields */}
              <div className="border-t border-stone-800 pt-3 space-y-3">
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">SEO Metadata</h4>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="SEO Meta Title"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200"
                />
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="SEO Meta Description"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                {saving && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <Save className="w-3.5 h-3.5" /> Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Move Category to Trash"
        message="Are you sure you want to move this category to the Trash? You can restore it later."
        confirmText="Move to Trash"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
