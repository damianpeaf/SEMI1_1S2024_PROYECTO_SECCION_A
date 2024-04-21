"use client";

import { Button, Input } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { PasswordInput } from "@/components/forms/PasswordInput";
import { useApi } from "@/hooks/useApi";
import { ImageInput } from "../forms/ImageInput";

export const RegisterSchema = z
  .object({
    username: z.string().min(4, {
      message: "El nombre de usuario debe tener al menos 4 carácteres",
    }),
    name: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 carácteres" }),
    password: z
      .string()
      .min(4, { message: "La contraseña debe tener al menos 4 carácteres" }),
    confirmPassword: z
      .string()
      .min(4, { message: "La contraseña debe tener al menos 4 carácteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type TRegisterSchema = z.infer<typeof RegisterSchema>;

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
  });

  const registerApi = useApi({
    endpointPath: "auth/register",
    method: "POST",
  });

  const onSubmit: SubmitHandler<TRegisterSchema> = async (data) => {
    const resp = await registerApi.call({
      body: {
        username: data.username,
        name: data.name,
        password: data.password,
      },
      successMessage: "Usuario registrado exitosamente",
      errorMessage: ({ error }) => {
        return `Error al registrar usuario. ${error.message}`;
      },
    });
    if (!resp) return;
    reset();
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
      <Input
        label="Name"
        variant="bordered"
        placeholder="Jhon Doe"
        isInvalid={!!errors.name}
        errorMessage={<>{errors.name?.message}</>}
        {...register("name")}
      />
      <PasswordInput
        label="Password"
        placeholder="********"
        variant="bordered"
        isInvalid={!!errors.password}
        errorMessage={<>{errors.password?.message}</>}
        control={control}
        name="password"
      />
      <PasswordInput
        label="Confirm Password"
        placeholder="********"
        variant="bordered"
        isInvalid={!!errors.confirmPassword}
        errorMessage={<>{errors.confirmPassword?.message}</>}
        control={control}
        name="confirmPassword"
      />
      <Button
        color="primary"
        className="w-full text-center font-medium text-lg"
        type="submit"
      >
        Registrarse
      </Button>
    </form>
  );
};
