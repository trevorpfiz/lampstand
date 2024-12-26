import { getActiveSubscriptionByUserId } from '@lamp/db/queries';
import { createClient } from '@lamp/supabase/server';
import { SidebarInset, SidebarProvider } from '@lamp/ui/components/sidebar';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { SettingsDialog } from '~/components/settings/settings-dialog';
import { AppSidebar } from '~/components/sidebar/app-sidebar';
import { BibleStoreProvider } from '~/providers/bible-store-provider';
import { ChatStoreProvider } from '~/providers/chat-store-provider';
import { LayoutStoreProvider } from '~/providers/layout-store-provider';
import { PanelsStoreProvider } from '~/providers/panels-store-provider';
import { SettingsDialogStoreProvider } from '~/providers/settings-dialog-store-provider';
import { HydrateClient, api } from '~/trpc/server';

export default async function AppLayout({ children }: { children: ReactNode }) {
  api.study.byUser.prefetch();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const activeSubscriptionData = await getActiveSubscriptionByUserId(user.id);

  const [subscription] = await Promise.all([activeSubscriptionData]);

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
                    <SettingsDialog
                      subscription={subscription.subscription}
                      userEmail={user.email ?? ''}
                      userId={user.id}
                    />
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
