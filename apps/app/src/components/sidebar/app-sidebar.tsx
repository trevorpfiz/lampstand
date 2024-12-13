"use client";

import * as React from "react";
import { FilePen, Home, SquarePen } from "lucide-react";

import { Button } from "@lamp/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lamp/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@lamp/ui/sidebar";

import { NavFooter } from "~/components/sidebar/nav-footer";
import { NavMain } from "~/components/sidebar/nav-main";
import { NavStudies } from "~/components/sidebar/nav-studies";

export const mockMainNavItems = [
  { title: "Home", url: "#", icon: Home, isActive: true },
];

// Sample data for studies (this would come from your backend in production)
export const mockStudies = [
  { id: "1", name: "Genesis Study", url: "#", icon: FilePen },
  { id: "2", name: "Psalms Notes", url: "#", icon: FilePen },
  { id: "3", name: "Revelation Study", url: "#", icon: FilePen },
];

export const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-0.5 pl-2 leading-none">
                <span className="font-semibold">Lampstand</span>
              </div>

              <Button variant="ghost" size="icon">
                <SquarePen />
                <span className="sr-only">New Study</span>
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain items={mockMainNavItems} />
      </SidebarHeader>
      <SidebarContent>
        <NavStudies studies={mockStudies} />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <Card className="shadow-none">
            <form>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-sm">
                  Subscribe to our newsletter
                </CardTitle>
                <CardDescription>
                  Opt-in to receive updates and news about the sidebar.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2.5 p-4">
                <SidebarInput type="email" placeholder="Email" />
                <Button
                  className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
                  size="sm"
                >
                  Subscribe
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
        <NavFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
