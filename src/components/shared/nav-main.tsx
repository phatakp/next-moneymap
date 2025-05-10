"use client";

import { ChevronRight } from "lucide-react";

import Icon from "@/components/shared/icon";
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

export function NavMain({ onClick }: { onClick: () => void }) {
  const pathname = usePathname();
  const items = NAV_LINKS.map((link) => {
    const url = `/${link}`;
    return {
      title: link,
      url,
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
                onClick={onClick}
                tooltip={capitalize(item.title)}
                className={cn(
                  item.isActive &&
                    "bg-primary-gradient text-primary-foreground",
                )}
              >
                <Link href={item.url}>
                  <Icon name={item.title} className="size-6" />
                  <span className="text-xl capitalize md:text-lg">
                    {item.title}
                  </span>
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
                            onClick={onClick}
                            className={cn(
                              "py-4",
                              subItem.isActive &&
                                "bg-primary-gradient text-primary-foreground",
                            )}
                          >
                            <Link href={subItem.url}>
                              <span className="text-lg md:text-base">
                                {subItem.title}
                              </span>
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
