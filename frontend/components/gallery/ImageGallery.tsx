"use client";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import React from "react";
import { ImageGrid } from "./GalleryGrid";

const albums = [
  {
    id: 1,
    title: "Fotos de perfil",
    images: [
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg",
    ],
  },
  {
    id: 2,
    title: "Album 1",
    images: [
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
      "https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg",
    ],
  },
];
export const ImageGallery = () => {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options" color="primary" variant="bordered">
        {albums.map((album) => (
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
