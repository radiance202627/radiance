'use client';

import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

export interface VariantItem {
  id?: string;
  size?: string;
  finish?: string;
  material?: string;
  sku?: string;
  variantCode?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  sortOrder?: number;
}

interface VariantManagerProps {
  variants: VariantItem[];
  onChange: (variants: VariantItem[]) => void;
}

export default function VariantManager({ variants, onChange }: VariantManagerProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [form, setForm] = useState<VariantItem>({
    size: '',
    finish: '',
    material: '',
    sku: '',
    variantCode: '',
    status: 'ACTIVE',
  });

  const handleSave = () => {
    if (editingIdx !== null) {
      const updated = [...variants];
      updated[editingIdx] = { ...form };
      onChange(updated);
      setEditingIdx(null);
    } else {
      if (!form.sku && !form.size && !form.finish) return;
      onChange([
        ...variants,
        {
          ...form,
          sortOrder: variants.length + 1,
        },
      ]);
    }

    setForm({
      size: '',
      finish: '',
      material: '',
      sku: '',
      variantCode: '',
      status: 'ACTIVE',
    });
  };

  const handleEdit = (idx: number) => {
    setEditingIdx(idx);
    setForm({ ...variants[idx] });
  };

  const handleRemove = (idx: number) => {
    const updated = variants.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          Product Variants ({variants.length})
        </label>
      </div>

      {/* Add / Edit Form Card */}
      <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl space-y-3">
        <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
          {editingIdx !== null ? `Edit Variant #${editingIdx + 1}` : 'Add New Variant'}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-stone-400 mb-1">Size / Dimension</label>
            <input
              type="text"
              value={form.size || ''}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              placeholder="e.g. 130mm Rose (54mm dia)"
              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-400 mb-1">Finish Name</label>
            <input
              type="text"
              value={form.finish || ''}
              onChange={(e) => setForm({ ...form, finish: e.target.value })}
              placeholder="e.g. Aged Antique Brass"
              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-400 mb-1">Material Override</label>
            <input
              type="text"
              value={form.material || ''}
              onChange={(e) => setForm({ ...form, material: e.target.value })}
              placeholder="e.g. Solid Brass"
              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-400 mb-1">Variant SKU</label>
            <input
              type="text"
              value={form.sku || ''}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="e.g. DH-LH-001-AB-130"
              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-400 mb-1">Variant Code</label>
            <input
              type="text"
              value={form.variantCode || ''}
              onChange={(e) => setForm({ ...form, variantCode: e.target.value })}
              placeholder="e.g. VAR-130-AB"
              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-400 mb-1">Status</label>
            <select
              value={form.status || 'ACTIVE'}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 focus:outline-none"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 bg-amber-400 text-stone-950 rounded-lg text-xs font-semibold hover:bg-amber-300 transition flex items-center gap-1"
          >
            {editingIdx !== null ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {editingIdx !== null ? 'Update Variant' : 'Add Variant'}
          </button>
          {editingIdx !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingIdx(null);
                setForm({ size: '', finish: '', material: '', sku: '', variantCode: '', status: 'ACTIVE' });
              }}
              className="px-3 py-1.5 bg-stone-900 text-stone-400 rounded-lg text-xs hover:text-stone-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Variants Table */}
      {variants.length > 0 && (
        <div className="overflow-x-auto border border-stone-800 rounded-xl bg-stone-900/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 border-b border-stone-800 text-stone-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3">SKU / Code</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Finish</th>
                <th className="py-2.5 px-3">Material</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {variants.map((v, idx) => (
                <tr key={idx} className="hover:bg-stone-800/30">
                  <td className="py-2.5 px-3 font-mono text-amber-400">{v.sku || v.variantCode || '-'}</td>
                  <td className="py-2.5 px-3">{v.size || '-'}</td>
                  <td className="py-2.5 px-3">{v.finish || '-'}</td>
                  <td className="py-2.5 px-3">{v.material || '-'}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        v.status === 'INACTIVE'
                          ? 'bg-stone-800 text-stone-500'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {v.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(idx)}
                      className="p-1 text-stone-400 hover:text-amber-400 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1 text-stone-400 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
