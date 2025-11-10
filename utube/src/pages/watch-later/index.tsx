import WatchLaterContent from "@/components/WatchLaterContent";
import { Suspense } from "react";

export default function WatchLaterPage() {
  return (
    <main className="flex-1 p-6 bg-white dark:bg-black dark:text-white">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Watch later</h1>
        <Suspense fallback={<div>Loading watch later...</div>}>
          <WatchLaterContent />
        </Suspense>
      </div>
    </main>
  );
}