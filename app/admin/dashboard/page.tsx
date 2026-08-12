'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  FolderTree,
  Boxes,
  FileText,
  Clock,
  CheckCircle,
  FileEdit,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    totalCategories: 0,
    totalCollections: 0,
    totalQuotes: 0,
    newQuotes: 0,
  });

  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [prodRes, catRes, collRes, quoteRes] = await Promise.all([
          fetch('/api/products?mode=admin').then((r) => r.json()).catch(() => ({ data: [] })),
          fetch('/api/categories?mode=admin').then((r) => r.json()).catch(() => ({ data: [] })),
          fetch('/api/collections?mode=admin').then((r) => r.json()).catch(() => ({ data: [] })),
          fetch('/api/quotes').then((r) => r.json()).catch(() => ({ data: [] })),
        ]);

        const prods = prodRes.data || [];
        const cats = catRes.data || [];
        const colls = collRes.data || [];
        const quotes = quoteRes.data || [];

        setStats({
          totalProducts: prods.length,
          publishedProducts: prods.filter((p: any) => p.status === 'AVAILABLE' || p.status === 'PUBLISHED' || p.status === 'available').length,
          draftProducts: prods.filter((p: any) => p.status === 'DRAFT' || p.status === 'draft').length,
          totalCategories: cats.length,
          totalCollections: colls.length,
          totalQuotes: quotes.length,
          newQuotes: quotes.filter((q: any) => q.status === 'NEW').length,
        });

        setRecentQuotes(quotes.slice(0, 5));
        setRecentProducts(prods.slice(0, 5));
      } catch (e) {
        console.error('Error loading dashboard stats:', e);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, href: '/admin/products', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Published Products', value: stats.publishedProducts, icon: CheckCircle, href: '/admin/products', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Draft Products', value: stats.draftProducts, icon: FileEdit, href: '/admin/products', color: 'text-stone-400', bg: 'bg-stone-800/50 border-stone-700/50' },
    { label: 'Total Categories', value: stats.totalCategories, icon: FolderTree, href: '/admin/categories', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Total Collections', value: stats.totalCollections, icon: Boxes, href: '/admin/collections', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { label: 'Total Quote Requests', value: stats.totalQuotes, icon: FileText, href: '/admin/quotes', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { label: 'New Quote Requests', value: stats.newQuotes, icon: Clock, href: '/admin/quotes', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-100 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            Catalog Control Center
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Real-time overview of products, categories, collections, and client RFQs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold hover:bg-amber-300 transition shadow-lg flex items-center gap-1.5"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {statCards.map((st) => {
          const Icon = st.icon;
          return (
            <Link
              key={st.label}
              href={st.href}
              className={`p-4 rounded-2xl border transition group hover:scale-[1.02] ${st.bg}`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${st.color}`} />
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 transition" />
              </div>
              <p className="text-2xl font-bold text-stone-100 mt-3 font-mono">
                {loading ? '...' : st.value}
              </p>
              <p className="text-[11px] text-stone-400 font-medium mt-0.5 truncate">{st.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quotes */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-400" />
              Recent Quote Requests
            </h3>
            <Link href="/admin/quotes" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-stone-400 uppercase tracking-wider border-b border-stone-800 pb-2">
                <tr>
                  <th className="py-2">Customer</th>
                  <th className="py-2">Company</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                {recentQuotes.length > 0 ? (
                  recentQuotes.map((q) => (
                    <tr key={q.id} className="hover:bg-stone-800/40 transition">
                      <td className="py-3 font-semibold text-stone-200">{q.customer?.name || 'B2B Client'}</td>
                      <td className="py-3 text-stone-400">{q.customer?.company || '-'}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            q.status === 'NEW'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-stone-500 font-mono text-[11px]">
                        {new Date(q.submittedDate || q.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-stone-500 italic">
                      No quote requests submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Added Products */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              Recently Added Products
            </h3>
            <Link href="/admin/products" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-stone-400 uppercase tracking-wider border-b border-stone-800 pb-2">
                <tr>
                  <th className="py-2">Product Name</th>
                  <th className="py-2">SKU</th>
                  <th className="py-2">Category</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                {recentProducts.length > 0 ? (
                  recentProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-800/40 transition">
                      <td className="py-3 font-semibold text-stone-200 truncate max-w-[160px]">
                        {p.name}
                      </td>
                      <td className="py-3 font-mono text-amber-400">{p.sku}</td>
                      <td className="py-3 text-stone-400">{p.categoryName || p.category?.name || 'Catalog'}</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400">
                          {p.status || 'AVAILABLE'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-stone-500 italic">
                      No products added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
