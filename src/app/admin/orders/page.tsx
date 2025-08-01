import AdminOrdersPageClient from './_components/admin-orders-client';
import { getAllOrders } from '@/lib/order-service';


export default async function AdminOrdersPage() {
    const orders = await getAllOrders();
    
    return <AdminOrdersPageClient orders={orders} />
}
