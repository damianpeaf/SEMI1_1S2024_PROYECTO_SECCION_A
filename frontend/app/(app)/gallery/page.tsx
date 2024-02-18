import { ImageGallery } from "@/components/gallery/ImageGallery";

export default function Gallery() {
  return (
    <article className="flex-grow-0 mx-4">
      <h2 className="text-3xl font-bold text-center text-white py-4">
        Galería de imágenes
      </h2>
      <ImageGallery />
    </article>
  );
}
