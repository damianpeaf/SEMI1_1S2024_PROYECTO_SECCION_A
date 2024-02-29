"use client";
import { Button, Card, CardBody } from "@nextui-org/react";
import { IoAdd } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { Table } from "../ui/Table";
import { useEffect, useState } from "react";
import { AlbumModal } from "./AlbumModal";
import { Album } from "@/types/Album";
import { useApi } from "@/hooks/useApi";
import { ApiResponse } from "@/types/Api";

export interface GetAlbumResponseT {
  albums: Albums[];
}

export interface Albums {
  id: number;
  name: string;
  images: Image[];
}

export interface Image {
  id: number;
  name: string;
  url: string;
  album: number;
}

export const AlbumCrud = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<null | Albums>(null);
  const [albumsData, setAlbumsData] = useState<Albums[]>([]);

  const getApi = useApi<ApiResponse<GetAlbumResponseT>>({
    endpointPath: "album",
    method: "GET",
  });

  const deleteApi = useApi({
    endpointPath: "album",
    method: "DELETE",
  });

  const getAlbums = async () => {
    const resp = await getApi.call();
    if (!resp) return;
    setAlbumsData(resp?.data?.albums || []);
  };

  useEffect(() => {
    getAlbums();
  }, []);

  const handleDelete = async (album: Albums) => {
    const resp = await deleteApi.call({
      resourceId: album.id.toString(),
      errorMessage: "No se pudo eliminar el album",
      successMessage: "Album eliminado correctamente",
    });
    if (!resp) return;
    getAlbums();
  };
  return (
    <>
      <AlbumModal
        isOpen={isOpen}
        scrollBehavior="outside"
        album={selectedAlbum}
        onAction={getAlbums}
        onClose={() => setIsOpen(false)}
      />
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50"
        shadow="sm"
      >
        <CardBody>
          <div className="flex justify-end">
            <Button
              startContent={<IoAdd />}
              color="primary"
              className="mb-4"
              onClick={() => {
                setIsOpen(true);
                setSelectedAlbum(null);
              }}
            >
              Añadir Album
            </Button>
          </div>
          <Table
            isStriped
            isHeaderSticky
            isVirtualized
            headers={[
              {
                title: "Nombre",
                formatter: (album: Albums) => album.name,
              },
              {
                title: "Acciones",
                formatter: (album: Albums) => (
                  <div className="flex justify-center gap-x-2">
                    <Button
                      color="warning"
                      isIconOnly
                      onClick={() => {
                        setIsOpen(true);
                        setSelectedAlbum(album);
                      }}
                    >
                      <MdOutlineModeEdit />
                    </Button>
                    <Button
                      color="danger"
                      isIconOnly
                      onClick={() => handleDelete(album)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                ),
              },
            ]}
            items={albumsData}
          />
        </CardBody>
      </Card>
    </>
  );
};
