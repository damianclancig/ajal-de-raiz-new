
import SlideForm from '@/components/admin/slide-form';
import { getSlideById } from '@/lib/slide-service';
import { notFound } from 'next/navigation';

export default async function EditSlidePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const slide = await getSlideById(id);

  if (!slide) {
    notFound();
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SlideForm slide={slide} />
    </div>
  );
}
