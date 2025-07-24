
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Package, Users2, Star } from "lucide-react";

export default function AdminNav() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const routes = [
    {
      href: `/admin/products`,
      label: t('Products'),
      active: pathname.startsWith(`/admin/products`),
      icon: Package
    },
    {
      href: `/admin/users`,
      label: t('Users'),
      active: pathname.startsWith(`/admin/users`),
      icon: Users2
    },
    {
      href: `/admin/slides`,
      label: t('Slides'),
      active: pathname.startsWith(`/admin/slides`),
      icon: Star
    },
  ];

  return (
    <div className="relative border-b">
        <ScrollArea className="max-w-full whitespace-nowrap">
            <nav className="flex items-center space-x-4 lg:space-x-6 p-1">
                {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary p-2 rounded-md',
                    route.active ? 'text-primary bg-muted' : 'text-muted-foreground'
                    )}
                >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                </Link>
                ))}
            </nav>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
  );
}
