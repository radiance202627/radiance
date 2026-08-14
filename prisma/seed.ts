import { PrismaClient, Role, UserStatus, CategoryStatus, ProductStatus, CollectionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { categories } from '../data/categories';
import { products } from '../data/products';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with full catalog data...');

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

  await prisma.user.upsert({
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

  // 3. Seed All Categories and Subcategories from data/categories.ts
  for (let i = 0; i < categories.length; i++) {
    const catData = categories[i];
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {
        name: catData.name,
        description: catData.description,
        image: catData.heroImage,
      },
      create: {
        id: catData.id,
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        image: catData.heroImage,
        sortOrder: i + 1,
        status: CategoryStatus.ACTIVE,
      },
    });

    if (catData.subcategories && catData.subcategories.length > 0) {
      for (let j = 0; j < catData.subcategories.length; j++) {
        const sub = catData.subcategories[j];
        await prisma.category.upsert({
          where: { slug: sub.slug },
          update: {
            name: sub.name,
            description: sub.description,
            parentId: category.id,
          },
          create: {
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            parentId: category.id,
            sortOrder: j + 1,
            status: CategoryStatus.ACTIVE,
          },
        });
      }
    }
  }

  console.log(`✅ ${categories.length} main categories and subcategories seeded.`);

  // 4. Create Collections
  await prisma.collection.upsert({
    where: { slug: 'vintage' },
    update: {},
    create: {
      id: 'coll-vintage',
      name: 'Vintage Collection',
      slug: 'vintage',
      description: 'Authentic heritage designs hand-patinated for period properties and restoration projects.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      sortOrder: 1,
      status: CollectionStatus.ACTIVE,
    },
  });

  await prisma.collection.upsert({
    where: { slug: 'black-antique' },
    update: {},
    create: {
      id: 'coll-black-antique',
      name: 'Black Antique',
      slug: 'black-antique',
      description: 'Handcrafted ironmongery finished in heavy durable black powder coating and oil-rubbed bronze.',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1000&auto=format&fit=crop',
      featured: true,
      sortOrder: 2,
      status: CollectionStatus.ACTIVE,
    },
  });

  console.log('✅ Default collections created.');

  // 5. Seed All Catalog Products from data/products.ts
  for (let i = 0; i < products.length; i++) {
    const prodData = products[i];
    const category = await prisma.category.findFirst({
      where: { slug: prodData.categorySlug },
    });

    if (!category) continue;

    const subcategory = prodData.subcategorySlug
      ? await prisma.category.findFirst({ where: { slug: prodData.subcategorySlug } })
      : null;

    const dbProduct = await prisma.product.upsert({
      where: { sku: prodData.sku },
      update: {
        name: prodData.name,
        slug: prodData.slug,
        categoryId: category.id,
        subcategoryId: subcategory ? subcategory.id : null,
        shortDescription: prodData.shortDescription,
        description: prodData.description,
        material: prodData.material,
        featured: prodData.featured,
        status: ProductStatus.AVAILABLE,
      },
      create: {
        id: prodData.id,
        name: prodData.name,
        slug: prodData.slug,
        sku: prodData.sku,
        productCode: `PC-${prodData.sku}`,
        categoryId: category.id,
        subcategoryId: subcategory ? subcategory.id : null,
        shortDescription: prodData.shortDescription,
        description: prodData.description,
        material: prodData.material,
        featured: prodData.featured,
        sortOrder: i + 1,
        status: ProductStatus.AVAILABLE,
      },
    });

    // Create product images if none exist
    if (prodData.images && prodData.images.length > 0) {
      const existingImages = await prisma.productImage.count({
        where: { productId: dbProduct.id },
      });
      if (existingImages === 0) {
        await prisma.productImage.createMany({
          data: prodData.images.map((imgUrl, idx) => ({
            productId: dbProduct.id,
            url: imgUrl,
            altText: `${prodData.name} View ${idx + 1}`,
            isFeatured: idx === 0,
            sortOrder: idx + 1,
          })),
        });
      }
    }
  }

  console.log(`✅ ${products.length} products seeded successfully.`);
  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
