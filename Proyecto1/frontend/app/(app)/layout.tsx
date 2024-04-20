import { ProtectedRoute } from "@/components/routes/ProtectedRoute";
import { Layout } from "@/components/ui/layout/layout";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>
        <section className="flex flex-col flex-grow">{children}</section>
      </Layout>
    </ProtectedRoute>
  );
}
