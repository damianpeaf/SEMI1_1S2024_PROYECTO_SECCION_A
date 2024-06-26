"use client";

import { useApi } from "@/hooks/useApi";
import { ProjectI, RoleT } from "@/types/Project";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MiniLoader } from "../routes/Loader";
import { ProjectForm } from "./ProjectForm";
import { Button } from "@nextui-org/react";
import { MdAdd, MdDelete } from "react-icons/md";
import { ProjectNotes } from "./ProjectNotes";
import { AddMemberModal } from "./AddMemberModal";

interface GetProjectInfoI {
  message: string;
  status: number;
  data: Data;
}

interface Data {
  id: number;
  title: string;
  description: string;
  date_created: Date;
  location: string;
  category: string;
  members: Member[];
}

export interface Member {
  id: string;
  name: string;
  username: string;
  role_name: RoleT;
}

export const ProjectProfile = () => {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const apiInfo = useApi<GetProjectInfoI>({
    endpointPath: "project/projects",
    method: "GET",
  });
  const apiUpdate = useApi({
    endpointPath: "project/projects",
    method: "PUT",
  });
  const deleteApi = useApi({
    endpointPath: "project/projects",
    method: "DELETE",
  });

  const getInfo = async () => {
    if (!id) return;
    const res = await apiInfo.call({
      resourceId: id,
    });
  };

  const updateProject = async (data: ProjectI) => {
    if (!id) return;
    const res = await apiUpdate.call({
      resourceId: id,
      body: data,
      successMessage({ data, error }) {
        getInfo();
        return "Proyecto actualizado";
      },
      errorMessage({ data, error }) {
        return "Error al actualizar el proyecto";
      },
    });
  };

  const deleteProject = async () => {
    if (!id) return;
    const res = await deleteApi.call({
      resourceId: id,
      successMessage({ data, error }) {
        router.push("/dashboard");
        return "Proyecto eliminado";
      },
      errorMessage({ data, error }) {
        return "Error al eliminar el proyecto";
      },
    });
  };

  useEffect(() => {
    getInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!id)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full px-10 my-6">
        <h1 className="text-2xl font-bold mb-5">Proyecto no encontrado</h1>
      </div>
    );

  if (apiInfo.loading) return <MiniLoader />;
  if (!apiInfo.data) return null;

  const project = apiInfo.data.data;

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <div className="flex justify-end w-full gap-x-2">
        <Button
          color="danger"
          className="text-white text-xl"
          onClick={() => deleteProject()}
          size="sm"
        >
          <MdDelete />
        </Button>
        <Button
          color="primary"
          className="text-white text-sm"
          onClick={() => setIsMembersModalOpen(true)}
          size="sm"
        >
          <MdAdd /> Miembros
        </Button>
        <AddMemberModal
          onGetMembers={getInfo}
          isOpen={isMembersModalOpen}
          onClose={() => setIsMembersModalOpen(false)}
          projectId={id}
          members={project.members}
        />
      </div>
      <h2 className="text-2xl font-bold mb-5">{project.title}</h2>
      <ProjectForm
        initialValues={{
          name: project.title,
          description: project.description,
          category: project.category,
          location: project.location,
        }}
        onSubmit={({ data }) => {
          updateProject({
            category: data.category,
            description: data.description,
            location: data.location,
            name: data.name,
            id: project.id,
          });
        }}
        actionButtonText="Actualizar proyecto"
      />
      <ProjectNotes projectId={id} />
    </div>
  );
};
