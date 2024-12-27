import type { Metadata } from 'next';

import { showBetaFeature } from '@lamp/feature-flags';
import { createMetadata } from '@lamp/seo/metadata';

import { Separator } from '@lamp/ui/components/separator';
import CTA from '~/components/craft/cta';
import FAQ from '~/components/craft/faq';
import { Features } from './components/features';
import { Hero } from './components/hero';

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
      <div className="px-8">
        <Separator className="bg-muted" />
      </div>
      <Features />
      <div className="px-8">
        <Separator className="bg-muted" />
      </div>
      <FAQ />
      <div className="px-8">
        <Separator className="bg-muted" />
      </div>
      <CTA />
    </>
  );
};

export default Home;
