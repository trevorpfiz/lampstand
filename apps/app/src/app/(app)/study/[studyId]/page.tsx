import BibleViewer from "~/components/bible/bible-viewer";

export default function StudyPage({ params }: { params: { studyId: string } }) {
  return (
    <main className="h-full">
      <BibleViewer />
    </main>
  );
}
