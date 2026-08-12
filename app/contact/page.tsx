'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, FileText } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="bg-white rounded-lg border border-brand-border p-6 sm:p-10 shadow-sm">
        <SectionHeading
          subtitle="Trade & Export Communications"
          title="Contact Wholesale Division"
          description="Have questions about custom finishing, CAD hardware schedules, or container exports? Reach out to our B2B trade specialists."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-charcoal text-white rounded-lg border border-brand-border-dark p-6 sm:p-8 shadow-floating space-y-6">
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider border-b border-slate-700 pb-3">
              Export Desk & Headquarters
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-brass flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Factory & Head Office</strong>
                  <p className="text-slate-400 font-light mt-0.5 leading-relaxed">
                    [COMPANY_ADDRESS_LINE_1_PLACEHOLDER]<br />
                    [INDUSTRIAL_EXPORT_ZONE_PLACEHOLDER]<br />
                    [CITY_COUNTRY_PLACEHOLDER]
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-brass flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Export Enquiries</strong>
                  <p className="text-slate-400 font-light mt-0.5">export@radiencehardware.com</p>
                  <p className="text-slate-400 font-light">sales@radiencehardware.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-brass flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Phone & WhatsApp</strong>
                  <p className="text-slate-400 font-light mt-0.5">Phone: +1 (800) 555-ARCH / +91 (120) 456-7890</p>
                  <p className="text-slate-400 font-light">WhatsApp: +1 555 987 6543 (Trade Desk)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-brass flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-display">Business Operating Hours</strong>
                  <p className="text-slate-400 font-light mt-0.5">Monday - Friday: 08:30 - 18:00 (GMT+5:30)</p>
                  <p className="text-slate-400 font-light">Saturday: 09:00 - 14:00 (Export Operations)</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <Link
                href="/request-quote"
                className="w-full py-3 bg-brand-brass hover:bg-brand-brass-dark text-white font-display text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 text-center shadow"
              >
                <FileText className="w-4 h-4" /> Start Direct RFQ Enquiry
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: General Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-brand-border p-6 sm:p-8 shadow-card">
          <h3 className="font-display font-bold text-lg text-brand-dark uppercase tracking-wider mb-2">
            Send Us a Direct Message
          </h3>
          <p className="text-xs text-brand-text-muted mb-6">
            For general wholesale questions, dealership applications, or sample requests.
          </p>

          {isSubmitted ? (
            <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-lg space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-display font-bold text-lg text-emerald-900">
                Message Sent Successfully!
              </h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Thank you for contacting our trade desk. A representative will respond to your message within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-dark mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-brand-slate border border-slate-200 rounded px-3 py-2 text-brand-dark focus:outline-none focus:border-brand-brass"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-dark mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-brand-slate border border-slate-200 rounded px-3 py-2 text-brand-dark focus:outline-none focus:border-brand-brass"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-dark mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-brand-slate border border-slate-200 rounded px-3 py-2 text-brand-dark focus:outline-none focus:border-brand-brass"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-dark mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-brand-slate border border-slate-200 rounded px-3 py-2 text-brand-dark focus:outline-none focus:border-brand-brass"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Catalog Sample Request / Dealership Enquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-brand-slate border border-slate-200 rounded px-3 py-2 text-brand-dark focus:outline-none focus:border-brand-brass"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-dark mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your inquiry details here..."
                  className="w-full bg-brand-slate border border-slate-200 rounded p-3 text-brand-dark focus:outline-none focus:border-brand-brass leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-brand-brass hover:bg-brand-brass-dark text-white font-display text-xs font-bold uppercase tracking-wider rounded shadow transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Contact Message</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
