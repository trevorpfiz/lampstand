import { draftMode } from "next/headers";
import Link from "next/link";
import { MoveRight, PhoneCall } from "lucide-react";

import { blog } from "@lamp/cms";
import { Feed } from "@lamp/cms/components/feed";
import { env } from "@lamp/env";
import { Button } from "@lamp/ui/components/button";

export const Hero = async () => {
  const draft = await draftMode();

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
          <div>
            <Feed queries={[blog.latestPostQuery]} draft={draft.isEnabled}>
              {/* biome-ignore lint/suspicious/useAwait: "Server Actions must be async" */}
              {async ([data]) => {
                "use server";

                return (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-4"
                    asChild
                  >
                    <Link href={`/blog/${data.blog.posts.items.at(0)?._slug}`}>
                      Read our latest article <MoveRight className="h-4 w-4" />
                    </Link>
                  </Button>
                );
              }}
            </Feed>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-regular max-w-2xl text-center text-5xl tracking-tighter md:text-7xl">
              This is the start of something new
            </h1>
            <p className="max-w-2xl text-center text-lg leading-relaxed tracking-tight text-muted-foreground md:text-xl">
              Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our
              goal is to streamline SMB trade, making it easier and faster than
              ever.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline" asChild>
              <Link href="/contact">
                Get in touch <PhoneCall className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" className="gap-4" asChild>
              <Link href={env.NEXT_PUBLIC_APP_URL}>
                Sign up <MoveRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
