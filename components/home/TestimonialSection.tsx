import React from 'react';
import { Star, Quote, ShieldCheck, Building2, MapPin } from 'lucide-react';

export const TestimonialSection: React.FC = () => {
  const testimonials = [
    {
      id: '1',
      name: 'Marcus Vance',
      role: 'Senior Architectural Specifier',
      company: 'Vance & Sterling Hardware Ltd.',
      location: 'London, United Kingdom',
      flag: '🇬🇧',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      quote:
        'SB PATTERN WORKS has been our primary foundry partner for luxury door handle suites across Mayfair and Kensington developments. Their solid brass casting density, hand-chased detail, and precise CTC backset tolerances are exceptional. Deliveries arrive impeccably packed in master export cartons with full test certification.',
    },
    {
      id: '2',
      name: 'Elena Rostova',
      role: 'Director of Interior Procurement',
      company: 'AURA Design & Hospitality',
      location: 'Dubai, United Arab Emirates',
      flag: '🇦🇪',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      quote:
        'We specified custom Aged Antique Brass cabinet pulls and heavy friction stays for a 5-star resort in Palm Jumeirah. The hand-applied patinas were perfectly uniform across all 3,500 pieces, and the salt-spray chamber durability reports gave our structural engineering team absolute confidence.',
    },
    {
      id: '3',
      name: 'David K. Miller',
      role: 'VP Procurement & Sourcing',
      company: 'Midwest Architectural Wholesale',
      location: 'Dallas, Texas, USA',
      flag: '🇺🇸',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      quote:
        'Working with SB PATTERN WORKS on full container load (FCL) orders has streamlined our supply chain. Their custom laser logo etching and OEM private-label box packaging arrive retail-ready. Their factory direct pricing and strict ISO quality checks make them our top Indian metal foundry supplier.',
    },
    {
      id: '4',
      name: 'Julian Thorne',
      role: 'Managing Director',
      company: 'Thorne Heritage Ironmongery',
      location: 'Sydney, Australia',
      flag: '🇦🇺',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      rating: 5,
      quote:
        'Their pattern making team turned our complex 3D CAD drawings for period-accurate Victorian mortise knobs into precision production tooling in under 3 weeks. The sand-cast brass feel and heavy mechanical spring action exceed European DIN standards. Outstanding B2B export desk communication.',
    },
  ];

  return (
    <section className="bg-[#FAF8F5] py-20 border-y border-[#E6E1D7] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="eyebrow-tag justify-center mx-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9E7B47]" />
            <span>Global Client Endorsements</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-[#1C1917]">
            Trusted by Specifiers & Distributors Worldwide
          </h2>

          <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed">
            Read authentic feedback from international architectural ironmongers, commercial hardware stockists, and luxury interior design firms sourcing from our Aligarh foundry units.
          </p>
        </div>

        {/* Testimonials 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#F3F0E8] border border-[#E6E1D7] hover:border-[#9E7B47]/50 rounded-[6px] p-6 flex flex-col justify-between space-y-6 transition-all duration-500 hover:shadow-md group"
            >
              <div className="space-y-4">
                {/* Rating & Verified Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#9E7B47] text-[#9E7B47]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-[#9E7B47] uppercase tracking-[0.14em] bg-[#FAF8F5] px-2 py-0.5 rounded-[3px] border border-[#E6E1D7]">
                    {item.flag} Verified
                  </span>
                </div>

                {/* Quote Text */}
                <div className="relative">
                  <Quote className="w-6 h-6 text-[#9E7B47]/20 absolute -top-2 -left-1 stroke-[1]" />
                  <p className="text-xs text-[#1C1917] leading-relaxed font-normal relative z-10 pt-2 italic">
                    "{item.quote}"
                  </p>
                </div>
              </div>

              {/* Author Info Footer */}
              <div className="pt-4 border-t border-[#E6E1D7] flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E6E1D7] shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h3 className="font-serif font-medium text-sm text-[#1C1917] truncate group-hover:text-[#9E7B47] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] font-medium text-[#6B635B] truncate">
                    {item.role}
                  </p>
                  <p className="text-[10px] text-[#9E7B47] font-semibold truncate flex items-center gap-1">
                    <Building2 className="w-3 h-3 shrink-0" />
                    {item.company}
                  </p>
                  <p className="text-[10px] text-[#6B635B] truncate flex items-center gap-1 pt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-[#9E7B47] shrink-0" />
                    {item.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Stat Bar */}
        <div className="pt-6 border-t border-[#E6E1D7] grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
          <div className="space-y-0.5">
            <p className="font-serif text-2xl font-semibold text-[#1C1917]">28+</p>
            <p className="text-[11px] text-[#6B635B] uppercase tracking-wider font-medium">Export Countries</p>
          </div>
          <div className="space-y-0.5">
            <p className="font-serif text-2xl font-semibold text-[#1C1917]">300,000+</p>
            <p className="text-[11px] text-[#6B635B] uppercase tracking-wider font-medium">Units Exported Annually</p>
          </div>
          <div className="space-y-0.5">
            <p className="font-serif text-2xl font-semibold text-[#1C1917]">99.4%</p>
            <p className="text-[11px] text-[#6B635B] uppercase tracking-wider font-medium">On-Time Shipment Rate</p>
          </div>
          <div className="space-y-0.5">
            <p className="font-serif text-2xl font-semibold text-[#1C1917]">100%</p>
            <p className="text-[11px] text-[#6B635B] uppercase tracking-wider font-medium">Solid Brass Guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
};
