'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, FileText } from 'lucide-react';

export function ContactClient() {
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = new FormData();
      payload.append('access_key', '5c13d35f-9934-4b1e-b53b-4c469ac826ea');
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('company', formData.company);
      payload.append('subject', formData.subject);
      payload.append('message', formData.message);
      payload.append('from_name', 'Radiance Hardware Contact Form');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: payload,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
        });
      } else {
        setErrorMessage(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please check your network connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 sm:p-10 shadow-sm">
        <SectionHeading
          subtitle="Trade & Export Communications"
          title="Contact Wholesale Division"
          description="Have questions about custom finishing, CAD hardware schedules, or container exports? Reach out to our B2B trade specialists."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#F4F2ED] text-[#222222] rounded-2xl border border-[#E5E2DA] p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-lg text-[#222222] border-b border-[#E5E2DA] pb-3">
              Export Desk & Headquarters
            </h3>

            <div className="space-y-4 text-xs text-[#666666] font-sans">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#B08D57] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#222222] block font-serif">Factory & Head Office</strong>
                  <p className="text-[#666666] font-normal mt-0.5 leading-relaxed">
                    Building No. 4/2, Anoopshahr Road<br />
                    Front of Radio Colony, Jatav Wali Gali Jamalpur<br />
                    Aligarh, Uttar Pradesh - 202001, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#B08D57] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#222222] block font-serif">Export Enquiries</strong>
                  <p className="text-[#666666] font-normal mt-0.5">export@radiancehardware.com</p>
                  <p className="text-[#666666] font-normal">sales@radiancehardware.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#B08D57] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#222222] block font-serif">Phone & WhatsApp</strong>
                  <p className="text-[#666666] font-normal mt-0.5">Phone: +1 (800) 555-ARCH / +91 (120) 456-7890</p>
                  <p className="text-[#666666] font-normal">WhatsApp: +1 555 987 6543 (Trade Desk)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#B08D57] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#222222] block font-serif">Business Operating Hours</strong>
                  <p className="text-[#666666] font-normal mt-0.5">Monday - Friday: 08:30 - 18:00 (GMT+5:30)</p>
                  <p className="text-[#666666] font-normal">Saturday: 09:00 - 14:00 (Export Operations)</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E2DA]">
              <Link
                href="/request-quote"
                className="w-full py-3 px-6 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] font-sans text-xs font-medium uppercase tracking-wider rounded-[8px] transition-colors flex items-center justify-center gap-2 text-center"
              >
                <FileText className="w-4 h-4" /> Start Direct RFQ Enquiry
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: General Inquiry Form */}
        <div className="lg:col-span-7 bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] p-6 sm:p-8 shadow-sm">
          <h3 className="font-serif font-bold text-lg text-[#222222] tracking-tight mb-2">
            Send Us a Direct Message
          </h3>
          <p className="text-xs text-[#666666] mb-6 font-sans">
            For general wholesale questions, dealership applications, or sample requests.
          </p>

          {isSubmitted ? (
            <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-lg text-emerald-900">
                Message Sent Successfully!
              </h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto font-sans">
                Thank you for contacting our trade desk. A representative will respond to your message within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-5 py-2.5 bg-emerald-600 text-[#FAF9F6] text-xs font-sans font-medium rounded-[8px] uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[8px]">
                  {errorMessage}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#222222] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-[8px] px-3 py-2 text-[#222222] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#222222] mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-[8px] px-3 py-2 text-[#222222] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#222222] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-[8px] px-3 py-2 text-[#222222] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#222222] mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-[8px] px-3 py-2 text-[#222222] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#222222] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Catalog Sample Request / Dealership Enquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-[8px] px-3 py-2 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#222222] mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your inquiry details here..."
                  className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-[8px] p-3 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57] leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] font-sans text-xs font-medium uppercase tracking-wider rounded-[8px] transition-colors flex items-center justify-center gap-2"
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
