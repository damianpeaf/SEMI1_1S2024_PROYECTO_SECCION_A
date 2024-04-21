import React from "react";
import { Sidebar } from "./sidebar.styles";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";

import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "../layout/layout-context";
import { usePathname } from "next/navigation";
import { GoProject } from "react-icons/go";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Inicio"
              icon={<HomeIcon />}
              isActive={pathname === "/dashboard"}
              href="/dashboard"
            />
            <SidebarMenu title="Proyectos">
              <SidebarItem
                isActive={pathname === "/create-project"}
                title="Crear Proyecto"
                icon={<GoProject />}
                href="/create-project"
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
