"use client";

import { useParams, useSelectedLayoutSegment } from "next/navigation";

import { Separator } from "@lamp/ui/separator";
import { SidebarTrigger } from "@lamp/ui/sidebar";

import { UserButton } from "~/components/auth/user-button";
import { NavActions } from "~/components/sidebar/nav-actions";
import { api } from "~/trpc/react";

export function AppHeader() {
  const segment = useSelectedLayoutSegment();
  const params = useParams();
  const isStudyRoute = segment === "study";

  // Only fetch if we're on a study route and have a studyId
  const { data } = api.study.byId.useQuery(
    { id: params.studyId as string },
    { enabled: isStudyRoute && !!params.studyId },
  );

  return (
    <header className="sticky top-0 flex h-[57px] shrink-0 items-center gap-2 border-b bg-background px-4 py-3">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        {isStudyRoute && (
          <>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p>{data?.study?.title ?? ""}</p>
          </>
        )}
      </div>

      {isStudyRoute && (
        <div className="flex items-center">
          <NavActions />
        </div>
      )}

      <div className="flex items-center">
        <UserButton />
      </div>
    </header>
  );
}

// Add a skeleton component for loading state
export function AppHeaderSkeleton() {
  return (
    <header className="sticky top-0 flex h-[57px] shrink-0 items-center gap-2 border-b bg-background px-4 py-3">
      <div className="flex flex-1 items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </div>
    </header>
  );
}
