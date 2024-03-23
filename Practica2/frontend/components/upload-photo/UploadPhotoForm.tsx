"use client";
import { Button, Card, CardBody, Progress } from "@nextui-org/react";
import { ImageInput } from "../forms/ImageInput";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { Albums, GetAlbumResponseT } from "../albums/AlbumCrud";
import { ApiResponse } from "@/types/Api";
import { Input } from "../forms/Input";

export const UploadImageSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre de la imagen es muy corto, mínimo 2 caracteres",
  }),
  image: z.any().refine((val) => val?.length > 0, "Imagen de perfil requerida"),
  description: z.string().min(2, { message: "La descripción es muy corta" }),
});
type TUploadImageSchema = z.infer<typeof UploadImageSchema>;

interface ProfileFormProps {
  editable?: boolean;
}

export const UploadPhotoForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TUploadImageSchema>({
    resolver: zodResolver(UploadImageSchema),
  });
  const [albumsData, setAlbumsData] = useState<Albums[]>([]);

  const albumApi = useApi<ApiResponse<GetAlbumResponseT>>({
    endpointPath: "album",
    method: "GET",
  });

  const uploadApi = useApi<ApiResponse<{}>>({
    endpointPath: "photo",
    method: "POST",
  });

  const getAlbums = async () => {
    const resp = await albumApi.call();
    if (!resp) return;
    setAlbumsData(resp?.data?.albums || []);
  };

  const onSubmit: SubmitHandler<TUploadImageSchema> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("image", data.image[0]);

    const resp = await uploadApi.call({
      body: formData,
      formData: true,
      errorMessage: ({ error }) =>
        `Error al cargar la imagen: ${error?.message || "Error desconocido"}`,
      successMessage: "Imagen cargada correctamente",
    });

    if (resp) reset();
  };

  useEffect(() => {
    getAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-col justify-center items-center">
      {(albumApi.loading || uploadApi.loading) && (
        <Progress isIndeterminate className="mb-4 w-1/2" />
      )}
      <Card className="py-4 w-full max-w-[28rem]">
        <CardBody>
          <form
            className="flex flex-col gap-y-4 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="Nombre de la imagen"
              variant="bordered"
              placeholder="jhondoe"
              isInvalid={!!errors.name}
              errorMessage={<>{errors.name?.message}</>}
              control={control}
              name="name"
            />
            <Input
              label="Descripción"
              variant="bordered"
              placeholder="..."
              isInvalid={!!errors.description}
              errorMessage={<>{errors.description?.message}</>}
              control={control}
              name="description"
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
    </div>
  );
};
