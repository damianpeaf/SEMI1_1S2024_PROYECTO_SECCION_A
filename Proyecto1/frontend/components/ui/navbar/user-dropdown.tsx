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
import { BiUser } from "react-icons/bi";

export const UserDropdown = () => {
  const { logout } = useAuth();

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar as="button" color="default" size="md">
            <BiUser />
          </Avatar>
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label="User menu actions">
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
