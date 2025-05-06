"use client";

import {
  ChartPieIcon,
  ChevronRight,
  ClipboardTypeIcon,
  LandmarkIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ACCT_TYPES, NAV_LINKS } from "@/lib/constants";
import { capitalize, cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icons: Record<string, LucideIcon> = {
  dashboard: ChartPieIcon,
  accounts: LandmarkIcon,
  transactions: ClipboardTypeIcon,
  groups: UsersIcon,
};
export function NavMain() {
  const pathname = usePathname();
  const items = NAV_LINKS.map((link) => {
    const url = `/${link}`;
    return {
      title: link,
      url,
      icon: icons[link]!,
      isActive: url === pathname,
      items:
        link === "accounts"
          ? ACCT_TYPES.map((t) => ({
              title: t,
              url: `/accounts/${t}`,
              isActive: pathname === `/accounts/${t}`,
            }))
          : undefined,
    };
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Links</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={item.isActive || pathname.includes("accounts")}
            defaultOpen={item.isActive || pathname.includes("accounts")}
            className="my-2"
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={capitalize(item.title)}
                className={cn(
                  item.isActive && "bg-primary text-primary-foreground",
                )}
              >
                <Link href={item.url}>
                  <item.icon className="size-6" />
                  <span className="text-lg capitalize">{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              subItem.isActive &&
                                "bg-primary text-primary-foreground",
                            )}
                          >
                            <Link href={subItem.url}>
                              <span className="text-base">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
