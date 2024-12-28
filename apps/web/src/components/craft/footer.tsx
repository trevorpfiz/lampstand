import { Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MdEmail } from 'react-icons/md';

import Logo from '~/app/icon.svg';
import { Container, Section } from '~/components/craft';

const footerItems = [
  {
    title: 'Resources',
    links: [
      { label: 'Guide', href: '/guide' },
      { label: 'FAQs', href: '#faq' },
    ],
  },
  {
    title: 'Company',
    links: [{ label: 'Support', href: 'mailto:trevor@getlampstand.com' }],
  },
  {
    title: 'Socials',
    links: [
      { label: 'X (Twitter)', href: 'mailto:trevor@getlampstand.com' },
      { label: 'Instagram', href: 'mailto:trevor@getlampstand.com' },
      { label: 'LinkedIn', href: 'mailto:trevor@getlampstand.com' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
];

const socialIcons = [
  {
    icon: <Instagram size={20} strokeWidth={1.5} />,
    href: 'https://instagram.com/lampstand',
  },
  {
    icon: <MdEmail size={20} />,
    href: 'mailto:trevor@getlampstand.com',
  },
];

export default function Footer() {
  return (
    <footer className="pb-16">
      <Section>
        <Container>
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-start md:justify-between md:gap-4 lg:gap-8">
            {/* Logo */}
            <div>
              <h3 className="sr-only">Lampstand</h3>
              <Image
                src={Logo}
                alt="Logo"
                width={32}
                height={32}
                className="border-none"
              />
            </div>

            {/* Links Groups */}
            <div className="flex flex-col gap-10 md:flex-row md:gap-4 lg:gap-10">
              {footerItems.map((group) => (
                <div key={group.title} className="flex w-28 flex-col gap-4">
                  <h5 className="font-semibold">{group.title}</h5>
                  <div className="flex flex-col gap-2 text-muted-foreground">
                    {group.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="hover:text-foreground"
                        target={
                          link.href.includes('http') ? '_blank' : undefined
                        }
                        rel={
                          link.href.includes('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Social and Copyright */}
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground md:text-sm lg:text-base">
                © {new Date().getFullYear()} Lampstand
              </p>
              <div className="flex gap-3 text-muted-foreground md:justify-end">
                {socialIcons.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="hover:text-foreground"
                    target={social.href.includes('http') ? '_blank' : undefined}
                    rel={
                      social.href.includes('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </footer>
  );
}
