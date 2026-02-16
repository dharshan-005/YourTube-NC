"use client";

import { API_URL } from "@/lib/constants";
import { useRouter } from "next/router";
import React, { useRef, useEffect, useState } from "react";

console.log("Video player loaded");
console.log("API_URL =", API_URL);

interface Video {
  _id: string;
  videotitle: string;
  filepath: string;
}
interface VideoPlayerProps {
  videos: Video[];
  allowedMinutes?: number | null;
}

export default function VideoPlayer({
  videos,
  allowedMinutes,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [tapTimeout, setTapTimeout] = useState<NodeJS.Timeout | null>(null);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();

  const limitReachedRef = useRef(false);

  const handleTap = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x: number;
    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ("clientX" in e) {
      x = e.clientX - rect.left;
    } else {
      return;
    }
    const width = rect.width;

    let zone: "left" | "middle" | "right";
    if (x < width / 3) {
      zone = "left";
    } else if (x < (2 * width) / 3) {
      zone = "middle";
    } else {
      zone = "right";
    }

    setTapCount((prev) => prev + 1);

    if (tapTimeout) {
      clearTimeout(tapTimeout);
    }

    setTapTimeout(
      setTimeout(() => {
        if (tapCount === 1) {
          if (zone === "middle" && videoRef.current) {
            if (videoRef.current.paused) {
              videoRef.current.play().catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }
        } else if (tapCount === 2) {
          if (videoRef.current) {
            if (zone === "left") {
              videoRef.current.currentTime = Math.max(
                0,
                videoRef.current.currentTime - 10,
              );
            } else if (zone === "right") {
              videoRef.current.currentTime = Math.min(
                videoRef.current.duration,
                videoRef.current.currentTime + 10,
              );
            }
          }
        } else if (tapCount === 3) {
          if (zone === "middle") {
            setCurrentIndex((prev) => (prev + 1) % videos.length);
          } else if (zone === "right") {
            alert("Share Feature Coming Soon!");
          } else if (zone === "left") {
            alert("Comment Section Coming Soon!");
          }
        }

        setTapCount(0);
      }, 300),
    );
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex, videos]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!allowedMinutes || allowedMinutes === Infinity) return;

    const maxSeconds = allowedMinutes * 60;
    // const maxSeconds = 10; // For testing, limit to 10 seconds;

    const handleTimeUpdate = () => {
      if (!videoRef.current) return;
      if (limitReachedRef.current) return;

      if (videoRef.current.currentTime >= maxSeconds && !showUpgradeModal) {
        limitReachedRef.current = true;

        videoRef.current.currentTime = maxSeconds;
        videoRef.current.pause();

        // alert("Watch limit reached. Please upgrade your plan.");
        setShowUpgradeModal(true);
      }
    };

    videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [allowedMinutes]);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {videos && videos.length > 0 ? (
        <video
          ref={videoRef}
          className="w-full h-full"
          controls
          poster={`/placeholder.svg?height=480&width=854`}
        >
          <source
            src={`${API_URL}/${videos[currentIndex]?.filepath}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          No videos available.
        </div>
      )}

      {showUpgradeModal && (
        <div className="absolute inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl text-center space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold">Watch Limit Reached</h2>
            <p className="text-gray-500">
              Upgrade your plan to continue watching this video.
            </p>

            <button
              onClick={() => router.push("/upgrade")}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition cursor-pointer"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
