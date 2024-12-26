'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lamp/ui/components/select';

import { useTheme } from '@lamp/ui/providers/theme';

export function GeneralTab() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-3 pt-5 pr-6 pb-6 pl-0 text-foreground text-sm">
      <div className="flex items-center justify-between border-border border-b pb-3">
        <p className="text-base">Theme</p>
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
  );
}
