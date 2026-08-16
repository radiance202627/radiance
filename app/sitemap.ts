import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/services/productService';
import { getCategories } from '@/lib/services/categoryService';
import { getCollections } from '@/lib/services/collectionService';
import { getBlogPosts } from '@/lib/services/blogService';
import { getGalleryAlbums } from '@/lib/services/galleryService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sbpatternworks.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/custom-craft`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/request-quote`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/why-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  try {
    const [products, categories, collections, blogRes, galleryRes] = await Promise.all([
      getProducts().catch(() => []),
      getCategories().catch(() => []),
      getCollections().catch(() => []),
      getBlogPosts({ status: 'PUBLISHED', limit: 100 }).catch(() => ({ posts: [] })),
      getGalleryAlbums({ status: 'PUBLISHED', limit: 100 }).catch(() => ({ albums: [] })),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/products/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const subcategoryRoutes: MetadataRoute.Sitemap = categories.flatMap((c) =>
      c.subcategories.map((sub) => ({
        url: `${baseUrl}/products/${c.slug}/${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }))
    );

    const collectionRoutes: MetadataRoute.Sitemap = collections.map((col) => ({
      url: `${baseUrl}/collections#${col.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const blogRoutes: MetadataRoute.Sitemap = blogRes.posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const galleryRoutes: MetadataRoute.Sitemap = galleryRes.albums.map((album) => ({
      url: `${baseUrl}/gallery/${album.slug}`,
      lastModified: new Date(album.updatedAt || album.createdAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...subcategoryRoutes,
      ...collectionRoutes,
      ...productRoutes,
      ...blogRoutes,
      ...galleryRoutes,
    ];
  } catch {
    return staticRoutes;
  }
}
