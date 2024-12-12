import { CardWrapper } from "~/components/auth/card-wrapper";
import { UpdatePasswordForm } from "~/components/auth/update-password-form";

export default function UpdatePasswordPage() {
  return (
    <CardWrapper
      headerTitle="Update Password"
      headerSubtitle="Enter your new password below"
      backButtonLabel="Back to account"
      backButtonLinkLabel="Account"
      backButtonHref="/account"
      showCredentials
    >
      <UpdatePasswordForm />
    </CardWrapper>
  );
}
