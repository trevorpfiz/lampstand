"use client";

import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { LogOut, Settings, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@lamp/ui/avatar";
import { Button } from "@lamp/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@lamp/ui/dropdown-menu";

import { signOut } from "~/lib/actions/auth";
import { getNameFromUser } from "~/lib/utils";
import { useSettingsDialogStore } from "~/providers/settings-dialog-store-provider";

function UserButton({ user }: { user: User | null }) {
  const openSettingsDialog = useSettingsDialogStore(
    (state) => state.openSettingsDialog,
  );
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  const name = getNameFromUser(user);
  const displayEmail = user.email ?? "User";

  const handleSettings = () => {
    setOpen(false);
    openSettingsDialog("general");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src={user.user_metadata.avatar_url} /> */}
            <AvatarImage className="border-2 border-border bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white" />
            <AvatarFallback className="border-2 border-border bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
              {/* {initials || ""} */}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="truncate text-sm font-medium leading-none text-foreground">
              {name}
            </p>
            <p className="truncate text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Upgrade to Pro</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={handleSettings}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserButton };
