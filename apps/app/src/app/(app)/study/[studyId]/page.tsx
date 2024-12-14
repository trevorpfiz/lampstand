import BibleViewer from "~/components/bible/bible-viewer";
import { api } from "~/trpc/server";

export default function StudyPage({ params }: { params: { studyId: string } }) {
  void api.study.byId.prefetch({ id: params.studyId });

  return (
    <main className="h-full">
      <BibleViewer />
    </main>
  );
}
