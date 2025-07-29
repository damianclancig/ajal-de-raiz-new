
"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X, UploadCloud, Image as ImageIcon, Loader2, Video } from 'lucide-react';
import NextImage from 'next/image';
import { useLanguage } from '@/hooks/use-language';

const MAX_MEDIA = 5;

interface MultiMediaUploaderProps {
  name: string;
  defaultValues?: string[];
}

export default function MultiMediaUploader({ name, defaultValues = [] }: MultiMediaUploaderProps) {
  const [mediaUrls, setMediaUrls] = useState<string[]>(defaultValues);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)$/i.test(url);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (mediaUrls.length >= MAX_MEDIA) {
      toast({
        variant: 'destructive',
        title: t('Image_Limit_Title'),
        description: t('Image_Limit_Desc', { max: MAX_MEDIA }),
      });
      return;
    }

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

      if (!resSign.ok) {
        throw new Error('Failed to get signature from server.');
      }
      
      const { signature, timestamp } = await resSign.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error.message || 'Cloudinary upload failed.');
      }
      
      const data = await res.json();
      
      setMediaUrls(prev => [...prev, data.secure_url]);

      toast({
        title: t('Image_upload_success_title'),
        description: t('Image_upload_success_desc'),
      });

    } catch (err: any) {
        console.error("Media upload error:", err);
        let description = t('Upload_Error_Desc');
        if (err?.message?.includes('File size too large')) {
          description = t('Upload_Error_File_Too_Large_Desc');
        }

        toast({
            variant: 'destructive',
            title: t('Upload_Error_Title'),
            description: description,
        });
    } finally {
        setLoading(false);
        e.target.value = '';
    }
  };

  const handleRemoveMedia = (urlToRemove: string) => {
    setMediaUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  return (
    <div className="space-y-4">
      {mediaUrls.map((url, index) => (
        <input key={index} type="hidden" name={`${name}[${index}]`} value={url} />
      ))}
      
      <div className="grid grid-cols-3 gap-4">
        {mediaUrls.map((url, index) => (
          <div key={index} className="relative aspect-square w-full rounded-md overflow-hidden">
            {isVideo(url) ? (
                 <video
                    src={url}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <NextImage
                  src={url.replace(/\.heic$/i, '.png')}
                  alt={`Vista previa ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-md"
                />
            )}
            <div className="absolute top-1 right-1 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveMedia(url)}
                className="h-6 w-6"
                disabled={loading}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Eliminar medio</span>
              </Button>
            </div>
             {isVideo(url) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Video className="h-8 w-8 text-white" />
                </div>
            )}
            {index === 0 && (
              <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs text-center p-1">
                Principal
              </div>
            )}
          </div>
        ))}
        {mediaUrls.length < MAX_MEDIA && (
          <div className="relative aspect-square w-full border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground">
            {loading ? (
                <div className="flex flex-col items-center gap-2 text-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-sm">Subiendo...</p>
                </div>
            ) : (
                <div className="text-center">
                    <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <label htmlFor="file-upload" className="mt-2 cursor-pointer flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-semibold">
                       <UploadCloud className="h-4 w-4" />
                       <span>Añadir</span>
                    </label>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,video/*" disabled={loading} />
                    <p className="text-xs text-muted-foreground mt-1">
                        {mediaUrls.length} / {MAX_MEDIA}
                    </p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
