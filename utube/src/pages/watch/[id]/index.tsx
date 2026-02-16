"use client";

import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import VideoPlayer from "@/components/VideoPlayer";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const WatchPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allowedMinutes, setAllowedMinutes] = useState<number | null>(null);

  const videoId = typeof id === "string" ? id : null;

  useEffect(() => {
    if (!videoId) return;

    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get(`/video/watch/${videoId}`);

        // const foundVideo = res.data.find((vid: any) => vid._id === id);

        setCurrentVideo(res.data.video || null);
        setAllowedMinutes(res.data.allowedMinutes);

        const all = await axiosInstance.get("/video/getall");
        setAllVideos(all.data);
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
            {/* ✅ VideoPlayer expects ARRAY */}
            <VideoPlayer videos={[currentVideo]} allowedMinutes={allowedMinutes} />

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
