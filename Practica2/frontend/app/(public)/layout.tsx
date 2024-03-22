import { PublicRoute } from "@/components/routes/PublicRoute";
import { Navbar } from "@/components/ui/Navbar";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicRoute>{children}</PublicRoute>;
}
