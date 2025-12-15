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
