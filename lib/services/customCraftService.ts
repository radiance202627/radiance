import { prisma } from '@/lib/prisma';
import { CustomCraftStatus, Prisma } from '@prisma/client';

export interface AttachmentInput {
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
}

export interface CreateCustomCraftInput {
  name: string;
  companyName?: string;
  email: string;
  contactNumber: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  purpose: string;
  customPurpose?: string;
  metals: string[];
  customMetal?: string;
  finishType: 'Standard Finish' | 'Custom Finish' | string;
  selectedFinish?: string;
  expectedQuantity?: string;
  deliveryDate?: string;
  description: string;
  attachments?: AttachmentInput[];
}

export function generateCustomCraftRef(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `CCR-${dateStr}-${randomStr}`;
}

export async function createCustomCraftRequest(data: CreateCustomCraftInput) {
  const referenceNo = generateCustomCraftRef();

  const request = await prisma.customCraftRequest.create({
    data: {
      referenceNo,
      name: data.name,
      companyName: data.companyName || null,
      email: data.email.toLowerCase().trim(),
      contactNumber: data.contactNumber,
      address: data.address || null,
      city: data.city,
      state: data.state,
      country: data.country,
      zipCode: data.zipCode || null,
      purpose: data.purpose,
      customPurpose: data.customPurpose || null,
      metals: data.metals || [],
      customMetal: data.customMetal || null,
      finishType: data.finishType,
      selectedFinish: data.selectedFinish || null,
      expectedQuantity: data.expectedQuantity || null,
      deliveryDate: data.deliveryDate || null,
      description: data.description,
      status: CustomCraftStatus.NEW,
      attachments: data.attachments
        ? {
            create: data.attachments.map((att) => ({
              fileName: att.fileName,
              fileUrl: att.fileUrl,
              fileType: att.fileType || null,
              fileSize: att.fileSize || null,
            })),
          }
        : undefined,
    },
    include: {
      attachments: true,
    },
  });

  // Trigger internal email notification
  await sendCustomCraftNotificationEmail(request);

  return request;
}

export async function sendCustomCraftNotificationEmail(request: any) {
  const targetEmail = 'Sales@sbpatternworks.com';
  console.log(`[CUSTOM_CRAFT_EMAIL] Sending custom craft notification for ${request.referenceNo} to ${targetEmail}`);

  // Format notification payload (Can be integrated with Web3Forms, Nodemailer, Resend, or Webhook)
  try {
    const metalsList = Array.isArray(request.metals) ? request.metals.join(', ') : request.metals;
    const emailBody = `
=== CUSTOM CRAFT ENQUIRY RECEIVED ===
Ref No: ${request.referenceNo}
Timestamp: ${new Date(request.createdAt).toLocaleString()}

CUSTOMER DETAILS:
Name: ${request.name}
Company: ${request.companyName || 'N/A'}
Email: ${request.email}
Phone: ${request.contactNumber}
Address: ${request.address || ''}, ${request.city}, ${request.state}, ${request.country} - ${request.zipCode || ''}

REQUIREMENTS:
Purpose: ${request.purpose === 'Other' ? `Other (${request.customPurpose})` : request.purpose}
Metals Selected: ${metalsList} ${request.customMetal ? `(Custom: ${request.customMetal})` : ''}
Finish Type: ${request.finishType}
Selected Finish: ${request.selectedFinish || 'N/A'}
Expected Quantity: ${request.expectedQuantity || 'N/A'}
Target Delivery Date: ${request.deliveryDate || 'N/A'}

PRODUCT DESCRIPTION:
${request.description}

ATTACHMENTS (${request.attachments?.length || 0}):
${request.attachments?.map((a: any) => `- ${a.fileName}: ${a.fileUrl}`).join('\n') || 'None'}
    `.trim();

    // If Web3Forms key exists in env or direct fetch
    if (process.env.NEXT_PUBLIC_WEB3FORMS_KEY) {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `New Custom Craft Enquiry: ${request.referenceNo} - ${request.name}`,
          to_email: targetEmail,
          from_name: 'SB Pattern Works Web Portal',
          message: emailBody,
        }),
      }).catch((err) => console.warn('[EMAIL_DISPATCH_WARN]', err));
    }
  } catch (err) {
    console.error('[CUSTOM_CRAFT_EMAIL_ERROR]', err);
  }
}

export async function getCustomCraftRequests(options?: {
  status?: CustomCraftStatus | 'ALL' | 'TRASH';
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { status = 'ALL', search, page = 1, limit = 15 } = options || {};

  const where: Prisma.CustomCraftRequestWhereInput = {};

  if (status === 'TRASH') {
    where.deletedAt = { not: null };
  } else {
    where.deletedAt = null;
    if (status !== 'ALL') {
      where.status = status as CustomCraftStatus;
    }
  }

  if (search) {
    where.OR = [
      { referenceNo: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { companyName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { country: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    prisma.customCraftRequest.findMany({
      where,
      include: {
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.customCraftRequest.count({ where }),
  ]);

  return {
    requests,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getCustomCraftRequestById(id: string) {
  return await prisma.customCraftRequest.findUnique({
    where: { id },
    include: {
      attachments: true,
    },
  });
}

export async function updateCustomCraftStatus(
  id: string,
  status: CustomCraftStatus,
  internalNotes?: string
) {
  return await prisma.customCraftRequest.update({
    where: { id },
    data: {
      status,
      internalNotes: internalNotes !== undefined ? internalNotes : undefined,
    },
    include: {
      attachments: true,
    },
  });
}

export async function softDeleteCustomCraftRequest(id: string) {
  return await prisma.customCraftRequest.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function restoreCustomCraftRequest(id: string) {
  return await prisma.customCraftRequest.update({
    where: { id },
    data: { deletedAt: null },
  });
}

export async function hardDeleteCustomCraftRequest(id: string) {
  return await prisma.customCraftRequest.delete({
    where: { id },
  });
}
