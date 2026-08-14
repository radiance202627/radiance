'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { QuoteBadge } from '@/components/quote/QuoteBadge';
import { Logo } from '@/components/ui/Logo';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-xl text-stone-100 border-b border-stone-800/80 shadow-2xl">
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
                      className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                        isActive ? 'text-amber-400' : 'text-stone-300 hover:text-stone-100'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 text-stone-500 group-hover:rotate-180 transition-transform duration-300" />
                    </Link>

                    {/* Category Megamenu Dropdown */}
                    <div className="absolute top-full left-0 w-80 bg-stone-900/95 backdrop-blur-xl border border-amber-500/20 shadow-2xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                      <div className="px-4 py-2 border-b border-stone-800 mb-1">
                        <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest">
                          Explore Categories
                        </p>
                      </div>
                      <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products/${cat.slug}`}
                            className="block px-4 py-2.5 text-xs text-stone-300 hover:bg-stone-800/80 hover:text-amber-400 transition-colors border-b border-stone-800/40 last:border-0"
                          >
                            <span className="font-semibold text-stone-200">{cat.name}</span>
                            <span className="block text-[10px] text-stone-500 font-sans mt-0.5">
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
                  className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors relative py-2 ${
                    isActive ? 'text-amber-400' : 'text-stone-300 hover:text-stone-100'
                  }`}
                >
                  {link.label}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-px bg-amber-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-stone-300 hover:text-stone-100 transition-colors rounded-xl hover:bg-stone-800 border border-transparent hover:border-stone-800"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Request a Quote Badge */}
            <QuoteBadge />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-stone-100 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Global Quick Search Overlay Bar */}
      {isSearchOpen && (
        <div className="bg-stone-950 border-t border-b border-stone-800 py-4 px-4 shadow-inner">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-stone-500" />
            <input
              type="text"
              placeholder="Search by Product Name, SKU (e.g. DH-LH-001), Category, Material, Finish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-4 py-2 text-stone-200 placeholder-stone-600 text-xs focus:outline-none focus:border-amber-500/50"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="text-stone-500 hover:text-stone-200 text-xs px-2"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl ${
                pathname === link.href ? 'bg-stone-800 text-amber-400' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-stone-800">
            <p className="px-3 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
              Product Categories
            </p>
            <div className="grid grid-cols-2 gap-1 px-3">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs text-stone-400 hover:text-amber-400 py-1 block truncate"
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
