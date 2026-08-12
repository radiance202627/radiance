import React from 'react';
import { FileText, Filter } from 'lucide-react';

export default function AdminQuotesPage() {
  const statuses = [
    { label: 'All', count: 29 },
    { label: 'New', count: 12, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { label: 'Contacted', count: 5, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { label: 'Quotation Sent', count: 6, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { label: 'Negotiation', count: 3, color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    { label: 'Won', count: 2, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { label: 'Lost', count: 1, color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-100 flex items-center gap-3">
          <FileText className="w-6 h-6 text-rose-400" />
          Quote Requests
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          Review B2B RFQs, items requested, quantities, custom finishes, and pipeline status.
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {statuses.map((st) => (
          <button
            key={st.label}
            disabled
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap opacity-80 cursor-not-allowed ${
              st.color || 'bg-stone-900 border-stone-800 text-stone-300'
            }`}
          >
            {st.label} ({st.count})
          </button>
        ))}
      </div>

      <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold font-serif text-stone-200">Quote Requests Shell Layout</h3>
        <p className="text-stone-400 text-sm max-w-md mx-auto mt-2">
          Quote workflow statuses (<code className="text-rose-400 font-mono">New</code>, <code className="text-rose-400 font-mono">Contacted</code>, <code className="text-rose-400 font-mono">Quotation Sent</code>, <code className="text-rose-400 font-mono">Negotiation</code>, <code className="text-rose-400 font-mono">Won</code>, <code className="text-rose-400 font-mono">Lost</code>) and quote item schemas configured in Prisma & REST endpoints at <code className="text-rose-400 font-mono">/api/quotes</code>.
        </p>
      </div>
    </div>
  );
}
