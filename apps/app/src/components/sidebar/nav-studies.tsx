'use client';

import { Check, MoreHorizontal, Pen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type FormEvent, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@lamp/ui/components/dropdown-menu';
import { Input } from '@lamp/ui/components/input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@lamp/ui/components/popover';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@lamp/ui/components/sidebar';
import { Spinner } from '@lamp/ui/components/spinner';
import { handleError } from '@lamp/ui/lib/utils';

import { revalidateStudy } from '~/lib/actions/study';
import { api } from '~/trpc/react';

export function NavStudies() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  const utils = api.useUtils();
  const [{ studies }] = api.study.byUser.useSuspenseQuery();

  const [open, setOpen] = useState(false);

  const [selectedStudy, setSelectedStudy] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [name, setName] = useState('');

  const renameMutation = api.study.rename.useMutation({
    onMutate: async (updatedStudy) => {
      // Cancel any outgoing refetches
      await utils.study.byUser.cancel();

      // Snapshot the previous value
      const previousStudies = utils.study.byUser.getData();

      // Optimistically update to the new value
      utils.study.byUser.setData(undefined, (old) => {
        if (!old) return { studies: [] };
        return {
          studies: old.studies.map((study) => {
            if (study.id === updatedStudy.id) {
              return {
                ...study,
                title: updatedStudy.title || study.title,
              };
            }
            return study;
          }),
        };
      });

      setOpen(false);
      return { previousStudies };
    },
    onError: (error, updatedStudy, context) => {
      // Rollback to the previous value
      if (context?.previousStudies) {
        utils.study.byUser.setData(undefined, context.previousStudies);
      }

      handleError(error);
    },
    onSettled: async () => {
      await revalidateStudy(selectedStudy?.id);
      await utils.study.byUser.invalidate();
      setSelectedStudy(null);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedStudy || !name.trim()) {
      return;
    }

    renameMutation.mutate({
      id: selectedStudy.id,
      title: name.trim(),
    });
  };

  const deleteMutation = api.study.delete.useMutation({
    onSuccess: () => {
      utils.study.byUser.invalidate();
    },
    onError: (error) => {
      handleError(error);
    },
  });

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Studies</SidebarGroupLabel>
      <SidebarMenu>
        {studies.length > 0
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
                    <SidebarMenuButton
                      asChild
                      tooltip={study.title}
                      isActive={pathname === `/study/${study.id}`}
                    >
                      <Link href={`/study/${study.id}`}>
                        <span>{study.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </PopoverAnchor>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction
                        showOnHover={pathname !== `/study/${study.id}`}
                      >
                        <MoreHorizontal size={16} strokeWidth={2} />
                        <span className="sr-only">Options</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side={isMobile ? 'bottom' : 'right'}
                      align={isMobile ? 'end' : 'start'}
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
                              'Are you sure you want to delete this study? This action cannot be undone.'
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
                          aria-hidden="true"
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
                      <div className="flex rounded-lg shadow-black/5 shadow-sm">
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
                          className="inline-flex w-9 items-center justify-center rounded-e-lg border border-input bg-background text-muted-foreground/80 text-sm outline-offset-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={renameMutation.isPending || !name.trim()}
                          aria-label="Rename"
                        >
                          {renameMutation.isPending ? (
                            <Spinner />
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

export const NavStudiesSkeleton = () => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Studies</SidebarGroupLabel>
      <div className="flex justify-center py-2">
        <Spinner />
      </div>
    </SidebarGroup>
  );
};
