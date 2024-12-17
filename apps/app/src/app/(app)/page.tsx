import { AppHeader } from "~/components/app-header";

export default function Home() {
  return (
    <>
      <AppHeader />
      <div className="flex-1 overflow-auto">
        <main className="h-full">
          <div className="flex h-full flex-col items-center justify-center">
            <h1 className="text-4xl font-semibold">Welcome!</h1>
            <h2 className="text-lg text-muted-foreground">
              Create a new study to get started.
            </h2>
          </div>
        </main>
      </div>
    </>
  );
}
