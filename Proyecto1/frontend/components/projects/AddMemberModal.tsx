import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  user,
} from "@nextui-org/react";
import { Member } from "./ProjectProfile";
import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import { useApi } from "@/hooks/useApi";

type AddMemberModalProps = {
  projectId: string;
  members: Member[];
  onGetMembers: () => void;
} & Omit<ModalProps, "children">;

export const AddMemberModal = ({
  projectId,
  members,
  onGetMembers,
  ...modalProps
}: AddMemberModalProps) => {
  const searchApi = useApi<{ user_id: string; status: number }>({
    endpointPath: "user/getIdByUsername",
    method: "GET",
  });

  const addApi = useApi<{ user_id: string; role_id: string }>({
    endpointPath: "project/projects",
    method: "POST",
  });

  const [role, setRole] = useState("2");
  const [searchUsername, setSearchUsername] = useState("");
  const [validUser, setValidUser] = useState<{
    username: string;
    id: string;
  } | null>(null);

  const onSearchUser = async () => {
    if (!searchUsername) return;
    const res = await searchApi.call({
      resourceId: searchUsername,
      errorMessage({ data, error }) {
        return "No se encontró el usuario.";
      },
      successMessage({ data, error }) {
        return "Usuario encontrado.";
      },
    });
    if (res?.status != 200) return setValidUser(null);
    setValidUser({ username: searchUsername, id: res.user_id });
  };

  const onAddMember = async () => {
    if (!validUser) return;
    await addApi.call({
      body: {
        user_id: validUser.id,
        role_id: role,
      },
      resourceId: `${projectId}/members`,
      errorMessage({ data, error }) {
        return "No se pudo agregar al usuario.";
      },
      successMessage({ data, error }) {
        onGetMembers();
        return "Usuario agregado.";
      },
    });
  };

  return (
    <Modal {...modalProps}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">Miembros</h2>
              <div className="flex w-full gap-x-2 mb-4">
                <Input
                  label="Buscar usuario"
                  placeholder="usuario@usuario.com"
                  value={searchUsername}
                  className="w-full"
                  onChange={(e) => setSearchUsername(e.target.value)}
                />
                <Button
                  color="primary"
                  className="text-white"
                  onClick={() => onSearchUser()}
                  size="sm"
                >
                  <MdSearch />
                </Button>
              </div>
              {validUser && (
                <div className="flex w-full gap-x-2 mb-4 ">
                  <Input
                    label="Usuario"
                    value={validUser.username}
                    readOnly
                    className="w-full"
                  />
                  <Select
                    selectedKeys={[role]}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <SelectItem key="2" value="2">
                      Colaborador
                    </SelectItem>
                    <SelectItem key="3" value="3">
                      Solo lectura
                    </SelectItem>
                  </Select>
                  <Button
                    color="success"
                    className="text-white"
                    onClick={() => onAddMember()}
                    size="sm"
                  >
                    <MdAdd />
                  </Button>
                </div>
              )}
              <Table aria-label="Example table with dynamic content">
                <TableHeader
                  columns={[
                    { key: "username", label: "Username" },
                    { key: "role_name", label: "Role" },
                  ]}
                >
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={members}>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ModalHeader>
            <ModalBody className="mx-3"></ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
