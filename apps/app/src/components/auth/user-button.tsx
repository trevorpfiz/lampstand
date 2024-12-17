"use client";

import { useEffect, useState } from "react";
import { LogOut, Settings, Sparkles } from "lucide-react";

import type { User } from "@lamp/supabase";
import { createClient } from "@lamp/supabase/client";
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

function UserButton() {
  const openSettingsDialog = useSettingsDialogStore(
    (state) => state.openSettingsDialog,
  );
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    void fetchUser();
  }, []);

  const name = user ? getNameFromUser(user) : "User";
  const displayEmail = user?.email ?? "email";

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
            <Sparkles
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Upgrade to Pro</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={handleSettings}>
            <Settings
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={handleSignOut}>
          <LogOut
            size={16}
            strokeWidth={2}
            className="opacity-60"
            aria-hidden="true"
          />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { UserButton };
