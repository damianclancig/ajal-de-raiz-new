
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import NextImage from 'next/image';
import { useLanguage } from '@/hooks/use-language';
import { submitReceipt } from '@/lib/actions';

interface UploadReceiptButtonProps {
    orderId: string;
}

export default function UploadReceiptButton({ orderId }: UploadReceiptButtonProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    toast({
      title: t('Uploading_Image_Title'),
      description: t('Uploading_Image_Desc'),
    });

    try {
      const resSign = await fetch('/api/sign-cloudinary-params', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!resSign.ok) throw new Error('Failed to get signature.');
      
      const { signature, timestamp } = await resSign.json();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Cloudinary upload failed.');
      
      const data = await res.json();
      setImageUrl(data.secure_url);
      toast({
        title: t('Image_upload_success_title'),
        description: t('Image_upload_success_desc'),
      });
    } catch (err: any) {
      toast({ variant: 'destructive', title: t('Upload_Error_Title'), description: err.message });
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = () => {
    if (!imageUrl) {
        toast({ variant: 'destructive', title: "Error", description: "Por favor, sube una imagen del comprobante primero." });
        return;
    }
    startSubmitTransition(async () => {
        const result = await submitReceipt(orderId, imageUrl);
        if (result.success) {
            toast({ title: "Comprobante Enviado", description: "Hemos recibido tu comprobante, lo verificaremos a la brevedad." });
            setOpen(false);
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
        }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" />
          {t('Upload_Receipt')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Subir Comprobante de Pago</AlertDialogTitle>
          <AlertDialogDescription>
            Selecciona la imagen de tu comprobante de pago. Una vez subida, haz clic en "Enviar Comprobante" para que podamos verificarlo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
            {imageUrl ? (
                 <div className="relative aspect-video w-full rounded-md overflow-hidden">
                    <NextImage src={imageUrl} alt="Comprobante" fill className="object-contain" />
                 </div>
            ) : (
                <div className="relative aspect-video w-full border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground">
                    {loading ? (
                         <div className="flex flex-col items-center gap-2 text-center">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <p className="text-sm">Subiendo...</p>
                        </div>
                    ) : (
                         <div className="text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <label htmlFor="receipt-upload" className="mt-2 cursor-pointer text-primary hover:text-primary/80 font-semibold">
                               Seleccionar Imagen
                            </label>
                            <Input id="receipt-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={loading} />
                        </div>
                    )}
                </div>
            )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
          <Button onClick={handleSubmit} disabled={!imageUrl || loading || isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Enviar Comprobante
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
