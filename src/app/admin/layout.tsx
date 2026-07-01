import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutWrapper>
      {children}
      <Toaster theme="dark" richColors position="top-right" />
    </AdminLayoutWrapper>
  );
}
