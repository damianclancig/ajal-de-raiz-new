
import AdminNav from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
       <AdminNav />
       <main className="py-8 px-4 md:px-6 lg:px-8">
        {children}
       </main>
    </div>
  );
}
