import { ProtectedRoute } from "@/components/routes/ProtectedRoute";
import { Navbar } from "@/components/ui/Navbar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <Navbar />
      <section className="flex flex-col flex-grow">{children}</section>
    </ProtectedRoute>
  );
}
