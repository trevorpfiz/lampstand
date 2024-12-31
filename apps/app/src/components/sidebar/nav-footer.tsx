'use client';

import { HelpCircle } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@lamp/ui/components/sidebar';
import { FeedbackForm } from './feedback-form';
import { UsageStats } from './usage-stats';

export function NavFooter() {
  return (
    <>
      <div className="p-1">
        <UsageStats />
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <FeedbackForm />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href={`mailto:${NEXT_PUBLIC_EMAIL}`}>
              <HelpCircle size={16} strokeWidth={2} />
              <span>Support</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
