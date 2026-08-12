'use client';

import React, { useState, useEffect } from 'react';
import { Boxes, Plus, Edit, Trash2, RefreshCw, X, Save, Star } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ToastNotification, { ToastMessage } from '@/components/admin/ToastNotification';
import { slugify } from '@/lib/utils/slug';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT'>('ACTIVE');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Delete & Toasts
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/collections?mode=admin');
      const data = await res.json();
      if (res.ok && data.success) {
        setCollections(data.data || []);
      }
    } catch {
      addToast('error', 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const openCreateModal = () => {
    setEditingCollection(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setFeatured(false);
    setSortOrder(0);
    setStatus('ACTIVE');
    setSeoTitle('');
    setSeoDescription('');
    setShowModal(true);
  };

  const openEditModal = (col: any) => {
    setEditingCollection(col);
    setName(col.name || '');
    setSlug(col.slug || '');
    setDescription(col.description || '');
    setImage(col.image || '');
    setFeatured(!!col.featured);
    setSortOrder(col.sortOrder || 0);
    setStatus(col.status || 'ACTIVE');
    setSeoTitle(col.seoTitle || '');
    setSeoDescription(col.seoDescription || '');
    setShowModal(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCollection) setSlug(slugify(val));
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
      featured,
      sortOrder: Number(sortOrder),
      status,
      seoTitle,
      seoDescription,
    };

    try {
      const url = editingCollection ? `/api/collections/${editingCollection.id}` : '/api/collections';
      const method = editingCollection ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        addToast('success', editingCollection ? 'Collection updated' : 'Collection created');
        setShowModal(false);
        loadCollections();
      } else {
        addToast('error', data.error?.message || 'Failed to save collection');
      }
    } catch {
      addToast('error', 'Error saving collection');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const res = await fetch(`/api/collections/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('success', 'Moved collection to Trash');
        setDeleteTargetId(null);
        loadCollections();
      } else {
        addToast('error', 'Failed to delete collection');
      }
    } catch {
      addToast('error', 'Error deleting collection');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-100 flex items-center gap-3">
            <Boxes className="w-6 h-6 text-sky-400" />
            Curated Collections
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Manage architectural hardware collections (Vintage, Black Antique, Nautical, Decorative).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCollections}
            className="p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-400 hover:text-stone-100 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-sky-500 text-white rounded-xl text-xs font-semibold hover:bg-sky-400 transition shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Collection
          </button>
        </div>
      </div>

      {/* Collection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-stone-500">
            <span className="inline-block w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading collections...</p>
          </div>
        ) : collections.length > 0 ? (
          collections.map((col) => (
            <div
              key={col.id}
              className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl flex flex-col hover:border-sky-500/30 transition group"
            >
              <div className="relative h-40 bg-stone-950 overflow-hidden">
                <img
                  src={col.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop'}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />
                {col.featured && (
                  <span className="absolute top-3 left-3 bg-amber-400 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-stone-950" /> Featured
                  </span>
                )}
                <span className="absolute top-3 right-3 text-[10px] font-mono bg-stone-950/80 px-2 py-0.5 rounded text-stone-300 border border-stone-800">
                  {col._count?.products || 0} products
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-stone-100 text-base">{col.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        col.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      {col.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">{col.description || 'Curated architectural collection'}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-800/80">
                  <span className="text-[11px] font-mono text-stone-500">/{col.slug}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(col)}
                      className="p-1.5 text-stone-400 hover:text-amber-400 rounded-lg hover:bg-stone-800 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(col.id)}
                      className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg hover:bg-stone-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-stone-500 italic">
            No collections created yet.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleSave}
            className="bg-stone-900 border border-stone-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-100">
                {editingCollection ? `Edit Collection: ${editingCollection.name}` : 'Create Collection'}
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
                    Collection Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Vintage Collection"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none"
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
                    placeholder="vintage"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs font-mono text-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Collection overview and design theme..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Collection Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 rounded"
                  />
                  <span className="text-xs font-semibold text-stone-200">Featured Collection</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-stone-300">Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="bg-stone-950 border border-stone-800 rounded-xl px-2 py-1 text-xs text-stone-200"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
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
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                {saving && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <Save className="w-3.5 h-3.5" /> Save Collection
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Move Collection to Trash"
        message="Are you sure you want to move this collection to the Trash?"
        confirmText="Move to Trash"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
