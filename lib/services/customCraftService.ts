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

  try {
    const metalsList = Array.isArray(request.metals) ? request.metals.join(', ') : request.metals;
    const emailBody = `
=== NEW CUSTOM CRAFT ENQUIRY ===
Ref No: ${request.referenceNo}
Timestamp: ${new Date(request.createdAt || Date.now()).toLocaleString()}

CUSTOMER DETAILS:
• Name: ${request.name}
• Company: ${request.companyName || 'N/A'}
• Email: ${request.email}
• Phone: ${request.contactNumber}
• Location: ${request.address ? `${request.address}, ` : ''}${request.city}, ${request.state}, ${request.country} ${request.zipCode || ''}

MANUFACTURING REQUIREMENTS:
• Purpose: ${request.purpose === 'Other' ? `Other (${request.customPurpose})` : request.purpose}
• Metals Selected: ${metalsList} ${request.customMetal ? `(Custom: ${request.customMetal})` : ''}
• Finish Type: ${request.finishType}
• Selected Finish: ${request.selectedFinish || 'N/A'}
• Expected Quantity: ${request.expectedQuantity || 'N/A'}
• Target Delivery Date: ${request.deliveryDate || 'N/A'}

PRODUCT DESCRIPTION & SPECIFICATIONS:
${request.description}

ATTACHED DRAWINGS & CAD FILES (${request.attachments?.length || 0}):
${request.attachments?.map((a: any, idx: number) => `${idx + 1}. ${a.fileName} (${a.fileUrl})`).join('\n') || 'None'}
    `.trim();

    const apiKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '5c13d35f-9934-4b1e-b53b-4c469ac826ea';

    const formData = new FormData();
    formData.append('access_key', apiKey);
    formData.append('name', request.name);
    formData.append('email', request.email);
    formData.append('phone', request.contactNumber);
    formData.append('subject', `[${request.referenceNo}] New Custom Craft Enquiry from ${request.name}`);
    formData.append('message', emailBody);
    formData.append('from_name', 'SB Pattern Works Custom Craft');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const resData = await response.json();
    console.log('[CUSTOM_CRAFT_EMAIL_DISPATCH_RESULT]', resData);
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
