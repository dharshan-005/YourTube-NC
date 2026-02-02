"use client";

import React, { useRef, useEffect, useState } from "react";

interface Video {
  _id: string;
  videotitle: string;
  filepath: string;
}
interface VideoPlayerProps {
  videos: Video[];
}

export default function VideoPlayer({ videos }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [tapTimeout, setTapTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleTap = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
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
                videoRef.current.currentTime - 10
              );
            } else if (zone === "right") {
              videoRef.current.currentTime = Math.min(
                videoRef.current.duration,
                videoRef.current.currentTime + 10
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
      }, 300)
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

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      {videos && videos.length > 0 ? (
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        poster={`/placeholder.svg?height=480&width=854`}
      >
        <source
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${videos[currentIndex]?.filepath}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          No videos available.
        </div>
      )}
    </div>
  );
}
