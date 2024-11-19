import Sidebar06 from "~/components/sidebar-06";
import { PredictionTypeStoreProvider } from "~/providers/prediction-type-store-provider";
import { ShareDialogStoreProvider } from "~/providers/share-dialog-store-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PredictionTypeStoreProvider>
      <ShareDialogStoreProvider>
        <Sidebar06 />
      </ShareDialogStoreProvider>
    </PredictionTypeStoreProvider>
  );
}
