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

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductBreadcrumbProps {
    category: string;
}

export default function ProductBreadcrumb({ category }: ProductBreadcrumbProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between w-full pb-4 mb-6 border-b border-border/40">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
                <Link
                    href="/products"
                    className="text-xs font-medium tracking-widest text-muted-foreground uppercase hover:text-primary transition-colors"
                >
                    Productos
                </Link>
                <span className="text-muted-foreground/40 font-light select-none">/</span>
                <span className="text-xs font-bold tracking-widest text-foreground uppercase">
                    {category}
                </span>
            </nav>

            <Button
                variant="ghost"
                size="sm"
                className="group px-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Volver</span>
            </Button>
        </div>
    );
}
