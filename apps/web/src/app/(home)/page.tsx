import type { Metadata } from 'next';

import { showBetaFeature } from '@lamp/feature-flags';
import { createMetadata } from '@lamp/seo/metadata';

import { Separator } from '@lamp/ui/components/separator';
import { Hero } from '~/app/(home)/components/hero';
import { Container } from '~/components/craft';
import CTA from '~/components/craft/cta';
import FAQ from '~/components/craft/faq';
import { HeroVideoDialog } from '~/components/hero-video';
// import Hero from '~/components/craft/hero';
import { Features } from './components/features';

const meta = {
  title: 'From zero to production in minutes.',
  description:
    "next-forge is a production-grade boilerplate for modern Next.js apps. It's designed to have everything you need to build your new SaaS app as quick as possible. Authentication, billing, analytics, SEO, and more. It's all here.",
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

      <Hero />

      <Container>
        <HeroVideoDialog
          videoSrc="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          thumbnailSrc="https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
        />
      </Container>

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
