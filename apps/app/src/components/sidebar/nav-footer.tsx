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
import { toast } from "@lamp/ui/sonner";
import { Spinner } from "@lamp/ui/spinner";
import { Textarea } from "@lamp/ui/textarea";

import { api } from "~/trpc/react";

export function NavFooter() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const createMutation = api.feedback.create.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your feedback!");
      setContent("");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to submit feedback. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createMutation.mutate({
      content,
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton>
              <MessageCircle size={16} strokeWidth={2} />
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
            <form className="space-y-3" onSubmit={handleSubmit}>
              <Textarea
                id="feedback"
                placeholder="How can we improve Lampstand?"
                aria-label="Send feedback"
                className="min-h-24"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={createMutation.isPending}
              />
              <div className="flex flex-row justify-between">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                  type="button"
                  disabled={createMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  disabled={createMutation.isPending || !content.trim()}
                >
                  {createMutation.isPending ? (
                    <>
                      <Spinner className="-ms-1 me-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a href="mailto:trevor@getlampstand.com">
            <HelpCircle size={16} strokeWidth={2} />
            <span>Support</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
