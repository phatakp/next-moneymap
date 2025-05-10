"use client";

import * as React from "react";

import { NavMain } from "@/components/shared/nav-main";
import { NavUser } from "@/components/shared/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "./logo";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  const handleClick = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/"
                className={cn("flex items-center")}
                onClick={handleClick}
              >
                <Logo />
                {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Icon name="logo" className="size-6" />
                </div>*/}
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="title text-xl font-semibold">MoneyMap</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain onClick={handleClick} />
      </SidebarContent>
      <SidebarFooter className="py-4">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
