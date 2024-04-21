"use client";
import { useApi } from "@/hooks/useApi";
import { Card, CardBody } from "@nextui-org/react";
import { useEffect } from "react";

export const Content = () => {
  const { data, call } = useApi({
    endpointPath: "project/projects",
    method: "GET",
  });

  const getAllProjects = async () => {
    const projects = await call({
      errorMessage: ({ error }) => {
        console.log(error);
        return `Error al obtener proyectos. ${error?.message || error}`;
      },
    });

    if (!projects) return;
  };

  useEffect(() => {
    getAllProjects();
  }, []);

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
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.isArray(data) && data.map((project) => <></>)}
      </div>
    </div>
  );
};
