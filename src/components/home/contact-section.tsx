
"use client";

import { useTransition, useRef, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { handleContactForm } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import ReCAPTCHA from "react-google-recaptcha";
import { useTheme } from "next-themes";

export default function ContactSection() {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);
  const { theme } = useTheme();

  const handleRecaptchaChange = (token: string | null) => {
    setIsVerified(!!token);
  };

  const handleSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    if (!email) {
      toast({
        variant: "destructive",
        title: t("Error_Title"),
        description: "Por favor, ingresa un correo electrónico.",
      });
      return;
    }

    const recaptchaToken = recaptchaRef.current?.getValue();
    if (!recaptchaToken) {
        toast({
            variant: "destructive",
            title: "Verificación requerida",
            description: "Por favor, completa el reCAPTCHA.",
        });
        return;
    }
    formData.append('g-recaptcha-response', recaptchaToken);

    startTransition(async () => {
      const result = await handleContactForm(formData);
      if (result.success) {
        toast({
          title: "¡Gracias!",
          description: "Hemos recibido tu solicitud. Nos pondremos en contacto pronto.",
        });
        formRef.current?.reset();
        recaptchaRef.current?.reset();
        setIsVerified(false);
      } else {
        toast({
          variant: "destructive",
          title: t("Error_Title"),
          description: result.message,
        });
      }
    });
  };

  return (
    <section id="contact" className="container py-12 md:py-20">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl md:text-4xl font-bold">{t('Contact_Us')}</CardTitle>
            <CardDescription className="text-lg">{t('Have_questions')}</CardDescription>
        </CardHeader>
        <CardContent>
             <form ref={formRef} action={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">{t('Email')}</Label>
                    <Input id="contact-email" type="email" name="email" placeholder={t('Placeholder_Email')} disabled={isPending} required />
                  </div>
               </div>
               <div className="space-y-2">
                <Label htmlFor="contact-message">{t('Your_Message')}</Label>
                <Textarea id="contact-message" name="message" placeholder={t('Message_Placeholder')} disabled={isPending} required />
               </div>
                <div className="rounded-md overflow-hidden w-[304px]">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={handleRecaptchaChange}
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    key={theme}
                  />
                </div>
              <Button type="submit" disabled={isPending || !isVerified}>
                {isPending ? <Loader2 className="animate-spin" /> : t('Send_Message')}
              </Button>
            </form>
        </CardContent>
      </Card>
    </section>
  );
}
