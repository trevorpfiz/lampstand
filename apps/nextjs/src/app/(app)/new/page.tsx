import BibleViewer from "~/components/bible/bible-viewer";
import { JsonBibleViewer } from "~/components/bible/json-bible-viewer";

export default function Home() {
  return (
    <div className="h-full">
      <BibleViewer />
      {/* <JsonBibleViewer /> */}
    </div>
  );
}
