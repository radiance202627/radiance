'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, AlertOctagon, RefreshCw, Package, FolderTree, Boxes } from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ToastNotification, { ToastMessage } from '@/components/admin/ToastNotification';

export default function AdminTrashPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'collections'>('products');
  const [trashData, setTrashData] = useState<{
    products: any[];
    categories: any[];
    collections: any[];
  }>({
    products: [],
    categories: [],
    collections: [],
  });
  const [loading, setLoading] = useState(true);

  // Confirm Purge / Restore Modal
  const [targetItem, setTargetItem] = useState<{
    id: string;
    name: string;
    entity: 'product' | 'category' | 'collection';
    action: 'restore' | 'purge';
  } | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadTrash = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trash');
      const data = await res.json();
      if (res.ok && data.success) {
        setTrashData({
          products: data.data?.products || [],
          categories: data.data?.categories || [],
          collections: data.data?.collections || [],
        });
      }
    } catch {
      addToast('error', 'Failed to load trash items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleExecuteAction = async () => {
    if (!targetItem) return;

    try {
      const res = await fetch('/api/trash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity: targetItem.entity,
          action: targetItem.action,
          id: targetItem.id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        addToast(
          'success',
          targetItem.action === 'restore'
            ? `Restored "${targetItem.name}"`
            : `Permanently deleted "${targetItem.name}"`
        );
        setTargetItem(null);
        loadTrash();
      } else {
        addToast('error', data.error?.message || 'Trash operation failed');
      }
    } catch {
      addToast('error', 'Error performing trash operation');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-100 flex items-center gap-3">
            <Trash2 className="w-6 h-6 text-red-400" />
            Trash & Soft Delete Manager
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Review soft-deleted records. Restore items to active status or permanently purge them.
          </p>
        </div>

        <button
          onClick={loadTrash}
          className="p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-400 hover:text-stone-100 transition self-start"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-stone-900 text-amber-400 border-t-2 border-amber-400 border-x border-stone-800'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Package className="w-4 h-4" /> Deleted Products ({trashData.products.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-stone-900 text-emerald-400 border-t-2 border-emerald-400 border-x border-stone-800'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <FolderTree className="w-4 h-4" /> Deleted Categories ({trashData.categories.length})
        </button>

        <button
          onClick={() => setActiveTab('collections')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 ${
            activeTab === 'collections'
              ? 'bg-stone-900 text-sky-400 border-t-2 border-sky-400 border-x border-stone-800'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Boxes className="w-4 h-4" /> Deleted Collections ({trashData.collections.length})
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 border-b border-stone-800 text-stone-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Identifier / Slug</th>
                <th className="py-3 px-4">Deleted Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-500">
                    <span className="inline-block w-6 h-6 border-2 border-red-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading trash items...</p>
                  </td>
                </tr>
              ) : activeTab === 'products' && trashData.products.length > 0 ? (
                trashData.products.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-semibold text-stone-200">{item.name}</td>
                    <td className="py-3 px-4 font-mono text-amber-400">{item.sku}</td>
                    <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                      {new Date(item.deletedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() =>
                          setTargetItem({ id: item.id, name: item.name, entity: 'product', action: 'restore' })
                        }
                        className="px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 rounded-lg text-xs font-semibold transition"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() =>
                          setTargetItem({ id: item.id, name: item.name, entity: 'product', action: 'purge' })
                        }
                        className="px-3 py-1 bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg text-xs font-semibold transition"
                      >
                        Purge Permanently
                      </button>
                    </td>
                  </tr>
                ))
              ) : activeTab === 'categories' && trashData.categories.length > 0 ? (
                trashData.categories.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-semibold text-stone-200">{item.name}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">/{item.slug}</td>
                    <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                      {new Date(item.deletedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() =>
                          setTargetItem({ id: item.id, name: item.name, entity: 'category', action: 'restore' })
                        }
                        className="px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 rounded-lg text-xs font-semibold transition"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() =>
                          setTargetItem({ id: item.id, name: item.name, entity: 'category', action: 'purge' })
                        }
                        className="px-3 py-1 bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg text-xs font-semibold transition"
                      >
                        Purge Permanently
                      </button>
                    </td>
                  </tr>
                ))
              ) : activeTab === 'collections' && trashData.collections.length > 0 ? (
                trashData.collections.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-semibold text-stone-200">{item.name}</td>
                    <td className="py-3 px-4 font-mono text-sky-400">/{item.slug}</td>
                    <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                      {new Date(item.deletedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() =>
                          setTargetItem({ id: item.id, name: item.name, entity: 'collection', action: 'restore' })
                        }
                        className="px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 rounded-lg text-xs font-semibold transition"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() =>
                          setTargetItem({ id: item.id, name: item.name, entity: 'collection', action: 'purge' })
                        }
                        className="px-3 py-1 bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg text-xs font-semibold transition"
                      >
                        Purge Permanently
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-500 italic">
                    Trash is empty for this section. No deleted records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!targetItem}
        title={targetItem?.action === 'purge' ? 'Permanently Purge Record' : 'Restore Record'}
        message={
          targetItem?.action === 'purge'
            ? `WARNING: Are you sure you want to permanently delete "${targetItem?.name}"? This action cannot be undone.`
            : `Are you sure you want to restore "${targetItem?.name}" back to the active catalog?`
        }
        confirmText={targetItem?.action === 'purge' ? 'Purge Permanently' : 'Restore Record'}
        confirmVariant={targetItem?.action === 'purge' ? 'danger' : 'primary'}
        onConfirm={handleExecuteAction}
        onCancel={() => setTargetItem(null)}
      />

      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
