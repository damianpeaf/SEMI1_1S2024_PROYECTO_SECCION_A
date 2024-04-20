"use client";
import { Card, CardBody } from "@nextui-org/react";

export const Content = () => (
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
  </div>
);
