
"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { X, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import NextImage from 'next/image';

interface ImageUploaderProps {
  name: string;
  defaultValue?: string;
}

export default function ImageUploader({ name, defaultValue = '' }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const toastId = toast({
      title: "Subiendo imagen...",
      description: "Por favor espera.",
    }).id;

    try {
      const resSign = await fetch('/api/sign-cloudinary-params', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // No need to send params for this simple signature
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
      
      setImageUrl(data.secure_url);

      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido correctamente.",
      });

    } catch (err: any) {
        toast({
            variant: 'destructive',
            title: "Error al subir",
            description: err.message,
        });
    } finally {
        setLoading(false);
        // Reset file input to allow re-uploading the same file
        e.target.value = '';
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setImageUrl('');
  };

  return (
    <div className="space-y-2">
      <Input
        id={name}
        name={name}
        type="hidden"
        value={imageUrl}
        readOnly
      />
      
      <div className="w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground relative">
        {imageUrl ? (
          <>
            <NextImage
              src={imageUrl.replace(/\.heic$/i, '.png')}
              alt="Vista previa del producto"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
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
                <span className="sr-only">Eliminar imagen</span>
              </Button>
            </div>
          </>
        ) : (
           <div className="text-center">
            {loading ? (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-12 w-12 animate-spin" />
                    <p>Subiendo...</p>
                </div>
            ) : (
                <>
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <label htmlFor="file-upload" className="mt-2 cursor-pointer flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-semibold">
                       <UploadCloud className="h-4 w-4" />
                       <span>Subir una Imagen</span>
                    </label>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={loading} />
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF hasta 10MB</p>
                </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
