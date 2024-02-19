"use client";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { ImageInput } from "../forms/ImageInput";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@/components/forms/Select";

export const UploadImageSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre de la imagen es muy corto, mínimo 2 caracteres",
  }),
  image: z.any().refine((val) => val?.length > 0, "Imagen de perfil requerida"),
});
type TUploadImageSchema = z.infer<typeof UploadImageSchema>;

interface ProfileFormProps {
  editable?: boolean;
}

export const UploadPhotoForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TUploadImageSchema>({
    resolver: zodResolver(UploadImageSchema),
  });

  const onSubmit: SubmitHandler<TUploadImageSchema> = async (data) => {
    console.log({
      data,
    });
  };
  return (
    <Card className="py-4 w-full max-w-[28rem]">
      <CardBody>
        <form
          className="flex flex-col gap-y-4 w-full "
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Nombre de la imagen"
            variant="bordered"
            placeholder="jhondoe"
            isInvalid={!!errors.name}
            errorMessage={<>{errors.name?.message}</>}
            {...register("name")}
          />
          <Select
            label="Album"
            variant="bordered"
            placeholder="Selecciona un album"
            options={[
              { value: "1", label: "Album 1", key: "1" },
              { value: "2", label: "Album 2", key: "2" },
              { value: "3", label: "Album 3", key: "3" },
            ]}
          />

          <ImageInput
            {...register("image")}
            errorMessage={errors.image?.message?.toString() || ""}
            preview={{
              className: "w-16 h-16 rounded-md",
            }}
          />
          <Button
            color="primary"
            className="w-full text-center font-medium text-lg"
            type="submit"
          >
            Cargar imagen
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
