"use client";

import { useState } from "react";
import { HelpCircle, MessageCircle } from "lucide-react";

import { Button } from "@lamp/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@lamp/ui/popover";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@lamp/ui/sidebar";
import { Textarea } from "@lamp/ui/textarea";

export function NavFooter() {
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton>
              <MessageCircle />
              <span>Feedback</span>
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-72 p-2"
            side="top"
            align="start"
            sideOffset={4}
            alignOffset={4}
          >
            <form className="space-y-3">
              <Textarea
                id="feedback"
                placeholder="How can we improve Lampstand?"
                aria-label="Send feedback"
                className="min-h-24"
              />
              <div className="flex flex-row justify-between">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button size="sm">Submit</Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a href="mailto:trevor@getlampstand.com">
            <HelpCircle />
            <span>Support</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
