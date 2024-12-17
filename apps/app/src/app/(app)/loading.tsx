import { LoaderCircle } from "lucide-react";

import { SidebarInset, SidebarProvider } from "@lamp/ui/sidebar";

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
            <LoaderCircle className="h-4 w-4 animate-spin" />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
