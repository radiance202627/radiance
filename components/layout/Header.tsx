'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { QuoteBadge } from '@/components/quote/QuoteBadge';
import { Logo } from '@/components/ui/Logo';
import { Search, Menu, X, ShieldCheck, Compass, ChevronDown } from 'lucide-react';
import { categories } from '@/data/categories';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Products', href: '/products', hasDropdown: true },
    { label: 'Collections', href: '/collections' },
    { label: 'About Us', href: '/about' },
    { label: 'Why Us', href: '/why-us' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-brand-charcoal text-white border-b border-brand-border-dark shadow-md">
      {/* Top B2B Announcement Bar */}
      <div className="bg-brand-dark text-slate-400 text-xs py-1.5 px-4 border-b border-brand-border-dark">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-brass" />
              B2B Manufacturer & Global Exporter
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline">Custom Finishes & Architectural Specification Support</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/request-quote" className="hover:text-brand-brass transition-colors">
              Submit RFQ
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-brand-brass transition-colors">
              Wholesale Enquiries
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Logo variant="dark" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.href}
                    className="relative group py-6"
                    onMouseEnter={() => setIsProductsDropdownOpen(true)}
                    onMouseLeave={() => setIsProductsDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 font-display text-xs font-semibold uppercase tracking-wider transition-colors ${
                        isActive ? 'text-brand-brass' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
                    </Link>

                    {/* Category Megamenu Dropdown */}
                    <div className="absolute top-full left-0 w-80 bg-brand-charcoal border border-brand-border-dark shadow-floating rounded-b-md py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="px-4 py-2 border-b border-brand-border-dark mb-2">
                        <p className="text-[11px] font-semibold text-brand-brass uppercase tracking-widest">
                          Explore Categories
                        </p>
                      </div>
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products/${cat.slug}`}
                            className="block px-4 py-2 text-xs text-slate-300 hover:bg-brand-card hover:text-brand-brass transition-colors"
                          >
                            <span className="font-medium text-white">{cat.name}</span>
                            <span className="block text-[10px] text-slate-400 font-sans mt-0.5 line-clamp-1">
                              {cat.subcategories.length} subcategories
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-display text-xs font-semibold uppercase tracking-wider transition-colors relative py-2 ${
                    isActive ? 'text-brand-brass' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-brass" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-brand-card"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Request a Quote Badge */}
            <QuoteBadge />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Global Quick Search Overlay Bar */}
      {isSearchOpen && (
        <div className="bg-brand-dark border-t border-b border-brand-border-dark py-4 px-4 shadow-inner">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Product Name, SKU (e.g. DH-LH-001), Category, Material, Finish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none px-2 py-1"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-brand-brass hover:bg-brand-brass-dark text-white text-xs font-semibold uppercase tracking-wider rounded"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-2"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-brand-charcoal border-b border-brand-border-dark px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm font-display font-semibold uppercase tracking-wider rounded ${
                pathname === link.href ? 'bg-brand-card text-brand-brass' : 'text-slate-200 hover:bg-brand-card'
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="pt-3 border-t border-brand-border-dark">
            <p className="px-3 text-xs font-semibold text-brand-brass uppercase tracking-widest mb-2">
              Product Categories
            </p>
            <div className="grid grid-cols-2 gap-1 px-3">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs text-slate-300 hover:text-brand-brass py-1 block truncate"
                >
                  • {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
