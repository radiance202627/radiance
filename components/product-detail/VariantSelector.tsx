'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface VariantSelectorProps {
  finishes: string[];
  selectedFinish: string;
  onSelectFinish: (finish: string) => void;
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  material: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  finishes,
  selectedFinish,
  onSelectFinish,
  sizes,
  selectedSize,
  onSelectSize,
  material,
}) => {
  return (
    <div className="space-y-6 py-4 border-t border-b border-slate-200">
      {/* Base Material indicator */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 font-display mb-1">
          Base Material
        </label>
        <span className="inline-block text-xs font-medium bg-slate-100 text-brand-dark px-3 py-1 rounded border border-slate-200">
          {material}
        </span>
      </div>

      {/* Finish Pills Selector */}
      {finishes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-display">
            <span className="font-semibold uppercase tracking-wider text-brand-dark">
              Architectural Finish *
            </span>
            <span className="text-brand-brass font-medium">{selectedFinish}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {finishes.map((finish) => {
              const isSelected = selectedFinish === finish;
              return (
                <button
                  key={finish}
                  type="button"
                  onClick={() => onSelectFinish(finish)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-all ${
                    isSelected
                      ? 'border-brand-brass bg-brand-brass/10 text-brand-brass font-semibold shadow-sm'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-brass" />}
                  <span>{finish}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Pills Selector */}
      {sizes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-display">
            <span className="font-semibold uppercase tracking-wider text-brand-dark">
              Dimensions / Size *
            </span>
            <span className="text-brand-brass font-medium">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(size)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-all ${
                    isSelected
                      ? 'border-brand-brass bg-brand-brass/10 text-brand-brass font-semibold shadow-sm'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-brass" />}
                  <span>{size}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
