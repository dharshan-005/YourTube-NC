import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { API_URL } from "@/lib/constants";
import Link from "next/link";

const Downloads = () => {
  const [downloads, setDownloads] = useState<any[]>([]);

  useEffect(() => {
    const fetchDownloads = async () => {
      const res = await axiosInstance.get("/user/downloads");
      setDownloads(res.data);
    };
    fetchDownloads();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-6">Your Downloads</h1>

      {downloads.length === 0 && <p>No downloads yet</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {downloads.map((d) => {
          const videoUrl = `${API_URL}/${d.videoId.filepath}`;

          return (
            <div
              key={d._id}
              className="bg-white dark:bg-[#181818] rounded-lg shadow p-3"
            >
              {/* 🎬 VIDEO PREVIEW */}
              <video
                src={videoUrl}
                controls
                className="w-full h-48 rounded"
              />

              {/* 📄 INFO */}
              <h3 className="font-medium mt-2">
                {d.videoId.videotitle}
              </h3>

              <p className="text-xs text-gray-500">
                Downloaded on{" "}
                {new Date(d.downloadedAt).toDateString()}
              </p>

              {/* ▶ WATCH PAGE */}
              <Link
                href={`/watch/${d.videoId._id}`}
                className="text-sm text-blue-500 mt-2 inline-block"
              >
                Open watch page
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Downloads;
