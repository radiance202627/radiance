import prisma, { withDbTimeout } from '@/lib/prisma';

export async function getAllCustomers(includeDeleted = false) {
  try {
    return await withDbTimeout(
      prisma.customer.findMany({
        where: includeDeleted ? {} : { deletedAt: null },
        include: {
          quoteRequests: {
            where: { deletedAt: null },
            select: {
              id: true,
              status: true,
              submittedDate: true,
            },
          },
          _count: { select: { quoteRequests: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
    );
  } catch {
    return [];
  }
}

export async function getCustomerById(id: string) {
  try {
    return await withDbTimeout(
      prisma.customer.findFirst({
        where: { id, deletedAt: null },
        include: {
          quoteRequests: {
            where: { deletedAt: null },
            include: {
              items: {
                include: {
                  product: true,
                  variant: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      })
    );
  } catch {
    return null;
  }
}

export async function findOrCreateCustomer(data: {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  city?: string | null;
  businessType: string;
  companyWebsite?: string | null;
  notes?: string | null;
}) {
  const emailClean = data.email.toLowerCase().trim();
  const companyWebsite = data.companyWebsite ?? undefined;
  const notes = data.notes ?? undefined;

  console.log(`[CUSTOMER_SERVICE] Finding or creating customer in DB for email: ${emailClean}`);

  const existing = await withDbTimeout(
    prisma.customer.findFirst({
      where: { email: emailClean },
    })
  );

  if (existing) {
    console.log(`[CUSTOMER_SERVICE] Existing customer found in DB (ID: ${existing.id}). Updating record...`);
    const updated = await prisma.customer.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        company: data.company,
        phone: data.phone,
        country: data.country,
        city: data.city || 'N/A',
        businessType: data.businessType,
        companyWebsite: companyWebsite ?? existing.companyWebsite,
        notes: notes ?? existing.notes,
        deletedAt: null,
      },
    });
    console.log(`[CUSTOMER_SERVICE] Customer updated successfully in DB. Customer ID: ${updated.id}`);
    return updated;
  }

  console.log(`[CUSTOMER_SERVICE] Creating new Customer record in PostgreSQL...`);
  const created = await prisma.customer.create({
    data: {
      name: data.name,
      company: data.company,
      email: emailClean,
      phone: data.phone,
      country: data.country,
      city: data.city || 'N/A',
      businessType: data.businessType,
      companyWebsite: companyWebsite,
      notes: notes,
    },
  });
  console.log(`[CUSTOMER_SERVICE] New Customer inserted successfully into PostgreSQL. Customer ID: ${created.id}`);
  return created;
}

export async function updateCustomer(
  id: string,
  data: Partial<{
    name: string;
    company: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    businessType: string;
    companyWebsite: string;
    notes: string;
  }>
) {
  return prisma.customer.update({
    where: { id },
    data,
  });
}

export async function softDeleteCustomer(id: string) {
  return prisma.customer.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function restoreCustomer(id: string) {
  return prisma.customer.update({
    where: { id },
    data: { deletedAt: null },
  });
}

export async function deleteCustomer(id: string) {
  return softDeleteCustomer(id);
}
