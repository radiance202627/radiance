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
    <div className="space-y-6 pt-8 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg text-brand-dark uppercase tracking-wider">
            Technical Specifications
          </h3>
          <p className="text-xs text-brand-text-muted">
            Dimensional data and engineering compliance details
          </p>
        </div>

        <button
          onClick={handleDownloadSpec}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-slate hover:bg-slate-200 text-brand-dark text-xs font-display font-semibold uppercase tracking-wider rounded border border-slate-300 transition-colors"
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
              <Download className="w-4 h-4 text-brand-brass" />
              <span>Download Specification PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Technical Spec Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left text-xs font-sans">
          <tbody>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <td className="py-3 px-4 font-semibold text-brand-dark w-1/3">Item SKU Code</td>
              <td className="py-3 px-4 font-mono text-slate-700">{sku}</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-3 px-4 font-semibold text-brand-dark">Primary Material</td>
              <td className="py-3 px-4 text-slate-700">{material}</td>
            </tr>
            {Object.entries(specifications).map(([key, val], idx) => (
              <tr
                key={key}
                className={`border-b border-slate-100 ${
                  idx % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'
                }`}
              >
                <td className="py-3 px-4 font-semibold text-brand-dark">{key}</td>
                <td className="py-3 px-4 text-slate-700">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* B2B Custom Engineering Note */}
      <div className="p-4 bg-brand-slate rounded border border-brand-border flex items-start gap-3">
        <FileText className="w-5 h-5 text-brand-brass flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-semibold text-brand-dark uppercase tracking-wider font-display">
            Custom B2B Manufacturing & Finishes Available
          </h4>
          <p className="text-brand-text-muted leading-relaxed">
            Need custom dimensions, PVD coatings, unlisted screw hole CTC, or private label laser branding? Our technical engineering team provides custom OEM/ODM production for architectural hardware orders.
          </p>
        </div>
      </div>
    </div>
  );
};
