import prisma, { withDbTimeout } from '@/lib/prisma';
import { QuoteStatus, ProductStatus } from '@prisma/client';
import { findOrCreateCustomer } from './customerService';
import { products as staticProducts } from '@/data/products';

export async function getAllQuoteRequests(includeDeleted = false) {
  console.log('[QUOTE_SERVICE] Fetching quote requests directly from PostgreSQL database...');
  const res = await withDbTimeout(
    prisma.quoteRequest.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      include: {
        customer: true,
        assignedAdmin: {
          select: { id: true, name: true, email: true, role: true },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                material: true,
              },
            },
            variant: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  );
  console.log(`[QUOTE_SERVICE] Successfully fetched ${res.length} quote request(s) from PostgreSQL.`);
  return res;
}

export async function getQuoteRequestById(id: string) {
  try {
    return await withDbTimeout(
      prisma.quoteRequest.findFirst({
        where: { id, deletedAt: null },
        include: {
          customer: true,
          assignedAdmin: {
            select: { id: true, name: true, email: true, role: true },
          },
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      })
    );
  } catch {
    return null;
  }
}

export async function createQuoteRequest(data: {
  customer: {
    name: string;
    company: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    businessType: string;
    companyWebsite?: string;
  };
  notes?: string;
  adminNotes?: string;
  assignedAdminId?: string;
  message?: string;
  companyWebsite?: string;
  expectedQuantity?: string;
  requiredFinish?: string;
  requiredDeliveryDate?: string;
  additionalRequirements?: string;
  items: {
    productId: string;
    variantId?: string;
    selectedFinish?: string;
    selectedSize?: string;
    selectedMaterial?: string;
    quantity: number;
    notes?: string;
  }[];
}) {
  console.log('[QUOTE_SERVICE] Entering createQuoteRequest()');
  console.log(`[QUOTE_SERVICE] Customer payload: ${data.customer.name} (${data.customer.company}, ${data.customer.email})`);

  const customer = await findOrCreateCustomer(data.customer);
  console.log(`[QUOTE_SERVICE] Customer record ready. Customer ID: ${customer.id}`);

  console.log(`[QUOTE_SERVICE] Resolving ${data.items.length} quote item(s) for DB insertion...`);
  const resolvedItems = await Promise.all(
    data.items.map(async (item, idx) => {
      let dbProduct = await prisma.product.findFirst({
        where: {
          OR: [
            { id: item.productId },
            { sku: item.productId },
          ],
        },
        select: { id: true, name: true },
      });

      if (!dbProduct) {
        console.log(`[QUOTE_SERVICE] Product ${item.productId} not found in DB by direct ID/SKU. Checking catalog static list...`);
        const staticMatch = staticProducts.find(
          (p) => p.id === item.productId || p.sku === item.productId
        );

        if (staticMatch) {
          console.log(`[QUOTE_SERVICE] Found static product match: ${staticMatch.name} (${staticMatch.sku}). Syncing to PostgreSQL...`);
          let category = await prisma.category.findFirst({
            where: { slug: staticMatch.categorySlug },
          });

          if (!category) {
            category = await prisma.category.create({
              data: {
                id: staticMatch.categoryId,
                name: staticMatch.categoryName,
                slug: staticMatch.categorySlug,
                description: staticMatch.categoryName,
              },
            });
          }

          dbProduct = await prisma.product.upsert({
            where: { sku: staticMatch.sku },
            update: {},
            create: {
              id: staticMatch.id,
              name: staticMatch.name,
              slug: staticMatch.slug,
              sku: staticMatch.sku,
              material: staticMatch.material,
              categoryId: category.id,
              shortDescription: staticMatch.shortDescription,
              description: staticMatch.description,
              status: ProductStatus.AVAILABLE,
            },
            select: { id: true, name: true },
          });
        } else {
          console.log(`[QUOTE_SERVICE] Product ${item.productId} not found in static list. Using fallback product in PostgreSQL...`);
          const fallbackProduct = await prisma.product.findFirst({ select: { id: true, name: true } });
          if (fallbackProduct) {
            dbProduct = fallbackProduct;
          } else {
            let defaultCat = await prisma.category.findFirst();
            if (!defaultCat) {
              defaultCat = await prisma.category.create({
                data: { name: 'General Hardware', slug: 'general-hardware' },
              });
            }
            dbProduct = await prisma.product.create({
              data: {
                id: item.productId,
                name: 'Architectural Hardware Item',
                slug: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                sku: item.productId,
                material: 'Solid Metal',
                categoryId: defaultCat.id,
              },
              select: { id: true, name: true },
            });
          }
        }
      }

      console.log(`[QUOTE_SERVICE] Item #${idx + 1} resolved to DB Product ID: ${dbProduct.id}`);
      return {
        productId: dbProduct.id,
        variantId: item.variantId || null,
        selectedFinish: item.selectedFinish || null,
        selectedSize: item.selectedSize || null,
        selectedMaterial: item.selectedMaterial || null,
        quantity: item.quantity,
        notes: item.notes || null,
      };
    })
  );

  console.log('[QUOTE_SERVICE] Executing prisma.quoteRequest.create() with relational QuoteItems...');
  const createdQuote = await withDbTimeout(
    prisma.quoteRequest.create({
      data: {
        customerId: customer.id,
        status: QuoteStatus.NEW,
        notes: data.notes,
        adminNotes: data.adminNotes,
        assignedAdminId: data.assignedAdminId || null,
        message: data.message,
        companyWebsite: data.companyWebsite || data.customer.companyWebsite,
        expectedQuantity: data.expectedQuantity,
        requiredFinish: data.requiredFinish,
        requiredDeliveryDate: data.requiredDeliveryDate,
        additionalRequirements: data.additionalRequirements,
        items: {
          create: resolvedItems,
        },
      },
      include: {
        customer: true,
        assignedAdmin: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    })
  );

  console.log(`[QUOTE_SERVICE] Transaction complete! Created QuoteRequest ID: ${createdQuote.id} with ${createdQuote.items.length} QuoteItem(s) in PostgreSQL.`);
  return createdQuote;
}

export async function updateQuoteStatus(
  id: string,
  status: QuoteStatus,
  notes?: string,
  adminNotes?: string,
  assignedAdminId?: string
) {
  return prisma.quoteRequest.update({
    where: { id },
    data: {
      status,
      notes: notes ? notes : undefined,
      adminNotes: adminNotes ? adminNotes : undefined,
      assignedAdminId: assignedAdminId !== undefined ? assignedAdminId : undefined,
    },
    include: {
      customer: true,
      assignedAdmin: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function softDeleteQuoteRequest(id: string) {
  return prisma.quoteRequest.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function restoreQuoteRequest(id: string) {
  return prisma.quoteRequest.update({
    where: { id },
    data: { deletedAt: null },
  });
}

export async function deleteQuoteRequest(id: string) {
  return softDeleteQuoteRequest(id);
}
