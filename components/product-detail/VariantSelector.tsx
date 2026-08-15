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
    <div className="space-y-6 py-4 border-t border-b border-[#E5E2DA]">
      {/* Base Material indicator */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#666666] font-display mb-1">
          Base Material
        </label>
        <span className="inline-block text-xs font-medium bg-[#FAF9F6] text-[#222222] px-3 py-1 rounded-lg border border-[#E5E2DA]">
          {material}
        </span>
      </div>

      {/* Finish Pills Selector */}
      {finishes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-display">
            <span className="font-semibold uppercase tracking-wider text-[#222222]">
              Architectural Finish *
            </span>
            <span className="text-[#B08D57] font-medium">{selectedFinish}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {finishes.map((finish) => {
              const isSelected = selectedFinish === finish;
              return (
                <button
                  key={finish}
                  type="button"
                  onClick={() => onSelectFinish(finish)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                    isSelected
                      ? 'border-[#B08D57] bg-[#B08D57]/10 text-[#B08D57] font-semibold shadow-sm'
                      : 'border-[#E5E2DA] bg-[#FAF9F6] text-[#222222] hover:border-[#B08D57]/50'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#B08D57]" />}
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
            <span className="font-semibold uppercase tracking-wider text-[#222222]">
              Dimensions / Size *
            </span>
            <span className="text-[#B08D57] font-medium">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(size)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                    isSelected
                      ? 'border-[#B08D57] bg-[#B08D57]/10 text-[#B08D57] font-semibold shadow-sm'
                      : 'border-[#E5E2DA] bg-[#FAF9F6] text-[#222222] hover:border-[#B08D57]/50'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#B08D57]" />}
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
