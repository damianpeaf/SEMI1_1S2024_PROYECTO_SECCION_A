"use client";
import { Avatar } from "@nextui-org/react";
import React, { useState } from "react";
import { CameraIcon } from "../svgs/CameraIcon";
import { Control, Controller } from "react-hook-form";

interface ImageInputProps {
  control: Control<any>;
  name: string;
}

export const ImageInput = ({ control, name }: ImageInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  return (
    <>
      <button
        className="flex gap-4 items-center cursor-pointer"
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <p>{!!selectedFile ? selectedFile.name : "Subir imagen"}</p>
        <Avatar
          isBordered
          showFallback
          src={selectedFile ? URL.createObjectURL(selectedFile) : undefined}
          size="lg"
          fallback={
            <CameraIcon
              className="animate-pulse w-6 h-6 text-default-500"
              fill="currentColor"
            />
          }
        />
      </button>
      {/* hidden file input */}
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field: { onChange, ...otherProps } }) => (
          <input
            {...otherProps}
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
                onChange(e);
              }
            }}
          />
        )}
      />
    </>
  );
};
