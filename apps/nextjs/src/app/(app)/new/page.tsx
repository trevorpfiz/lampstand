import BibleViewer from "~/components/bible/bible-viewer";
import BibleViewerIr from "~/components/bible/bible-viewer-ir";
import BibleViewerManny from "~/components/bible/bible-viewer-manny";

export default function Home() {
  return (
    <div className="h-full">
      {/* <BibleViewer /> */}
      <BibleViewerIr />
      {/* <BibleViewerManny /> */}
    </div>
  );
}
