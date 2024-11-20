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
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <p>Bible</p>
            </div>

            <div className="ml-auto px-3">
              <NavActions />
            </div>
          </header>

          <PanelsLayout>{children}</PanelsLayout>
        </SidebarInset>
      </SidebarProvider>
    </PanelsStoreProvider>
  );
}
