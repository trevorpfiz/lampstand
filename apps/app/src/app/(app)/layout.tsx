import { SidebarInset, SidebarProvider } from "@lamp/ui/sidebar";
import { TooltipProvider } from "@lamp/ui/tooltip";

import { AppHeader } from "~/components/app-header";
import { SettingsDialog } from "~/components/settings/settings-dialog";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { BibleStoreProvider } from "~/providers/bible-store-provider";
import { PanelsStoreProvider } from "~/providers/panels-store-provider";
import { SettingsDialogStoreProvider } from "~/providers/settings-dialog-store-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SettingsDialogStoreProvider>
        <PanelsStoreProvider>
          <BibleStoreProvider>
            <TooltipProvider delayDuration={100} skipDelayDuration={300}>
              <AppSidebar />
              <SidebarInset className="h-screen">
                <AppHeader />
                <div className="flex-1 overflow-auto">{children}</div>
                <SettingsDialog />
              </SidebarInset>
            </TooltipProvider>
          </BibleStoreProvider>
        </PanelsStoreProvider>
      </SettingsDialogStoreProvider>
    </SidebarProvider>
  );
}
