"use client";
import { Card, CardBody, Progress, Tab, Tabs } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { ImageGrid } from "./GalleryGrid";
import { useApi } from "@/hooks/useApi";
import { ApiResponse } from "@/types/Api";
import { Albums, GetAlbumResponseT } from "../albums/AlbumCrud";

export const ImageGallery = () => {
  const [albumsData, setAlbumsData] = useState<
    {
      id: number;
      title: string;
      images: {
        url: string;
        name: string;
      }[];
    }[]
  >([]);

  const albumApi = useApi<ApiResponse<GetAlbumResponseT>>({
    endpointPath: "album",
    method: "GET",
  });

  const getAlbums = async () => {
    const resp = await albumApi.call();
    if (!resp) return;
    setAlbumsData(
      resp?.data?.albums.map((album: Albums) => ({
        id: album.id,
        title: album.name,
        images: album.images.map((image) => ({
          name: image.name,
          url: image.url,
        })),
      })) || []
    );
  };
  useEffect(() => {
    getAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (albumApi.loading)
    return (
      <div className="flex w-full flex-col min-h-screen">
        <Progress isIndeterminate />
      </div>
    );

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" color="primary" variant="bordered">
        {albumsData.map((album) => (
          <Tab
            key={album.id}
            title={
              <div className="flex items-center space-x-2">
                <span>{album.title}</span>
              </div>
            }
          >
            <Card>
              <CardBody>
                <ImageGrid images={album.images} />
              </CardBody>
            </Card>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};
