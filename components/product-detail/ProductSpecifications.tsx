'use client';

import React, { useState } from 'react';
import { Download, CheckCircle, FileText, ShieldAlert } from 'lucide-react';

interface ProductSpecificationsProps {
  sku: string;
  name: string;
  material: string;
  specifications: Record<string, string>;
}

export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  sku,
  name,
  material,
  specifications,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownloadSpec = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6 pt-8 border-t border-[#E5E2DA]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-[#222222] tracking-tight">
            Technical Specifications
          </h3>
          <p className="text-xs text-[#666666] font-sans font-normal mt-0.5">
            Dimensional data and engineering compliance details
          </p>
        </div>

        <button
          onClick={handleDownloadSpec}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F4F2ED] hover:bg-[#E5E2DA] text-[#222222] text-xs font-sans font-medium uppercase tracking-wider rounded-[8px] border border-[#E5E2DA] transition-colors"
        >
          {downloading ? (
            <span className="animate-pulse">Generating Spec PDF...</span>
          ) : downloadComplete ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Spec Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#B08D57]" />
              <span>Download Specification PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Technical Spec Table */}
      <div className="border border-[#E5E2DA] rounded-2xl overflow-hidden bg-[#F4F2ED] shadow-sm">
        <table className="w-full text-left text-xs font-sans">
          <tbody>
            <tr className="border-b border-[#E5E2DA] bg-[#FAF9F6]">
              <td className="py-3 px-4 font-semibold text-[#222222] w-1/3">Item SKU Code</td>
              <td className="py-3 px-4 font-mono text-[#666666]">{sku}</td>
            </tr>
            <tr className="border-b border-[#E5E2DA]">
              <td className="py-3 px-4 font-semibold text-[#222222]">Primary Material</td>
              <td className="py-3 px-4 text-[#666666]">{material}</td>
            </tr>
            {Object.entries(specifications).map(([key, val], idx) => (
              <tr
                key={key}
                className={`border-b border-[#E5E2DA] last:border-0 ${
                  idx % 2 === 0 ? 'bg-[#FAF9F6]' : 'bg-[#F4F2ED]'
                }`}
              >
                <td className="py-3 px-4 font-semibold text-[#222222]">{key}</td>
                <td className="py-3 px-4 text-[#666666]">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* B2B Custom Engineering Note */}
      <div className="p-5 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] flex items-start gap-3 shadow-sm">
        <FileText className="w-5 h-5 text-[#B08D57] flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 font-sans">
          <h4 className="font-serif font-bold text-[#222222] tracking-tight text-sm">
            B2B Custom Tooling & OEM Manufacturing Schedule
          </h4>
          <p className="text-[#666666] leading-relaxed font-normal">
            Require custom CTC backsets, non-standard spindle sizes (7mm/8mm/9mm), PVD titanium coatings, or laser-etched brand logos? Our Aligarh foundry engineering department provides direct OEM/ODM production, CAD drawing matching, and BS EN compliance testing for commercial hardware schedules.
          </p>
        </div>
      </div>
    </div>
  );
};
