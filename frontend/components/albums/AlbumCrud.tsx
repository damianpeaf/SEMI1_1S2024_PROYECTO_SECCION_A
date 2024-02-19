"use client";
import { Button, Card, CardBody } from "@nextui-org/react";
import { IoAdd } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { Table } from "../ui/Table";
import { useState } from "react";
import { AlbumModal } from "./AlbumModal";
import { Album } from "@/types/Album";

const albumsData = [
  {
    id: 1,
    name: "Album 1",
  },
  {
    id: 2,
    name: "Album 2",
  },
  {
    id: 3,
    name: "Album 3",
  },
];

export const AlbumCrud = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<null | Album>(null);

  const handleDelete = (album: any) => {};
  return (
    <>
      <AlbumModal
        isOpen={isOpen}
        scrollBehavior="outside"
        album={selectedAlbum}
        // onOpenChange={onOpenChange}
        // onAction={getAlbums}
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
                formatter: (album) => album.name,
              },
              {
                title: "Acciones",
                formatter: (album) => (
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
