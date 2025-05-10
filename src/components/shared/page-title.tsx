"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/badge";

export default function PageTitle() {
  const [user] = api.users.me.useSuspenseQuery();
  const path = usePathname();
  const page = path.slice(1);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="">
              <BreadcrumbLink href={path}>
                <Badge className="capitalize">{page}</Badge>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-base">
                {user?.firstName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* <h3 className="title text-2xl capitalize">{page}</h3> */}
      </div>
    </header>
  );
}
