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


"use client";

import SlideTable from "@/components/admin/slide-table";
import { useLanguage } from "@/hooks/use-language";
import type { HeroSlide } from "@/lib/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

interface AdminSlidesPageClientProps {
    initialSlides: HeroSlide[];
}

export default function AdminSlidesPageClient({ initialSlides }: AdminSlidesPageClientProps) {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
            <h1 className="font-headline text-4xl font-bold">{t('Slide_Management')}</h1>
            <p className="text-muted-foreground">{t('Manage_your_slides')}</p>
        </div>
        <Button asChild>
          <Link href="/admin/slides/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('Add_New_Slide')}
          </Link>
        </Button>
      </div>
      <SlideTable initialSlides={initialSlides} />
    </>
  );
}
