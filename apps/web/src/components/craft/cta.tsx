// React and Next.js imports
import Link from 'next/link';

// Third-party library imports
import Balancer from 'react-wrap-balancer';

// UI component imports
import { Button } from '@lamp/ui/components/button';

// Custom components
import { Container, Section } from '~/components/craft';

const CTA = () => {
  return (
    <Section className="craft px-8">
      <Container className="flex flex-col items-center gap-6 rounded-lg border bg-accent/50 p-6 text-center md:rounded-xl md:p-12">
        <h2 className="!my-0">Get started for free</h2>
        <h3 className="!mb-0 text-muted-foreground">
          <Balancer>Take Lampstand for a spin. No card required.</Balancer>
        </h3>
        <div className="not-prose mx-auto flex flex-wrap items-center justify-center gap-2">
          <Button className="w-fit rounded-2xl" asChild>
            <Link href="#" className="!no-underline">
              Get Started
            </Link>
          </Button>
          <Button className="w-fit rounded-2xl" variant="link" asChild>
            <Link href="#">Learn More {'->'}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
};

export default CTA;
