import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const userCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'SALES_EXECUTIVE']).default('ADMIN'),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'SALES_EXECUTIVE']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().or(z.string().length(0)).optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('ACTIVE'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
});

export const collectionSchema = z.object({
  name: z.string().min(2, 'Collection name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.enum(['ACTIVE', 'DRAFT']).default('ACTIVE'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
});

export const variantSchema = z.object({
  productId: z.string().optional(),
  size: z.string().optional(),
  finish: z.string().optional(),
  material: z.string().optional(),
  sku: z.string().optional(),
  variantCode: z.string().optional(),
  sortOrder: z.number().int().default(0),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const productImageSchema = z.object({
  url: z.string().url('Image must be a valid URL'),
  altText: z.string().optional(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().optional(),
  sku: z.string().min(2, 'SKU is required'),
  productCode: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().nullable().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  material: z.string().min(1, 'Material is required'),
  finish: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  styles: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.enum(['AVAILABLE', 'CUSTOM_ORDER', 'DISCONTINUED', 'PUBLISHED', 'DRAFT']).default('AVAILABLE'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
  images: z.array(productImageSchema).optional(),
  variants: z.array(variantSchema).optional(),
  collectionIds: z.array(z.string()).optional(),
});

export const customerSchema = z.object({
  name: z.string().trim().min(2, 'Customer name is required'),
  company: z.string().trim().min(2, 'Company name is required'),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().min(3, 'Phone number is required'),
  country: z.string().trim().min(2, 'Country is required'),
  city: z.string().trim().optional().nullable().or(z.literal('')),
  businessType: z.string().trim().min(2, 'Business type is required'),
  companyWebsite: z.string().trim().optional().nullable().or(z.literal('')),
  notes: z.string().trim().optional().nullable().or(z.literal('')),
});

export const quoteItemSchema = z.object({
  productId: z.string().trim().min(1, 'Product ID is required'),
  variantId: z.string().trim().optional().nullable().or(z.literal('')),
  selectedFinish: z.string().trim().optional().nullable().or(z.literal('')),
  selectedSize: z.string().trim().optional().nullable().or(z.literal('')),
  selectedMaterial: z.string().trim().optional().nullable().or(z.literal('')),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1').default(1),
  notes: z.string().trim().optional().nullable().or(z.literal('')),
});

export const quoteRequestSchema = z.object({
  customer: customerSchema,
  status: z.enum(['NEW', 'CONTACTED', 'QUOTATION_SENT', 'NEGOTIATION', 'WON', 'LOST']).default('NEW'),
  notes: z.string().trim().optional().nullable().or(z.literal('')),
  adminNotes: z.string().trim().optional().nullable().or(z.literal('')),
  assignedAdminId: z.string().trim().optional().nullable().or(z.literal('')),
  message: z.string().trim().optional().nullable().or(z.literal('')),
  companyWebsite: z.string().trim().optional().nullable().or(z.literal('')),
  expectedQuantity: z.string().trim().optional().nullable().or(z.literal('')),
  requiredFinish: z.string().trim().optional().nullable().or(z.literal('')),
  requiredDeliveryDate: z.string().trim().optional().nullable().or(z.literal('')),
  additionalRequirements: z.string().trim().optional().nullable().or(z.literal('')),
  items: z.array(quoteItemSchema).min(1, 'At least one quote item is required'),
});

export const quoteStatusUpdateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUOTATION_SENT', 'NEGOTIATION', 'WON', 'LOST']),
  notes: z.string().optional(),
  adminNotes: z.string().optional(),
  assignedAdminId: z.string().optional(),
});

export const siteSettingsSchema = z.object({
  companyName: z.string().optional(),
  logo: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  googleMapUrl: z.string().optional(),
  socialLinks: z.record(z.string()).optional(),
  seoDefaults: z.record(z.string()).optional(),
  footerContent: z.record(z.string()).optional(),
});
