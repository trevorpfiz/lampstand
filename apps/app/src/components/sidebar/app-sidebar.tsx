'use client';

import { SquarePen } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { Button } from '@lamp/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@lamp/ui/components/card';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@lamp/ui/components/sidebar';
import { Spinner } from '@lamp/ui/components/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@lamp/ui/components/tooltip';
import { handleError } from '@lamp/ui/lib/utils';

import { NavFooter } from '~/components/sidebar/nav-footer';
import { NavMain } from '~/components/sidebar/nav-main';
import {
  NavStudies,
  NavStudiesSkeleton,
} from '~/components/sidebar/nav-studies';
import { api } from '~/trpc/react';

import LogoFull from '~/public/lampstand-logo-full.svg';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const utils = api.useUtils();

  const createMutation = api.study.create.useMutation({
    onSuccess: () => {
      utils.study.byUser.invalidate();
    },
    onError: (error) => {
      handleError(error);
    },
  });

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="mb-[1px] py-3">
        <SidebarMenu className="h-8">
          <SidebarMenuItem>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-0.5 pl-2 leading-none">
                <Image
                  src={LogoFull}
                  alt="Lampstand"
                  className="h-6 w-auto"
                  priority
                />
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Add new study"
                    className="h-8 w-8"
                    onClick={() => {
                      createMutation.mutate({
                        title: 'New study',
                      });
                    }}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <Spinner />
                    ) : (
                      <SquarePen size={16} strokeWidth={2} aria-hidden="true" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">
                  New study
                </TooltipContent>
              </Tooltip>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <React.Suspense fallback={<NavStudiesSkeleton />}>
          <NavStudies />
        </React.Suspense>
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
