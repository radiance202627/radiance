'use client';

import React, { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Heading, Code, Eye, Edit3 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  label = 'Description',
  placeholder = 'Write detailed product description here...',
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const text = value || '';
    onChange(`${text}${prefix}${suffix}`);
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
            {label}
          </label>
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
                activeTab === 'write' ? 'bg-stone-800 text-amber-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
                activeTab === 'preview' ? 'bg-stone-800 text-amber-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
        </div>
      )}

      {activeTab === 'write' ? (
        <div className="border border-stone-800 rounded-xl overflow-hidden bg-stone-950/80">
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-stone-900 border-b border-stone-800 text-stone-400">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**')}
              title="Bold"
              className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-stone-200 transition"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*')}
              title="Italic"
              className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-stone-200 transition"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('### ')}
              title="Heading"
              className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-stone-200 transition"
            >
              <Heading className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('- ')}
              title="Bullet List"
              className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-stone-200 transition"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('1. ')}
              title="Numbered List"
              className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-stone-200 transition"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('`', '`')}
              title="Inline Code"
              className="p-1.5 rounded-lg hover:bg-stone-800 hover:text-stone-200 transition"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          <textarea
            rows={6}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 bg-transparent text-stone-200 placeholder-stone-600 text-sm focus:outline-none resize-y"
          />
        </div>
      ) : (
        <div className="p-4 border border-stone-800 rounded-xl bg-stone-950/80 min-h-[160px] text-sm text-stone-300 prose prose-invert max-w-none">
          {value ? (
            <div className="whitespace-pre-wrap">{value}</div>
          ) : (
            <p className="text-stone-600 italic">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
