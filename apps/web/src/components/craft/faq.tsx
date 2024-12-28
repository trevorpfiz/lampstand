import { ArrowUpRight } from 'lucide-react';

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
  answer: string;
  link?: string;
};

const content: FAQItem[] = [
  {
    question: 'Lorem ipsum dolor sit amet?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    link: 'https://google.com',
  },
  {
    question: 'Ut enim ad minim veniam?',
    answer:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    question: 'Duis aute irure dolor in reprehenderit?',
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    question: 'Excepteur sint occaecat cupidatat non proident?',
    answer:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

const FAQ = () => {
  return (
    <Section id="faq">
      <Container className="craft flex flex-col items-center gap-4 md:gap-8">
        <h3 className="!mt-0 !text-4xl !font-semibold">Questions?</h3>

        <div className="flex w-full flex-col gap-8">
          <div className="not-prose flex flex-col gap-4">
            {content.map((item, index) => (
              <Accordion key={index} type="single" collapsible>
                <AccordionItem value={item.question}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base md:w-3/4">
                    {item.answer}
                    {item.link && (
                      <a
                        href={item.link}
                        className="mt-2 flex w-full items-center opacity-60 transition-all hover:opacity-100"
                      >
                        Learn more <ArrowUpRight className="ml-1" size="16" />
                      </a>
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
                href="mailto:trevor@getlampstand.com"
                className="hover:!text-foreground text-muted-foreground"
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
