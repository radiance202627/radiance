import React from 'react';
import { Users, Search } from 'lucide-react';

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-stone-100 flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-400" />
          B2B Customers
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          Store & review architectural customer enquiries, companies, and contact details.
        </p>
      </div>

      <div className="flex items-center gap-4 bg-stone-900 border border-stone-800 rounded-xl p-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Search by customer name, company, or country..."
            disabled
            className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-sm text-stone-300 placeholder-stone-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto mb-4">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold font-serif text-stone-200">Customers Shell Layout</h3>
        <p className="text-stone-400 text-sm max-w-md mx-auto mt-2">
          Customer data service in <code className="text-purple-400 font-mono">lib/services/customerService.ts</code> and API endpoints at <code className="text-purple-400 font-mono">/api/customers</code> ready.
        </p>
      </div>
    </div>
  );
}
