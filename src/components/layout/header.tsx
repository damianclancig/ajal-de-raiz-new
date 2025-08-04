
"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import Logo from "@/components/icons/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import LanguageSwitcher from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserNav } from "./user-nav";
import HeaderNavLinks from "./header-nav-links";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/cart-context";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { useNotification } from "@/contexts/notification-context";

export default function Header() {
  const { t } = useLanguage();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const [isClient, setIsClient] = useState(false);
  const { pendingPaymentCount, refreshPendingCount } = useNotification();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      refreshPendingCount();
    }
  }, [status, refreshPendingCount]);
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Placeholder to prevent layout shift before client-side rendering
  const AuthPlaceholder = () => <div className="h-10 w-24" />;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo size={56} />
            <span className="hidden md:inline font-headline text-2xl font-bold">
              {t("Ajal")} {t("de_Raiz")}
            </span>
          </Link>
        </div>

        {/* Center Section: Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center">
          <div className="flex gap-4">
            <HeaderNavLinks />
          </div>
        </nav>

        {/* Right Section: Actions */}
        <div className="flex items-center justify-end space-x-2">
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {!isClient ? (
            <AuthPlaceholder />
          ) : session ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-xs">
                      {cartItemCount}
                    </Badge>
                  )}
                  <span className="sr-only">{t('Shopping_Cart')}</span>
                </Link>
              </Button>
              <UserNav session={session} pendingPaymentCount={pendingPaymentCount} />
            </div>
          ) : (
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/login">{t('Login')}</Link>
            </Button>
          )}
          
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <div className="md:hidden flex items-center">
                {isClient && !session && (
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/login">{t('Login')}</Link>
                    </Button>
                )}
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">{t('Mobile_Menu')}</span>
                    </Button>
                </SheetTrigger>
            </div>
            <SheetContent side="left" className="flex flex-col p-0">
              <SheetHeader className="p-4 border-b">
                 <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Logo size={48} />
                    <span className="font-headline text-2xl font-bold">
                      {t("Ajal")} {t("de_Raiz")}
                    </span>
                  </Link>
                  <SheetTitle className="sr-only">Menu Principal</SheetTitle>
              </SheetHeader>
              <div className="p-4 flex-grow">
                <nav className="flex flex-col gap-4">
                  <HeaderNavLinks onLinkClick={() => setIsMobileMenuOpen(false)}/>
                </nav>
              </div>
              <Separator />
              <div className="p-4 flex justify-around">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
