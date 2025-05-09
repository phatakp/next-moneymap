import AppSidebar from "@/components/shared/app-sidebar";
import PageTitle from "@/components/shared/page-title";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { api, HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  void api.users.me.prefetch();
  const headerList = await headers();
  const url = headerList.get("x-url");
  const path = url?.split("/").at(-1);

  return (
    <SidebarProvider>
      <HydrateClient>
        <AppSidebar />
      </HydrateClient>
      <SidebarInset>
        {!!path && path !== "profile" && <PageTitle />}
        <main className="px-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
