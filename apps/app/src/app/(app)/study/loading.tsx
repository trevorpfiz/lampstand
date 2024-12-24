import { Spinner } from "@lamp/ui/components/spinner";

import { AppHeader } from "~/components/app-header";

export default function Loading() {
  return (
    <>
      <AppHeader isStudyRoute={true} studyTitle="" />
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    </>
  );
}
