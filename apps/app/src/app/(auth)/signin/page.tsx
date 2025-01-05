import type { Metadata } from 'next';

import { CardWrapper } from '~/components/auth/card-wrapper';
import { SignInForm } from '~/components/auth/sign-in-form';

export const metadata: Metadata = {
  title: 'Welcome back | Lampstand',
  description: 'Welcome back! Please sign in to continue.',
};

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
