
"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button asChild variant="ghost" className={cn(
      "justify-start text-base transition-colors hover:text-primary",
      isActive ? "font-bold text-primary" : "text-muted-foreground",
    )}>
      <Link href={href}>{children}</Link>
    </Button>
  );
};

export default function HeaderNavLinks() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.isAdmin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [session, status]);
  
  const navLinks = [
    { href: "/", label: t("Home") },
    { href: "/#services", label: t("Services") },
    { href: "/products", label: t("Products") },
  ];

  if (isAdmin) {
    navLinks.push({ href: "/admin", label: t("Admin") });
  }

  return (
    <>
      {navLinks.map((link) => (
        <NavLink key={link.href} href={link.href}>
          {link.label}
        </NavLink>
      ))}
    </>
  );
}
