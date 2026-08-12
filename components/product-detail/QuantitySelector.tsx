'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (newQty: number) => void;
  min?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChange,
  min = 1,
}) => {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    onChange(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= min) {
      onChange(val);
    }
  };

  return (
    <div className="space-y-1.5 font-sans">
      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-dark font-display">
        Estimated Quantity
      </label>
      <div className="inline-flex items-center border border-slate-300 rounded bg-white overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= min}
          className="p-2.5 text-slate-500 hover:text-brand-dark disabled:opacity-30 hover:bg-slate-100 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="number"
          min={min}
          value={quantity}
          onChange={handleInputChange}
          className="w-16 text-center text-sm font-semibold text-brand-dark py-1.5 focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={handleIncrement}
          className="p-2.5 text-slate-500 hover:text-brand-dark hover:bg-slate-100 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <span className="block text-[11px] text-slate-400">
        Bulk wholesale pricing calculated upon RFQ submission
      </span>
    </div>
  );
};
