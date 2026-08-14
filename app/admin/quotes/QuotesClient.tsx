'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Package,
  CheckCircle2,
  Clock,
  Send,
  X,
  ChevronRight,
  User,
  MessageSquare,
  Sparkles,
  Save,
  Trash2,
  RefreshCw,
} from 'lucide-react';

export interface AdminQuoteItem {
  id?: string;
  productId?: string;
  selectedFinish?: string;
  selectedSize?: string;
  selectedMaterial?: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    sku: string;
    material?: string;
  };
}

export interface AdminCustomer {
  id?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  businessType: string;
  companyWebsite?: string;
}

export interface AdminQuoteRequest {
  id: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTATION_SENT' | 'NEGOTIATION' | 'WON' | 'LOST';
  submittedDate?: string;
  createdAt: string;
  message?: string;
  companyWebsite?: string;
  expectedQuantity?: string;
  requiredFinish?: string;
  requiredDeliveryDate?: string;
  additionalRequirements?: string;
  notes?: string;
  adminNotes?: string;
  customer: AdminCustomer;
  items: AdminQuoteItem[];
}

interface QuotesClientProps {
  initialQuotes: AdminQuoteRequest[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  NEW: {
    label: 'New RFQ',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  CONTACTED: {
    label: 'Contacted',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  QUOTATION_SENT: {
    label: 'Quotation Sent',
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  NEGOTIATION: {
    label: 'In Negotiation',
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  WON: {
    label: 'Won Order',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  LOST: {
    label: 'Lost Request',
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
};

export const QuotesClient: React.FC<QuotesClientProps> = ({ initialQuotes }) => {
  const [quotes, setQuotes] = useState<AdminQuoteRequest[]>(initialQuotes);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuote, setActiveQuote] = useState<AdminQuoteRequest | null>(null);

  // Inspector modal editing states
  const [editStatus, setEditStatus] = useState<string>('NEW');
  const [editAdminNotes, setEditAdminNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const openInspector = (quote: AdminQuoteRequest) => {
    setActiveQuote(quote);
    setEditStatus(quote.status);
    setEditAdminNotes(quote.adminNotes || quote.notes || '');
    setSaveSuccess(false);
  };

  const handleSaveStatus = async () => {
    if (!activeQuote) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/quotes/${activeQuote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          adminNotes: editAdminNotes,
          notes: editAdminNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setQuotes((prev) =>
          prev.map((q) =>
            q.id === activeQuote.id
              ? { ...q, status: editStatus as any, adminNotes: editAdminNotes, notes: editAdminNotes }
              : q
          )
        );
        setActiveQuote((prev) =>
          prev ? { ...prev, status: editStatus as any, adminNotes: editAdminNotes, notes: editAdminNotes } : null
        );
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error('Failed to update quote status:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm('Are you sure you want to move this quote request to trash?')) return;

    try {
      const res = await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
        if (activeQuote?.id === id) setActiveQuote(null);
      }
    } catch (e) {
      console.error('Failed to delete quote:', e);
    }
  };

  // Status counters
  const counts = {
    ALL: quotes.length,
    NEW: quotes.filter((q) => q.status === 'NEW').length,
    CONTACTED: quotes.filter((q) => q.status === 'CONTACTED').length,
    QUOTATION_SENT: quotes.filter((q) => q.status === 'QUOTATION_SENT').length,
    NEGOTIATION: quotes.filter((q) => q.status === 'NEGOTIATION').length,
    WON: quotes.filter((q) => q.status === 'WON').length,
    LOST: quotes.filter((q) => q.status === 'LOST').length,
  };

  // Filtered quote list
  const filteredQuotes = quotes.filter((q) => {
    if (selectedStatus !== 'ALL' && q.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchCustomer =
        q.customer.name.toLowerCase().includes(query) ||
        q.customer.company.toLowerCase().includes(query) ||
        q.customer.email.toLowerCase().includes(query) ||
        q.customer.country.toLowerCase().includes(query);
      const matchId = q.id.toLowerCase().includes(query);
      const matchItems = q.items.some(
        (it) =>
          it.product?.name.toLowerCase().includes(query) ||
          it.product?.sku.toLowerCase().includes(query)
      );
      return matchCustomer || matchId || matchItems;
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-100 flex items-center gap-3">
            <FileText className="w-6 h-6 text-amber-400" />
            Quote Requests Module
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Database-backed RFQ management center. Track B2B client requests, requested catalog items, custom specifications, and quote pipeline statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-mono bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl">
            Total RFQs: <strong className="text-amber-400">{quotes.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          <button
            onClick={() => setSelectedStatus('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              selectedStatus === 'ALL'
                ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            All ({counts.ALL})
          </button>

          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const isSel = selectedStatus === key;
            const count = (counts as any)[key] || 0;
            return (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border flex items-center gap-2 ${
                  isSel
                    ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-1 ring-amber-400/50`
                    : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:border-stone-700'
                }`}
              >
                <span>{cfg.label}</span>
                <span className="bg-stone-950/80 px-1.5 py-0.5 rounded text-[10px] font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, client, RFQ ID, SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-600 rounded-xl focus:outline-none focus:border-amber-500/50"
          />
        </div>

      </div>

      {/* Main Table View */}
      <div className="bg-stone-900 border border-stone-800/80 rounded-2xl overflow-hidden shadow-2xl">
        {filteredQuotes.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-stone-500 mx-auto border border-stone-700">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-300 font-serif">No RFQ Records Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No quote requests match your active filters or search terms. Try clearing filters or submitting a test RFQ.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 uppercase tracking-widest font-mono text-[10px] border-b border-stone-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">RFQ Reference / Date</th>
                  <th className="py-3.5 px-4 font-semibold">Customer & Business</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                {filteredQuotes.map((q) => {
                  const cfg = STATUS_CONFIG[q.status] || STATUS_CONFIG.NEW;
                  const dateStr = q.createdAt
                    ? new Date(q.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Recent';

                  const displayRef = q.id.startsWith('RFQ-')
                    ? q.id
                    : `RFQ-${q.id.slice(-6).toUpperCase()}`;

                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-stone-800/40 transition cursor-pointer"
                      onClick={() => openInspector(q)}
                    >
                      <td className="py-4 px-4 font-mono">
                        <span className="font-bold text-stone-200 block text-xs">{displayRef}</span>
                        <span className="text-[10px] text-stone-500">{dateStr}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-semibold text-stone-100 block">{q.customer.company}</span>
                        <span className="text-[11px] text-stone-400 font-sans">{q.customer.name} • {q.customer.email}</span>
                      </td>

                      <td className="py-4 px-4 font-sans text-slate-300">
                        <span className="block font-medium text-stone-300">{q.customer.country}</span>
                        <span className="text-[10px] text-stone-500">{q.customer.businessType}</span>
                      </td>

                      <td className="py-4 px-4 font-mono">
                        <span className="bg-stone-950 border border-stone-800 px-2 py-1 rounded text-stone-300 font-semibold text-[11px]">
                          {q.items.length} Products
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {cfg.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openInspector(q)}
                            className="px-3 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuote(q.id)}
                            title="Move to trash"
                            className="p-1.5 text-stone-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RFQ Inspector Drawer / Modal */}
      {activeQuote && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setActiveQuote(null)}
          />
          <div className="relative w-full max-w-2xl bg-stone-900 border-l border-stone-800 shadow-2xl h-full flex flex-col z-10 font-sans">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
                    {activeQuote.id.startsWith('RFQ-')
                      ? activeQuote.id
                      : `RFQ-${activeQuote.id.slice(-6).toUpperCase()}`}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      (STATUS_CONFIG[activeQuote.status] || STATUS_CONFIG.NEW).bg
                    } ${(STATUS_CONFIG[activeQuote.status] || STATUS_CONFIG.NEW).text} ${
                      (STATUS_CONFIG[activeQuote.status] || STATUS_CONFIG.NEW).border
                    }`}
                  >
                    {(STATUS_CONFIG[activeQuote.status] || STATUS_CONFIG.NEW).label}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-lg text-stone-100 mt-0.5">
                  {activeQuote.customer.company}
                </h2>
              </div>

              <button
                onClick={() => setActiveQuote(null)}
                className="p-2 text-stone-400 hover:text-stone-100 rounded-xl hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Customer Contact Information Card */}
              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4" /> B2B Client Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-300">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-mono">Contact Name</span>
                    <strong className="text-stone-200">{activeQuote.customer.name}</strong>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-mono">Company</span>
                    <strong className="text-stone-200">{activeQuote.customer.company}</strong>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-mono">Business Email</span>
                    <a href={`mailto:${activeQuote.customer.email}`} className="text-amber-400 hover:underline">
                      {activeQuote.customer.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-mono">Phone / WhatsApp</span>
                    <span className="text-stone-200">{activeQuote.customer.phone}</span>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-mono">Location</span>
                    <span className="text-stone-200">{activeQuote.customer.country} ({activeQuote.customer.city || 'N/A'})</span>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-mono">Business Type</span>
                    <span className="text-stone-200">{activeQuote.customer.businessType}</span>
                  </div>
                </div>
              </div>

              {/* Specification Requirements (If provided) */}
              {(activeQuote.expectedQuantity || activeQuote.requiredFinish || activeQuote.requiredDeliveryDate) && (
                <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 text-xs space-y-2">
                  <h4 className="font-semibold text-stone-300 uppercase tracking-wider text-[11px]">
                    Order Specification Parameters
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-stone-400 text-[11px]">
                    {activeQuote.expectedQuantity && (
                      <div>
                        <span className="block text-[10px] text-stone-500">Expected Qty:</span>
                        <strong className="text-stone-200">{activeQuote.expectedQuantity}</strong>
                      </div>
                    )}
                    {activeQuote.requiredFinish && (
                      <div>
                        <span className="block text-[10px] text-stone-500">Required Finish:</span>
                        <strong className="text-stone-200">{activeQuote.requiredFinish}</strong>
                      </div>
                    )}
                    {activeQuote.requiredDeliveryDate && (
                      <div>
                        <span className="block text-[10px] text-stone-500">Target Date:</span>
                        <strong className="text-stone-200">{activeQuote.requiredDeliveryDate}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Requested Products Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-400" /> Requested Catalog Items ({activeQuote.items.length})
                  </span>
                </h3>

                <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden text-xs">
                  <div className="divide-y divide-stone-800">
                    {activeQuote.items.map((item, idx) => (
                      <div key={item.id || idx} className="p-3.5 flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <strong className="text-stone-200 block text-xs">
                            {item.product?.name || `Product ID: ${item.productId}`}
                          </strong>
                          <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                            {item.product?.sku && <span>SKU: {item.product.sku}</span>}
                            <span>• Finish: {item.selectedFinish || 'Default'}</span>
                            <span>• Size: {item.selectedSize || 'Default'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-amber-400/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded font-mono font-bold text-xs">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Message / Notes */}
              {activeQuote.message && (
                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 text-xs space-y-1">
                  <span className="text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                    Customer Message & Notes:
                  </span>
                  <p className="text-stone-300 leading-relaxed font-light whitespace-pre-wrap">
                    {activeQuote.message}
                  </p>
                </div>
              )}

              {/* Admin Pipeline Control Panel */}
              <div className="bg-stone-950 border border-amber-500/20 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Admin Pipeline Status Control
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Update Pipeline Status:
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                    >
                      <option value="NEW">New RFQ (Requires Review)</option>
                      <option value="CONTACTED">Contacted Client (Awaiting Details)</option>
                      <option value="QUOTATION_SENT">Quotation Sent to Client</option>
                      <option value="NEGOTIATION">In Price / Contract Negotiation</option>
                      <option value="WON">Won - Order Confirmed</option>
                      <option value="LOST">Lost - Request Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 font-medium mb-1">
                      Internal Admin Notes (Sales Team Notes):
                    </label>
                    <textarea
                      rows={3}
                      value={editAdminNotes}
                      onChange={(e) => setEditAdminNotes(e.target.value)}
                      placeholder="Add internal notes on pricing offered, lead time estimated, follow-up calls..."
                      className="w-full bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-xl p-3 focus:outline-none focus:border-amber-500 leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={handleSaveStatus}
                    disabled={isSaving}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Saving Changes...
                      </span>
                    ) : saveSuccess ? (
                      <span className="flex items-center gap-2 text-stone-950 font-extrabold">
                        <CheckCircle2 className="w-4 h-4 text-stone-950" /> RFQ Status Updated!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save RFQ Updates
                      </span>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
