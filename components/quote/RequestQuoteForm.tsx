'use client';

import React, { useState } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { QuoteEnquiryForm } from '@/lib/types';
import { Send, CheckCircle2, Building, Globe, Mail, Phone, Calendar, PackageCheck } from 'lucide-react';
import Link from 'next/link';

export const RequestQuoteForm: React.FC = () => {
  const { items, clearQuote } = useQuote();
  const [formData, setFormData] = useState<QuoteEnquiryForm>({
    fullName: '',
    companyName: '',
    businessEmail: '',
    phoneWhatsApp: '',
    country: '',
    city: '',
    companyWebsite: '',
    businessType: 'Hardware Distributor',
    message: '',
    expectedQuantity: '',
    requiredFinish: '',
    requiredDeliveryDate: '',
    additionalRequirements: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const extractValidationMessages = (details: any): string[] => {
    if (!details || typeof details !== 'object') return [];
    const messages: string[] = [];

    const traverse = (obj: any, prefix = '') => {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj._errors) && obj._errors.length > 0) {
        obj._errors.forEach((msg: string) => {
          messages.push(prefix ? `${prefix}: ${msg}` : msg);
        });
      }
      for (const key of Object.keys(obj)) {
        if (key !== '_errors') {
          const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
          traverse(obj[key], prefix ? `${prefix} -> ${fieldName}` : fieldName);
        }
      }
    };

    traverse(details);
    return messages;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const refNo = `RFQ-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Primary: Save to PostgreSQL database via API endpoint
      const dbResponse = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: formData.fullName.trim(),
            company: formData.companyName.trim(),
            email: formData.businessEmail.trim(),
            phone: formData.phoneWhatsApp.trim(),
            country: formData.country.trim(),
            city: formData.city.trim() || 'N/A',
            businessType: formData.businessType.trim(),
            companyWebsite: formData.companyWebsite?.trim() || undefined,
          },
          message: formData.message?.trim() || undefined,
          companyWebsite: formData.companyWebsite?.trim() || undefined,
          expectedQuantity: formData.expectedQuantity?.trim() || undefined,
          requiredFinish: formData.requiredFinish?.trim() || undefined,
          requiredDeliveryDate: formData.requiredDeliveryDate?.trim() || undefined,
          additionalRequirements: formData.additionalRequirements?.trim() || undefined,
          items: items.map((item) => ({
            productId: item.product.id,
            selectedFinish: item.selectedFinish || undefined,
            selectedSize: item.selectedSize || undefined,
            selectedMaterial: item.selectedMaterial || undefined,
            quantity: item.quantity,
          })),
        }),
      });

      const dbData = await dbResponse.json();

      if (!dbResponse.ok || !dbData.success) {
        const details = dbData.error?.details;
        const validationMsgs = extractValidationMessages(details);
        if (validationMsgs.length > 0) {
          throw new Error(`Validation failed: ${validationMsgs.join(' | ')}`);
        }
        throw new Error(dbData.error?.message || 'Database registration failed.');
      }

      const returnedId = dbData.data?.id ? `RFQ-${dbData.data.id.slice(-6).toUpperCase()}` : refNo;

      // 2. Secondary: Trigger Web3Forms email notification service in tandem
      try {
        const formattedItemList = items.length > 0
          ? items.map((item, i) => `${i + 1}. ${item.product.name} (SKU: ${item.product.sku}) - Finish: ${item.selectedFinish || 'Default'}, Size: ${item.selectedSize || 'Default'}, Qty: ${item.quantity}`).join('\n')
          : 'No specific items attached (General RFQ Inquiry)';

        const messageContent = `
--- B2B RFQ DETAILS ---
Reference: ${returnedId}
Full Name: ${formData.fullName}
Company: ${formData.companyName}
Business Email: ${formData.businessEmail}
Phone/WhatsApp: ${formData.phoneWhatsApp}
Country/City: ${formData.country} / ${formData.city || 'N/A'}
Business Type: ${formData.businessType}
Website: ${formData.companyWebsite || 'N/A'}

--- SPECIFICATION & ORDER REQUIREMENTS ---
Expected Quantity: ${formData.expectedQuantity || 'N/A'}
Required Finish: ${formData.requiredFinish || 'N/A'}
Target Delivery Date: ${formData.requiredDeliveryDate || 'N/A'}

--- REQUESTED CATALOG PRODUCTS ---
${formattedItemList}

--- CLIENT MESSAGE / CUSTOM REQUIREMENTS ---
${formData.message || 'None provided'}
        `.trim();

        const payload = new FormData();
        payload.append('access_key', '5c13d35f-9934-4b1e-b53b-4c469ac826ea');
        payload.append('name', formData.fullName);
        payload.append('email', formData.businessEmail);
        payload.append('phone', formData.phoneWhatsApp);
        payload.append('company', formData.companyName);
        payload.append('subject', `[${returnedId}] New RFQ Submitted by ${formData.companyName}`);
        payload.append('message', messageContent);
        payload.append('from_name', 'Radiance RFQ Portal');

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: payload,
        });
      } catch (emailErr) {
        console.warn('Web3Forms notification dispatch warning:', emailErr);
      }

      setSubmittedRef(returnedId);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedRef) {
    return (
      <div className="bg-[#F4F2ED] border border-[#E5E2DA] rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-sm my-8 font-sans">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <span className="text-xs font-mono text-[#666666] uppercase tracking-widest block font-semibold">
          Reference Number: {submittedRef}
        </span>
        
        <h2 className="font-display font-bold text-2xl text-[#222222] mt-1 mb-3">
          RFQ Enquiry Submitted Successfully!
        </h2>

        <p className="text-xs md:text-sm text-[#666666] leading-relaxed max-w-lg mx-auto mb-6">
          Thank you, <strong className="text-[#222222]">{formData.fullName}</strong>. Our B2B export and technical estimation division at <strong className="text-[#222222]">{formData.companyName}</strong> has received your Request for Quote.
        </p>

        <div className="bg-[#FAF9F6] rounded-xl border border-[#E5E2DA] p-4 text-left text-xs mb-6 space-y-2">
          <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-2">
            <span className="font-semibold text-[#222222] uppercase tracking-wider font-display">
              Submission Summary ({items.length} Products)
            </span>
            <span className="text-[#666666] font-mono">{new Date().toLocaleDateString()}</span>
          </div>
          <ul className="space-y-1.5 pt-1 max-h-40 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-[#666666]">
                <span className="truncate pr-2">
                  • <strong className="text-[#222222]">{item.product.name}</strong> ({item.selectedFinish}, {item.selectedSize})
                </span>
                <span className="font-mono bg-[#F4F2ED] px-2 py-0.5 rounded-md border border-[#E5E2DA] text-[11px] text-[#222222]">
                  Qty: {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            onClick={() => clearQuote()}
            className="w-full sm:w-auto px-6 py-3 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] font-display text-xs font-semibold uppercase tracking-wider rounded-xl shadow-sm transition-all"
          >
            Continue Catalog Browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#F4F2ED] border border-[#E5E2DA] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 font-sans">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {errorMessage}
        </div>
      )}
      
      {/* Primary Contact Details */}
      <div>
        <h3 className="font-display font-bold text-base text-[#222222] uppercase tracking-wider pb-2 border-b border-[#E5E2DA] mb-4 flex items-center gap-2">
          <Building className="w-4 h-4 text-[#B08D57]" /> Business Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#222222] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Alexander Wright"
              className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl px-3 py-2 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#222222] mb-1">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Apex Architectural Hardware Ltd"
              className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl px-3 py-2 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#222222] mb-1">
              Business Email *
            </label>
            <input
              type="email"
              name="businessEmail"
              required
              value={formData.businessEmail}
              onChange={handleChange}
              placeholder="e.g. procurement@apex-hardware.com"
              className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl px-3 py-2 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#222222] mb-1">
              Phone / WhatsApp Number *
            </label>
            <input
              type="tel"
              name="phoneWhatsApp"
              required
              value={formData.phoneWhatsApp}
              onChange={handleChange}
              placeholder="e.g. +1 555 234 5678"
              className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl px-3 py-2 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#222222] mb-1">
              Country *
            </label>
            <input
              type="text"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. United Kingdom / United States / UAE"
              className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl px-3 py-2 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#222222] mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. London / New York / Dubai"
              className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl px-3 py-2 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#222222] mb-1">
              Company Website
            </label>
            <input
              type="text"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              placeholder="e.g. www.yourcompany.com"
              className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl px-3 py-2 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#222222] mb-1">
              Business Type *
            </label>
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl px-3 py-2 text-[#222222] focus:outline-none focus:border-[#B08D57]"
            >
              <option value="Hardware Distributor">Hardware Distributor</option>
              <option value="Architect">Architect / Specification Office</option>
              <option value="Interior Designer">Interior Designer</option>
              <option value="Builder / Contractor">Builder / Commercial Contractor</option>
              <option value="Furniture Manufacturer">Furniture / Cabinet Manufacturer</option>
              <option value="Retailer">Retailer / Stockist</option>
              <option value="International Importer">International Importer</option>
              <option value="Other">Other Business</option>
            </select>
          </div>
        </div>
      </div>

      {/* Optional Specific B2B Project Details */}
      <div>
        <h3 className="font-display font-bold text-base text-[#222222] uppercase tracking-wider pb-2 border-b border-[#E5E2DA] mb-4 flex items-center gap-2">
          <PackageCheck className="w-4 h-4 text-[#B08D57]" /> Optional Order & Specification Requirements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#222222] mb-1">
              Expected Total Order Quantity
            </label>
            <input
              type="text"
              name="expectedQuantity"
              value={formData.expectedQuantity}
              onChange={handleChange}
              placeholder="e.g. 500 sets / 1 Full Container"
              className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl px-3 py-2 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#222222] mb-1">
              Required Custom Finish (If any)
            </label>
            <input
              type="text"
              name="requiredFinish"
              value={formData.requiredFinish}
              onChange={handleChange}
              placeholder="e.g. Custom PVD Gunmetal / Satin Brass"
              className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl px-3 py-2 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#222222] mb-1">
              Target Delivery Date
            </label>
            <input
              type="date"
              name="requiredDeliveryDate"
              value={formData.requiredDeliveryDate}
              onChange={handleChange}
              className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl px-3 py-2 text-[#222222] focus:outline-none focus:border-[#B08D57]"
            />
          </div>
        </div>
      </div>

      {/* Message / Custom Requirements */}
      <div className="text-xs">
        <label className="block font-semibold text-[#222222] mb-1">
          Project Requirements & Message *
        </label>
        <textarea
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Specify any custom branding, door preparation specs, packaging requests, export documentation needed, or destination port details..."
          className="w-full bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl p-3 text-[#222222] placeholder-[#666666] focus:outline-none focus:border-[#B08D57] leading-relaxed"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="w-full py-3.5 px-6 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] font-sans text-xs font-medium uppercase tracking-widest rounded-[8px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Processing RFQ Submission...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit RFQ Enquiry</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-[#666666] text-center mt-2 font-sans">
          Submitting this RFQ does not place an order. Factory pricing and lead times will be provided by return email.
        </p>
      </div>

    </form>
  );
};
