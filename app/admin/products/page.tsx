'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Filter,
  Star,
  Edit2,
  Trash2,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import ConfirmModal from '@/components/admin/ConfirmModal';
import ToastNotification, { ToastMessage } from '@/components/admin/ToastNotification';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Confirm Modal & Toasts
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, collRes] = await Promise.all([
        fetch('/api/products?mode=admin').then((r) => r.json()),
        fetch('/api/categories?mode=admin').then((r) => r.json()),
        fetch('/api/collections?mode=admin').then((r) => r.json()),
      ]);

      if (prodRes.success) setProducts(prodRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
      if (collRes.success) setCollections(collRes.data || []);
    } catch (e) {
      addToast('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered & Search Results
  const filteredProducts = products.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      const matchCode = p.productCode?.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchCode) return false;
    }

    if (categoryFilter && p.categoryId !== categoryFilter && p.categorySlug !== categoryFilter) {
      return false;
    }

    if (collectionFilter) {
      const colSlugs = p.collections || [];
      if (!colSlugs.includes(collectionFilter)) return false;
    }

    if (statusFilter && p.status !== statusFilter) {
      return false;
    }

    if (featuredFilter) {
      const isFeat = featuredFilter === 'true';
      if (!!p.featured !== isFeat) return false;
    }

    return true;
  });

  // Pagination Slice
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  // Selection Logic
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkAction = async (action: 'publish' | 'draft' | 'delete') => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);

    try {
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedIds }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        addToast('success', data.data?.message || 'Bulk action applied');
        setSelectedIds([]);
        loadData();
      } else {
        addToast('error', data.error?.message || 'Bulk action failed');
      }
    } catch {
      addToast('error', 'Bulk action error occurred');
    } finally {
      setBulkLoading(false);
    }
  };

  // Soft Delete Single Item
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        addToast('success', `Moved "${deleteTarget.name}" to Trash`);
        setDeleteTarget(null);
        loadData();
      } else {
        addToast('error', 'Failed to delete product');
      }
    } catch {
      addToast('error', 'Error deleting product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-100 flex items-center gap-3">
            <Package className="w-6 h-6 text-amber-400" />
            Product Management
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Manage product catalog, specifications, variants, imagery, and publishing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            title="Refresh product list"
            className="p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-400 hover:text-stone-100 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold hover:bg-amber-300 transition shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by Product Name, SKU, or Product Code..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={collectionFilter}
              onChange={(e) => {
                setCollectionFilter(e.target.value);
                setPage(1);
              }}
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none"
            >
              <option value="">All Collections</option>
              {collections.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="CUSTOM_ORDER">Custom Order</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>

            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value);
                setPage(1);
              }}
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none"
            >
              <option value="">Featured Status</option>
              <option value="true">Featured Only</option>
              <option value="false">Standard Only</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl animate-fade-in">
            <span className="text-xs font-semibold text-amber-400">
              {selectedIds.length} item(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('publish')}
                disabled={bulkLoading}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-semibold transition"
              >
                Publish Selected
              </button>
              <button
                onClick={() => handleBulkAction('draft')}
                disabled={bulkLoading}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition"
              >
                Draft Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={bulkLoading}
                className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded-lg text-xs font-semibold transition"
              >
                Move to Trash
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 border-b border-stone-800 text-stone-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 w-10">
                  <button onClick={toggleSelectAll} className="text-stone-400 hover:text-amber-400">
                    {selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU / Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    <span className="inline-block w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading products...</p>
                  </td>
                </tr>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const thumb = Array.isArray(p.images) && p.images.length > 0
                    ? typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url
                    : '/images/placeholder.jpg';

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-stone-800/40 transition ${isSelected ? 'bg-amber-500/5' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <button onClick={() => toggleSelect(p.id)} className="text-stone-400 hover:text-amber-400">
                          {isSelected ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-stone-950 border border-stone-800 overflow-hidden flex-shrink-0">
                            <img src={thumb} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <Link href={`/admin/products/${p.id}/edit`} className="font-semibold text-stone-200 hover:text-amber-400 transition">
                              {p.name}
                            </Link>
                            <p className="text-[11px] text-stone-500 truncate max-w-xs">{p.shortDescription || 'Architectural fitting'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-400 font-semibold">{p.sku}</td>
                      <td className="py-3 px-4 text-stone-400">{p.categoryName || p.category?.name || '-'}</td>
                      <td className="py-3 px-4 text-stone-400">{p.material || '-'}</td>
                      <td className="py-3 px-4">
                        {p.featured ? (
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ) : (
                          <Star className="w-4 h-4 text-stone-600" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'AVAILABLE' || p.status === 'available' || p.status === 'PUBLISHED'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : p.status === 'DRAFT'
                              ? 'bg-stone-800 text-stone-400 border border-stone-700'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {p.status || 'AVAILABLE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          title="Preview product on public site"
                          className="p-1.5 inline-block text-stone-400 hover:text-stone-200 rounded-lg hover:bg-stone-800 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          title="Edit product"
                          className="p-1.5 inline-block text-stone-400 hover:text-amber-400 rounded-lg hover:bg-stone-800 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                          title="Move to trash"
                          className="p-1.5 text-stone-400 hover:text-red-400 rounded-lg hover:bg-stone-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500 italic">
                    No products matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <p className="text-xs text-stone-400">
            Showing <span className="font-semibold text-stone-200">{filteredProducts.length === 0 ? 0 : (page - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-stone-200">{Math.min(page * pageSize, filteredProducts.length)}</span> of{' '}
            <span className="font-semibold text-stone-200">{filteredProducts.length}</span> products
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-stone-400 font-mono">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Move to Trash"
        message={`Are you sure you want to move "${deleteTarget?.name}" to the Trash? You can restore it later from the Trash page.`}
        confirmText="Move to Trash"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
