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
      description: 'Chemical oxidation patination hand-rubbed with pumice compound, revealing golden highlights along cast relief lines before receiving a protective microcrystalline wax seal.',
      gradient: 'from-[#8a631e] via-[#c59b27] to-[#593e0c]',
      borderColor: 'border-[#c59b27]',
    },
    {
      id: 'pb',
      name: 'Polished Brass (PB)',
      code: 'RAD-PB-01',
      description: 'Hand-muffed solid brass polished to a 600-grit mirror lustre, baked with electrophoretic clear lacquer to prevent atmospheric tarnishing.',
      gradient: 'from-[#fef08a] via-[#eab308] to-[#ca8a04]',
      borderColor: 'border-[#eab308]',
    },
    {
      id: 'sc',
      name: 'Satin Nickel & Chrome (SC)',
      code: 'RAD-SC-04',
      description: 'Directional linished satin finish electroplated over nickel undercoat for high corrosion resistance in commercial high-traffic installations.',
      gradient: 'from-[#cbd5e1] via-[#94a3b8] to-[#64748b]',
      borderColor: 'border-[#cbd5e1]',
    },
    {
      id: 'mb',
      name: 'Black Antique & Matt (MB)',
      code: 'RAD-MB-02',
      description: 'Thermal rust-armour black coating applied over sand-cast ironmongery, providing traditional stippled texture and weather resistance.',
      gradient: 'from-[#334155] via-[#1e293b] to-[#0f172a]',
      borderColor: 'border-slate-700',
    },
    {
      id: 'orb',
      name: 'Oil Rubbed Bronze (ORB)',
      code: 'RAD-ORB-08',
      description: 'Unlacquered living patina chemically aged to deep copper-brown tones, engineered to subtly wear over time and highlight natural handling points.',
      gradient: 'from-[#78350f] via-[#451a03] to-[#1c0a00]',
      borderColor: 'border-amber-900',
    },
    {
      id: 'ac',
      name: 'Antique Copper & Gunmetal',
      code: 'RAD-AC-12',
      description: 'Hand-distressed copper plating over cast brass cores, highlighted with dark firescale oxidation for historic period restoration hardware.',
      gradient: 'from-[#9a3412] via-[#7c2d12] to-[#451a03]',
      borderColor: 'border-amber-700',
    },
  ];

  const [activeFinish, setActiveFinish] = useState<FinishOption>(finishes[0]);

  return (
    <div className="bg-[#F4F2ED] text-[#222222] rounded-2xl border border-[#E5E2DA] p-6 sm:p-10 shadow-sm relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#B08D57]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E2DA] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-sans font-medium tracking-[0.22em] uppercase text-[#B08D57]">
              <Hammer className="w-4 h-4" />
              <span>Foundry Metal Patinas</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[#222222] tracking-tight">
              Architectural Finish Palette
            </h3>
          </div>
          <p className="text-xs text-[#666666] max-w-md font-sans font-normal">
            Our solid brass and cast iron hardware is produced in hand-rubbed patinas, lacquered polishes, and PVD coatings engineered for seamless project matching.
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
                className={`p-3 rounded-[8px] border text-left transition-all duration-200 flex flex-col justify-between h-24 ${
                  isActive
                    ? 'bg-[#FAF9F6] border-[#B08D57] shadow-sm'
                    : 'bg-[#FAF9F6]/60 border-[#E5E2DA] hover:border-[#B08D57]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${f.gradient} border ${f.borderColor} shadow-inner`} />
                  {isActive && <Check className="w-4 h-4 text-[#B08D57]" />}
                </div>

                <span className="text-[11px] font-sans font-medium text-[#222222] line-clamp-1">
                  {f.name.split(' ')[0]} {f.name.split(' ')[1]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Finish Showcase Panel */}
        <div className="bg-[#FAF9F6] rounded-2xl border border-[#E5E2DA] p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
          <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr ${activeFinish.gradient} border-4 ${activeFinish.borderColor} shadow-md flex-shrink-0 flex items-center justify-center`}>
            <span className="text-[10px] font-mono text-[#FAF9F6] font-bold bg-[#222222]/60 px-2 py-0.5 rounded-[4px] backdrop-blur-sm">
              {activeFinish.code}
            </span>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <span className="text-[10px] font-mono font-semibold text-[#B08D57] uppercase tracking-widest block">
              Finish Code: {activeFinish.code}
            </span>
            <h4 className="text-xl sm:text-2xl font-serif font-bold text-[#222222]">
              {activeFinish.name}
            </h4>
            <p className="text-xs text-[#666666] font-sans font-normal leading-relaxed">
              {activeFinish.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-[#666666] font-mono">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#B08D57]" /> Hand-Finished Metalwork Patina
              </span>
              <span>•</span>
              <span>ISO 9227 Corrosion Resistance Compliant</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
