"use client";

import { Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@lamp/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@lamp/ui/dialog";
import { Label } from "@lamp/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lamp/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lamp/ui/tabs";

import { useSettingsDialogStore } from "~/providers/settings-dialog-store-provider";

export function SettingsDialog() {
  const { theme, setTheme } = useTheme();
  const { isOpen, closeSettingsDialog } = useSettingsDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      closeSettingsDialog: state.closeSettingsDialog,
    })),
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && closeSettingsDialog()}
    >
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">
            Settings
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Make changes to your settings here.
        </DialogDescription>
        <div className="flex flex-col gap-6 md:flex-row">
          <Tabs
            defaultValue="general"
            className="flex-1"
            orientation="vertical"
          >
            <TabsList className="m-2 flex flex-shrink-0 flex-col gap-2 md:m-0 md:min-w-[180px] md:max-w-[200px] md:px-4 md:pl-6 md:pt-4">
              <TabsTrigger
                value="general"
                className="flex w-full items-center justify-start gap-2 px-2 py-1.5 text-sm"
              >
                <Settings className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="general"
              className="max-h-[calc(100vh-150px)] w-full overflow-y-auto md:min-h-[380px]"
            >
              <div className="flex flex-col gap-3 px-4 pb-6 text-sm sm:px-6 md:ps-0 md:pt-5">
                <div className="border-b border-border pb-3 last-of-type:border-b-0">
                  <div className="flex items-center justify-between">
                    <div>Theme</div>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-auto min-w-[100px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
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
      <Settings className="h-4 w-4" />
      <span className="sr-only">Open settings</span>
    </Button>
  );
}
