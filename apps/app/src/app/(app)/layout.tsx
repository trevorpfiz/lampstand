import { createClient } from "@lamp/supabase/server";
import { Separator } from "@lamp/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@lamp/ui/sidebar";
import { TooltipProvider } from "@lamp/ui/tooltip";

import { UserButton } from "~/components/auth/user-button";
import { PanelsLayout } from "~/components/panels-layout";
import { SettingsDialog } from "~/components/settings/settings-dialog";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { NavActions } from "~/components/sidebar/nav-actions";
import { BibleStoreProvider } from "~/providers/bible-store-provider";
import { PanelsStoreProvider } from "~/providers/panels-store-provider";
import { SettingsDialogStoreProvider } from "~/providers/settings-dialog-store-provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PanelsStoreProvider>
      <SidebarProvider>
        <SettingsDialogStoreProvider>
          <BibleStoreProvider>
            <TooltipProvider delayDuration={100} skipDelayDuration={300}>
              <AppSidebar />
              <SidebarInset className="h-screen">
                <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
                  <div className="flex flex-1 items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <p>Bible</p>
                  </div>

                  <div className="flex items-center">
                    <NavActions />
                  </div>

                  <div className="flex items-center">
                    <UserButton user={user} />
                  </div>
                </header>

                <div className="flex-1 overflow-auto">
                  <PanelsLayout>{children}</PanelsLayout>
                </div>

                <SettingsDialog />
              </SidebarInset>
            </TooltipProvider>
          </BibleStoreProvider>
        </SettingsDialogStoreProvider>
      </SidebarProvider>
    </PanelsStoreProvider>
  );
}
