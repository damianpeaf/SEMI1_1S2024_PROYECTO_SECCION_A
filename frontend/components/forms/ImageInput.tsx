"use client";
import { Avatar } from "@nextui-org/react";
import { ReactNode, forwardRef, useRef, useState } from "react";
import { CameraIcon } from "../svgs/CameraIcon";
import { RefCallBack } from "react-hook-form";
interface ImageInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref: RefCallBack;
  errorMessage?: string;
  preview?: {
    size?: "sm" | "md" | "lg";
    className?: string;
  };
}

// eslint-disable-next-line react/display-name
export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  ({ errorMessage, preview, ...restProps }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    return (
      <div className="flex flex-col w-full justify-center items-center">
        <button
          className="flex gap-4 items-center cursor-pointer "
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          <p>{!!selectedFile ? selectedFile.name : "Subir imagen"}</p>
          <Avatar
            isBordered
            showFallback
            src={selectedFile ? URL.createObjectURL(selectedFile) : undefined}
            size={preview?.size || "lg"}
            fallback={
              <CameraIcon
                className="animate-pulse w-6 h-6 text-default-500"
                fill="currentColor"
              />
            }
            color={
              selectedFile ? "primary" : errorMessage ? "danger" : "default"
            }
            className={preview?.className}
          />
        </button>
        <div
          data-slot="helper-wrapper"
          className=" group-data-[has-helper=true]:flex p-1 relative flex-col gap-1.5 w-full"
        >
          <div
            id="react-aria-:R3auukqH4:"
            data-slot="error-message"
            className="text-tiny text-danger"
          >
            {errorMessage}
          </div>
        </div>
        <input
          {...restProps}
          ref={(e) => {
            if (typeof ref === "function") ref(e);
            else if (ref) ref.current = e;
            inputRef.current = e;
          }}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            restProps.onChange?.(e);
            const file = e?.target?.files && e.target.files[0];
            if (file) setSelectedFile(file);
            else setSelectedFile(null);
          }}
        />
      </div>
    );
  }
);
