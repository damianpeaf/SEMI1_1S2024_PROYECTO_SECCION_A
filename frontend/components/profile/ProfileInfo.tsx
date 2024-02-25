"use client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardBody, CardHeader, Image, Input } from "@nextui-org/react";

interface ProfileInfoProps {}

export const ProfileInfo = ({}: ProfileInfoProps) => {
  const { auth } = useAuth();

  return (
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
          src={auth?.user.photoUrl}
          width={270}
        />
        <Input
          label="Username"
          variant="bordered"
          readOnly
          value={auth?.user.username}
        />
        <Input
          label="Name"
          variant="bordered"
          readOnly
          value={auth?.user.name}
        />
      </CardBody>
    </Card>
  );
};
