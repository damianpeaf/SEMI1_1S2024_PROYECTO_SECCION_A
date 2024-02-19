import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { Album } from "@/types/Album";
import { useApi } from "@/hooks/useApi";
import { AlbumForm } from "./AlbumForm";

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
  const endpointPath = album ? `album/update/${album.id}` : "album/publish";

  const { call: performAction } = useApi({
    endpointPath,
    method: "POST",
  });

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
                onAction={onAction}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
