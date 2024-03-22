import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { Album } from "@/types/Album";
import { useApi } from "@/hooks/useApi";
import { AlbumForm, TAlbumFormState } from "./AlbumForm";

export type AlbumModalProps = {
  album: Album | null;
  isReadOnly?: boolean;
  onAction?: () => void;
} & Omit<ModalProps, "children">;

export const AlbumModal = ({
  album,
  isReadOnly,
  onAction,
  ...modalProps
}: AlbumModalProps) => {
  let albumModalTitle = album ? "Editar" : "Crear";

  const endpointPath = album ? `album/${album.id}` : "album";

  const { call: performAction } = useApi({
    endpointPath,
    method: album ? "PUT" : "POST",
  });

  const onSubmit = async (data: TAlbumFormState) => {
    const resp = await performAction({
      body: data,
      errorMessage: `No se pudo ${album ? "actualizar" : "crear"} el album`,
      successMessage: `Album ${album ? "actualizado" : "creado"} correctamente`,
    });
    if (!resp) return;
    if (onAction) onAction();
    if (modalProps.onClose) modalProps.onClose();
  };

  return (
    <Modal {...modalProps}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">{albumModalTitle} Album</h2>
            </ModalHeader>
            <ModalBody className="mx-3">
              <AlbumForm
                album={album}
                onCancel={modalProps.onClose}
                onSubmit={onSubmit}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
