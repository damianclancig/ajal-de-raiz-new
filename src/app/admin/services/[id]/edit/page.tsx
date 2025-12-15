
import ServiceForm from "@/components/admin/service-form";
import { getServiceById } from "@/lib/service-service";
import { notFound } from "next/navigation";

export default async function EditServicePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
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
