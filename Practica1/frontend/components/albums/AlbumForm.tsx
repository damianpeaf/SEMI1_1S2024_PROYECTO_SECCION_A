import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ModalFooter } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import moment from "moment";

import { Album as AlbumI } from "@/types/Album";
import { Input } from "@/components/forms/Input";

const AlbumSchema = z.object({
  name: z.string().nonempty({ message: "El nombre del libro es requerido" }),
});

export type TAlbumFormState = z.infer<typeof AlbumSchema>;

interface AlbumFormProps {
  album: AlbumI | null;
  onCancel?: () => void;
  onSubmit?: (album: TAlbumFormState) => void;
}

const emptyAlbum: TAlbumFormState = {
  name: "",
};

export const AlbumForm = ({
  album,
  onCancel,
  onSubmit: outerSubmitHanlder,
}: AlbumFormProps) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<TAlbumFormState>({
    resolver: zodResolver(AlbumSchema),
    values: album || emptyAlbum,
    defaultValues: album || emptyAlbum,
  });

  const onSubmit: SubmitHandler<TAlbumFormState> = (data) => {
    if (outerSubmitHanlder) outerSubmitHanlder(data);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-y-4">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nombre"
          labelPlacement="outside"
          isInvalid={!!errors.name}
          errorMessage={<>{errors.name?.message}</>}
          control={control}
          name="name"
        />
        <ModalFooter className="w-full flex justify-between items-center p-0 gap-2 mt-4">
          <Button
            className="w-full"
            color="danger"
            variant="light"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            className="w-full"
            color={!!album?.id ? "warning" : "primary"}
            type="submit"
          >
            {!!album?.id ? "Actualizar" : "Crear"}
          </Button>
        </ModalFooter>
      </form>
    </div>
  );
};
