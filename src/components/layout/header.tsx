
"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import Logo from "@/components/icons/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import LanguageSwitcher from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserNav } from "./user-nav";
import HeaderNavLinks from "./header-nav-links";
import { useState } from "react";

export default function Header() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <Logo size={56} />
            <span className="font-headline text-2xl font-bold">
              {t("Ajal")} {t("de_Raiz")}
            </span>
          </Link>
        </div>
         <div className="md:hidden">
            <Link href="/" className="flex items-center space-x-2">
                <Logo size={48} />
            </Link>
        </div>
        
        <div className="flex items-center justify-end space-x-2">
          <nav className="hidden md:flex md:gap-4">
            <HeaderNavLinks />
          </nav>
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            {session ? <UserNav session={session} /> : (
              <Button asChild variant="outline">
                <Link href="/login">{t('Login')}</Link>
              </Button>
            )}

            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle className="sr-only">{t('Mobile_Menu')}</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                  <Link href="/" className="flex items-center space-x-2 mb-8" onClick={() => setIsMobileMenuOpen(false)}>
                      <Logo size={48} />
                      <span className="font-headline text-2xl font-bold">
                        {t("Ajal")} {t("de_Raiz")}
                      </span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                      <HeaderNavLinks onLinkClick={() => setIsMobileMenuOpen(false)}/>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
