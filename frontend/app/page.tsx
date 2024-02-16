import { LoginForm } from "@/components/auth/LoginForm";
import { Link, Spacer } from "@nextui-org/react";

export default function Home() {
  return (
    <section className="flex min-h-screen flex-col items-center mx-4 justify-center">
      <h1 className="text-4xl font-bold mb-5">Login</h1>
      <LoginForm />
      <Spacer y={2} />
      <Link href="/signup">{`No tienes cuenta? Regístrate`}</Link>
    </section>
  );
}
