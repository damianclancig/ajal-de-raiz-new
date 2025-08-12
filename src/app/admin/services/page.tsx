
import { getAllServices } from "@/lib/service-service";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ServiceTable from "@/components/admin/service-table";

export const revalidate = 0;

export default async function AdminServicesPage() {
    const services = await getAllServices();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Servicios</h1>
                    <p className="text-muted-foreground">Crea, edita y elimina los servicios ofrecidos.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/services/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Nuevo Servicio
                    </Link>
                </Button>
            </div>
            <ServiceTable initialServices={services} />
        </div>
    );
}
