import { Navbar } from "@/components/ui/Navbar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <section className="flex flex-col flex-grow">{children}</section>
    </>
  );
}
