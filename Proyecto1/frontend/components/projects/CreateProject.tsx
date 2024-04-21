"use client";
import { useApi } from "@/hooks/useApi";
import { ApiResponse } from "@/types/Api";
import { ProjectForm, TLoginSchema } from "./ProjectForm";
import { toast } from "sonner";

export const CreateProject = () => {
  const { call: createApi } = useApi<ApiResponse<ProjectI>>({
    endpointPath: "project/projects",
    method: "POST",
  });

  const onSubmit = async ({
    data,
    reset,
  }: {
    data: TLoginSchema;
    reset: () => void;
  }) => {
    const project = await createApi({
      body: data,
      errorMessage: ({ error }) => {
        console.log(error);
        return `Error al crear proyecto. ${error?.message || error}`;
      },
    });

    if (!project) return;
    reset();
    toast.success("Proyecto creado correctamente");
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-5">Crear Proyecto</h1>
      <ProjectForm onSubmit={onSubmit} actionButtonText="Crear Proyecto" />
    </>
  );
};
