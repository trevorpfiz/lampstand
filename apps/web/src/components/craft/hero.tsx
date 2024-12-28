import Image from 'next/image';
import Link from 'next/link';

import { Camera } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

import { Button } from '@lamp/ui/components/button';

import { Container, Section } from '~/components/craft';

import Logo from '~/app/icon.png';

const Hero = () => {
  return (
    <Section className="craft">
      <Container className="flex flex-col items-center text-center">
        <Image
          src={Logo}
          width={172}
          height={72}
          alt="Company Logo"
          className="not-prose mb-6 md:mb-8 dark:invert"
        />
        <h1 className="!mb-0">
          <Balancer>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Balancer>
        </h1>
        <h3 className="text-muted-foreground">
          <Balancer>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </Balancer>
        </h3>
        <div className="not-prose mt-6 flex gap-2 md:mt-12">
          <Button asChild>
            <Link href="/">
              <Camera className="mr-2" />
              Lorem Ipsum
            </Link>
          </Button>
          <Button variant={'ghost'} asChild>
            <Link href="/posts">Dolor Sit Amet -{'>'}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;
