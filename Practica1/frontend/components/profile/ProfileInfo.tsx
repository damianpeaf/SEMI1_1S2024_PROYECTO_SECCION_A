"use client";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { ApiResponse } from "@/types/Api";
import { Card, CardBody, CardHeader, Image, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface ProfileInfoProps {}

type InfoUserT = {
  userid: number;
  name: string;
  username: string;
  imageUrl: string;
};

export const ProfileInfo = ({}: ProfileInfoProps) => {
  const { auth, _userInfoChanged, login } = useAuth();
  const [userData, setUserData] = useState<InfoUserT>({
    imageUrl: auth?.user.photoUrl || "",
    name: auth?.user.name || "",
    userid: auth?.user.id || 0,
    username: auth?.user.username || "",
  });

  const dataApi = useApi<ApiResponse<InfoUserT>>({
    endpointPath: "user/info",
    method: "GET",
  });

  const getUserInfo = async () => {
    const resp = await dataApi.call();
    if (!resp) return;
    setUserData(resp.data);
    login(auth?.token || "", {
      id: resp.data.userid,
      name: resp.data.name,
      username: resp.data.username,
      photoUrl: resp.data.imageUrl,
      password: "",
    });
  };

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_userInfoChanged]);

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
          src={userData.imageUrl}
          width={270}
        />
        <Input
          label="Username"
          variant="bordered"
          readOnly
          value={userData.username}
        />
        <Input label="Name" variant="bordered" readOnly value={userData.name} />
      </CardBody>
    </Card>
  );
};
