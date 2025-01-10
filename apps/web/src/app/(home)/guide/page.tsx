import type { Metadata } from 'next';

import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Guide | Lampstand',
  description:
    'Guide for getting the most out of Lampstand, the AI-powered Bible study app for the next generation of believers.',
};

const Guide = () => {
  redirect(
    'https://lampstand-ai.notion.site/Welcome-Guide-1776e386179380aabaa2f03a9c91634e?pvs=4'
  );
};

export default Guide;
