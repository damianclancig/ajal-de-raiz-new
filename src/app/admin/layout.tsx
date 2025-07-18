
import AdminNav from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-4">
       <AdminNav />
       <main className="py-8">
        {children}
       </main>
    </div>
  );
}
