import { PrismaClient, Role, UserStatus, CategoryStatus, ProductStatus, CollectionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Phase 2A.1...');

  // 1. Create Default Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      companyName: 'B2B Architectural Hardware',
      logo: '/images/logo.png',
      email: 'info@architecturalhardware.com',
      phone: '+1 (800) 555-0199',
      whatsapp: '+1 (800) 555-0199',
      address: 'Building No. 4/2, Anoopshahr Road, Front of Radio Colony, Jatav Wali Gali Jamalpur, Aligarh, Uttar Pradesh 202001',
      googleMapUrl: 'https://maps.google.com',
      socialLinks: JSON.stringify({
        linkedin: 'https://linkedin.com/company/b2b-architectural-hardware',
        instagram: 'https://instagram.com/architectural_hardware',
      }),
      seoDefaults: JSON.stringify({
        metaTitle: 'B2B Architectural Hardware | Bespoke Handles & Fittings',
        metaDescription: 'Hot-forged solid brass and bronze architectural hardware manufactured for commercial and high-end residential developments.',
      }),
      footerContent: JSON.stringify({
        copyright: '© 2026 B2B Architectural Hardware. All Rights Reserved.',
      }),
    },
  });

  console.log('✅ Site Settings seeded.');

  // 2. Create Default Users
  const superAdminPassword = await bcrypt.hash('Admin@123456', 10);
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const salesPassword = await bcrypt.hash('Sales@123456', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@hardware.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@hardware.com',
      password: superAdminPassword,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: 'john@hardware.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@hardware.com',
      password: adminPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: 'sales@hardware.com' },
    update: {},
    create: {
      name: 'Sarah Jenkins',
      email: 'sales@hardware.com',
      password: salesPassword,
      role: Role.SALES_EXECUTIVE,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('✅ Default users created.');

  // 3. Create Categories & Subcategories
  const doorHardware = await prisma.category.upsert({
    where: { slug: 'door-hardware' },
    update: {},
    create: {
      name: 'Door Hardware',
      slug: 'door-hardware',
      description: 'Hot-forged solid brass door handles, lever sets, mortise knobs, and escutcheons.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop',
      sortOrder: 1,
      status: CategoryStatus.ACTIVE,
      seoTitle: 'Architectural Door Hardware | Premium Handles & Knobs',
      seoDescription: 'Bespoke architectural door hardware manufactured in solid brass, bronze, and stainless steel.',
      canonicalUrl: 'https://architecturalhardware.com/products/door-hardware',
    },
  });

  const leverHandles = await prisma.category.upsert({
    where: { slug: 'lever-handles' },
    update: {},
    create: {
      name: 'Lever Handles',
      slug: 'lever-handles',
      description: 'Solid brass lever handles on backplate and rose.',
      parentId: doorHardware.id,
      sortOrder: 1,
      status: CategoryStatus.ACTIVE,
      canonicalUrl: 'https://architecturalhardware.com/products/door-hardware/lever-handles',
    },
  });

  const mortiseKnobs = await prisma.category.upsert({
    where: { slug: 'mortise-knobs' },
    update: {},
    create: {
      name: 'Mortise Knobs',
      slug: 'mortise-knobs',
      description: 'Heritage mortise door knobs with detailed textures.',
      parentId: doorHardware.id,
      sortOrder: 2,
      status: CategoryStatus.ACTIVE,
      canonicalUrl: 'https://architecturalhardware.com/products/door-hardware/mortise-knobs',
    },
  });

  const cabinetHardware = await prisma.category.upsert({
    where: { slug: 'cabinet-hardware' },
    update: {},
    create: {
      name: 'Cabinet Hardware',
      slug: 'cabinet-hardware',
      description: 'Architectural cabinet pulls, T-bars, drop handles, and solid brass knobs.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop',
      sortOrder: 2,
      status: CategoryStatus.ACTIVE,
      canonicalUrl: 'https://architecturalhardware.com/products/cabinet-hardware',
    },
  });

  const pullHandles = await prisma.category.upsert({
    where: { slug: 'pull-handles' },
    update: {},
    create: {
      name: 'Pull Handles',
      slug: 'pull-handles',
      description: 'Bar pulls and knurled cabinet handles.',
      parentId: cabinetHardware.id,
      sortOrder: 1,
      status: CategoryStatus.ACTIVE,
      canonicalUrl: 'https://architecturalhardware.com/products/cabinet-hardware/pull-handles',
    },
  });

  console.log('✅ Default categories created.');

  // 4. Create Collections
  const vintageColl = await prisma.collection.upsert({
    where: { slug: 'vintage' },
    update: {},
    create: {
      name: 'Vintage Collection',
      slug: 'vintage',
      description: 'Authentic heritage designs hand-patinated for period properties and restoration projects.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      sortOrder: 1,
      status: CollectionStatus.ACTIVE,
      canonicalUrl: 'https://architecturalhardware.com/collections/vintage',
    },
  });

  const blackAntiqueColl = await prisma.collection.upsert({
    where: { slug: 'black-antique' },
    update: {},
    create: {
      name: 'Black Antique',
      slug: 'black-antique',
      description: 'Handcrafted ironmongery finished in heavy durable black powder coating and oil-rubbed bronze.',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      sortOrder: 2,
      status: CollectionStatus.ACTIVE,
      canonicalUrl: 'https://architecturalhardware.com/collections/black-antique',
    },
  });

  console.log('✅ Default collections created.');

  // 5. Create Sample Product & Variants
  const product1 = await prisma.product.upsert({
    where: { slug: 'antique-brass-lever-handle-set' },
    update: {},
    create: {
      name: 'Antique Brass Lever Handle Set',
      slug: 'antique-brass-lever-handle-set',
      sku: 'DH-LH-001',
      productCode: 'PC-DH-LH-001',
      categoryId: doorHardware.id,
      subcategoryId: leverHandles.id,
      shortDescription: 'Solid hot-forged brass architectural lever handle featuring an ergonomic reeded grip.',
      description: 'The DH-LH-001 is a flagship architectural lever handle meticulously forged from solid high-grade brass. Inspired by Edwardian door hardware patterns, it incorporates a concealed rose fixing system.',
      material: 'Solid Hot-Forged Brass',
      finish: 'Aged Antique Brass',
      weight: '680 grams',
      dimensions: '130mm Handle Length x 54mm Rose Diameter',
      styles: JSON.stringify(['Heritage', 'Victorian', 'Edwardian']),
      specifications: JSON.stringify({
        'Casting Method': 'Hot-Forged Brass Casting',
        'Spindle Diameter': '8mm square steel spindle included',
        'Rose Thickness': '10mm rose plate with concealed fixing',
        'Installation Type': 'Universal Timber & Metal Doors (35mm-55mm)',
        'Care Instructions': 'Clean with dry microfiber cloth',
      }),
      featured: true,
      sortOrder: 1,
      status: ProductStatus.AVAILABLE,
      seoTitle: 'Antique Brass Lever Handle Set | Architectural Ironmongery',
      seoDescription: 'Bespoke hot-forged antique brass lever handles on rose plate for luxury architectural hardware projects.',
      canonicalUrl: 'https://architecturalhardware.com/product/antique-brass-lever-handle-set',
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop',
            altText: 'Antique Brass Lever Handle Set Main View',
            isFeatured: true,
            sortOrder: 1,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'DH-LH-001-AB-130',
            variantCode: 'VAR-130-AB',
            size: '130mm Rose (54mm dia)',
            finish: 'Aged Antique Brass',
            material: 'Solid Brass',
            sortOrder: 1,
          },
          {
            sku: 'DH-LH-001-PB-150',
            variantCode: 'VAR-150-PB',
            size: '150mm Rectangular Backplate',
            finish: 'Polished Brass',
            material: 'Solid Brass',
            sortOrder: 2,
          },
        ],
      },
    },
  });

  // Link Product to Collection
  await prisma.productCollection.upsert({
    where: {
      productId_collectionId: {
        productId: product1.id,
        collectionId: vintageColl.id,
      },
    },
    update: {},
    create: {
      productId: product1.id,
      collectionId: vintageColl.id,
    },
  });

  console.log('✅ Default products created.');
  console.log('🎉 Phase 2A.1 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
