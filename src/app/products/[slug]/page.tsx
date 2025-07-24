
import { getProductBySlug } from '@/lib/product-service';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';
import { cookies } from 'next/headers';

// Helper to get language from cookie on the server
const getLanguage = () => {
    const cookieStore = cookies();
    const langCookie = cookieStore.get('language');
    const lang = langCookie?.value;
    if (lang === 'en' || lang === 'es' || lang === 'pt') {
        return lang;
    }
    return 'es'; // Default language
};

const formatPrice = (price: number, lang: 'en' | 'es' | 'pt') => {
    const locale = lang === 'es' ? 'es-AR' : lang;
    return new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
};

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  const lang = getLanguage();
  const t = (key: keyof typeof translations) => translations[key][lang] || key;

  const imageUrl = product.image
    ? product.image.replace(/\.heic$/i, '.png')
    : 'https://placehold.co/600x600/a1a1a1/000000/jpg?text=No+Image';

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            data-ai-hint={product.dataAiHint || 'product image'}
          />
        </div>

        <div className="flex flex-col justify-center">
            <Card>
                <CardHeader>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <CardTitle className="font-headline text-4xl md:text-5xl">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-lg text-muted-foreground">{product.description}</p>
                    
                    <div className="text-4xl font-bold text-primary">
                        ${formatPrice(product.price, lang)}
                    </div>

                    <Button size="lg" className="w-full">
                        {t('Contact_Us')}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
