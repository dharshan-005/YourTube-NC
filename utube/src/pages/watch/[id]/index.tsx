"use client";

import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videopplayer from "@/components/Videopplayer";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const WatchPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const videoId = typeof id === "string" ? id : null;

  useEffect(() => {
    if (!videoId) return;

    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");

        const foundVideo = res.data.find((vid: any) => vid._id === id);

        setCurrentVideo(foundVideo || null);
        setAllVideos(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [videoId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentVideo) {
    return <div>Video not found</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* ✅ Videoplayer expects ARRAY */}
            <Videopplayer videos={[currentVideo]} />

            <VideoInfo video={currentVideo} />

            {videoId && <Comments videoId={videoId} />}
          </div>

          <div className="space-y-4">
            <RelatedVideos videos={allVideos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;

// 'use client';

// import Comments from "@/components/Comments";
// import RelatedVideos from "@/components/RelatedVideos";
// import VideoInfo from "@/components/VideoInfo";
// import Videopplayer from "@/components/Videopplayer";
// import axiosInstance from "@/lib/axiosinstance";
// import { useRouter } from "next/router";
// import React, { useEffect, useMemo, useState } from "react";

// const index = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const [videos, setvideo] = useState<any>(null);
//   const [video, setvide] = useState<any>(null);
//   const [loading, setloading] = useState(true);
//   useEffect(() => {
//     const fetchvideo = async () => {
//       if (!id || typeof id !== "string") return;
//       try {
//         const res = await axiosInstance.get("/video/getall");
//         const video = res.data?.filter((vid: any) => vid._id === id);
//         setvideo(video[0]);
//         setvide(res.data);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setloading(false);
//       }
//     };
//     fetchvideo();
//   }, [id]);
//   if (loading) {
//     return <div>Loading..</div>;
//   }

//   if (!videos) {
//     return <div>Video not found</div>;
//   }
//   return (
//     <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
//       <div className="max-w-7xl mx-auto p-4">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-4">
//             <Videopplayer videos={video} />
//             <VideoInfo video={videos} />
//             <Comments videoId={id} />
//           </div>
//           <div className="space-y-4">
//             <RelatedVideos videos={video} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default index;
