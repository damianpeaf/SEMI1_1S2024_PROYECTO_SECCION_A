import { SignupForm } from "@/components/auth/SignupForm";
import { Link, Spacer } from "@nextui-org/react";

function page() {
  return (
    <section className="flex min-h-screen flex-col items-center mx-4 justify-center">
      <h1 className="text-4xl font-bold mb-5">Registro</h1>
      <SignupForm />
      <Spacer y={2} />
      <Link href="/">Volver al inicio</Link>
    </section>
  );
}

export default page;
