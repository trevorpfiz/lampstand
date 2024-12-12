import { CardWrapper } from "~/components/auth/card-wrapper";
import { ForgotPasswordForm } from "~/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <CardWrapper
      headerTitle="Forgot Password"
      headerSubtitle="Enter your email to reset your password"
      backButtonLabel="Remember your password?"
      backButtonLinkLabel="Sign in"
      backButtonHref="/signin"
      showCredentials
    >
      <ForgotPasswordForm />
    </CardWrapper>
  );
}
