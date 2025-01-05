import merge from 'lodash.merge';
import type { Metadata } from 'next';

type MetadataGenerator = Omit<Metadata, 'description' | 'title'> & {
  title: string;
  description: string;
  image?: string;
  applicationFirst?: boolean;
};

const applicationName = 'Lampstand';
const author: Metadata['authors'] = {
  name: 'Lampstand',
  url: 'https://lampstand.ai',
};
const publisher = 'Lampstand';
const twitterHandle = '@lampstand_ai';

export const createMetadata = ({
  metadataBase,
  title,
  description,
  image,
  applicationFirst = false,
  ...properties
}: MetadataGenerator): Metadata => {
  const parsedTitle = applicationFirst
    ? `${applicationName} | ${title}`
    : `${title} | ${applicationName}`;
  const defaultMetadata: Metadata = {
    metadataBase,
    title: parsedTitle,
    description,
    applicationName,
    authors: [author],
    creator: author.name,
    formatDetection: {
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: parsedTitle,
    },
    openGraph: {
      title: parsedTitle,
      description,
      url: metadataBase?.toString() ?? 'https://lampstand.ai',
      siteName: applicationName,
      locale: 'en_US',
      type: 'website',
    },
    publisher,
    twitter: {
      card: 'summary_large_image',
      creator: twitterHandle,
    },
  };

  const metadata: Metadata = merge(defaultMetadata, properties);

  if (image && metadata.openGraph) {
    metadata.openGraph.images = [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ];
  }

  return metadata;
};
