import Image from 'next/image';
import { Container, Section } from '~/components/craft';

import ChatDemo from '~/public/images/chat-demo-305.png';
import NotesDemo from '~/public/images/notes-demo-447.png';
import ReaderDemo from '~/public/images/reader-demo-slim.png';
import VerseDemo from '~/public/images/verse-demo.png';

// 1. Chat with AI
// 2. Immediately navigate to verses
// 3. Take notes
// 4. Bible viewer

function Features() {
  return (
    <Section>
      <Container className="max-lg:!max-w-2xl">
        <h2 className="text-center font-semibold text-base/7 text-muted-foreground">
          Study faster
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-balance text-center font-semibold text-4xl text-foreground tracking-tight sm:text-5xl">
          Everything you need to study the Bible
        </p>
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-background lg:rounded-l-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-8 sm:pb-0">
                <p className="mt-2 font-medium text-foreground text-lg tracking-tight max-lg:text-center">
                  Chat with AI
                </p>
                <p className="mt-2 max-w-lg text-muted-foreground text-sm/6 max-lg:text-center">
                  Ask questions, get different perspectives, and grow in your
                  understanding of the Bible.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute top-6 bottom-0 w-full overflow-hidden px-4 shadow-none">
                  <Image
                    src={ChatDemo}
                    alt="Chat demo"
                    priority
                    className="size-full object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-border lg:rounded-l-[2rem]" />
          </div>
          <div className="relative max-lg:row-start-1">
            <div className="absolute inset-px rounded-lg bg-background max-lg:rounded-t-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-8">
                <p className="mt-2 font-medium text-foreground text-lg tracking-tight max-lg:text-center">
                  Verses
                </p>
                <p className="mt-2 max-w-lg text-muted-foreground text-sm/6 max-lg:text-center">
                  Find verses quickly, and navigate to them right away.
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-4">
                <Image
                  src={VerseDemo}
                  alt="Verse navigation demo"
                  priority
                  className="h-[min(152px,50cqw)] object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-border max-lg:rounded-t-[2rem]" />
          </div>
          <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
            <div className="absolute inset-px rounded-lg bg-background" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-8">
                <p className="mt-2 font-medium text-foreground text-lg tracking-tight max-lg:text-center">
                  Take notes
                </p>
                <p className="mt-2 max-w-lg text-muted-foreground text-sm/6 max-lg:text-center">
                  Keep track of what you learn in a Notion-style editor.
                </p>
              </div>
              <div className="flex flex-1 items-center px-4 pt-4 [container-type:inline-size]">
                <Image
                  src={NotesDemo}
                  alt="Take notes demo"
                  priority
                  className="h-[min(152px,50cqw)] object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-border" />
          </div>
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-background max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-8 sm:pb-0">
                <p className="mt-2 font-medium text-foreground text-lg tracking-tight max-lg:text-center">
                  Bible reader
                </p>
                <p className="mt-2 max-w-lg text-muted-foreground text-sm/6 max-lg:text-center">
                  A modern Bible reader that works seamlessly with the rest of
                  the app.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow">
                <div className="absolute top-6 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-muted shadow-xl">
                  <div className="relative flex h-full overflow-hidden rounded-tl-xl border border-border bg-muted/40">
                    <Image
                      src={ReaderDemo}
                      alt="Bible reader demo"
                      priority
                      className="w-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-border max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
          </div>
        </div>
      </Container>
    </Section>
  );
}

export { Features };
