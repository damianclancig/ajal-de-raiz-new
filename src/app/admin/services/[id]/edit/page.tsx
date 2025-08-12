
import ServiceForm from "@/components/admin/service-form";
import { getServiceById } from "@/lib/service-service";
import { notFound } from "next/navigation";

export default async function EditServicePage({ params }: { params: { id: string }}) {
    const service = await getServiceById(params.id);

    if (!service) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto">
            <ServiceForm service={service} />
        </div>
    );
}
