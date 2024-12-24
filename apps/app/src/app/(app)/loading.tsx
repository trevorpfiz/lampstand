import { SidebarInset, SidebarProvider } from "@lamp/ui/components/sidebar";
import { Spinner } from "@lamp/ui/components/spinner";

import { AppHeader } from "~/components/app-header";
import { AppSidebar } from "~/components/sidebar/app-sidebar";

export default function Loading() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="h-screen">
        <AppHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <Spinner />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
