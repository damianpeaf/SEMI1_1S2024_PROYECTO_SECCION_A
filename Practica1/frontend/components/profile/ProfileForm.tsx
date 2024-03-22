"use client";
import { Card, Button, CardBody, CardHeader } from "@nextui-org/react";
import { PasswordInput } from "../forms/PasswordInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApi } from "@/hooks/useApi";
import { ImageInput } from "../forms/ImageInput";
import { Input } from "../forms/Input";
import { useAuth } from "@/hooks/useAuth";

export const RegisterSchema = z
  .object({
    username: z.string().min(4, {
      message: "El nombre de usuario debe tener al menos 4 caracteres",
    }),
    name: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    profileImage: z.any(),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password.length >= 4;
      }
      return true; // Si no se proporciona contraseña, siempre se cumple la validación
    },
    {
      message: "La contraseña debe tener al menos 4 caracteres",
      path: ["password"],
    }
  )
  .refine(
    (data) =>
      !data.password ||
      !data.confirmPassword ||
      data.password === data.confirmPassword,
    {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }
  );

type TRegisterSchema = z.infer<typeof RegisterSchema>;

interface ProfileFormProps {
  editable?: boolean;
}

export const ProfileForm = ({ editable = true }: ProfileFormProps) => {
  const { auth, userInfoChanged } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: auth?.user.username,
      name: auth?.user.name,
    },
  });

  const updateInfoApí = useApi({
    endpointPath: "user/info",
    method: "PUT",
  });

  const onSubmit: SubmitHandler<TRegisterSchema> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    if (data.password) formData.append("password", data.password);
    if (data.profileImage[0]) formData.append("image", data.profileImage[0]);

    const resp = await updateInfoApí.call({
      body: formData,
      formData: true,
      errorMessage: ({ error }) =>
        `Error al actualizar la información. ${error?.message || error}`,
      successMessage: "Información actualizada exitosamente",
    });
    if (!resp) return;
    userInfoChanged();
  };
  return (
    <Card className="py-4 w-full max-w-[28rem]">
      <CardHeader className="py-2 px-4">
        <h4 className="font-bold text-large w-full text-center">
          Editar Perfil
        </h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2 flex flex-col gap-y-5">
        <form
          className="flex flex-col gap-y-4 w-full "
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Username"
            variant="bordered"
            placeholder="jhondoe"
            isInvalid={!!errors.username}
            errorMessage={<>{errors.username?.message}</>}
            control={control}
            name="username"
            disabled
          />
          <Input
            label="Name"
            variant="bordered"
            placeholder="Jhon Doe"
            isInvalid={!!errors.name}
            errorMessage={<>{errors.name?.message}</>}
            control={control}
            name="name"
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
            Guardar
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
