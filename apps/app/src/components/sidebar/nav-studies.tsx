"use client";

import { useState } from "react";
import { Check, LoaderCircle, MoreHorizontal, Pen, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lamp/ui/dropdown-menu";
import { Input } from "@lamp/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@lamp/ui/popover";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@lamp/ui/sidebar";
import { toast } from "@lamp/ui/sonner";

import { api } from "~/trpc/react";

export function NavStudies() {
  const { isMobile } = useSidebar();

  const utils = api.useUtils();
  const { data, isPending } = api.study.byUser.useQuery();

  const [open, setOpen] = useState(false);

  const [selectedStudy, setSelectedStudy] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [name, setName] = useState("");

  const renameMutation = api.study.rename.useMutation({
    onSuccess: () => {
      void utils.study.byUser.invalidate();
      setOpen(false);
      setSelectedStudy(null);
    },
    onError: () => {
      toast.error("Failed to rename study");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudy || !name.trim()) return;

    renameMutation.mutate({
      id: selectedStudy.id,
      title: name.trim(),
    });
  };

  const deleteMutation = api.study.delete.useMutation({
    onSuccess: () => {
      void utils.study.byUser.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete study");
    },
  });

  const studies = data?.studies;

  if (isPending) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Studies</SidebarGroupLabel>
        <div className="flex justify-center py-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
        </div>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Studies</SidebarGroupLabel>
      <SidebarMenu>
        {studies && studies.length > 0
          ? studies.map((study) => (
              <SidebarMenuItem key={study.id}>
                <Popover
                  open={open && selectedStudy?.id === study.id}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) {
                      setOpen(false);
                      setSelectedStudy(null);
                    }
                  }}
                >
                  <PopoverAnchor asChild>
                    <SidebarMenuButton asChild tooltip={study.title}>
                      <a href={`/study/${study.id}`}>
                        <span>{study.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </PopoverAnchor>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">Options</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                      onCloseAutoFocus={(e) => {
                        e.preventDefault();

                        if (selectedStudy) {
                          setOpen(true);
                        }
                      }}
                    >
                      <DropdownMenuItem
                        onSelect={() => {
                          setSelectedStudy(study);
                          setName(study.title);
                        }}
                      >
                        <Pen size={16} strokeWidth={2} />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this study? This action cannot be undone.",
                            )
                          ) {
                            deleteMutation.mutate({ id: study.id });
                          }
                        }}
                      >
                        <Trash2
                          className="text-destructive"
                          size={16}
                          strokeWidth={2}
                        />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <PopoverContent
                    className="w-56 p-0.5"
                    side="bottom"
                    align="start"
                  >
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={handleSubmit}
                    >
                      <div className="flex rounded-lg shadow-sm shadow-black/5">
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10"
                          autoFocus
                          onFocus={(e) => e.target.select()}
                          disabled={renameMutation.isPending}
                        />
                        <button
                          type="submit"
                          className="inline-flex w-9 items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 outline-offset-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={renameMutation.isPending || !name.trim()}
                          aria-label="Rename"
                        >
                          {renameMutation.isPending ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </div>
                    </form>
                  </PopoverContent>
                </Popover>
              </SidebarMenuItem>
            ))
          : undefined}
      </SidebarMenu>
    </SidebarGroup>
  );
}
