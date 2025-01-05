// React and Next.js imports
import Link from 'next/link';

// Third-party library imports
import { MoveRight } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

// UI component imports
import { Button } from '@lamp/ui/components/button';

// Custom components
import { Container, Section } from '~/components/craft';
import { appUrl } from '~/lib/constants';

const CTA = () => {
  return (
    <Section className="px-6">
      <Container className="md:!p-12 flex flex-col items-center gap-6 rounded-lg border bg-accent/50 text-center md:rounded-xl">
        <h2 className="!my-0 text-center font-semibold text-4xl tracking-tighter md:text-5xl">
          <Balancer>Get started for free</Balancer>
        </h2>
        <h3 className="!mb-0 text-center text-lg text-muted-foreground leading-relaxed tracking-tight">
          <Balancer>Take Lampstand for a spin. No card required.</Balancer>
        </h3>
        <div className="not-prose mx-auto flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="default"
            size="lg"
            className="rounded-xl bg-orange-400 px-4 font-semibold hover:bg-orange-400/90"
            asChild
          >
            <Link href={`${appUrl}/signup`}>Get Started</Link>
          </Button>
          <Button className="group rounded-xl" variant="link" asChild>
            <Link href="/guide">
              Learn More
              <MoveRight
                className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                size={13}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
};

export default CTA;
