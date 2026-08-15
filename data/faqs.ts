export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export const masterFaqs: FaqItem[] = [
  {
    question: 'What is solid brass hardware and why is it preferred by architects?',
    answer:
      'Solid brass hardware is manufactured from an alloy of copper and zinc without hollow cores or cheap zinc/iron filler metals. Architects prefer solid brass because it is naturally corrosion-resistant, antimicrobial, structural, extremely durable, and capable of taking hand-applied patinas and high-durability PVD coatings that age gracefully.',
  },
  {
    question: 'How long does solid brass architectural hardware last?',
    answer:
      'High-quality solid brass hardware lasts for decades—often outlasting the building itself. Unlike zinc alloys (zamak) or plated steel which pit and rust within 2–5 years, solid brass retains structural integrity for 50+ years even under heavy commercial usage.',
  },
  {
    question: 'What finish is best for coastal marine environments?',
    answer:
      'PVD (Physical Vapor Deposition) Titanium finishes and Marine-Grade 316 Stainless Steel or Unlacquered Naval Brass are best for coastal environments. PVD finishes create a molecular bond that resists salt spray, oxidation, UV degradation, and tarnishing for over 10 years without pitting.',
  },
  {
    question: 'What is the difference between forged brass and cast brass hardware?',
    answer:
      'Forged brass is produced by heating solid brass billets and stamping them under extreme hydraulic pressure, yielding dense grain structure ideal for thin, high-stress lever handles. Cast brass involves pouring molten metal into sand or investment molds, allowing intricate organic shapes, heavy wall thicknesses, and ornate decorative detailing.',
  },
  {
    question: 'How do I clean and maintain antique brass architectural hardware?',
    answer:
      'To clean antique brass, wipe gently with a soft microfiber cloth dampened with warm water and mild soap. Avoid abrasive metal polishes, chemical solvents, or scouring pads which strip hand-applied patinas. Apply a thin coat of natural beeswax annually to preserve the protective luster.',
  },
  {
    question: 'Can Radiance manufacture custom OEM hardware from CAD drawings?',
    answer:
      'Yes, Radiance provides complete OEM/ODM contract manufacturing at our foundry in Aligarh, India. We convert 3D CAD models or physical samples into precision brass tooling, produce 3D-printed wax prototypes, and manufacture custom hardware lines under strict confidentiality (NDA).',
  },
  {
    question: 'How long is the standard export production and shipping lead time?',
    answer:
      'Standard production for bulk hardware orders takes 30 to 45 days from sample approval. Air freight dispatch takes 5 to 7 days, while FCL/LCL ocean container freight from Nhava Sheva (JNPT) or Mundra ports takes 18 to 35 days depending on the destination port.',
  },
  {
    question: 'What quality testing standards does Radiance hardware undergo?',
    answer:
      'Radiance hardware undergoes virgin alloy chemical spectrum analysis, ISO 9227 neutral salt-spray corrosion chamber testing, and BS EN 1906 mechanical endurance testing exceeding 200,000 operational cycles.',
  },
  {
    question: 'What are the export packaging and private label options?',
    answer:
      'We offer custom private label laser etching, inner retail white or branded boxes, barcoded master cartons, and ISPM-15 heat-treated export pallets to ensure safe global transit.',
  },
];
