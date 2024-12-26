'use client';

import { BadgePlus, Settings, User } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import type { SubscriptionWithDetails } from '@lamp/db/schema';
import { Button } from '@lamp/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@lamp/ui/components/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@lamp/ui/components/tabs';

import { GeneralTab } from '~/components/settings/general-tab';
import { useSettingsDialogStore } from '~/providers/settings-dialog-store-provider';
import { SubscriptionTab } from './subscription-tab';

interface SettingsDialogProps {
  subscription: SubscriptionWithDetails | null | undefined;
  userEmail: string;
  userId: string;
}

export function SettingsDialog({
  subscription,
  userEmail,
  userId,
}: SettingsDialogProps) {
  const { isOpen, closeSettingsDialog } = useSettingsDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      closeSettingsDialog: state.closeSettingsDialog,
    }))
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && closeSettingsDialog()}
    >
      <DialogContent className="flex min-h-96 flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-2xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-border border-b px-6 py-4 text-lg">
            Settings
          </DialogTitle>
          <DialogDescription className="hidden">
            Make changes to your settings here.
          </DialogDescription>

          <div className="overflow-y-auto">
            <div className="p-0">
              <Tabs
                defaultValue="general"
                orientation="vertical"
                className="flex w-full gap-6"
              >
                <TabsList className="min-w-44 flex-col justify-start gap-2 bg-transparent p-4">
                  <TabsTrigger
                    value="general"
                    className="w-full justify-start text-foreground hover:bg-muted hover:text-foreground data-[state=active]:bg-muted data-[state=active]:shadow-none"
                  >
                    <Settings
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    value="account"
                    className="w-full justify-start text-foreground hover:bg-muted hover:text-foreground data-[state=active]:bg-muted data-[state=active]:shadow-none"
                  >
                    <User
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="subscription"
                    className="w-full justify-start text-foreground hover:bg-muted hover:text-foreground data-[state=active]:bg-muted data-[state=active]:shadow-none"
                  >
                    <BadgePlus
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Subscription
                  </TabsTrigger>
                </TabsList>
                <div className="grow text-start">
                  <TabsContent value="general" className="m-0">
                    <GeneralTab />
                  </TabsContent>
                  <TabsContent value="account" className="m-0" />
                  <TabsContent value="subscription" className="m-0">
                    <SubscriptionTab
                      subscription={subscription}
                      userEmail={userEmail}
                      userId={userId}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function SettingsButton() {
  const { openSettingsDialog } = useSettingsDialogStore((state) => ({
    openSettingsDialog: state.openSettingsDialog,
  }));

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => openSettingsDialog()}
      className="h-9 w-9"
    >
      <Settings size={16} strokeWidth={2} />
      <span className="sr-only">Open settings</span>
    </Button>
  );
}
