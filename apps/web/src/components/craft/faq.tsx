import { ArrowUpRight } from 'lucide-react';

import { env } from '@lamp/env';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@lamp/ui/components/accordion';
import Link from 'next/link';
import { Container, Section } from '~/components/craft';

type FAQItem = {
  question: string;
  answer: string[];
  link?: string;
};

const content: FAQItem[] = [
  {
    question: 'What is Lampstand?',
    answer: ['Lampstand is an AI-powered Bible study platform that helps '],
  },
  {
    question: 'Is there a free trial?',
    answer: [
      `While we don't offer a free trial, we provide a 7-day grace period from the date of your first payment. If you're unsatisfied, you can request a full refund within this period.`,
    ],
  },
  {
    question: 'Why the BSB?',
    answer: [
      'The Berean Standard Bible (BSB) is a completely new English translation of the Holy Bible based on the best available manuscripts and sources.',
      'What sets it apart is its open license, which allows use without restrictions. Its combination of quality and accessibility makes it an ideal foundation for Lampstand.',
    ],
    link: 'https://berean.bible/licensing.htm',
  },
  {
    question: 'Can I use other versions of the Bible?',
    answer: [
      'Currently, we only support the BSB, with the KJV coming soon. However, we are actively working on licensing agreements for other popular translations, such as the NIV, ESV, NKJV, NASB, and more.',
    ],
  },
  {
    question: 'What is your refund policy?',
    answer: [
      'We offer a 7-day grace period from the date of your first payment. To request a refund, send us a message at support@lampstand.com.',
    ],
  },
  {
    question: 'Is Lampstand available in other languages than English?',
    answer: [
      'Our interface is in English, but the AI can understand and respond in over 90 languages. Feel free to ask questions in your preferred language.',
    ],
  },
];

const FAQ = () => {
  return (
    <Section id="faq">
      <Container className="flex flex-col items-center gap-4 md:gap-8">
        <h3 className="!mt-0 !text-4xl !font-semibold">Questions?</h3>

        <div className="flex w-full flex-col gap-8">
          <div className="not-prose flex flex-col gap-4">
            {content.map((item, index) => (
              <Accordion key={index} type="single" collapsible>
                <AccordionItem value={item.question}>
                  <AccordionTrigger className="text-left font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground md:w-3/4">
                    {item.answer.map((paragraph, i) => (
                      <p key={i} className={i > 0 ? 'mt-4' : ''}>
                        {paragraph}
                      </p>
                    ))}
                    {item.link && (
                      <Link
                        href={item.link}
                        className="mt-2 flex w-full items-center text-foreground underline underline-offset-2 opacity-60 transition-all hover:opacity-100"
                        target={
                          item.link.includes('http') ? '_blank' : undefined
                        }
                        rel={
                          item.link.includes('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        Learn more <ArrowUpRight className="ml-1" size="16" />
                      </Link>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
          <div className="flex flex-row items-center justify-center gap-2 text-sm">
            <p className="!text-sm text-muted-foreground">
              Have more questions?
            </p>
            <div className="flex flex-row items-center gap-0.5">
              <Link
                href={`mailto:${env.NEXT_PUBLIC_EMAIL}`}
                className="underline underline-offset-2 opacity-60 transition-all hover:opacity-100"
              >
                Contact us
              </Link>
              <span>.</span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default FAQ;
