'use client';

import React, { useState } from 'react';
import { Sparkles, Check, Info, Hammer } from 'lucide-react';

interface FinishOption {
  id: string;
  name: string;
  code: string;
  description: string;
  gradient: string;
  borderColor: string;
}

export const FinishPalette: React.FC = () => {
  const finishes: FinishOption[] = [
    {
      id: 'ab',
      name: 'Aged Antique Brass (AB)',
      code: 'RAD-AB-10',
      description: 'Hand-rubbed patinated warm brass revealing golden highlights along detailed cast relief lines.',
      gradient: 'from-[#8a631e] via-[#c59b27] to-[#593e0c]',
      borderColor: 'border-[#c59b27]',
    },
    {
      id: 'pb',
      name: 'Polished Brass (PB)',
      code: 'RAD-PB-01',
      description: 'High-lustre hand-polished solid brass with protective clear lacquer to preserve golden warmth.',
      gradient: 'from-[#fef08a] via-[#eab308] to-[#ca8a04]',
      borderColor: 'border-[#eab308]',
    },
    {
      id: 'sc',
      name: 'Satin Nickel & Chrome (SC)',
      code: 'RAD-SC-04',
      description: 'Directional brushed satin metal finish presenting a soft architectural luster.',
      gradient: 'from-[#cbd5e1] via-[#94a3b8] to-[#64748b]',
      borderColor: 'border-[#cbd5e1]',
    },
    {
      id: 'mb',
      name: 'Black Antique & Matt (MB)',
      code: 'RAD-MB-02',
      description: 'Traditional rust-armour black coating designed for rustic wrought ironmongery and gates.',
      gradient: 'from-[#334155] via-[#1e293b] to-[#0f172a]',
      borderColor: 'border-slate-700',
    },
    {
      id: 'orb',
      name: 'Oil Rubbed Bronze (ORB)',
      code: 'RAD-ORB-08',
      description: 'Living patinated bronze finish designed to subtly age and reveal warm undertones over time.',
      gradient: 'from-[#78350f] via-[#451a03] to-[#1c0a00]',
      borderColor: 'border-amber-900',
    },
    {
      id: 'ac',
      name: 'Antique Copper & Gunmetal',
      code: 'RAD-AC-12',
      description: 'Rich hand-finished copper patina with deep firescale tones along metal casting edges.',
      gradient: 'from-[#9a3412] via-[#7c2d12] to-[#451a03]',
      borderColor: 'border-amber-700',
    },
  ];

  const [activeFinish, setActiveFinish] = useState<FinishOption>(finishes[0]);

  return (
    <div className="bg-brand-dark text-white rounded-xl border border-brand-border-dark p-6 sm:p-10 shadow-floating relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-brass/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-border-dark pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase font-sans text-brand-brass">
              <Hammer className="w-4 h-4" />
              <span>Metal Finishes & Patinas</span>
            </div>
            <h3
              className="text-2xl sm:text-4xl font-bold text-white tracking-tight"
              style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif" }}
            >
              Architectural Finish Palette
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-md font-light">
            Our cast metal products are available in hand-applied patinas and finishes designed to complement classical, traditional, and heritage interiors.
          </p>
        </div>

        {/* Swatch Pill Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {finishes.map((f) => {
            const isActive = activeFinish.id === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFinish(f)}
                className={`p-3 rounded-lg border text-left transition-all duration-300 flex flex-col justify-between h-24 ${
                  isActive
                    ? 'bg-brand-card border-brand-brass shadow-gold scale-105'
                    : 'bg-brand-charcoal/80 border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${f.gradient} border ${f.borderColor} shadow-inner`} />
                  {isActive && <Check className="w-4 h-4 text-brand-brass" />}
                </div>

                <span className="text-[11px] font-semibold text-white line-clamp-1">
                  {f.name.split(' ')[0]} {f.name.split(' ')[1]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Finish Showcase Panel */}
        <div className="bg-brand-card rounded-lg border border-brand-border-dark p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr ${activeFinish.gradient} border-4 ${activeFinish.borderColor} shadow-floating flex-shrink-0 flex items-center justify-center`}>
            <span className="text-[10px] font-mono text-white/80 font-bold bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
              {activeFinish.code}
            </span>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <span className="text-[10px] font-mono font-semibold text-brand-brass uppercase tracking-widest block">
              Finish Code: {activeFinish.code}
            </span>
            <h4
              className="text-xl sm:text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif" }}
            >
              {activeFinish.name}
            </h4>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              {activeFinish.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-brand-brass" /> Hand-Finished Metalwork Patina
              </span>
              <span>•</span>
              <span>Available across Product Catalog</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
