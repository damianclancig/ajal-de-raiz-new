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
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const NavLink = ({ href, children, onLinkClick, isDesktop }: { href: string; children: React.ReactNode, onLinkClick?: () => void, isDesktop?: boolean }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button asChild variant="ghost" className={cn(
      "justify-start text-base transition-colors",
      isDesktop ? "hover:text-white" : "hover:text-primary",
      isActive ? "font-bold text-primary" : "text-muted-foreground",
    )}>
      <Link href={href} onClick={onLinkClick}>{children}</Link>
    </Button>
  );
};

interface HeaderNavLinksProps {
  onLinkClick?: () => void;
  isDesktop?: boolean;
}

export default function HeaderNavLinks({ onLinkClick, isDesktop }: HeaderNavLinksProps) {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (status === "authenticated" && session?.user?.isAdmin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [session, status]);

  const navLinks = [
    { href: "/", label: t("Home") },
    { href: "/products", label: t("Products") },
    { href: "/#services", label: t("Services") },
    { href: "/about", label: t("About_Us") },
    { href: "/#contact", label: t("Contact") },
  ];

  if (isClient && isAdmin) {
    navLinks.push({ href: "/admin", label: t("Admin") });
  }

  return (
    <>
      {navLinks.map((link) => (
        <NavLink key={link.href} href={link.href} onLinkClick={onLinkClick} isDesktop={isDesktop}>
          {link.label}
        </NavLink>
      ))}
    </>
  );
}
