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


import SlideForm from '@/components/admin/slide-form';
import { getSlideById } from '@/lib/slide-service';
import { notFound } from 'next/navigation';

export default async function EditSlidePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const slide = await getSlideById(id);

  if (!slide) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SlideForm slide={slide} />
    </div>
  );
}
