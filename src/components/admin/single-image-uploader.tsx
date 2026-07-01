
"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import NextImage from 'next/image';
import { useLanguage } from '@/hooks/use-language';
import imageCompression from 'browser-image-compression';

interface SingleImageUploaderProps {
  name: string;
  defaultValue?: string;
  folder?: string;
}

export default function SingleImageUploader({ name, defaultValue = '', folder }: SingleImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>(defaultValue);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    setLoading(true);
    toast({
      title: t('Uploading_Image_Title'),
      description: t('Uploading_Image_Desc'),
    });

    try {
      let fileToUpload = originalFile;
      if (originalFile.type.startsWith('image/')) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: 'image/webp' as string,
        };
        try {
          const compressedFile = await imageCompression(originalFile, options);
          const initialName = originalFile.name.replace(/\.[^/.]+$/, "");
          fileToUpload = new File([compressedFile], `${initialName}.webp`, {
            type: 'image/webp',
          });
        } catch (error) {
          console.error('Error al comprimir la imagen:', error);
        }
      }

      const resSign = await fetch('/api/sign-cloudinary-params', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      });

      if (!resSign.ok) throw new Error('Failed to get signature.');
      
      const { signature, timestamp } = await resSign.json();
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      if (folder) {
        formData.append('folder', folder);
      }
      
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

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={imageUrl} />
      
      <div className="relative aspect-square w-full border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground">
        {imageUrl ? (
          <>
            <NextImage
              src={imageUrl.replace(/\.heic$/i, '.png')}
              alt={t('Image_Preview')}
              fill
              style={{ objectFit: 'contain' }}
              className="p-2"
            />
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemoveImage}
                className="h-7 w-7"
                disabled={loading}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">{t('Delete_Image')}</span>
              </Button>
            </div>
          </>
        ) : (
          loading ? (
            <div className="flex flex-col items-center gap-2 text-center">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">{t('Uploading_Dots')}</p>
            </div>
          ) : (
            <div className="text-center p-4">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <label htmlFor="file-upload" className="mt-2 cursor-pointer flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 font-semibold">
                   <UploadCloud className="h-4 w-4" />
                   <span>{t('Upload_an_Image')}</span>
                </label>
                <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={loading} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
