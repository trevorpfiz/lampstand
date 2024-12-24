import { SidebarInset, SidebarProvider } from '@lamp/ui/components/sidebar';
import type { ReactNode } from 'react';

import { SettingsDialog } from '~/components/settings/settings-dialog';
import { AppSidebar } from '~/components/sidebar/app-sidebar';
import { BibleStoreProvider } from '~/providers/bible-store-provider';
import { ChatStoreProvider } from '~/providers/chat-store-provider';
import { LayoutStoreProvider } from '~/providers/layout-store-provider';
import { PanelsStoreProvider } from '~/providers/panels-store-provider';
import { SettingsDialogStoreProvider } from '~/providers/settings-dialog-store-provider';
import { HydrateClient, api } from '~/trpc/server';

export default function AppLayout({ children }: { children: ReactNode }) {
  api.study.byUser.prefetch();

  return (
    <HydrateClient>
      <SidebarProvider>
        <SettingsDialogStoreProvider>
          <PanelsStoreProvider>
            <LayoutStoreProvider>
              <BibleStoreProvider>
                <ChatStoreProvider>
                  <AppSidebar />
                  <SidebarInset className="h-screen">
                    {children}
                    <SettingsDialog />
                  </SidebarInset>
                </ChatStoreProvider>
              </BibleStoreProvider>
            </LayoutStoreProvider>
          </PanelsStoreProvider>
        </SettingsDialogStoreProvider>
      </SidebarProvider>
    </HydrateClient>
  );
}
