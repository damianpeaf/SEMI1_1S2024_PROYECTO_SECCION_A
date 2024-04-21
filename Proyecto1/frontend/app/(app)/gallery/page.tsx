import { ImageGallery } from "@/components/gallery/ImageGallery";

export default function Gallery() {
  return (
    <article className="flex-grow mx-4">
      <h2 className="text-2xl font-bold text-center text-white py-4">
        Galería de imágenes
      </h2>
      <div className="flex justify-center items-center flex-grow">
        <ImageGallery />
      </div>
    </article>
  );
}
