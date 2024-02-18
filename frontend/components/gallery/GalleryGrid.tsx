"use client";
import { Image, image } from "@nextui-org/react";

interface ImageGridProps {
  images: string[];
}

export const ImageGrid = ({ images }: ImageGridProps) => {
  return (
    <div className="columns-1 gap-5 sm:columns-2 sm:gap-8 md:columns-3 lg:columns-4 [&>img:not(:first-child)]:mt-8">
      {images.map((image, index) => (
        <Image key={index} className="rounded-lg my-2" src={image} alt="" />
      ))}
    </div>
  );
};
