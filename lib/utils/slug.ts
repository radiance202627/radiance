import prisma from '@/lib/prisma';

/**
 * Converts a string into a clean, lowercased, URL-safe slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

/**
 * Automatically generates a unique SEO-friendly slug for Products, Categories, or Collections,
 * resolving any conflicts by appending numeric suffixes if necessary.
 */
export async function generateUniqueSlug(
  modelName: 'product' | 'category' | 'collection',
  title: string,
  currentId?: string
): Promise<string> {
  const baseSlug = slugify(title) || 'item';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let existing: { id: string } | null = null;

    if (modelName === 'product') {
      existing = await prisma.product.findUnique({
        where: { slug },
        select: { id: true },
      });
    } else if (modelName === 'category') {
      existing = await prisma.category.findUnique({
        where: { slug },
        select: { id: true },
      });
    } else if (modelName === 'collection') {
      existing = await prisma.collection.findUnique({
        where: { slug },
        select: { id: true },
      });
    }

    if (!existing || existing.id === currentId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
