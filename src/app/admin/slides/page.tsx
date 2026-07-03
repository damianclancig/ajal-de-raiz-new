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


import { getAllSlides } from "@/lib/slide-service";
import AdminSlidesPageClient from "@/components/admin/admin-slides-page-client";

export default async function AdminSlidesPage() {
  const slides = await getAllSlides();

  return (
    <div>
      <AdminSlidesPageClient initialSlides={slides} />
    </div>
  );
}
