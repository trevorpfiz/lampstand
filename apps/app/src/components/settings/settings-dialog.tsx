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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lamp/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lamp/ui/select";

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

          <div className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="min-h-52 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-foreground">Theme</div>
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
            </DialogDescription>
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
      <Settings className="h-4 w-4" />
      <span className="sr-only">Open settings</span>
    </Button>
  );
}
