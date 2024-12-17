import { LoaderCircle } from "lucide-react";

import { AppHeader } from "~/components/app-header";

export default function Loading() {
  return (
    <>
      <AppHeader isStudyRoute={true} studyTitle="" />
      <div className="flex flex-1 items-center justify-center">
        <LoaderCircle className="h-4 w-4 animate-spin" />
      </div>
    </>
  );
}
