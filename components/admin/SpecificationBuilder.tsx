'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Sliders } from 'lucide-react';

interface SpecificationBuilderProps {
  specifications: Record<string, string>;
  onChange: (specs: Record<string, string>) => void;
}

export default function SpecificationBuilder({ specifications, onChange }: SpecificationBuilderProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const entries = Object.entries(specifications || {});

  const handleAdd = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    onChange({
      ...specifications,
      [newKey.trim()]: newValue.trim(),
    });
    setNewKey('');
    setNewValue('');
  };

  const handleRemove = (key: string) => {
    const updated = { ...specifications };
    delete updated[key];
    onChange(updated);
  };

  const handleValueChange = (key: string, val: string) => {
    onChange({
      ...specifications,
      [key]: val,
    });
  };

  const presetTemplates = [
    { key: 'Casting Method', defaultVal: 'Solid Hot-Forged Brass Casting' },
    { key: 'Spindle Diameter', defaultVal: '8mm Square Steel Spindle Included' },
    { key: 'Rose Thickness', defaultVal: '10mm Rose Plate with Concealed Fixing' },
    { key: 'Door Thickness Fit', defaultVal: '35mm - 55mm Timber & Metal Doors' },
    { key: 'Fixings Included', defaultVal: 'Solid Brass Wood Screws & Sex Bolts' },
    { key: 'Care Instructions', defaultVal: 'Clean periodically with soft dry cloth' },
  ];

  const applyPreset = (preset: { key: string; defaultVal: string }) => {
    onChange({
      ...specifications,
      [preset.key]: preset.defaultVal,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          Technical Specifications ({entries.length})
        </label>
      </div>

      {/* Quick Template Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-stone-500 font-medium py-1">Quick Presets:</span>
        {presetTemplates.map((tp) => {
          const exists = !!specifications[tp.key];
          return (
            <button
              key={tp.key}
              type="button"
              onClick={() => applyPreset(tp)}
              disabled={exists}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                exists
                  ? 'bg-stone-900 border-stone-800 text-stone-600 opacity-60 cursor-not-allowed'
                  : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-500/40'
              }`}
            >
              + {tp.key}
            </button>
          );
        })}
      </div>

      {/* Current Specs List */}
      {entries.length > 0 && (
        <div className="space-y-2 bg-stone-950/60 p-3 rounded-xl border border-stone-800">
          {entries.map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-1/3 text-xs font-semibold text-stone-300 bg-stone-900 px-3 py-2 rounded-lg border border-stone-800 truncate">
                {key}
              </div>
              <input
                type="text"
                value={val}
                onChange={(e) => handleValueChange(key, e.target.value)}
                className="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="button"
                onClick={() => handleRemove(key)}
                className="p-2 text-stone-500 hover:text-red-400 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Spec Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Spec Name (e.g. Projection)"
          className="w-1/3 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Spec Value (e.g. 62mm)"
          className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold hover:bg-amber-300 transition flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  );
}
