import { Suspense } from "react";
import DownloadContent from "./DownloadContent";

export default function DownloadPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-zinc-500">Laden…</p>
        </div>
      }
    >
      <DownloadContent />
    </Suspense>
  );
}
