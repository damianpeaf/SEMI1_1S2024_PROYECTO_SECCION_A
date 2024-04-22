import { useApi } from "@/hooks/useApi";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { MdAdd, MdEdit } from "react-icons/md";
import { MiniLoader } from "../routes/Loader";
import { TaskI } from "@/types/Project";
import { TaskForm } from "./TaskForm";
import { IoMdTrash } from "react-icons/io";

interface ProjectNotesI {
  projectId: string;
}

export interface GetTasksReponseI {
  tasks: any[];
  message: string;
  status: number;
}

export const ProjectNotes = ({ projectId }: ProjectNotesI) => {
  const getApi = useApi<GetTasksReponseI>({
    endpointPath: "task/tasks",
    method: "GET",
  });
  const [modalInfo, setModalInfo] = useState({
    task: null as TaskI | null,
    isOpen: false,
    projectId,
  });

  const getTasks = async () => {
    if (!projectId) return;
    const res = await getApi.call({
      params: {
        project_id: projectId,
      },
    });
  };

  useEffect(() => {
    getTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tasks = (getApi.data?.tasks || []) as any[];

  if (!projectId) return null;
  return (
    <div className="my-10 w-full flex flex-col items-center px-4">
      <div className="w-full flex justify-between">
        <h2 className="text-2xl font-bold mb-5">Tareas</h2>
        <Button
          color="primary"
          className="text-white text-xl"
          size="sm"
          onClick={() =>
            setModalInfo((prev) => ({ ...prev, isOpen: true, task: null }))
          }
        >
          <MdAdd />
        </Button>
      </div>
      <TaskModal
        {...modalInfo}
        onAction={() => getTasks()}
        onClose={() => {
          setModalInfo((prev) => ({ ...prev, isOpen: false, task: null }));
        }}
      />
      {getApi.loading && <MiniLoader />}
      {tasks.length === 0 && (
        <h5 className="text-lg font-semibold text-gray-500">
          No hay tareas en este proyecto
        </h5>
      )}
      <div className="w-full flex flex-col gap-y-5">
        {tasks.map((task) => (
          <Card key={task.id} className="w-full" shadow="sm">
            <CardBody>
              <div className="flex justify-between items-center gap-x-2">
                <p className="text-lg flex-grow ">{task.notes}</p>
                <Chip color="secondary" className="text-white">
                  {task.state}
                </Chip>
                <Button
                  color="warning"
                  size="sm"
                  onClick={() =>
                    setModalInfo((prev) => ({ ...prev, isOpen: true, task }))
                  }
                >
                  <MdEdit />
                </Button>
                <Button color="danger" size="sm" onClick={() => {}}>
                  <IoMdTrash />
                </Button>
              </div>
              <div className="flex justify-center">
                {task.image_url && (
                  <Image
                    src={task.image_url}
                    alt="Task image"
                    className="w-full h-40 object-cover rounded-md mt-5"
                  />
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

type TaslModalProps = {
  task: TaskI | null;
  projectId: string;
  onAction: () => void;
} & Omit<ModalProps, "children">;

const TaskModal = ({
  task,
  projectId,
  onAction,
  ...modalProps
}: TaslModalProps) => {
  const createApi = useApi({ endpointPath: "task/task", method: "POST" });
  const updateApi = useApi({ endpointPath: "task/task", method: "PUT" });

  const handleSubmit = async (
    data: { state: string; notes: string; image?: any },
    reset: () => void,
    onClose: () => void
  ) => {
    const formData = new FormData();
    if (data.image[0]) formData.append("image", data.image[0]);
    formData.append("state", data.state);
    formData.append("notes", data.notes);
    formData.append("project_id", projectId);
    if (task) {
      formData.append("task_id", "" + task.id);
      await updateApi.call({
        body: formData,
        formData: true,
        successMessage({ data, error }) {
          onAction();
          reset();
          return "Tarea actualizada correctamente";
        },
        errorMessage({ data, error }) {
          return "Ocurrió un error al actualizar la tarea";
        },
      });
      return;
    }
    await createApi.call({
      body: formData,
      formData: true,
      successMessage({ data, error }) {
        onAction();
        reset();
        onClose();
        return "Tarea creada correctamente";
      },
      errorMessage({ data, error }) {
        return "Ocurrió un error al crear la tarea";
      },
    });
  };

  return (
    <Modal {...modalProps}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">
                {task ? "Editar" : "Crear"} Tarea
              </h2>
            </ModalHeader>
            <ModalBody className="mx-3">
              <TaskForm
                onSubmit={({ data, reset }) => {
                  handleSubmit(data, reset, onClose);
                }}
                initialValues={task || undefined}
                actionButtonText={task ? "Actualizar" : "Crear"}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
