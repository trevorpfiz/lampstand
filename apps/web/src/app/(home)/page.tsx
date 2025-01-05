import { showBetaFeature } from '@lamp/feature-flags';
import { createMetadata } from '@lamp/seo/metadata';
import { Separator } from '@lamp/ui/components/separator';
import type { Metadata } from 'next';
import Image from 'next/image';

import { Container, Section } from '~/components/craft';
import CTA from '~/components/craft/cta';
import FAQ from '~/components/craft/faq';
import { Hero } from '~/components/hero';
import { Features } from '~/components/tailwindui/features';

import { webUrl } from '~/lib/constants';
import HeroDemoImage from '~/public/images/hero-demo-image.png';

const meta = {
  metadataBase: new URL(webUrl),
  title: 'Bible study for the next generation',
  description:
    'Lampstand is an AI-powered Bible study app for the next generation of believers. Quickly find verses, simplify complex topics, write with AI, and keep everything organized.',
  applicationFirst: true,
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
          <div className="rounded-2xl bg-muted p-1 sm:p-2">
            <Image
              src={HeroDemoImage}
              alt="Hero video thumbnail"
              priority
              className="w-full rounded-xl object-contain"
            />
          </div>

          {/* <HeroVideoDialog
            videoSrc="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            thumbnailSrc="https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
          /> */}
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
