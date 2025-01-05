import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';

import { Button } from '@lamp/ui/components/button';
import { cn } from '@lamp/ui/lib/utils';

import { AnimatedGradientText } from '~/components/magicui/animated-gradient-text';
import { appUrl } from '~/lib/constants';

export const Hero = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      {/* <Meteors number={10} /> */}

      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <AnimatedGradientText className="text-xs">
              🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{' '}
              <span
                className={cn(
                  'inline animate-gradient bg-[length:var(--bg-size)_100%] bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-clip-text text-transparent'
                )}
              >
                Just Launched!
              </span>
            </AnimatedGradientText>

            {/* <div className="flex items-center rounded-full border border-border bg-background py-1 pr-3 pl-3 text-sm">
              🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{' '}
              <p className="text-muted-foreground">Just Launched!</p>
            </div> */}

            <div className="flex flex-col gap-6">
              <h1 className="max-w-2xl text-center font-semibold text-4xl tracking-tighter md:text-6xl">
                <Balancer>Bible study for the next generation</Balancer>
              </h1>
              <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
                <Balancer>
                  Quickly find verses, simplify complex topics, write with AI,
                  and keep everything organized.
                </Balancer>
              </p>
            </div>
          </div>

          <div className="flex flex-row flex-wrap items-center justify-center gap-3">
            <Button
              className="group rounded-xl bg-orange-400 font-bold transition-all hover:scale-105 hover:bg-orange-400/90"
              size="lg"
              asChild
            >
              <Link href={`${appUrl}/signup`}>
                Get Started
                <span className="ml-2 opacity-60">It's free</span>
                <MoveRight
                  className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-1.5"
                  size={14}
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
