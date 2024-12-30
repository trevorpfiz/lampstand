import { notFound } from 'next/navigation';
import { type ReactNode, cache } from 'react';

import { getProducts } from '@lamp/db/queries';
import { env } from '@lamp/env';
import { secure } from '@lamp/security';
import { getUser } from '@lamp/supabase/queries';
import { createClient } from '@lamp/supabase/server';
import { SidebarInset, SidebarProvider } from '@lamp/ui/components/sidebar';

import { PricingDialog } from '~/components/billing/pricing-dialog';
import { SettingsDialog } from '~/components/settings/settings-dialog';
import { AppSidebar } from '~/components/sidebar/app-sidebar';
import { BibleStoreProvider } from '~/providers/bible-store-provider';
import { ChatStoreProvider } from '~/providers/chat-store-provider';
import { LayoutStoreProvider } from '~/providers/layout-store-provider';
import { PanelsStoreProvider } from '~/providers/panels-store-provider';
import { PricingDialogStoreProvider } from '~/providers/pricing-dialog-store-provider';
import { SettingsDialogStoreProvider } from '~/providers/settings-dialog-store-provider';
import { HydrateClient, api } from '~/trpc/server';

export default async function AppLayout({ children }: { children: ReactNode }) {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW']);
  }

  api.study.byUser.prefetch();
  api.profile.byUser.prefetch();
  api.stripe.getActiveSubscriptionByUser.prefetch();

  const supabase = await createClient();
  const user = await getUser(supabase);

  if (!user) {
    return notFound();
  }

  const productsQuery = cache(getProducts)();
  const [products] = await Promise.all([productsQuery]);

  return (
    <HydrateClient>
      <SidebarProvider>
        <SettingsDialogStoreProvider>
          <PricingDialogStoreProvider>
            <PanelsStoreProvider>
              <LayoutStoreProvider>
                <BibleStoreProvider>
                  <ChatStoreProvider>
                    <AppSidebar />
                    <SidebarInset className="h-screen">
                      {children}
                      <SettingsDialog
                        userEmail={user?.email ?? ''}
                        userId={user.id}
                      />
                      <PricingDialog
                        products={products}
                        userId={user.id}
                        userEmail={user?.email ?? ''}
                      />
                    </SidebarInset>
                  </ChatStoreProvider>
                </BibleStoreProvider>
              </LayoutStoreProvider>
            </PanelsStoreProvider>
          </PricingDialogStoreProvider>
        </SettingsDialogStoreProvider>
      </SidebarProvider>
    </HydrateClient>
  );
}
