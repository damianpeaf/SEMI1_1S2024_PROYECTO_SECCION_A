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
    profileImage: z
      .any()
      .refine((val) => val?.length > 0, "Imagen de perfil requerida"),
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
    console.log({
      data,
    });
    // username, name, password, image as MultiPart
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("name", data.name);
    formData.append("password", data.password);
    formData.append("image", data.profileImage[0]);

    const resp = await registerApi.call({
      body: formData,
      formData: true,
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
      <ImageInput
        {...register("profileImage")}
        errorMessage={errors.profileImage?.message?.toString() || ""}
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
