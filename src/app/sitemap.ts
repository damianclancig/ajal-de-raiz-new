import { getAvailableProducts } from '@/lib/product-service';
import { MetadataRoute } from 'next';
import type { Product } from '@/lib/types';

const BASE_URL = 'https://www.ajalderaiz.com.ar';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all products safely
  let products: Product[] = [];
  try {
    products = await getAvailableProducts();
  } catch (error) {
    console.error("Error al obtener productos para el sitemap:", error);
  }

  const productEntries: MetadataRoute.Sitemap = products.map(({ slug, updatedAt }) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: updatedAt ? new Date(updatedAt) : new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [...staticRoutes, ...productEntries];
}
