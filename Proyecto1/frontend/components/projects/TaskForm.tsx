"use client";

import {
  Button,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../forms/Input";
import { ImageInput } from "../forms/ImageInput";
import { useState } from "react";
import { BsTranslate } from "react-icons/bs";
import axios from "axios";
import { toast } from "sonner";
import { MdAudioFile } from "react-icons/md";
import { GiAudioCassette } from "react-icons/gi";
import { BiVolume } from "react-icons/bi";
import { baseUrl, useApi } from "../../hooks/useApi";

const TaskSchema = z.object({
  state: z.string().min(4, {
    message: "El estado del proyecto debe tener al menos 4 carácteres",
  }),
  notes: z.string().min(4, {
    message: "Las tarea del proyecto deben tener al menos 4 carácteres",
  }),
  image: z.any().optional(),
});

export type TTaskForm = z.infer<typeof TaskSchema>;
const langOptions = [
  {
    key: "en",
    value: "en",
    label: "Inglés",
  },
  {
    key: "es",
    value: "es",
    label: "Español",
  },
  {
    key: "fr",
    value: "fr",
    label: "Francés",
  },
];

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
    getValues,
  } = useForm<TTaskForm>({
    resolver: zodResolver(TaskSchema),
    values: initialValues,
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<TTaskForm> = async (data: TTaskForm) => {
    outerSubmit({ data, reset });
  };
  const [langs, setLangs] = useState("en");
  const [translation, setTranslation] = useState("");
  const [loadFromImage, setLoadFromImage] = useState(false);
  const [ocrImage, setOcrImage] = useState<any>(null);

  const onTranslateNotes = async () => {
    const notes = getValues("notes");
    if (!notes) return toast.error("No hay tarea para traducir");

    try {
      const response = await fetch(
        `https://zkf0k1bio0.execute-api.us-east-1.amazonaws.com/api/translate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: notes,
            target_language: langs,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.translated_text) {
          setTranslation(data.translated_text);
          return toast.success("Tarea traducidas correctamente");
        }
      } else {
        throw new Error("Error al traducir las tarea");
      }
    } catch (error) {
      console.error(error);
      return toast.error("Ocurrió un error al traducir las tarea");
    }
  };

  const onTtsNotes = async () => {
    const notes = getValues("notes");
    if (!notes) return toast.error("No hay tarea para traducir");

    try {
      const url = `${baseUrl}/tts`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al obtener el audio");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audioElement = new Audio(audioUrl);
      audioElement.play();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al reproducir el audio");
    }
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
      <Switch isSelected={loadFromImage} onValueChange={setLoadFromImage}>
        Cargar desde imagen
      </Switch>
      {loadFromImage && (
        <div className="w-full flex gap-x-2 justify-center items-center">
          <ImageInput
            onChange={(e) => {
              console.log(e);
              const file = e?.target?.files?.[0] || null;
              setOcrImage(file);
            }}
          />
          <Button
            color="success"
            size="sm"
            className="text-white"
            onClick={async () => {
              if (!ocrImage) return toast.error("No hay imagen para cargar");
              // send it as base64
              const reader = new FileReader();
              reader.readAsDataURL(ocrImage);
              reader.onloadend = async function () {
                const base64data = reader.result?.toString();
                if (!base64data)
                  return toast.error("Error al cargar la imagen");

                // remove the prefix
                const base64dataClean = base64data.split(",")[1];
                try {
                  const response = await axios.post(
                    "https://zkf0k1bio0.execute-api.us-east-1.amazonaws.com/api/ocr",
                    {
                      image: base64dataClean,
                    }
                  );
                  if (response.data && response.data.detected_text) {
                    reset({
                      ...initialValues,
                      notes: response.data.detected_text,
                    });
                    return toast.success("Tarea cargadas correctamente");
                  }
                } catch (error) {
                  console.error(error);
                  return toast.error("Error al cargar las tarea");
                }
              };
            }}
          >
            Cargar tarea
          </Button>
        </div>
      )}
      <div className="w-full flex gap-x-2 justify-center items-center">
        <Input
          label="Tarea"
          variant="bordered"
          placeholder="jhondoe"
          isInvalid={!!errors.notes}
          errorMessage={<>{errors.notes?.message}</>}
          name="notes"
          control={control}
        />
        <Button
          color="success"
          size="sm"
          className="text-white"
          onClick={() => onTtsNotes()}
        >
          <BiVolume />
        </Button>
      </div>
      <>
        <div className="w-full flex gap-x-2 justify-center items-center">
          <Select
            selectedKeys={[langs]}
            label="Traducir tarea"
            variant="bordered"
            placeholder="Seleccionar"
          >
            {langOptions.map((lang) => (
              <SelectItem
                key={lang.key}
                value={lang.value}
                onClick={() => setLangs(lang.value)}
              >
                {lang.label}
              </SelectItem>
            ))}
          </Select>
          <Button
            color="success"
            size="sm"
            className="text-white"
            onClick={() => onTranslateNotes()}
          >
            <BsTranslate />
          </Button>
        </div>
        {translation && (
          <Textarea
            label="Tarea traducidas"
            variant="bordered"
            placeholder="traducción"
            value={translation}
            readOnly
          />
        )}
      </>
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
