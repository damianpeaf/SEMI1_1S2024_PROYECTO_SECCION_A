"use client";
import { Button, Card, CardFooter, Image } from "@nextui-org/react";

interface ImageGridProps {
  images: {
    url: string;
    name: string;
  }[];
}

// <Image key={index} className="rounded-lg my-2" src={image.url} alt="" />
export const ImageGrid = ({ images }: ImageGridProps) => {
  return (
    <div className="columns-1 gap-5 sm:columns-2 sm:gap-8 md:columns-3 lg:columns-4 [&>img:not(:first-child)]:mt-8">
      {images.map((image, index) => (
        <Card key={index} isFooterBlurred radius="lg" className="border-none">
          <Image
            key={index}
            className="rounded-lg my-2"
            src={image.url}
            alt=""
          />

          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-0 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-center w-full text-white/80">
              {image.name}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
