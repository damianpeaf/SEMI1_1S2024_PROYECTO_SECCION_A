"use client";

import { Button, Textarea } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../forms/Input";
import { ImageInput } from "../forms/ImageInput";

const TaskSchema = z.object({
  state: z.string().min(4, {
    message: "El estado del proyecto debe tener al menos 4 carácteres",
  }),
  notes: z.string().min(4, {
    message: "Las notas del proyecto deben tener al menos 4 carácteres",
  }),
  image: z.any().optional(),
});

export type TTaskForm = z.infer<typeof TaskSchema>;

interface TaskFormProps {
  onSubmit: (params: { data: TTaskForm; reset: () => void }) => void;
  actionButtonText?: string;
  initialValues?: TTaskForm;
}

export const TaskForm = ({
  onSubmit: outerSubmit,
  actionButtonText,
  initialValues,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<TTaskForm>({
    resolver: zodResolver(TaskSchema),
    values: initialValues,
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<TTaskForm> = async (data: TTaskForm) => {
    outerSubmit({ data, reset });
  };

  return (
    <form
      className="flex flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Estado"
        variant="bordered"
        placeholder="jhondoe"
        isInvalid={!!errors.state}
        errorMessage={<>{errors.state?.message}</>}
        name="state"
        control={control}
      />
      <Input
        label="Notas"
        variant="bordered"
        placeholder="jhondoe"
        isInvalid={!!errors.notes}
        errorMessage={<>{errors.notes?.message}</>}
        name="notes"
        control={control}
      />
      <ImageInput
        {...register("image")}
        errorMessage={errors.image?.message?.toString() || ""}
        preview={{
          className: "w-16 h-16 rounded-md",
        }}
      />
      <div className="w-full flex justify-end">
        <Button color="primary" type="submit">
          {actionButtonText || "Crear Tarea"}
        </Button>
      </div>
    </form>
  );
};
