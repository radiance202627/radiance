export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  subcategories: Subcategory[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  subcategoryId: string;
  subcategoryName: string;
  subcategorySlug: string;
  shortDescription: string;
  description: string;
  images: string[];
  material: string;
  finishes: string[];
  sizes: string[];
  styles: string[];
  collections: string[];
  specifications: Record<string, string>;
  featured?: boolean;
  status: 'available' | 'custom_order' | 'discontinued';
}

export interface QuoteItem {
  id: string;
  product: Product;
  selectedFinish: string;
  selectedSize: string;
  selectedMaterial: string;
  quantity: number;
}

export interface ProductFilters {
  categorySlug?: string;
  subcategorySlug?: string;
  material?: string;
  finish?: string;
  size?: string;
  style?: string;
  collectionSlug?: string;
  searchQuery?: string;
  sortBy?: 'featured' | 'name-asc' | 'name-desc' | 'sku';
}

export interface QuoteEnquiryForm {
  fullName: string;
  companyName: string;
  businessEmail: string;
  phoneWhatsApp: string;
  country: string;
  city: string;
  companyWebsite?: string;
  businessType: string;
  message: string;
  expectedQuantity?: string;
  requiredFinish?: string;
  requiredDeliveryDate?: string;
  additionalRequirements?: string;
}
