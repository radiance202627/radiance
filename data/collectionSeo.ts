export interface CollectionSeoData {
  slug: string;
  name: string;
  designInspiration: string;
  targetArchitectureStyle: string;
  recommendedProjects: string;
  availableFinishes: string[];
  applications: string;
  fullEditorial: string;
}

export const collectionSeoMap: Record<string, CollectionSeoData> = {
  'vintage-hardware': {
    slug: 'vintage-hardware',
    name: 'Vintage Hardware Collection',
    designInspiration:
      'Inspired by classic 19th-century Victorian, Edwardian, and Art Deco architectural ironmongery discovered in historical European estates.',
    targetArchitectureStyle:
      'Victorian townhouses, Georgian manors, Art Deco boutique hotels, and period timber restorations.',
    recommendedProjects:
      'Heritage building retrofits, luxury boutique hotel suites, historic residential restorations, and custom period furniture.',
    availableFinishes: [
      'Aged Brass',
      'Antique Bronze',
      'Unlacquered Brass',
      'Oil Rubbed Bronze',
      'Pewter',
    ],
    applications:
      'Mortise door knobs, decorative push plates, rim lock assemblies, window casement peg stays, and cabinet cup pulls.',
    fullEditorial:
      'The Vintage Hardware Collection by Radiance captures the timeless charm of Victorian and Edwardian architectural ironmongery. Hand-cast from solid brass and patinated by master artisans in Aligarh, India, each piece features hand-chased filigree, beaded borders, and organic patinas that age gracefully over time.',
  },

  'black-antique': {
    slug: 'black-antique',
    name: 'Black Antique Collection',
    designInspiration:
      'Hand-forged ironwork inspired by Tudor manor houses, blacksmith forge traditions, and medieval English country estates.',
    targetArchitectureStyle:
      'Tudor style residences, rustic country cottages, timber frame barns, mountain lodges, and Mediterranean villas.',
    recommendedProjects:
      'Equestrian estates, wine cellar doors, rustic timber gates, country pub renovations, and timber beam interior joinery.',
    availableFinishes: [
      'Matt Black Powder Coat',
      'Black E-Coated Iron',
      'Rust-Proof Black Wax',
      'Antiqued Iron',
    ],
    applications:
      'Heavy strap hinges, Suffolk thumb latches, decorative ring turn latches, gate drop bolts, and rustic cabinet pulls.',
    fullEditorial:
      'The Black Antique Collection features heavy-gauge hand-forged ironmongery engineered for rustic architectural spaces. Each fitting undergoes multi-stage anti-rust electro-coating and UV-stable matte black finishing to ensure exceptional weather resistance.',
  },

  'nautical-hardware': {
    slug: 'nautical-hardware',
    name: 'Nautical Hardware Series',
    designInspiration:
      'Maritime vessel hardware, historic ocean liner fittings, brass porthole fasteners, and naval dockyard cleats.',
    targetArchitectureStyle:
      'Luxury coastal villas, beachfront estates, maritime yacht clubs, coastal resorts, and nautical interior concepts.',
    recommendedProjects:
      'Beach house entry doors, yacht interior joinery, oceanfront hotel suites, pool house cabanas, and waterfront dining spaces.',
    availableFinishes: [
      'Polished Naval Brass',
      'Satin 316 Stainless Steel',
      'Chrome Plated Brass',
      'PVD Gold',
    ],
    applications:
      'Mooring cleats, dog latches, porthole mirrors, marine flush pull handles, grab rails, and heavy sea chest handles.',
    fullEditorial:
      'Crafted from high-copper naval brass and marine-grade 316 stainless steel, the Nautical Hardware Series resists harsh salt spray environments without pitting. Designed to bring maritime luxury to coastal estates and yachts.',
  },

  'decorative-hardware': {
    slug: 'decorative-hardware',
    name: 'Decorative Architectural Accents',
    designInspiration:
      'French Baroque motifs, Art Nouveau organic curves, and ornate Middle Eastern geometric metalwork.',
    targetArchitectureStyle:
      'French Provincial estates, Baroque luxury apartments, high-end hotel lobbies, and opulent private residences.',
    recommendedProjects:
      'Boutique hotel reception desks, luxury dressing rooms, executive office portals, and bespoke furniture pieces.',
    availableFinishes: [
      'Burnished Brass',
      'French Gold',
      'Antique Pewter',
      'Rose Gold PVD',
      'Satin Brass',
    ],
    applications:
      'Ornate coat hooks, decorative radiator grilles, embossed push plates, decorative door knockers, and brass sign plaques.',
    fullEditorial:
      'The Decorative Collection blends lost-wax investment casting with master hand-chasing. Each fitting acts as a tactile focal point, adding depth and visual opulence to luxury interior concepts.',
  },

  'animal-nature': {
    slug: 'animal-nature',
    name: 'Animal & Nature Collection',
    designInspiration:
      'Biophilic design, organic botanical leaves, regal lion heads, stag motifs, and natural fauna sculptures.',
    targetArchitectureStyle:
      'Luxury country manors, botanical garden residences, hunting lodges, and whimsical organic modern spaces.',
    recommendedProjects:
      'Grand main entry doors, private estate gates, luxury bar joinery, and custom furniture accent pieces.',
    availableFinishes: [
      'Hand-Patinated Bronze',
      'Antique Brass',
      'Verdigris Green Brass',
      'Polished Brass',
    ],
    applications:
      'Lion head door knockers, leaf drawer pulls, dragonfly wall hooks, twig cabinet handles, and stag entrance pulls.',
    fullEditorial:
      'Hand-sculpted by skilled foundry artists in Aligarh, the Animal & Nature Collection turns solid brass into organic art. Every detail—from lion manes to leaf veins—is cast with exceptional fidelity and hand-burnished.',
  },

  'traditional-hardware': {
    slug: 'traditional-hardware',
    name: 'Traditional Hardware Collection',
    designInspiration:
      'Classic architectural hardware standards designed to precise international dimensional specifications.',
    targetArchitectureStyle:
      'Colonial residences, classic modern apartments, commercial office portals, and institutional developments.',
    recommendedProjects:
      'Commercial office building hardware schedules, multi-family residential complexes, and luxury hotel refurbishments.',
    availableFinishes: [
      'Satin Chrome',
      'Polished Brass',
      'Satin Nickel',
      'Matt Black',
      'PVD Brass',
    ],
    applications:
      'Standard mortise lever handles, door stoppers, flush bolts, Euro profile escutcheons, and cabinet bar pulls.',
    fullEditorial:
      'The Traditional Hardware Collection delivers clean lines, ergonomic comfort, and standardized dimensions. Engineered for seamless compliance with international door preparation templates and lockcase standards.',
  },
};
