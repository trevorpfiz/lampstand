import { CardWrapper } from "~/components/auth/card-wrapper";
import { ForgotPasswordForm } from "~/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <CardWrapper
      headerTitle="Forgot Password"
      headerSubtitle="Enter your email and we'll send you a link to reset your password."
      showContent
    >
      <ForgotPasswordForm />
    </CardWrapper>
  );
}
