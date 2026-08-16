'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { QuoteBadge } from '@/components/quote/QuoteBadge';
import { Logo } from '@/components/ui/Logo';
import { Search, Menu, X, ChevronDown, FileText, Phone, Mail } from 'lucide-react';
import { categories } from '@/data/categories';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Products', href: '/products', hasDropdown: true },
    { label: 'Collections', href: '/collections' },
    { label: 'Custom Craft', href: '/custom-craft' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blog', href: '/blog' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md text-[#1C1917] border-b border-[#E6E1D7] transition-all">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2.5 flex items-center justify-between min-h-[90px] sm:min-h-[110px] lg:min-h-[120px]">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Logo variant="dark" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
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
                      className={`flex items-center gap-1.5 text-[11px] xl:text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                        isActive ? 'text-[#9E7B47]' : 'text-[#6B635B] hover:text-[#1C1917]'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 stroke-[1.5] text-[#6B635B] group-hover:rotate-180 transition-transform duration-300" />
                    </Link>

                    {/* Category Megamenu Dropdown */}
                    <div className="absolute top-full left-0 w-80 bg-[#F3F0E8] border border-[#E6E1D7] shadow-lg rounded-[6px] py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                      <div className="px-5 py-2.5 border-b border-[#E6E1D7] mb-1 flex items-center justify-between">
                        <p className="text-[10px] font-semibold text-[#9E7B47] uppercase tracking-[0.2em] font-sans">
                          Product Catalog
                        </p>
                        <span className="text-[10px] text-[#6B635B]">{categories.length} Categories</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products/${cat.slug}`}
                            className="block px-5 py-3 text-xs text-[#6B635B] hover:bg-[#FAF8F5] hover:text-[#9E7B47] transition-colors border-b border-[#E6E1D7]/50 last:border-0"
                          >
                            <span className="font-semibold text-[#1C1917] block">{cat.name}</span>
                            <span className="block text-[10px] text-[#6B635B] font-sans mt-0.5">
                              {cat.subcategories?.length || 0} subcategories
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
                  className={`text-[11px] xl:text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors relative py-2 ${
                    isActive ? 'text-[#9E7B47]' : 'text-[#6B635B] hover:text-[#1C1917]'
                  }`}
                >
                  {link.label}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E7B47] rounded-full" />}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 sm:p-2.5 text-[#6B635B] hover:text-[#1C1917] transition-colors rounded-[4px] hover:bg-[#F3F0E8] border border-transparent hover:border-[#E6E1D7]"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.5]" />
            </button>

            {/* Quote Request Badge */}
            <QuoteBadge />

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#1C1917] hover:bg-[#F3F0E8] rounded-[4px] transition border border-[#E6E1D7]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search Overlay Bar */}
      {isSearchOpen && (
        <div className="bg-[#FAF8F5] border-t border-b border-[#E6E1D7] py-3.5 px-4 shadow-inner">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#9E7B47] shrink-0 stroke-[1.5]" />
            <input
              type="text"
              placeholder="Search product code, SKU, hardware category, material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-[#F3F0E8] border border-[#E6E1D7] rounded-[4px] px-4 py-2 text-[#1C1917] placeholder-[#6B635B] text-xs focus:outline-none focus:border-[#9E7B47]"
              autoFocus
            />
            <button
              type="submit"
              className="btn-luxury-primary"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-[#6B635B] hover:text-[#1C1917]"
            >
              <X className="w-4 h-4 stroke-[1.5]" />
            </button>
          </form>
        </div>
      )}

      {/* Responsive Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E6E1D7] shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
          {/* Mobile Search Form inside Menu */}
          <div className="p-4 bg-[#F3F0E8] border-b border-[#E6E1D7]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E6E1D7] rounded-[4px] text-xs text-[#1C1917] focus:outline-none focus:border-[#9E7B47]"
              />
              <Search className="w-4 h-4 text-[#6B635B] absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.5]" />
            </form>
          </div>

          {/* Primary Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              if (link.hasDropdown) {
                return (
                  <div key={link.href} className="space-y-1">
                    <button
                      onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] rounded-[4px] transition ${
                        isActive ? 'bg-[#F3F0E8] text-[#9E7B47]' : 'text-[#1C1917] hover:bg-[#F3F0E8]'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 stroke-[1.5] transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {mobileCategoriesOpen && (
                      <div className="pl-4 pr-2 py-2 space-y-1 bg-[#F3F0E8] rounded-[4px] border border-[#E6E1D7]">
                        <Link
                          href="/products"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-2 text-xs font-semibold text-[#9E7B47] uppercase tracking-[0.18em]"
                        >
                          View All Products →
                        </Link>
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products/${cat.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 text-xs text-[#6B635B] hover:text-[#1C1917] truncate border-b border-[#E6E1D7]/40 last:border-0"
                          >
                            • {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] rounded-[4px] transition ${
                    isActive
                      ? 'bg-[#F3F0E8] text-[#9E7B47] border border-[#E6E1D7]'
                      : 'text-[#1C1917] hover:bg-[#F3F0E8]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Quick Actions Footer inside Drawer */}
            <div className="pt-4 mt-2 border-t border-[#E6E1D7] space-y-3">
              <Link
                href="/custom-craft"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-3 bg-[#9E7B47] hover:bg-[#856637] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.18em] rounded-[4px] transition"
              >
                <FileText className="w-4 h-4 stroke-[1.5]" />
                <span>Custom Craft Enquiry</span>
              </Link>

              <div className="p-3 bg-[#F3F0E8] rounded-[4px] border border-[#E6E1D7] space-y-1 text-[11px] text-[#6B635B]">
                <p className="flex items-center gap-2 font-mono">
                  <Mail className="w-3.5 h-3.5 text-[#9E7B47] stroke-[1.5]" /> Sales@sbpatternworks.com
                </p>
                <p className="flex items-center gap-2 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#9E7B47] stroke-[1.5]" /> +91 (120) 456-7890
                </p>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
