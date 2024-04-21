import { useAuth } from "@/hooks/useAuth";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
} from "@nextui-org/react";
import React from "react";

export const UserDropdown = () => {
  const { logout } = useAuth();

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        >
          <p>Inicio de sesión como: </p>
          <p>damianpeaf@gmail.com</p>
        </DropdownItem>
        <DropdownItem key="settings">Ajustes</DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger "
          onClick={logout}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
