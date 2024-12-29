'use client';

import { LogOut, Settings, Sparkles } from 'lucide-react';
import { useState } from 'react';

import type { User } from '@lamp/supabase';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@lamp/ui/components/avatar';
import { Button } from '@lamp/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@lamp/ui/components/dropdown-menu';

import { signOut } from '~/lib/actions/auth';
import { getNameFromUser } from '~/lib/utils';
import { usePricingDialogStore } from '~/providers/pricing-dialog-store-provider';
import { useSettingsDialogStore } from '~/providers/settings-dialog-store-provider';

interface UserButtonProps {
  user: User;
}

function UserButton({ user }: UserButtonProps) {
  const openSettingsDialog = useSettingsDialogStore(
    (state) => state.openSettingsDialog
  );
  const openPricingDialog = usePricingDialogStore(
    (state) => state.openPricingDialog
  );
  const [open, setOpen] = useState(false);

  const name = getNameFromUser(user);
  const displayEmail = user?.email ?? 'email';

  const handleSettings = () => {
    setOpen(false);
    openSettingsDialog('general');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleUpgrade = () => {
    setOpen(false);
    openPricingDialog();
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
            <p className="truncate font-medium text-foreground text-sm leading-none">
              {name}
            </p>
            <p className="truncate text-muted-foreground text-xs leading-none">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={handleUpgrade}>
            <Sparkles
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Upgrade Plan</span>
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
