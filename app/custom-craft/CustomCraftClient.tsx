'use client';

import React, { useState } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  Hammer,
  Sparkles,
  Layers,
  FileCheck,
  Globe2,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  ShieldCheck,
  Send,
  Compass,
  Cpu,
} from 'lucide-react';
import { uploadFileToStorage } from '@/lib/storage';

const STANDARD_FINISHES = [
  'Satin Brass',
  'Antique Brass',
  'Matt Black',
  'PVD Gold',
  'Rose Gold',
  'Chrome',
  'Satin Nickel',
  'Gun Metal',
  'Bronze',
  'Copper',
  'White Bronze',
];

const METALS_LIST = [
  'Brass',
  'Copper',
  'Bronze',
  'White Bronze',
  'Cast Iron',
  'Zinc',
  'Aluminium',
  'Stainless Steel',
  'Other',
];

const PURPOSES = [
  'Design Development',
  'Prototype Development',
  'Mass Production',
  'OEM Manufacturing',
  'Reverse Engineering',
  'Product Improvement',
  'Other',
];

interface UploadedFileItem {
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
}

export const CustomCraftClient: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [zipCode, setZipCode] = useState('');

  // Purpose
  const [purpose, setPurpose] = useState('OEM Manufacturing');
  const [customPurpose, setCustomPurpose] = useState('');

  // Metals Selection (Checkboxes)
  const [selectedMetals, setSelectedMetals] = useState<string[]>(['Brass']);
  const [customMetal, setCustomMetal] = useState('');

  // Finish Selection (Radio + Conditional)
  const [finishType, setFinishType] = useState<'Standard Finish' | 'Custom Finish'>('Standard Finish');
  const [selectedFinish, setSelectedFinish] = useState('Satin Brass');
  const [customFinishDescription, setCustomFinishDescription] = useState('');

  // Quantity & Delivery
  const [expectedQuantity, setExpectedQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  // Description
  const [description, setDescription] = useState('');

  // Attachments
  const [attachments, setAttachments] = useState<UploadedFileItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleMetalCheckbox = (metal: string) => {
    if (selectedMetals.includes(metal)) {
      setSelectedMetals(selectedMetals.filter((m) => m !== metal));
    } else {
      setSelectedMetals([...selectedMetals, metal]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check size limit (max 20MB per file)
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 20 * 1024 * 1024) {
        alert(`File ${files[i].name} exceeds maximum allowed size of 20MB.`);
        return;
      }
    }

    setUploading(true);
    try {
      const uploaded: UploadedFileItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadFileToStorage(file, 'custom-craft');
        uploaded.push({
          fileName: file.name,
          fileUrl: url,
          fileType: file.type || file.name.split('.').pop(),
          fileSize: file.size,
        });
      }
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (err) {
      console.error('File upload error:', err);
      alert('Failed to upload attachment file.');
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name || !email || !contactNumber || !city || !state || !country || !description) {
      setErrorMsg('Please complete all required fields marked with (*)');
      return;
    }

    if (selectedMetals.length === 0) {
      setErrorMsg('Please select at least one metal option.');
      return;
    }

    setSubmitting(true);
    try {
      const finalFinish =
        finishType === 'Standard Finish' ? selectedFinish : customFinishDescription;

      const payload = {
        name,
        companyName,
        email,
        contactNumber,
        address,
        city,
        state,
        country,
        zipCode,
        purpose,
        customPurpose: purpose === 'Other' ? customPurpose : undefined,
        metals: selectedMetals,
        customMetal: selectedMetals.includes('Other') ? customMetal : undefined,
        finishType,
        selectedFinish: finalFinish,
        expectedQuantity,
        deliveryDate,
        description,
        attachments,
      };

      const res = await fetch('/api/custom-craft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedRef(data.referenceNo);

        // Dispatch client-side Web3Forms notification (matching Contact & RFQ forms)
        try {
          const web3Data = new FormData();
          const apiKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '5c13d35f-9934-4b1e-b53b-4c469ac826ea';
          const metalsStr = selectedMetals.join(', ');
          const emailMessage = `
=== NEW CUSTOM CRAFT ENQUIRY ===
Ref No: ${data.referenceNo}

CUSTOMER DETAILS:
- Name: ${name}
- Company: ${companyName || 'N/A'}
- Email: ${email}
- Phone: ${contactNumber}
- Location: ${address ? `${address}, ` : ''}${city}, ${state}, ${country} ${zipCode || ''}

REQUIREMENTS:
- Purpose: ${purpose === 'Other' ? `Other (${customPurpose})` : purpose}
- Metals: ${metalsStr} ${customMetal ? `(Custom: ${customMetal})` : ''}
- Finish: ${finishType} (${finalFinish || 'N/A'})
- Expected Qty: ${expectedQuantity || 'N/A'}
- Delivery Date: ${deliveryDate || 'N/A'}

PRODUCT DESCRIPTION:
${description}

ATTACHED DRAWINGS & CAD FILES (${attachments.length}):
${attachments.map((a, i) => `${i + 1}. ${a.fileName} (${a.fileUrl})`).join('\n') || 'None'}
          `.trim();

          web3Data.append('access_key', apiKey);
          web3Data.append('name', name);
          web3Data.append('email', email);
          web3Data.append('phone', contactNumber);
          web3Data.append('company', companyName || '');
          web3Data.append('subject', `[${data.referenceNo}] Custom Craft Request - ${name}`);
          web3Data.append('message', emailMessage);
          web3Data.append('from_name', 'SB Pattern Works Custom Craft');

          const web3Res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: web3Data,
          });
          const web3Json = await web3Res.json();
          console.log('[CUSTOM_CRAFT_WEB3FORMS_SUCCESS]', web3Json);
        } catch (web3Err) {
          console.warn('[CUSTOM_CRAFT_WEB3FORMS_WARN]', web3Err);
        }
      } else {
        setErrorMsg(data.error || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const processSteps = [
    { num: '01', title: 'Custom Design', desc: 'Transform client sketches or 2D/3D CAD drawings into engineered production plans.' },
    { num: '02', title: 'OEM Development', desc: 'Dedicated tooling and pattern making tailored to exact client dimensional specs.' },
    { num: '03', title: 'Pattern Development', desc: 'Precision CNC pattern shop crafting durable master patterns and core boxes.' },
    { num: '04', title: 'Foundry Casting', desc: 'Virgin metal melting in green sand molds, shell molds, and gravity steel dies.' },
    { num: '05', title: 'Precision Forging', desc: 'High-density hot forging for structural components requiring maximum tensile strength.' },
    { num: '06', title: 'CNC Machining', desc: 'Multi-axis turning, milling, and broaching ensuring exact CTC and spindle tolerances.' },
    { num: '07', title: 'Artisan Finishing', desc: 'Hand linishing, patination, PVD titanium coating, and clear electro-lacquer sealing.' },
    { num: '08', title: 'Global Export Freight', desc: 'Barcoded packaging, ocean container loading, and complete customs documentation.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 font-sans">
      <Breadcrumbs items={[{ label: 'Custom Craft Manufacturing' }]} />

      {/* Hero Section */}
      <div className="bg-[#F4F2ED] rounded-3xl border border-[#E5E2DA] p-8 sm:p-14 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B08D57]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF9F6] text-[#B08D57] border border-[#B08D57]/30 rounded-md">
            <Hammer className="w-4 h-4" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">
              Precision OEM & Bespoke Metal Foundry
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#222222] tracking-tight leading-[1.10]">
            Custom Craft Manufacturing
          </h1>

          <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-3xl">
            OEM Development • Prototype Manufacturing • Custom Metal Components • CAD to Production
          </p>

          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-[#222222]">
            <div className="p-3 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#B08D57]" />
              <span>3D CAD Tooling</span>
            </div>
            <div className="p-3 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B08D57]" />
              <span>Virgin Metallurgy</span>
            </div>
            <div className="p-3 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B08D57]" />
              <span>100% Quality Inspected</span>
            </div>
            <div className="p-3 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#B08D57]" />
              <span>Global Dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section: Production Process Breakdown */}
      <div className="space-y-8">
        <SectionHeading
          title="Integrated Foundry Capabilities & Process"
          subtitle="From initial 3D CAD modeling to final hand patination and container dispatch"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.num}
              className="bg-[#F4F2ED] p-6 rounded-2xl border border-[#E5E2DA] space-y-3 shadow-sm hover:border-[#B08D57]/50 transition duration-300"
            >
              <span className="text-2xl font-serif font-bold text-[#B08D57]">{step.num}</span>
              <h4 className="font-serif font-bold text-base text-[#222222]">{step.title}</h4>
              <p className="text-xs text-[#666666] leading-relaxed font-sans">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Request Form Section */}
      <div id="enquiry-form" className="bg-[#F4F2ED] rounded-3xl border border-[#E5E2DA] p-8 sm:p-12 shadow-sm space-y-8 max-w-5xl mx-auto">
        <div className="border-b border-[#E5E2DA] pb-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222]">
            Submit Custom Craft Manufacturing Enquiry
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            Provide your technical specifications, material preferences, quantity, and CAD files. Our engineering team will review and respond promptly.
          </p>
        </div>

        {submittedRef ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-2xl font-serif font-bold text-emerald-900">Enquiry Submitted Successfully</h3>
            <p className="text-sm text-emerald-800">
              Your reference number is <strong className="font-mono bg-white px-3 py-1 rounded-md border border-emerald-300">{submittedRef}</strong>.
            </p>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              A confirmation email notification has been dispatched to <strong>Sales@sbpatternworks.com</strong>. Our technical engineering desk will reach out within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmittedRef(null);
                setName('');
                setDescription('');
                setAttachments([]);
              }}
              className="px-6 py-2.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Customer Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B08D57] border-b border-[#E5E2DA] pb-2">
                1. Customer Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#222222] mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Alexander Wright"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#222222] mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Architectural Joinery Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#222222] mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="e.g. alexander@apexjoinery.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#222222] mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. +41 44 123 4567"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-[#222222] mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="Suite / Factory / Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#222222] mb-1">City *</label>
                  <input
                    type="text"
                    placeholder="e.g. London / New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#222222] mb-1">State / Region *</label>
                  <input
                    type="text"
                    placeholder="e.g. Greater London"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#222222] mb-1">Country *</label>
                  <input
                    type="text"
                    placeholder="e.g. United Kingdom / United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#222222] mb-1">Zip Code</label>
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Manufacturing Purpose */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B08D57] border-b border-[#E5E2DA] pb-2">
                2. Primary Manufacturing Purpose
              </h3>

              <div>
                <label className="block text-xs font-medium text-[#222222] mb-1">Select Purpose *</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  aria-label="Select custom craft purpose"
                  className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] font-medium"
                >
                  {PURPOSES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional Input for "Other" Purpose */}
              {purpose === 'Other' && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#B08D57] mb-1">Specify Your Purpose *</label>
                  <input
                    type="text"
                    placeholder="Please specify your custom manufacturing objective"
                    value={customPurpose}
                    onChange={(e) => setCustomPurpose(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#B08D57]/40 rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                    required
                  />
                </div>
              )}
            </div>

            {/* 3. Metal Selection (Checkboxes) */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B08D57] border-b border-[#E5E2DA] pb-2">
                3. Metal Selection (Multiple Allowed)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {METALS_LIST.map((metal) => {
                  const isChecked = selectedMetals.includes(metal);
                  return (
                    <label
                      key={metal}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                        isChecked
                          ? 'bg-[#B08D57]/15 border-[#B08D57] text-[#222222] font-semibold'
                          : 'bg-[#FAF9F6] border-[#E5E2DA] text-[#666666] hover:border-[#B08D57]/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleMetalCheckbox(metal)}
                        className="w-4 h-4 accent-[#B08D57]"
                      />
                      <span>{metal}</span>
                    </label>
                  );
                })}
              </div>

              {/* Conditional Input for "Other" Metal */}
              {selectedMetals.includes('Other') && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#B08D57] mb-1">Specify Metal *</label>
                  <input
                    type="text"
                    placeholder="e.g. Gunmetal / Phosphor Bronze / Specific Alloy Grade"
                    value={customMetal}
                    onChange={(e) => setCustomMetal(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#B08D57]/40 rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                    required
                  />
                </div>
              )}
            </div>

            {/* 4. Finish Selection (Radio Options) */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B08D57] border-b border-[#E5E2DA] pb-2">
                4. Required Surface Finish
              </h3>

              <div className="space-y-4">
                {/* Option 1: Standard Finish */}
                <div className="p-4 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="finishRadio"
                      checked={finishType === 'Standard Finish'}
                      onChange={() => setFinishType('Standard Finish')}
                      className="w-4 h-4 accent-[#B08D57]"
                    />
                    <span className="text-xs font-bold text-[#222222]">Option 1 — Standard Catalog Finish</span>
                  </label>

                  {finishType === 'Standard Finish' && (
                    <div className="pl-7">
                      <select
                        value={selectedFinish}
                        onChange={(e) => setSelectedFinish(e.target.value)}
                        aria-label="Select standard catalog finish"
                        className="w-full sm:w-80 px-3.5 py-2 bg-[#F4F2ED] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] font-medium"
                      >
                        {STANDARD_FINISHES.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Option 2: Custom Finish */}
                <div className="p-4 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="finishRadio"
                      checked={finishType === 'Custom Finish'}
                      onChange={() => setFinishType('Custom Finish')}
                      className="w-4 h-4 accent-[#B08D57]"
                    />
                    <span className="text-xs font-bold text-[#222222]">Option 2 — Custom Finish / Patina Match</span>
                  </label>

                  {finishType === 'Custom Finish' && (
                    <div className="pl-7">
                      <textarea
                        rows={3}
                        placeholder="Describe Your Required Finish (e.g. Organic Verdigris patina with wax seal, specific RAL powder coat...)"
                        value={customFinishDescription}
                        onChange={(e) => setCustomFinishDescription(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#F4F2ED] border border-[#B08D57]/40 rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 5. Quantity & Delivery */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B08D57] border-b border-[#E5E2DA] pb-2">
                5. Production Quantity & Timeline
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#222222] mb-1">Expected Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 pcs initial batch / 2,000 pcs annual container"
                    value={expectedQuantity}
                    onChange={(e) => setExpectedQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#222222] mb-1">Required Delivery Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57]"
                  />
                </div>
              </div>
            </div>

            {/* 6. Product Description */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B08D57] border-b border-[#E5E2DA] pb-2">
                6. Technical Product Description *
              </h3>

              <textarea
                rows={6}
                placeholder="Describe your product, dimensions, technical requirements, application, production process, quantities and any additional information."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222] focus:outline-none focus:border-[#B08D57] leading-relaxed font-sans"
                required
              />
            </div>

            {/* 7. File Upload (Multiple Files up to 20MB: JPG, JPEG, PNG, PDF, DOC, DOCX, STL) */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B08D57] border-b border-[#E5E2DA] pb-2">
                7. Technical Drawings & CAD File Upload
              </h3>

              <div className="border-2 border-dashed border-[#E5E2DA] bg-[#FAF9F6] p-6 rounded-2xl text-center space-y-3">
                <Upload className="w-8 h-8 text-[#666666]/40 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#222222]">Upload 2D/3D CAD files or product photos</p>
                  <p className="text-[11px] text-[#666666]">
                    Supported Formats: JPG, JPEG, PNG, PDF, DOC, DOCX, STL (Max 20 MB per file)
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading to Supabase Storage...' : 'Select Files to Upload'}</span>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.stl"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded File List */}
              {attachments.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-[#222222]">Attached Files ({attachments.length}):</label>
                  <div className="space-y-2">
                    {attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-[#E5E2DA] rounded-xl text-xs text-[#222222]"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-[#B08D57] shrink-0" />
                          <span className="truncate font-mono">{file.fileName}</span>
                          {file.fileSize && (
                            <span className="text-[10px] text-[#666666]">
                              ({(file.fileSize / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="p-1 text-[#666666] hover:text-red-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-[#E5E2DA]">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] text-xs font-semibold uppercase tracking-[0.2em] rounded-xl transition shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Enquiry & Dispatching Email...' : 'Submit Custom Craft Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
