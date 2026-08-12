import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Compass, Mail, Phone, MapPin, Globe2, ShieldCheck, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-slate-300 border-t border-brand-border-dark font-sans">
      {/* Top B2B Trust Bar */}
      <div className="border-b border-brand-border-dark py-8 px-4 sm:px-6 lg:px-8 bg-brand-charcoal/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-brand-brass/10 text-brand-brass rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
                Precision Hardware
              </h4>
              <p className="text-xs text-slate-400">Manufactured for global architects & builders</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-brand-brass/10 text-brand-brass rounded-lg">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
                Worldwide Export
              </h4>
              <p className="text-xs text-slate-400">Container shipments & international B2B logistics</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 bg-brand-brass/10 text-brand-brass rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-white uppercase tracking-wider">
                Request For Quote
              </h4>
              <p className="text-xs text-slate-400">Direct factory RFQ pricing without online retail markups</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-brass hover:bg-brand-brass-dark text-white font-display text-xs font-semibold uppercase tracking-wider rounded transition-colors"
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
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              Radience is a premier manufacturer and exporter of B2B architectural, cabinet, door, and decorative hardware fittings. Serving hardware distributors, interior designers, architects, and international bulk importers worldwide.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-brass" /> export@radiencehardware.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-brass" /> +1 (800) 555-RADIENCE / +91 (120) 456-7890
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-brass" /> Industrial Hardware Export Zone, Sector 62
              </p>
            </div>
          </div>

          {/* Quick Catalog */}
          <div>
            <h4 className="font-display text-xs font-semibold text-brand-brass uppercase tracking-widest mb-4">
              Catalog Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products/door-hardware" className="hover:text-brand-brass transition-colors">
                  Door Hardware & Handles
                </Link>
              </li>
              <li>
                <Link href="/products/cabinet-hardware" className="hover:text-brand-brass transition-colors">
                  Cabinet Pulls & Knobs
                </Link>
              </li>
              <li>
                <Link href="/products/railing-fittings" className="hover:text-brand-brass transition-colors">
                  Railing & Balustrade Fittings
                </Link>
              </li>
              <li>
                <Link href="/products/window-hardware" className="hover:text-brand-brass transition-colors">
                  Casement & Sash Hardware
                </Link>
              </li>
              <li>
                <Link href="/products/black-antique" className="hover:text-brand-brass transition-colors">
                  Black Antique Ironmongery
                </Link>
              </li>
              <li>
                <Link href="/products/nautical-hardware" className="hover:text-brand-brass transition-colors">
                  Marine Grade Fittings
                </Link>
              </li>
            </ul>
          </div>

          {/* Special Collections */}
          <div>
            <h4 className="font-display text-xs font-semibold text-brand-brass uppercase tracking-widest mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/collections" className="hover:text-brand-brass transition-colors">
                  Vintage Hardware Series
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-brand-brass transition-colors">
                  Black Antique Collection
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-brand-brass transition-colors">
                  Decorative Brass Accents
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-brand-brass transition-colors">
                  Animal & Nature Knockers
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-brand-brass transition-colors">
                  Traditional Architectural
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="font-display text-xs font-semibold text-brand-brass uppercase tracking-widest mb-4">
              Company & RFQ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-brand-brass transition-colors">
                  About Our Manufacturing
                </Link>
              </li>
              <li>
                <Link href="/why-us" className="hover:text-brand-brass transition-colors">
                  Why Work With Us
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-brand-brass transition-colors">
                  View My Quote List
                </Link>
              </li>
              <li>
                <Link href="/request-quote" className="hover:text-brand-brass transition-colors">
                  Request For Quote (RFQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-brass transition-colors">
                  Contact Wholesale Department
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-brand-border-dark py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Radience Architectural Hardware Manufacturers. All Rights Reserved. B2B Catalog.</p>
          <p className="text-[11px] text-slate-400">
            Product specifications and finishes subject to custom B2B manufacturing orders.
          </p>
        </div>
      </div>
    </footer>
  );
};
