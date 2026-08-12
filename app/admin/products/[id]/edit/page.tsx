'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Eye, Check } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import ImageUploader, { ImageItem } from '@/components/admin/ImageUploader';
import SpecificationBuilder from '@/components/admin/SpecificationBuilder';
import VariantManager, { VariantItem } from '@/components/admin/VariantManager';
import ToastNotification, { ToastMessage } from '@/components/admin/ToastNotification';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { slugify } from '@/lib/utils/slug';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [productCode, setProductCode] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [material, setMaterial] = useState('');
  const [finish, setFinish] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [stylesInput, setStylesInput] = useState('');
  const [specifications, setSpecifications] = useState<Record<string, string>>({});
  const [images, setImages] = useState<ImageItem[]>([]);
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<any>('AVAILABLE');
  const [sortOrder, setSortOrder] = useState(0);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogImage, setOgImage] = useState('');

  const [activeTab, setActiveTab] = useState<'general' | 'descriptions' | 'specs' | 'images' | 'variants' | 'collections' | 'seo'>('general');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, collRes, prodRes] = await Promise.all([
          fetch('/api/categories?mode=admin').then((r) => r.json()),
          fetch('/api/collections?mode=admin').then((r) => r.json()),
          fetch(`/api/products/${id}`).then((r) => r.json()),
        ]);

        if (catRes.success) setCategories(catRes.data || []);
        if (collRes.success) setCollections(collRes.data || []);

        if (prodRes.success && prodRes.data) {
          const p = prodRes.data;
          setName(p.name || '');
          setSlug(p.slug || '');
          setSku(p.sku || '');
          setProductCode(p.productCode || p.sku || '');
          setShortDescription(p.shortDescription || '');
          setDescription(p.description || '');
          setCategoryId(p.categoryId || '');
          setSubcategoryId(p.subcategoryId || '');
          setMaterial(p.material || '');
          setFinish(p.finish || '');
          setWeight(p.weight || '');
          setDimensions(p.dimensions || '');
          setFeatured(!!p.featured);
          setSortOrder(p.sortOrder || 0);
          setStatus(p.status || 'AVAILABLE');

          if (p.styles) {
            setStylesInput(typeof p.styles === 'string' ? JSON.parse(p.styles).join(', ') : Array.isArray(p.styles) ? p.styles.join(', ') : '');
          }

          if (p.specifications) {
            setSpecifications(typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications);
          }

          if (p.images && p.images.length > 0) {
            setImages(
              p.images.map((img: any) => ({
                url: typeof img === 'string' ? img : img.url,
                altText: img.altText || '',
                isFeatured: !!img.isFeatured,
                sortOrder: img.sortOrder || 1,
              }))
            );
          }

          if (p.variants && p.variants.length > 0) {
            setVariants(
              p.variants.map((v: any) => ({
                id: v.id,
                size: v.size || '',
                finish: v.finish || '',
                material: v.material || '',
                sku: v.sku || '',
                variantCode: v.variantCode || '',
                status: v.status || 'ACTIVE',
              }))
            );
          }

          if (p.collections && p.collections.length > 0) {
            setSelectedCollectionIds(p.collections.map((c: any) => c.collectionId || c.id || c));
          }

          setSeoTitle(p.seoTitle || '');
          setSeoDescription(p.seoDescription || '');
          setSeoKeywords(p.seoKeywords || '');
          setCanonicalUrl(p.canonicalUrl || '');
          setOgImage(p.ogImage || '');
        } else {
          addToast('error', 'Product not found');
        }
      } catch (e) {
        addToast('error', 'Error loading product details');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const selectedCat = categories.find((c) => c.id === categoryId);
      if (selectedCat && selectedCat.children) {
        setSubcategories(selectedCat.children);
      } else {
        setSubcategories([]);
      }
    }
  }, [categoryId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      slug: slug || slugify(name),
      sku,
      productCode,
      categoryId,
      subcategoryId: subcategoryId || null,
      shortDescription,
      description,
      material,
      finish,
      weight,
      dimensions,
      styles: stylesInput.split(',').map((s) => s.trim()).filter(Boolean),
      specifications,
      images,
      variants,
      collectionIds: selectedCollectionIds,
      featured,
      sortOrder: Number(sortOrder),
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      ogImage,
    };

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        addToast('success', 'Product updated successfully!');
      } else {
        addToast('error', data.error?.message || 'Failed to update product');
      }
    } catch {
      addToast('error', 'An error occurred while updating the product');
    } finally {
      setSaving(false);
    }
  };

  const handleSoftDelete = async () => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('success', `Moved "${name}" to Trash`);
        setTimeout(() => {
          router.push('/admin/products');
        }, 1000);
      } else {
        addToast('error', 'Failed to move product to trash');
      }
    } catch {
      addToast('error', 'Error trashing product');
    }
  };

  const tabs = [
    { id: 'general', label: 'General Info' },
    { id: 'descriptions', label: 'Descriptions' },
    { id: 'specs', label: 'Specifications' },
    { id: 'images', label: `Images (${images.length})` },
    { id: 'variants', label: `Variants (${variants.length})` },
    { id: 'collections', label: 'Collections' },
    { id: 'seo', label: 'SEO Metadata' },
  ];

  if (loading) {
    return (
      <div className="py-20 text-center text-stone-500">
        <span className="inline-block w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
        <p>Loading product editor...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-stone-900 border border-stone-800 rounded-xl text-stone-400 hover:text-stone-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-serif text-stone-100">Edit Product: {name}</h1>
            <p className="text-xs font-mono text-amber-400">SKU: {sku}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="p-2.5 bg-stone-900 border border-stone-800 text-stone-400 hover:text-red-400 rounded-xl transition"
            title="Move product to trash"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            href={`/product/${slug}`}
            target="_blank"
            className="p-2.5 bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 rounded-xl transition flex items-center gap-1.5 text-xs"
          >
            <Eye className="w-4 h-4" /> Preview
          </Link>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-semibold text-stone-200 focus:outline-none"
          >
            <option value="AVAILABLE">Available</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="CUSTOM_ORDER">Custom Order</option>
            <option value="DISCONTINUED">Discontinued</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold hover:bg-amber-300 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Update Product
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-stone-800 overflow-x-auto pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-stone-900 text-amber-400 border-t-2 border-amber-400 border-x border-stone-800'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: GENERAL INFO */}
      {activeTab === 'general' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                SKU (Stock Keeping Unit) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs font-mono text-amber-400 font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Product Code (Internal)
              </label>
              <input
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-800">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200"
              >
                <option value="">Select Parent Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Subcategory
              </label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200"
              >
                <option value="">Select Subcategory (Optional)</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-stone-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-amber-400 rounded"
              />
              <span className="text-xs font-semibold text-stone-200">Featured Product (Highlight on Homepage)</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-stone-300">Sort Order:</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-20 bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DESCRIPTIONS */}
      {activeTab === 'descriptions' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Short Description
            </label>
            <textarea
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none"
            />
          </div>

          <RichTextEditor
            label="Full Product Overview & Architectural Details"
            value={description}
            onChange={setDescription}
          />
        </div>
      )}

      {/* TAB 3: SPECIFICATIONS */}
      {activeTab === 'specs' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Primary Material <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Primary Finish
              </label>
              <input
                type="text"
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Weight
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Architectural Styles (comma separated)
            </label>
            <input
              type="text"
              value={stylesInput}
              onChange={(e) => setStylesInput(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-xs text-stone-200"
            />
          </div>

          <SpecificationBuilder specifications={specifications} onChange={setSpecifications} />
        </div>
      )}

      {/* TAB 4: IMAGES */}
      {activeTab === 'images' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <ImageUploader images={images} onChange={setImages} />
        </div>
      )}

      {/* TAB 5: VARIANTS */}
      {activeTab === 'variants' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <VariantManager variants={variants} onChange={setVariants} />
        </div>
      )}

      {/* TAB 6: COLLECTIONS */}
      {activeTab === 'collections' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
            Assign Product to Collections
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {collections.map((col) => {
              const selected = selectedCollectionIds.includes(col.id) || selectedCollectionIds.includes(col.slug);
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => {
                    if (selected) {
                      setSelectedCollectionIds((prev) => prev.filter((id) => id !== col.id && id !== col.slug));
                    } else {
                      setSelectedCollectionIds((prev) => [...prev, col.id]);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    selected
                      ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                      : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <span className="text-xs font-semibold">{col.name}</span>
                  {selected && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: SEO */}
      {activeTab === 'seo' && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Canonical URL
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                Open Graph Image URL
              </label>
              <input
                type="url"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Move Product to Trash"
        message={`Are you sure you want to move "${name}" to the Trash? You can restore it later.`}
        confirmText="Move to Trash"
        onConfirm={handleSoftDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </form>
  );
}
