'use client';

import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@lamp/ui/components/button';
import { Separator } from '@lamp/ui/components/separator';
import { cn } from '@lamp/ui/lib/utils';

import { appUrl } from '~/lib/constants';

import LogoFull from '~/public/lampstand-logo-full.svg';

const navigation = [{ name: 'Pricing', href: '/pricing' }];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="!py-0 container sticky top-0 z-10 bg-background/90 backdrop-blur-md">
      <div
        className={cn(
          'border-b py-5 transition-colors',
          scrolled ? 'border-border' : 'border-transparent'
        )}
      >
        <nav aria-label="Global" className="flex items-center justify-between">
          <Link
            href="/"
            className="-m-1.5 p-1.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Lampstand</span>
            <Image
              alt="Lampstand"
              src={LogoFull}
              className="h-6 w-auto dark:invert"
              priority
            />
          </Link>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:items-center lg:gap-x-2">
            {navigation.map((item) => (
              <Button
                variant="ghost"
                size="lg"
                className="rounded-xl px-4"
                key={item.name}
                asChild
              >
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
            <Separator
              orientation="vertical"
              className="h-6 w-[3px] opacity-70"
            />
            <Button
              variant="ghost"
              size="lg"
              className="rounded-xl px-4"
              asChild
            >
              <Link href={`${appUrl}/signin`}>Log in</Link>
            </Button>
            <Button
              variant="default"
              size="lg"
              className="rounded-xl bg-orange-400 px-4 font-semibold hover:bg-orange-400/90"
              asChild
            >
              <Link href={`${appUrl}/signup`}>Get Started</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-20" />
          <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="-m-1.5 p-1.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Lampstand</span>
                <Image alt="Lampstand" src={LogoFull} className="h-6 w-auto" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-foreground"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="flex flex-col items-start justify-start gap-2 py-6">
                  {navigation.map((item) => (
                    <Button
                      variant="ghost"
                      asChild
                      key={item.name}
                      className="-mx-3 rounded-lg px-3 py-2 font-semibold text-base/7"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href={item.href}>{item.name}</Link>
                    </Button>
                  ))}
                </div>
                <div className="flex flex-col items-start justify-start gap-4 py-6">
                  <Button
                    variant="ghost"
                    asChild
                    className="-mx-3 rounded-lg px-3 py-2 font-semibold text-base/7"
                  >
                    <Link href={`${appUrl}/signin`}>Log in</Link>
                  </Button>
                  <Button
                    className="rounded-xl bg-orange-400 px-4 font-semibold hover:bg-orange-400/90"
                    size="lg"
                    asChild
                  >
                    <Link href={`${appUrl}/signup`}>Get Started</Link>
                  </Button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </div>
    </header>
  );
}
