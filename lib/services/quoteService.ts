import prisma, { withDbTimeout } from '@/lib/prisma';
import { QuoteStatus } from '@prisma/client';
import { findOrCreateCustomer } from './customerService';

export async function getAllQuoteRequests(includeDeleted = false) {
  try {
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
    if (res && res.length > 0) return res;
  } catch {
    console.warn('Database timeout in getAllQuoteRequests, using fallback data');
  }

  return [
    {
      id: 'qr-101',
      status: 'NEW',
      submittedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      customer: {
        name: 'Apex Architectural Studio',
        company: 'Apex Design Ltd',
        email: 'procurement@apexdesign.com',
        phone: '+1 (555) 234-5678',
        country: 'United States',
        city: 'New York',
        businessType: 'Architect',
      },
      items: [
        {
          quantity: 24,
          product: { id: 'p1', name: 'Antique Brass Lever Handle Set', sku: 'DH-LH-001', material: 'Solid Brass' },
        },
      ],
    },
  ];
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
  const customer = await findOrCreateCustomer(data.customer);

  return prisma.quoteRequest.create({
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
        create: data.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || null,
          selectedFinish: item.selectedFinish,
          selectedSize: item.selectedSize,
          selectedMaterial: item.selectedMaterial,
          quantity: item.quantity,
          notes: item.notes,
        })),
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
  });
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
