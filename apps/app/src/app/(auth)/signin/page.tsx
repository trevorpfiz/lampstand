import type { Metadata } from 'next';

import { createMetadata } from '@lamp/seo/metadata';

import { env } from '@lamp/env';
import { CardWrapper } from '~/components/auth/card-wrapper';
import { SignInForm } from '~/components/auth/sign-in-form';

export const metadata: Metadata = createMetadata({
  metadataBase: new URL(
    env.NODE_ENV === 'production'
      ? env.NEXT_PUBLIC_APP_URL
      : 'http://localhost:3000'
  ),
  title: 'Welcome back',
  description: 'Welcome back! Please sign in to continue.',
});

export default function SignInPage() {
  return (
    <CardWrapper
      headerTitle="Sign in to Lampstand"
      headerSubtitle="Welcome back! Please sign in to continue."
      backButtonLabel="Don't have an account?"
      backButtonLinkLabel="Sign up"
      backButtonHref="/signup"
      showSocial
      showCredentials
    >
      <SignInForm />
    </CardWrapper>
  );
}
