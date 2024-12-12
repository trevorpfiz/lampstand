"use client";

import type { LucideIcon } from "lucide-react";
import { Home } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@lamp/ui/sidebar";

export const mockMainNavItems = [
  { title: "Home", url: "#", icon: Home, isActive: true },
];

export function NavMain({
  items,
}: {
  items: { title: string; url: string; icon: LucideIcon; isActive?: boolean }[];
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
