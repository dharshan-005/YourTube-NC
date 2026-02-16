import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Download,
  MoreHorizontal,
  Share,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import PremiumModal from "./PremiumModal";
// import refreshUser from "../lib/AuthContext"

/* ---------------- TYPES ---------------- */

type Video = {
  _id: string;
  videotitle: string;
  videochanel: string;
  views: number;
  createdAt: string;
  Like?: number;
  Dislike?: number;
};

type VideoInfoProps = {
  video: Video;
};

/* ---------------- COMPONENT ---------------- */

const VideoInfo = ({ video }: VideoInfoProps) => {
  const { user, refreshUser } = useUser();

  const [likes, setLikes] = useState<number>(video.Like || 0);
  const [dislikes, setDislikes] = useState<number>(video.Dislike || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Premium modal
  const [showPremium, setShowPremium] = useState(false);

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    setLikes(video.Like || 0);
    setDislikes(video.Dislike || 0);
    setIsLiked(false);
    setIsDisliked(false);
  }, [video]);

  useEffect(() => {
    const handleViews = async () => {
      try {
        if (user) {
          await axiosInstance.post(`/history/${video._id}`, {
            userId: user._id,
          });
        } else {
          await axiosInstance.post(`/history/views/${video._id}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    handleViews();
  }, [user, video._id]);

  /* ---------------- LIKE / DISLIKE ---------------- */

  const handleLike = async () => {
    if (!user) return;

    try {
      const res = await axiosInstance.post(`/like/${video._id}`, {
        userId: user._id,
      });

      if (res.data.liked) {
        if (isLiked) {
          setLikes((p) => p - 1);
          setIsLiked(false);
        } else {
          setLikes((p) => p + 1);
          setIsLiked(true);
          if (isDisliked) {
            setDislikes((p) => p - 1);
            setIsDisliked(false);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async () => {
    if (!user) return;

    try {
      const res = await axiosInstance.post(`/like/${video._id}`, {
        userId: user._id,
      });

      if (!res.data.liked) {
        if (isDisliked) {
          setDislikes((p) => p - 1);
          setIsDisliked(false);
        } else {
          setDislikes((p) => p + 1);
          setIsDisliked(true);
          if (isLiked) {
            setLikes((p) => p - 1);
            setIsLiked(false);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- DOWNLOAD ---------------- */

  const handleDownload = async () => {
    if (!user) {
      alert("Please login to download the video.");
      return;
    }

    try {
      // STEP 1: permission check + DB update
      await axiosInstance.post(`/download/${video._id}`);
      await refreshUser();

      // STEP 2: secure file download (auth-safe)
      const res = await axiosInstance.get(`/video/download/${video._id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${video.videotitle}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setShowPremium(true);
      } else {
        alert("Download failed!");
      }
    }
  };

  /* ---------------- JSX ---------------- */

  return (
    <div className="space-y-4 text-black dark:text-white">
      <h1 className="text-xl font-semibold">{video.videotitle}</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback>{video.videochanel?.[0]}</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-medium">{video.videochanel}</h3>
            <p className="text-sm text-gray-600">Subscribers</p>
          </div>

          <Button className="ml-4">Subscribe</Button>
        </div>

        <div className="flex items-center text-black gap-2 flex-row">
          <div className="flex items-center bg-gray-100 text-black rounded-full">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-l-full"
              onClick={handleLike}
            >
              <ThumbsUp
                className={`w-5 h-5 mr-2 ${
                  isLiked ? "fill-black text-black" : ""
                }`}
              />
              {likes.toLocaleString()}
            </Button>

            <div className="w-px h-6 bg-gray-300" />

            <Button
              variant="ghost"
              size="sm"
              className="rounded-r-full"
              onClick={handleDislike}
            >
              <ThumbsDown
                className={`w-5 h-5 mr-2 ${
                  isDisliked ? "fill-black text-black" : "text-black"
                }`}
              />
              {dislikes.toLocaleString()}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-100 rounded-full"
          >
            <Share className="w-5 h-5 mr-2" />
            Share
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="bg-gray-100 rounded-full"
            onClick={handleDownload}
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="bg-gray-100 rounded-full"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-[#303030] rounded-lg p-4">
        <div className="flex gap-4 text-sm font-medium mb-2">
          <span>{video.views.toLocaleString()} views</span>
          <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
        </div>

        <div className={`text-sm ${showFullDescription ? "" : "line-clamp-3"}`}>
          <p>
            Sample video description. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Autem aut totam quisquam quibusdam saepe.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-2 p-0 h-auto font-medium"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Show less" : "Show more"}
        </Button>
      </div>

      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  );
};

export default VideoInfo;

// import React, { useEffect, useState } from "react";
// import { Avatar, AvatarFallback } from "./ui/avatar";
// import { Button } from "./ui/button";
// import {
//   Clock,
//   Download,
//   MoreHorizontal,
//   Share,
//   ThumbsDown,
//   ThumbsUp,
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import { useUser } from "@/lib/AuthContext";
// import axiosInstance from "@/lib/axiosinstance";
// import { API_URL } from "@/lib/constants";

// const VideoInfo = ({ video }: any) => {
//   const [likes, setlikes] = useState(video.Like || 0);
//   const [dislikes, setDislikes] = useState(video.Dislike || 0);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isDisliked, setIsDisliked] = useState(false);
//   const [showFullDescription, setShowFullDescription] = useState(false);
//   const { user } = useUser();
//   const [isWatchLater, setIsWatchLater] = useState(false);

//   // Premium
//   const [showPremium, setShowPremium] = useState(false);

//   // const user: any = {
//   //   id: "1",
//   //   name: "John Doe",
//   //   email: "john@example.com",
//   //   image: "https://github.com/shadcn.png?height=32&width=32",
//   // };
//   useEffect(() => {
//     setlikes(video.Like || 0);
//     setDislikes(video.Dislike || 0);
//     setIsLiked(false);
//     setIsDisliked(false);
//   }, [video]);

//   useEffect(() => {
//     const handleviews = async () => {
//       if (user) {
//         try {
//           return await axiosInstance.post(`/history/${video?._id}`, {
//             userId: user?._id,
//           });
//         } catch (error) {
//           return console.log(error);
//         }
//       } else {
//         return await axiosInstance.post(`/history/views/${video?._id}`);
//       }
//     };
//     handleviews();
//   }, [user]);

//   const handleLike = async () => {
//     if (!user) return;
//     try {
//       const res = await axiosInstance.post(`/like/${video._id}`, {
//         userId: user?._id,
//       });
//       if (res.data.liked) {
//         if (isLiked) {
//           setlikes((prev: any) => prev - 1);
//           setIsLiked(false);
//         } else {
//           setlikes((prev: any) => prev + 1);
//           setIsLiked(true);
//           if (isDisliked) {
//             setDislikes((prev: any) => prev - 1);
//             setIsDisliked(false);
//           }
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleWatchLater = async () => {
//     try {
//       const res = await axiosInstance.post(`/watch/${video._id}`, {
//         userId: user?._id,
//       });
//       if (res.data.watchlater) {
//         setIsWatchLater(!isWatchLater);
//       } else {
//         setIsWatchLater(false);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDislike = async () => {
//     if (!user) return;
//     try {
//       const res = await axiosInstance.post(`/like/${video._id}`, {
//         userId: user?._id,
//       });
//       if (!res.data.liked) {
//         if (isDisliked) {
//           setDislikes((prev: any) => prev - 1);
//           setIsDisliked(false);
//         } else {
//           setDislikes((prev: any) => prev + 1);
//           setIsDisliked(true);
//           if (isLiked) {
//             setlikes((prev: any) => prev - 1);
//             setIsLiked(false);
//           }
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Download
//   const handleDownload = async () => {
//     if (!user) {
//       alert("Please login to download the video.");
//       return;
//     }

//     try {
//       // STEP 1: permission check + DB update
//       await axiosInstance.post(`/download/${video._id}`);

//       // STEP 2: actual download
//       const downloadUrl = `${API_URL}/video/download/${video._id}`;
//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.setAttribute("download", "");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error: any) {
//       if (error?.response?.status === 403) {
//         alert("Daily limit reached. Go Premium!");
//         // open premium modal here
//       } else {
//         alert("Download failed!");
//       }
//     }
//   };

//   return (
//     <div className="space-y-4 text-black dark:text-white">
//       <h1 className="text-xl font-semibold">{video.videotitle}</h1>

//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-4">
//           <Avatar className="w-10 h-10">
//             <AvatarFallback>{video.videochanel[0]}</AvatarFallback>
//           </Avatar>
//           <div>
//             <h3 className="font-medium">{video.videochanel}</h3>
//             <p className="text-sm text-gray-600">1.2M subscribers</p>
//           </div>
//           <Button className="ml-4">Subscribe</Button>
//         </div>
//         <div className="flex items-center text-black gap-2 flex-row">
//           <div className="flex items-center bg-gray-100 text-black rounded-full">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="rounded-l-full"
//               onClick={handleLike}
//             >
//               <ThumbsUp
//                 className={`w-5 h-5 mr-2 ${
//                   isLiked ? "fill-black text-black" : "text-black"
//                 }`}
//               />
//               {likes.toLocaleString()}
//             </Button>
//             <div className="w-px h-6 bg-gray-300" />
//             <Button
//               variant="ghost"
//               size="sm"
//               className="rounded-r-full"
//               onClick={handleDislike}
//             >
//               <ThumbsDown
//                 className={`w-5 h-5 mr-2 ${
//                   isDisliked ? "fill-black text-black" : "text-black"
//                 }`}
//               />
//               {dislikes.toLocaleString()}
//             </Button>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="bg-gray-100 rounded-full"
//           >
//             <Share className="w-5 h-5 mr-2" />
//             Share
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="bg-gray-100 rounded-full"
//             onClick={handleDownload}
//           >
//             <Download className="w-5 h-5 mr-2" />
//             Download
//           </Button>
//           {/* <Button
//             variant="ghost"
//             size="sm"
//             className={`bg-gray-100 rounded-full ${
//               isWatchLater ? "text-primary" : ""
//             }`}
//             onClick={handleWatchLater}
//           >
//             <Clock className="w-5 h-5 mr-2" />
//             {isWatchLater ? "Saved" : "Watch Later"}
//           </Button> */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="bg-gray-100 rounded-full"
//           >
//             <MoreHorizontal className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>
//       <div className="bg-gray-100 text-black dark:bg-[#303030] dark:text-white rounded-lg p-4">
//         <div className="flex gap-4 text-sm font-medium mb-2">
//           <span>{video.views.toLocaleString()} views</span>
//           <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
//         </div>
//         <div className={`text-sm ${showFullDescription ? "" : "line-clamp-3"}`}>
//           <p>
//             Sample video description. Lorem ipsum dolor sit amet, consectetur
//             adipisicing elit. Autem aut totam quisquam quibusdam saepe
//             voluptatem consectetur dolor, natus voluptatibus debitis molestias
//             nam soluta quidem hic obcaecati ipsam, incidunt cupiditate. Sint
//             facilis iusto, incidunt a exercitationem sequi sed nulla consectetur
//             itaque magni rem maiores pariatur, nemo mollitia dolorem, minima
//             vero! Totam blanditiis quos, consequatur vel illum incidunt labore,
//             dolor soluta officiis deserunt odit? Cumque est officiis sequi
//             necessitatibus obcaecati dolor expedita eaque tenetur! Perspiciatis,
//             nihil vero.
//           </p>
//         </div>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="mt-2 p-0 h-auto font-medium"
//           onClick={() => setShowFullDescription(!showFullDescription)}
//         >
//           {showFullDescription ? "Show less" : "Show more"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default VideoInfo;
