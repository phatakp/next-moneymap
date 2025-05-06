import AppSidebar from "@/components/shared/app-sidebar";
import PageTitle from "@/components/shared/page-title";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { api, HydrateClient } from "@/trpc/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  void api.users.me.prefetch();

  return (
    <SidebarProvider>
      <HydrateClient>
        <AppSidebar />
      </HydrateClient>
      <SidebarInset>
        <PageTitle />
        <main className="px-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
