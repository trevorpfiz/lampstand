import type { Metadata } from 'next';

import { showBetaFeature } from '@lamp/feature-flags';
import { createMetadata } from '@lamp/seo/metadata';
import { Separator } from '@lamp/ui/components/separator';

import { Container, Section } from '~/components/craft';
import CTA from '~/components/craft/cta';
import FAQ from '~/components/craft/faq';
import { Hero } from '~/components/hero';
import { HeroVideoDialog } from '~/components/hero-video';
import { Features } from '~/components/tailwindui/features';

const meta = {
  title: 'Bible study for the next generation',
  description:
    'Lampstand is a Bible study app for the next generation. It helps you study the Bible faster and easier.',
};

export const metadata: Metadata = createMetadata(meta);

const Home = async () => {
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}

      <Section className="!pt-0">
        <Hero />

        <Container>
          <HeroVideoDialog
            videoSrc="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            thumbnailSrc="https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
          />
        </Container>
      </Section>

      <Container>
        <Separator className="bg-muted" />
      </Container>

      <Features />

      <Container>
        <Separator className="bg-muted" />
      </Container>

      <FAQ />

      <Container>
        <Separator className="bg-muted" />
      </Container>

      <CTA />
    </>
  );
};

export default Home;
