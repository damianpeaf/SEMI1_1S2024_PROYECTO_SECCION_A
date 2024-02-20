"use client";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";

export const Navbar = () => {
  return (
    <NextUINavbar>
      <NavbarBrand>
        <Link
          href="/dashboard"
          color="foreground"
          className="font-bold text-inherit"
        >
          FAUNADEX
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/gallery" aria-current="page" color="secondary">
            Galería
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/albums" aria-current="page" color="secondary">
            Álbumes
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/upload-photo" aria-current="page" color="secondary">
            Subir foto
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem href="/profile" key="profile">
              Editar perfil
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </NextUINavbar>
  );
};