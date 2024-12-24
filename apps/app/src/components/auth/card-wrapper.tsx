import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@lamp/ui/components/card";

import { BackButton } from "~/components/auth/back-button";
import { Header } from "~/components/auth/header";
import { Social } from "~/components/auth/social";

interface CardWrapperProps {
  children: React.ReactNode;
  headerTitle: string;
  headerSubtitle: string;
  backButtonLabel?: string;
  backButtonLinkLabel?: string;
  backButtonHref?: string;
  showSocial?: boolean;
  showCredentials?: boolean;
  showContent?: boolean;
}

export const CardWrapper = ({
  children,
  headerTitle,
  headerSubtitle,
  backButtonLabel,
  backButtonLinkLabel,
  backButtonHref,
  showSocial,
  showCredentials,
  showContent,
}: CardWrapperProps) => {
  return (
    <Card className="rounded-lg p-4 shadow-md">
      <CardHeader>
        <Header headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
      </CardHeader>

      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}

      {showCredentials && (
        <>
          <div className="flex items-center justify-center px-6 pb-4 pt-0">
            <div className="flex-grow border-t" />
            <p className="px-4 text-[13px] leading-snug text-muted-foreground">
              or
            </p>
            <div className="flex-grow border-t" />
          </div>
          <CardContent>{children}</CardContent>
        </>
      )}

      {showContent && <CardContent>{children}</CardContent>}

      {(backButtonLabel ?? backButtonLinkLabel ?? backButtonHref) && (
        <CardFooter className="flex justify-center pb-0">
          <BackButton
            label={backButtonLabel ?? ""}
            linkLabel={backButtonLinkLabel ?? ""}
            href={backButtonHref ?? ""}
          />
        </CardFooter>
      )}
    </Card>
  );
};
