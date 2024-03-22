import { Progress } from "@nextui-org/react";

export const Loader = () => {
  return (
    <section className="fixed left-0 top-0 z-50 flex flex-col items-center justify-center w-full h-full px-10">
      <h1 className="text-4xl font-bold mb-5">Cargando...</h1>
      <Progress size="lg" isIndeterminate className="max-w-md w-full" />
    </section>
  );
};
