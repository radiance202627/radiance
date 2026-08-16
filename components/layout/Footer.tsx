import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Mail, Phone, MapPin, Globe2, ShieldCheck, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F3F0E8] text-[#6B635B] border-t border-[#E6E1D7] font-sans">
      {/* Top B2B Trust Bar */}
      <div className="border-b border-[#E6E1D7] py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-[#9E7B47]/10 text-[#9E7B47] rounded-[4px] border border-[#9E7B47]/20">
              <ShieldCheck className="w-4.5 h-4.5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-[#1C1917] uppercase tracking-[0.18em]">
                Virgin Metal Metallurgy
              </h4>
              <p className="text-[11px] text-[#6B635B]">CuZn39Pb2 brass, bronze & ISO tested alloys</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-[#9E7B47]/10 text-[#9E7B47] rounded-[4px] border border-[#9E7B47]/20">
              <Globe2 className="w-4.5 h-4.5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-[#1C1917] uppercase tracking-[0.18em]">
                Container Port Dispatch
              </h4>
              <p className="text-[11px] text-[#6B635B]">FCL/LCL logistics via Nhava Sheva & Mundra</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-[#9E7B47]/10 text-[#9E7B47] rounded-[4px] border border-[#9E7B47]/20">
              <FileText className="w-4.5 h-4.5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-[#1C1917] uppercase tracking-[0.18em]">
                Factory Direct Pricing
              </h4>
              <p className="text-[11px] text-[#6B635B]">Wholesale container rates without middlemen</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <Link
              href="/request-quote"
              className="btn-luxury-primary"
            >
              Submit Trade RFQ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" />
            <p className="text-xs text-[#6B635B] leading-relaxed pr-6">
              SB PATTERN WORKS is a premier luxury manufacturer and exporter of architectural, cabinet, door, and bespoke metal components. Serving hardware distributors, interior designers, architects, and international bulk importers worldwide.
            </p>
            <div className="space-y-2 text-xs text-[#6B635B] pt-2">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#9E7B47] stroke-[1.5]" /> Sales@sbpatternworks.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#9E7B47] stroke-[1.5]" /> +91 (120) 456-7890 / +91 (571) 240-0001
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#9E7B47] shrink-0 mt-0.5 stroke-[1.5]" /> E-41 CDF CHHERAT, INDUSTRIAL AREA CDF, ALIGARH, UTTAR PRADESH 202001, India
              </p>
            </div>
          </div>

          {/* Quick Catalog */}
          <div>
            <h4 className="text-[11px] font-semibold text-[#9E7B47] uppercase tracking-[0.2em] mb-4">
              Catalog Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6B635B]">
              <li>
                <Link href="/products/door-hardware" className="hover:text-[#9E7B47] transition-colors">
                  Door Hardware & Handles
                </Link>
              </li>
              <li>
                <Link href="/products/cabinet-hardware" className="hover:text-[#9E7B47] transition-colors">
                  Cabinet Pulls & Knobs
                </Link>
              </li>
              <li>
                <Link href="/products/railing-fittings" className="hover:text-[#9E7B47] transition-colors">
                  Railing & Balustrade Fittings
                </Link>
              </li>
              <li>
                <Link href="/products/window-hardware" className="hover:text-[#9E7B47] transition-colors">
                  Casement & Sash Hardware
                </Link>
              </li>
              <li>
                <Link href="/products/black-antique" className="hover:text-[#9E7B47] transition-colors">
                  Black Antique Ironmongery
                </Link>
              </li>
              <li>
                <Link href="/custom-craft" className="hover:text-[#9E7B47] font-semibold text-[#1C1917] transition-colors">
                  Custom Craft Manufacturing
                </Link>
              </li>
            </ul>
          </div>

          {/* Special Modules & Media */}
          <div>
            <h4 className="text-[11px] font-semibold text-[#9E7B47] uppercase tracking-[0.2em] mb-4">
              Showcase & Media
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6B635B]">
              <li>
                <Link href="/custom-craft" className="hover:text-[#9E7B47] transition-colors">
                  Custom Craft & OEM
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#9E7B47] transition-colors">
                  Manufacturing Gallery
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#9E7B47] transition-colors">
                  Industry Insights & Blog
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#9E7B47] transition-colors">
                  Curated Hardware Series
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-[#9E7B47] transition-colors">
                  Foundry Capabilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-[11px] font-semibold text-[#9E7B47] uppercase tracking-[0.2em] mb-4">
              Company & RFQ
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6B635B]">
              <li>
                <Link href="/about" className="hover:text-[#9E7B47] transition-colors">
                  About SB Pattern Works
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-[#9E7B47] transition-colors">
                  Quality Standards
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-[#9E7B47] transition-colors">
                  View My Quote List
                </Link>
              </li>
              <li>
                <Link href="/request-quote" className="hover:text-[#9E7B47] transition-colors">
                  Request For Quote (RFQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#9E7B47] transition-colors">
                  Contact Sales Office
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-[#E6E1D7] py-6 px-4 text-center text-xs text-[#6B635B]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SB PATTERN WORKS. All Rights Reserved.</p>
          <p className="text-[11px] text-[#6B635B]">
            E-41 CDF CHHERAT, INDUSTRIAL AREA CDF, ALIGARH, UTTAR PRADESH 202001, India
          </p>
        </div>
      </div>
    </footer>
  );
};
