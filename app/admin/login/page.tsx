'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || 'Invalid login credentials.');
        setLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError('An error occurred while signing in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl border border-stone-800 rounded-2xl sm:px-10">
      {error && (
        <div className="mb-6 bg-red-950/50 border border-red-800/60 rounded-xl p-4 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
            Business Email
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hardware.com"
              className="block w-full pl-10 pr-4 py-3 bg-stone-950/80 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
            Password
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="block w-full pl-10 pr-4 py-3 bg-stone-950/80 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm transition"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-amber-500/40 rounded-xl shadow-lg text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Admin Shell
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-stone-100">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-900 border border-amber-500/30 text-amber-400 mb-4 shadow-xl shadow-amber-950/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-stone-100 font-serif">
          Architectural Hardware
        </h2>
        <p className="mt-2 text-sm text-stone-400">
          Admin Portal & Control Center
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <Suspense fallback={
          <div className="bg-stone-900/80 py-8 px-6 text-center text-stone-400 text-sm rounded-2xl">
            Loading Admin Portal...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
