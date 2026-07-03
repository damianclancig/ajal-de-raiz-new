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

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Package, Users2, Star, ShoppingBag, ShieldAlert, HeartHandshake } from "lucide-react";

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
      href: `/admin/slides`,
      label: t('Slides'),
      active: pathname.startsWith(`/admin/slides`),
      icon: Star
    },
    {
      href: `/admin/orders`,
      label: t('Orders_Admin'),
      active: pathname.startsWith(`/admin/orders`),
      icon: ShoppingBag
    },
    {
      href: `/admin/services`,
      label: t('Services'),
      active: pathname.startsWith(`/admin/services`),
      icon: HeartHandshake
    },
    {
      href: `/admin/users`,
      label: t('Users'),
      active: pathname.startsWith(`/admin/users`),
      icon: Users2
    },
    {
      href: `/admin/logs`,
      label: "Logs",
      active: pathname.startsWith(`/admin/logs`),
      icon: ShieldAlert
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
                route.active ? 'bg-primary text-white' : 'text-muted-foreground'
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
