import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Compass, Mail, Phone, MapPin, Globe2, ShieldCheck, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800/80 font-sans">
      {/* Top B2B Trust Bar */}
      <div className="border-b border-stone-800/80 py-8 px-4 sm:px-6 lg:px-8 bg-stone-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider">
                Precision Ironmongery
              </h4>
              <p className="text-[11px] text-stone-400">Manufactured for global architects & developments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider">
                Worldwide Export
              </h4>
              <p className="text-[11px] text-stone-400">Container shipments & international B2B logistics</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider">
                Request For Quote
              </h4>
              <p className="text-[11px] text-stone-400">Direct factory RFQ pricing without retail markups</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-md font-sans"
            >
              Start RFQ Enquiry
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
            <p className="text-xs text-stone-400 leading-relaxed pr-6">
              Radiance is a premier manufacturer and exporter of architectural, cabinet, door, and decorative hardware fittings. Serving hardware distributors, interior designers, architects, and international bulk importers worldwide.
            </p>
            <div className="space-y-2 text-xs text-stone-400 pt-2">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" /> export@radiancehardware.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" /> +1 (800) 555-RADIANCE / +91 (120) 456-7890
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> Building No. 4/2, Anoopshahr Road, Front of Radio Colony, Jatav Wali Gali Jamalpur, Aligarh, UP - 202001
              </p>
            </div>
          </div>

          {/* Quick Catalog */}
          <div>
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">
              Catalog Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/products/door-hardware" className="hover:text-amber-400 transition-colors">
                  Door Hardware & Handles
                </Link>
              </li>
              <li>
                <Link href="/products/cabinet-hardware" className="hover:text-amber-400 transition-colors">
                  Cabinet Pulls & Knobs
                </Link>
              </li>
              <li>
                <Link href="/products/railing-fittings" className="hover:text-amber-400 transition-colors">
                  Railing & Balustrade Fittings
                </Link>
              </li>
              <li>
                <Link href="/products/window-hardware" className="hover:text-amber-400 transition-colors">
                  Casement & Sash Hardware
                </Link>
              </li>
              <li>
                <Link href="/products/black-antique" className="hover:text-amber-400 transition-colors">
                  Black Antique Ironmongery
                </Link>
              </li>
              <li>
                <Link href="/products/nautical-hardware" className="hover:text-amber-400 transition-colors">
                  Marine Grade Fittings
                </Link>
              </li>
            </ul>
          </div>

          {/* Special Collections */}
          <div>
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/collections" className="hover:text-amber-400 transition-colors">
                  Vintage Hardware Series
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-amber-400 transition-colors">
                  Black Antique Collection
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-amber-400 transition-colors">
                  Decorative Brass Accents
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-amber-400 transition-colors">
                  Animal & Nature Knockers
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-amber-400 transition-colors">
                  Traditional Architectural
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">
              Company & RFQ
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Our Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-amber-400 transition-colors">
                  Why Work With Us
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-amber-400 transition-colors">
                  View My Quote List
                </Link>
              </li>
              <li>
                <Link href="/request-quote" className="hover:text-amber-400 transition-colors">
                  Request For Quote (RFQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Wholesale Department
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-stone-800/80 py-6 px-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Radiance Architectural Hardware Manufacturers. All Rights Reserved.</p>
          <p className="text-[11px] text-stone-500">
            Product specifications and finishes subject to custom B2B manufacturing orders.
          </p>
        </div>
      </div>
    </footer>
  );
};
