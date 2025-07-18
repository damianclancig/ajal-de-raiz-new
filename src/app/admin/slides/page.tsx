
import { getAllSlides } from "@/lib/slide-service";
import AdminSlidesPageClient from "@/components/admin/admin-slides-page-client";

export default async function AdminSlidesPage() {
  const slides = await getAllSlides();

  return (
    <div>
      <AdminSlidesPageClient initialSlides={slides} />
    </div>
  );
}
