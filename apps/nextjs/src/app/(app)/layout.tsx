import { Separator } from "@lamp/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@lamp/ui/sidebar";

import { PanelsLayout } from "~/components/panels-layout";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { NavActions } from "~/components/sidebar/nav-actions";
import { PanelsStoreProvider } from "~/providers/panels-store-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelsStoreProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="h-screen">
          <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
            <div className="flex flex-1 items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <p>Bible</p>
            </div>

            <div className="px-1">
              <NavActions />
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <PanelsLayout>{children}</PanelsLayout>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PanelsStoreProvider>
  );
}
