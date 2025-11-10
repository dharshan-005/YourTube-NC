import React, { Suspense } from "react";
import HistoryContent from "@/components/HistoryContent";

const index = () => {
  return (
    <main className="flex-1 p-6 bg-white dark:bg-black dark:text-white">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Watch History</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <HistoryContent />
        </Suspense>
      </div>
    </main>
  );
};

export default index;