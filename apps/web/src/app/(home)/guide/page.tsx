import { createMetadata } from '@lamp/seo/metadata';
import { Separator } from '@lamp/ui/components/separator';
import type { Metadata } from 'next';

import { Container, Section } from '~/components/craft';
import CTA from '~/components/craft/cta';
import { webUrl } from '~/lib/constants';

const meta = {
  metadataBase: new URL(webUrl),
  title: 'Guide',
  description: 'Guide for getting the most out of Lampstand.',
};

export const metadata: Metadata = createMetadata(meta);

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
