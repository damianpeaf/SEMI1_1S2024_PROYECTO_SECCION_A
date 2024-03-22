import { UploadPhotoForm } from "@/components/upload-photo/UploadPhotoForm";

export default function UploadPhoto() {
  return (
    <article className="flex flex-col flex-grow mx-4">
      <div className="flex justify-center items-center flex-grow">
        <UploadPhotoForm />
      </div>
    </article>
  );
}
