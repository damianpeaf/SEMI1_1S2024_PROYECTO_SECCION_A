"use client";
import { EditIcon, EyeFilledIcon } from "@/components/svgs";
import { useApi } from "@/hooks/useApi";
import { ProjectPriviliges, RoleT } from "@/types/Project";
import {
  Chip,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { useEffect } from "react";
import { FcInvite } from "react-icons/fc";
import { MdDelete } from "react-icons/md";
import Link from "next/link";
import { MiniLoader } from "@/components/routes/Loader";

interface GetProjectI {
  description: string;
  id: number;
  role_name: RoleT;
  role_privileges: ProjectPriviliges[];
  title: string;
}

const chipColor = (role: RoleT) => {
  switch (role) {
    case "Creador":
      return "success";
    case "Colaborador":
      return "warning";
    case "Visualizador":
      return "secondary";
  }
};

const privilegeComponent = (privilege: ProjectPriviliges) => {
  switch (privilege) {
    case ProjectPriviliges.Invite:
      return <FcInvite />;
    case ProjectPriviliges.Modify:
      return <EditIcon />;
    case ProjectPriviliges.Delete:
      return <MdDelete />;
    case ProjectPriviliges.View:
      return <EyeFilledIcon />;
    default:
      return null;
  }
};

export const Content = () => {
  const { data, call, loading } = useApi<{
    data: GetProjectI;
  }>({
    endpointPath: "project/projects",
    method: "GET",
  });

  const getAllProjects = async () => {
    const projects = await call({
      errorMessage: ({ error }) => {
        return `Error al obtener proyectos. ${error?.message || error}`;
      },
    });

    if (!projects) return;
  };

  useEffect(() => {
    getAllProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const projects = data?.data as GetProjectI[] | undefined;

  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
        <div className="mt-2 gap-6 flex flex-col w-full">
          <Card className="bg-secondary-900">
            <CardBody>
              <p className="text-white text-xl font-bold">
                Bienvenido a Planorama!{" "}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
      {loading && <MiniLoader />}
      {(projects?.length && !loading) === 0 && (
        <div className="text-center text-xl font-bold w-full mt-6 flex items-center justify-center">
          No hay proyectos
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 xl:grid-cols-4 px-4">
        {Array.isArray(projects) &&
          projects.map((project) => (
            <Link href={`/project?id=${project.id}`} key={project.id}>
              <Card
                key={project.id}
                isFooterBlurred
                radius="lg"
                className="border-none"
              >
                <CardHeader>
                  <div className="relative w-full">
                    <p className="text-lg font-bold">{project.title}</p>
                    <div className="absolute top-0 right-0">
                      <Chip
                        color={chipColor(project.role_name)}
                        size="sm"
                        className="text-white"
                      >
                        {project.role_name}
                      </Chip>
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-sm font-bold mb-2">Descripción:</p>
                  <p>{project.description}</p>
                </CardBody>
                <Divider />
                <CardFooter>
                  <p className="text-sm font-bold mr-2">Permisos:</p>
                  <div className="flex gap-x-2">
                    {project.role_privileges.map((privilege) => (
                      <div key={privilege} className="text-black">
                        {privilegeComponent(privilege)}
                      </div>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
};
