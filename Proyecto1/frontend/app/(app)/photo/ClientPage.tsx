"use client";
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";

export const ClientPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return (
    <article className="flex-grow flex flex-col sm:flex-row gap-4 mx-4 md:mx-8 mt-6">
      <div className="flex justify-center sm:justify-start items-start">
        <Card className="py-4 max-w-[300px]">
          <CardHeader className="py-2 px-4">
            <h4 className="font-bold text-large w-full text-center">
              Información de usuario
            </h4>
          </CardHeader>
          <CardBody className="overflow-visible py-2 flex flex-col gap-y-5">
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src={"https://source.unsplash.com/random"}
              width={270}
            />
          </CardBody>
        </Card>
      </div>
      <div className="flex justify-center items-start flex-grow flex-col gap-4">
        <Card className="py-4 w-full h-full mb-4">
          <CardBody>
            <h4 className="text-lg font-medium text-center">Información</h4>
          </CardBody>
        </Card>
      </div>
    </article>
  );
};
