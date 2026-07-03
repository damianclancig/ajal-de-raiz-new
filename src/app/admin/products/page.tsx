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


import { getPaginatedProducts } from "@/lib/actions";
import AdminPageClient from "@/components/admin/admin-page-client";
import { getUniqueCategories } from "@/lib/product-service";

export const revalidate = 0;
const PRODUCTS_PER_PAGE = 20;

export default async function AdminProductsPage() {
  const result = await getPaginatedProducts({ offset: 0, limit: PRODUCTS_PER_PAGE });
  const products = result.products || [];
  const categories = await getUniqueCategories();

  return (
    <div>
      <AdminPageClient initialProducts={products} categories={categories} />
    </div>
  );
}
