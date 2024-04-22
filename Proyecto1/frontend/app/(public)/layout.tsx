import { PublicRoute } from "@/components/routes/PublicRoute";
import { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicRoute>{children}</PublicRoute>;
}
