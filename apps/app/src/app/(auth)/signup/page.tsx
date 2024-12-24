import type { Metadata } from 'next';

import { createMetadata } from '@lamp/seo/metadata';

import { CardWrapper } from '~/components/auth/card-wrapper';
import { SignUpForm } from '~/components/auth/sign-up-form';

export const metadata: Metadata = createMetadata({
  title: 'Create your account',
  description: 'Welcome! Please fill in your details to get started.',
});

export default function SignUpPage() {
  return (
    <CardWrapper
      headerTitle="Create your account"
      headerSubtitle="Welcome! Please fill in the details to get started."
      backButtonLabel="Have an account?"
      backButtonLinkLabel="Sign in"
      backButtonHref="/signin"
      showSocial
      showCredentials
    >
      <SignUpForm />
    </CardWrapper>
  );
}
