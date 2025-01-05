import type { Metadata } from 'next';

import { Separator } from '@lamp/ui/components/separator';

import { Container, Section } from '~/components/craft';
import CTA from '~/components/craft/cta';

export const metadata: Metadata = {
  title: 'Guide | Lampstand',
  description:
    'Guide for getting the most out of Lampstand, the AI-powered Bible study app for the next generation of believers.',
};

const Guide = () => {
  return (
    <>
      <Section className="!pt-0">
        <Container className="flex min-h-[50vh] items-center justify-center">
          <h1 className="text-center font-semibold text-4xl">
            Guide coming soon!
          </h1>
        </Container>
      </Section>

      <Container>
        <Separator className="bg-muted" />
      </Container>

      <CTA />
    </>
  );
};

export default Guide;
