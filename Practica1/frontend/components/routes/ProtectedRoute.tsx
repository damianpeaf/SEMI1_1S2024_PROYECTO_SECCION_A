"use client";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "./Loader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { status } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return <Loader />;
};
