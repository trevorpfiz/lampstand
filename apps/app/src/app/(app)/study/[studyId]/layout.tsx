import { PanelsLayout } from "~/components/panels-layout";

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PanelsLayout>{children}</PanelsLayout>;
}
