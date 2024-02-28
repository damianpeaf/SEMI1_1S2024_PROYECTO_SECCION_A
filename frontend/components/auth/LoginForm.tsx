"use client";

import { Button, Input } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { PasswordInput } from "@/components/forms/PasswordInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { useApi } from "@/hooks/useApi";
import { FullUser } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { ApiResponse } from "@/types/Api";

const LoginSchema = z.object({
  username: z.string().min(4, {
    message: "El nombre de usuario debe tener al menos 4 carácteres",
  }),
  password: z
    .string()
    .min(4, { message: "La contraseña debe tener al menos 4 carácteres" }),
});

type TLoginSchema = z.infer<typeof LoginSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const { login } = useAuth();

  const { call: postLogin } = useApi<
    ApiResponse<{
      userid: string;
      name: string;
      username: string;
      image: string;
      jwt: string;
    }>
  >({
    endpointPath: "auth/login",
    method: "POST",
  });

  const onSubmit: SubmitHandler<TLoginSchema> = async (data: TLoginSchema) => {
    const userInformation = await postLogin({
      body: data,
      errorMessage: ({ error }) => {
        console.log(error);
        return `Error al iniciar sesión. ${error?.message || error}`;
      },
    });

    if (!userInformation) return;
    reset();

    const { jwt, userid, name, username, image } = userInformation.data;

    login(jwt, {
      id: +userid,
      name,
      username,
      photoUrl: image,
      password: "",
    });
  };

  return (
    <form
      className="flex flex-col items-center justify-center w-5/6 md:max-w-[28rem] gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Username"
        variant="bordered"
        placeholder="jhondoe"
        isInvalid={!!errors.username}
        errorMessage={<>{errors.username?.message}</>}
        {...register("username")}
      />

      <PasswordInput
        label="Password"
        placeholder="********"
        variant="bordered"
        isInvalid={!!errors.password}
        errorMessage={<>{errors.password?.message}</>}
        {...register("password")}
      />

      <Button
        color="primary"
        type="submit"
        className="w-full text-center font-medium text-lg"
      >
        Login
      </Button>
    </form>
  );
};
