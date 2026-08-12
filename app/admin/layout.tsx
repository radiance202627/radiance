'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  Users,
  FileText,
  Trash2,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    if (pathname !== '/admin/login') {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.user) {
            setUser(data.data.user);
          }
        })
        .catch(() => {});
    }
  }, [pathname]);

  // Skip sidebar & shell for login page (placed AFTER hooks)
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Collections', href: '/admin/collections', icon: Boxes },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Quote Requests', href: '/admin/quotes', icon: FileText },
    { label: 'Trash', href: '/admin/trash', icon: Trash2 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-stone-900 border-r border-stone-800 flex-shrink-0">
        <div className="p-6 border-b border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-stone-100 leading-tight">
              Hardware Admin
            </h1>
            <span className="text-xs text-stone-400 font-mono uppercase tracking-wider">
              Control Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/50">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-sm font-semibold text-stone-200 truncate">
                {user?.name || 'Super Admin'}
              </p>
              <p className="text-xs text-amber-400/90 font-mono uppercase tracking-wider">
                {user?.role || 'SUPER_ADMIN'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 rounded-xl text-stone-400 hover:text-red-400 hover:bg-stone-800/80 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-72 max-w-full bg-stone-900 border-r border-stone-800 z-10">
            <div className="p-6 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                <span className="font-serif font-bold text-stone-100">Hardware Admin</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-stone-800 flex items-center justify-between">
              <div className="truncate">
                <p className="text-sm font-semibold text-stone-200">{user?.name || 'Super Admin'}</p>
                <p className="text-xs text-amber-400 font-mono">{user?.role || 'SUPER_ADMIN'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-stone-400 hover:text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-stone-900 border-b border-stone-800 p-4 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-stone-400 hover:text-stone-200"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-stone-100">Architectural Hardware</span>
          <div className="w-6" />
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
