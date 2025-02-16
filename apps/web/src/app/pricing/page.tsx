import type { Metadata } from 'next';
import { cache } from 'react';
import Balancer from 'react-wrap-balancer';

import { getProducts } from '@lamp/db/queries';
import { Separator } from '@lamp/ui/components/separator';

import { Container, Section } from '~/components/craft';
import CTA from '~/components/craft/cta';
import FAQ from '~/components/craft/faq';
import PricingTables from '~/components/pricing-tables';

export const metadata: Metadata = {
  title: 'Pricing | Lampstand',
  description:
    'Pricing for Lampstand, the AI-powered Bible study app for the next generation of believers.',
};

export default async function Pricing() {
  const productsData = cache(getProducts)();
  const [products] = await Promise.all([productsData]);

  return (
    <>
      <Section>
        <Container className="flex flex-col items-center justify-center gap-12">
          <div className="flex flex-col gap-6">
            <h1 className="max-w-2xl text-center font-semibold text-4xl tracking-tighter md:text-6xl">
              <Balancer>The simple but powerful Bible study platform</Balancer>
            </h1>
            <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
              <Balancer>Unlimited access. Cancel anytime.</Balancer>
            </p>
          </div>

          <PricingTables products={products} />
        </Container>
      </Section>

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
}
