import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Compass, Mail, Phone, MapPin, Globe2, ShieldCheck, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F4F2ED] text-[#666666] border-t border-[#E5E2DA] font-sans">
      {/* Top B2B Trust Bar */}
      <div className="border-b border-[#E5E2DA] py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-[#B08D57]/10 text-[#B08D57] rounded-xl border border-[#B08D57]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-[#222222] uppercase tracking-wider font-sans">
                Virgin Brass Metallurgy
              </h4>
              <p className="text-[11px] text-[#666666] font-sans">CuZn39Pb2 alloy & ISO 9227 salt spray tested</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-[#B08D57]/10 text-[#B08D57] rounded-xl border border-[#B08D57]/20">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-[#222222] uppercase tracking-wider font-sans">
                Container Port Dispatch
              </h4>
              <p className="text-[11px] text-[#666666] font-sans">FCL/LCL logistics via Nhava Sheva & Mundra</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-[#B08D57]/10 text-[#B08D57] rounded-xl border border-[#B08D57]/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-[#222222] uppercase tracking-wider font-sans">
                Factory Direct Pricing
              </h4>
              <p className="text-[11px] text-[#666666] font-sans">Wholesale container rates without middlemen</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] text-xs font-sans font-medium uppercase tracking-wider rounded-[8px] transition-colors"
            >
              Submit Trade RFQ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="dark" />
            <p className="text-xs text-[#666666] leading-relaxed pr-6">
              Radiance is a premier manufacturer and exporter of architectural, cabinet, door, and decorative hardware fittings. Serving hardware distributors, interior designers, architects, and international bulk importers worldwide.
            </p>
            <div className="space-y-2 text-xs text-[#666666] pt-2">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B08D57]" /> export@radiancehardware.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B08D57]" /> +1 (800) 555-RADIANCE / +91 (120) 456-7890
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" /> Building No. 4/2, Anoopshahr Road, Front of Radio Colony, Jatav Wali Gali Jamalpur, Aligarh, UP - 202001
              </p>
            </div>
          </div>

          {/* Quick Catalog */}
          <div>
            <h4 className="text-xs font-semibold text-[#B08D57] uppercase tracking-widest mb-4">
              Catalog Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-[#666666]">
              <li>
                <Link href="/products/door-hardware" className="hover:text-[#B08D57] transition-colors">
                  Door Hardware & Handles
                </Link>
              </li>
              <li>
                <Link href="/products/cabinet-hardware" className="hover:text-[#B08D57] transition-colors">
                  Cabinet Pulls & Knobs
                </Link>
              </li>
              <li>
                <Link href="/products/railing-fittings" className="hover:text-[#B08D57] transition-colors">
                  Railing & Balustrade Fittings
                </Link>
              </li>
              <li>
                <Link href="/products/window-hardware" className="hover:text-[#B08D57] transition-colors">
                  Casement & Sash Hardware
                </Link>
              </li>
              <li>
                <Link href="/products/black-antique" className="hover:text-[#B08D57] transition-colors">
                  Black Antique Ironmongery
                </Link>
              </li>
              <li>
                <Link href="/products/nautical-hardware" className="hover:text-[#B08D57] transition-colors">
                  Marine Grade Fittings
                </Link>
              </li>
            </ul>
          </div>

          {/* Special Collections */}
          <div>
            <h4 className="text-xs font-semibold text-[#B08D57] uppercase tracking-widest mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#666666]">
              <li>
                <Link href="/collections" className="hover:text-[#B08D57] transition-colors">
                  Vintage Hardware Series
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#B08D57] transition-colors">
                  Black Antique Collection
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#B08D57] transition-colors">
                  Decorative Brass Accents
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#B08D57] transition-colors">
                  Animal & Nature Knockers
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#B08D57] transition-colors">
                  Traditional Architectural
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-semibold text-[#B08D57] uppercase tracking-widest mb-4">
              Company & RFQ
            </h4>
            <ul className="space-y-2.5 text-xs text-[#666666]">
              <li>
                <Link href="/about" className="hover:text-[#B08D57] transition-colors">
                  About Our Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-[#B08D57] transition-colors">
                  Why Work With Us
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-[#B08D57] transition-colors">
                  View My Quote List
                </Link>
              </li>
              <li>
                <Link href="/request-quote" className="hover:text-[#B08D57] transition-colors">
                  Request For Quote (RFQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B08D57] transition-colors">
                  Contact Wholesale Department
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-[#E5E2DA] py-6 px-4 text-center text-xs text-[#666666]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Radiance Architectural Hardware Manufacturers. All Rights Reserved.</p>
          <p className="text-[11px] text-[#666666]">
            Product specifications and finishes subject to custom B2B manufacturing orders.
          </p>
        </div>
      </div>
    </footer>
  );
};
