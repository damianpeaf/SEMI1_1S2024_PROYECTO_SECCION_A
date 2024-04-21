"use client";

import { Button, Input, Textarea } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { SubmitHandler, useForm } from "react-hook-form";

const LoginSchema = z.object({
  name: z.string().min(4, {
    message: "El nombre del proyecto debe tener al menos 4 carácteres",
  }),
  description: z.string().min(4, {
    message: "La descripción del proyecto debe tener al menos 4 carácteres",
  }),
  category: z.string().min(4, {
    message: "La categoría del proyecto debe tener al menos 4 carácteres",
  }),
  location: z.string().min(4, {
    message: "La ubicación del proyecto debe tener al menos 4 carácteres",
  }),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;

interface ProjectFormProps {
  onSubmit: (params: { data: TLoginSchema; reset: () => void }) => void;
  actionButtonText?: string;
}

export const ProjectForm = ({
  onSubmit: outerSubmit,
  actionButtonText,
}: ProjectFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<TLoginSchema> = async (data: TLoginSchema) => {
    outerSubmit({ data, reset });
  };

  return (
    <form
      className="flex flex-col items-center justify-center w-5/6 md:max-w-[28rem] gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Nombre"
        variant="bordered"
        placeholder="jhondoe"
        isInvalid={!!errors.name}
        errorMessage={<>{errors.name?.message}</>}
        {...register("name")}
      />
      <Textarea
        label="Descripción"
        variant="bordered"
        placeholder="jhondoe"
        isInvalid={!!errors.description}
        errorMessage={<>{errors.description?.message}</>}
        {...register("description")}
      />
      <Input
        label="Categoría"
        variant="bordered"
        placeholder="jhondoe"
        isInvalid={!!errors.category}
        errorMessage={<>{errors.category?.message}</>}
        {...register("category")}
      />
      <Input
        label="Ubicación"
        variant="bordered"
        placeholder="jhondoe"
        isInvalid={!!errors.location}
        errorMessage={<>{errors.location?.message}</>}
        {...register("location")}
      />
      <div className="w-full flex justify-end">
        <Button color="primary" type="submit">
          {actionButtonText || "Crear Proyecto"}
        </Button>
      </div>
    </form>
  );
};
