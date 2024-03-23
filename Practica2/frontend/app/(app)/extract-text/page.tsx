import { ExtractTextForm } from "@/components/extract-text/ExtractTextForm";

export default function UploadPhoto() {
  return (
    <article className="flex flex-col flex-grow mx-4">
      <div className="flex justify-center items-center flex-grow">
        <ExtractTextForm />
      </div>
    </article>
  );
}
