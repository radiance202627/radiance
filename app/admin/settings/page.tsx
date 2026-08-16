'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Building, Phone, Mail, MapPin, Share2, Globe, Shield, RefreshCw } from 'lucide-react';
import ToastNotification, { ToastMessage } from '@/components/admin/ToastNotification';
import MediaUploader from '@/components/admin/MediaUploader';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [googleMapUrl, setGoogleMapUrl] = useState('');

  // Social Links
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');

  // SEO Defaults
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Footer Content
  const [copyright, setCopyright] = useState('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const s = data.data;
        setCompanyName(s.companyName || '');
        setLogo(s.logo || '');
        setEmail(s.email || '');
        setPhone(s.phone || '');
        setWhatsapp(s.whatsapp || '');
        setAddress(s.address || '');
        setGoogleMapUrl(s.googleMapUrl || '');

        const social = typeof s.socialLinks === 'string' ? JSON.parse(s.socialLinks) : s.socialLinks || {};
        setLinkedin(social.linkedin || '');
        setInstagram(social.instagram || '');
        setFacebook(social.facebook || '');

        const seo = typeof s.seoDefaults === 'string' ? JSON.parse(s.seoDefaults) : s.seoDefaults || {};
        setMetaTitle(seo.metaTitle || '');
        setMetaDescription(seo.metaDescription || '');

        const footer = typeof s.footerContent === 'string' ? JSON.parse(s.footerContent) : s.footerContent || {};
        setCopyright(footer.copyright || '');
      }
    } catch {
      addToast('error', 'Failed to load site settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      companyName,
      logo,
      email,
      phone,
      whatsapp,
      address,
      googleMapUrl,
      socialLinks: { linkedin, instagram, facebook },
      seoDefaults: { metaTitle, metaDescription },
      footerContent: { copyright },
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        addToast('success', 'Site Settings updated successfully!');
      } else {
        addToast('error', data.error?.message || 'Failed to save settings');
      }
    } catch {
      addToast('error', 'Error updating site settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-stone-500">
        <span className="inline-block w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
        <p>Loading site settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-stone-100 flex items-center gap-3">
            <Settings className="w-6 h-6 text-amber-400" />
            Global Site Settings
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Manage company branding, contact numbers, social links, SEO defaults, and footer text.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadSettings}
            className="p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-400 hover:text-stone-100 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold hover:bg-amber-300 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save Site Settings
          </button>
        </div>
      </div>

      {/* Company Branding */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-serif font-bold text-lg text-stone-100 flex items-center gap-2">
          <Building className="w-5 h-5 text-amber-400" />
          Company Identity & Branding
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
            />
          </div>

          <div>
            <MediaUploader
              label="Company Logo"
              value={logo}
              onChange={(url) => setLogo(url as string)}
              folder="logos"
              acceptSvg={true}
            />
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-serif font-bold text-lg text-stone-100 flex items-center gap-2">
          <Phone className="w-5 h-5 text-emerald-400" />
          Contact & Location Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Business Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              WhatsApp Contact
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Physical Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Google Maps URL
            </label>
            <textarea
              rows={2}
              value={googleMapUrl}
              onChange={(e) => setGoogleMapUrl(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-serif font-bold text-lg text-stone-100 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-sky-400" />
          Social Media Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1">LinkedIn</label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1">Instagram</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1">Facebook</label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
            />
          </div>
        </div>
      </div>

      {/* SEO & Footer Defaults */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-serif font-bold text-lg text-stone-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-400" />
          Default SEO & Footer
        </h3>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
            Default Meta Title
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
            Default Meta Description
          </label>
          <textarea
            rows={2}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
            Footer Copyright Text
          </label>
          <input
            type="text"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-100"
          />
        </div>
      </div>

      <ToastNotification toasts={toasts} onDismiss={removeToast} />
    </form>
  );
}
