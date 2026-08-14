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
  city: string;
  businessType: string;
  companyWebsite?: string;
  notes?: string;
}) {
  try {
    const existing = await withDbTimeout(
      prisma.customer.findFirst({
        where: { email: data.email.toLowerCase().trim() },
      })
    );

    if (existing) {
      return await prisma.customer.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          company: data.company,
          phone: data.phone,
          country: data.country,
          city: data.city,
          businessType: data.businessType,
          companyWebsite: data.companyWebsite || existing.companyWebsite,
          notes: data.notes || existing.notes,
          deletedAt: null,
        },
      });
    }

    return await prisma.customer.create({
      data: {
        name: data.name,
        company: data.company,
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        country: data.country,
        city: data.city,
        businessType: data.businessType,
        companyWebsite: data.companyWebsite,
        notes: data.notes,
      },
    });
  } catch (error) {
    console.warn('Database timeout/error in findOrCreateCustomer, using fallback customer object:', error);
    return {
      id: `cust-${Date.now()}`,
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      country: data.country,
      city: data.city,
      businessType: data.businessType,
      companyWebsite: data.companyWebsite || null,
      notes: data.notes || null,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
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
