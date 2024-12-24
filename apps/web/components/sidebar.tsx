import type { ReactNode } from "react";

import { capitalize } from "@lamp/design-system/lib/utils";

type SidebarProperties = {
  readonly date: Date;
  readonly readingTime: string;
  readonly tags?: string[];
  readonly toc?: ReactNode;
};

export const Sidebar = async ({
  date,
  readingTime,
  tags,
  toc: Toc,
}: SidebarProperties) => (
  <div className="col-span-4 flex w-72 flex-col items-start gap-8 border-l border-foreground/10 px-6 lg:col-span-2">
    <div className="grid gap-2">
      <p className="text-sm text-muted-foreground">Published</p>
      <p className="rounded-sm text-sm text-foreground">
        {new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "America/New_York",
        }).format(date)}
      </p>
    </div>
    <div className="grid gap-2">
      <p className="text-sm text-muted-foreground">Reading Time</p>
      <p className="rounded-sm text-sm text-foreground">{readingTime}</p>
    </div>
    {tags && (
      <div className="grid gap-2">
        <p className="text-sm text-muted-foreground">Tags</p>
        <p className="rounded-sm text-sm text-foreground">
          {tags.map(capitalize).join(", ")}
        </p>
      </div>
    )}
    {Toc ? (
      <div className="-mx-2">
        <div className="grid gap-2 p-2">
          <p className="text-sm text-muted-foreground">Sections</p>
          {Toc}
        </div>
      </div>
    ) : undefined}
  </div>
);
