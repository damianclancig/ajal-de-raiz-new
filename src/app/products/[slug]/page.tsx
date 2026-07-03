/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { getProductBySlug } from '@/lib/product-service';
import { notFound } from 'next/navigation';
import ProductDetailClient from './_components/product-detail-client';
import type { Product } from '@/lib/types';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  const title = `${product.name} | Ajal de Raiz`;
  const description = product.description.substring(0, 160); // Cap description for meta tag
  const imageUrl = product.images[0]?.replace(/\.(mp4|webm)$/i, '.jpg');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    }
  };
}

import { auth } from "@/auth";

// This is a Server Component that fetches data.
export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const session = await auth();
  const product: Product | null = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // It passes the fetched data to a Client Component.
  return <ProductDetailClient product={product} isAdmin={session?.user?.isAdmin} />;
}
