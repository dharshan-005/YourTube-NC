import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import CreateChannelForm from "@/components/CreateChannelForm";
import ChannelHeader from "@/components/ChannelHeader";
import Channeltabs from "@/components/Channeltabs";
import ChannelVideos from "@/components/ChannelVideos";
import VideoUploader from "@/components/VideoUploader";

import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

const index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [channel, setChannel] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [checkingChannel, setCheckingChannel] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);

  /**
   ✅ FETCH CHANNEL
   Hooks ALWAYS run first
   */
  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchChannel = async () => {
      try {
        const res = await axiosInstance.get(`/user/${id}`);
        setChannel(res.data);
      } catch (err) {
        console.error("Channel fetch error:", err);
        setChannel(null);
      } finally {
        setCheckingChannel(false);
      }
    };

    fetchChannel();
  }, [router.isReady, id]);

  /**
   ✅ FETCH VIDEOS
   */
  useEffect(() => {
    if (!id) return;

    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get(`/video/user/${id}`);
        setVideos(res.data || []);
      } catch (err) {
        console.error("Video fetch error:", err);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchVideos();
  }, [id]);

  /**
   ✅ CONDITIONAL UI AFTER HOOKS
   */

  if (!router.isReady || !user) {
    return <div className="p-6">Loading...</div>;
  }

  if (checkingChannel) {
    return <div className="p-6">Loading channel...</div>;
  }

  const isOwner = String(user._id) === String(id);

  /**
   ✅ OWNER BUT NO CHANNEL → SHOW CREATE
   */
  if (!channel && isOwner) {
    return <CreateChannelForm onCreated={setChannel} />;
  }

  /**
   ✅ VISITING SOMEONE ELSE'S CHANNEL BUT NOT FOUND
   */
  if (!channel && !isOwner) {
    return <div className="p-6 text-red-500">Channel not found</div>;
  }

  /**
   ✅ MAIN UI
   */
  return (
    <div className="flex-1 min-h-screen bg-white dark:bg-black">
      <div className="max-w-full mx-auto">
        
        {/* Channel Header */}
        <ChannelHeader channel={channel} user={user} />

        <Channeltabs />

        {/* ✅ Only owner can upload */}
        {isOwner && (
          <div className="px-4 pb-8">
            <VideoUploader
              channelId={channel._id}     // ✅ NOT user._id
              channelName={channel.channelname}
            />
          </div>
        )}

        {/* Videos */}
        <div className="px-4 pb-8">
          {loadingVideos ? (
            <div className="text-gray-500">Loading videos...</div>
          ) : videos.length === 0 ? (
            <div className="text-gray-500">No videos uploaded yet</div>
          ) : (
            <ChannelVideos videos={videos} />
          )}
        </div>

      </div>
    </div>
  );
};

export default index;

// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";

// import CreateChannelForm from "@/components/CreateChannelForm";
// import ChannelHeader from "@/components/ChannelHeader";
// import Channeltabs from "@/components/Channeltabs";
// import ChannelVideos from "@/components/ChannelVideos";
// import VideoUploader from "@/components/VideoUploader";

// import { useUser } from "@/lib/AuthContext";
// import axiosInstance from "@/lib/axiosinstance";

// const index = () => {
//   const router = useRouter();

//   const [channel, setChannel] = useState<any>(null);
//   const [checkingChannel, setCheckingChannel] = useState(true);

//   const { id } = router.query;
//   const { user } = useUser();

//   const [videos, setVideos] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   if (!router.isReady || !user) {
//     return <div>Loading...</div>;
//   }

//   // ✅ HOOKS MUST ALWAYS RUN
//   useEffect(() => {
//     if (!router.isReady || !id) return;

//     const fetchChannel = async () => {
//       try {
//         const res = await axiosInstance.get(`/channel/${id}`);
//         setChannel(res.data);
//       } catch (err) {
//         console.error("Error fetching channel:", err);
//         setChannel(null);
//       } finally {
//         setCheckingChannel(false);
//       }
//     };

//     fetchChannel();
//   }, [router.isReady, id]);

//   // useEffect(() => {
//   //   if (!user) return;

//   //   const fetchMyChannel = async () => {
//   //     try {
//   //       const res = await axiosInstance.get("/channel/${id}");
//   //       setChannel(res.data); // null OR channel object
//   //     } catch (err) {
//   //       console.error("Error fetching channel:", err);
//   //     } finally {
//   //       setCheckingChannel(false);
//   //     }
//   //   };

//   //   fetchMyChannel();
//   // }, [user]);

//   // ⬇️ CONDITIONAL RENDERING COMES AFTER HOOKS

//   if (!user) {
//     return <div>Please login</div>;
//   }

//   if (checkingChannel) {
//     return <div>Loading channel...</div>;
//   }
//   const isOwner = user._id === id;

//   if (!checkingChannel && !channel && isOwner) {
//     return <CreateChannelForm onCreated={setChannel} />;
//   }

//   if (!checkingChannel && !channel && !isOwner) {
//     return <div>Channel not found</div>;
//   }

//   // if (!channel) {
//   //   return <CreateChannelForm onCreated={setChannel} />; // 👈 show ONCE only
//   // }

//   return (
//     <div className="flex-1 min-h-screen bg-white dark:bg-black">
//       <div className="max-w-full mx-auto">
//         {/* Channel Header */}
//         <ChannelHeader channel={channel} user={user} channelId={id} />

//         {/* Tabs */}
//         <Channeltabs />

//         {/* Upload Section */}
//         <div className="px-4 pb-8">
//           <VideoUploader channelId={user._id} channelName={user.channelname} />
//         </div>

//         {/* Videos Section */}
//         <div className="px-4 pb-8">
//           {loading ? (
//             <div className="text-gray-500">Loading videos...</div>
//           ) : videos.length === 0 ? (
//             <div className="text-gray-500">No videos uploaded yet</div>
//           ) : (
//             <ChannelVideos videos={videos} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default index;

// // import ChannelHeader from "@/components/ChannelHeader";
// // import Channeltabs from "@/components/Channeltabs";
// // import ChannelVideos from "@/components/ChannelVideos";
// // import VideoUploader from "@/components/VideoUploader";
// // import { useUser } from "@/lib/AuthContext";
// // import { notFound } from "next/navigation";
// // import { useRouter } from "next/router";
// // import React from "react";

// // const index = () => {
// //   const router = useRouter();
// //   const { id } = router.query;
// //   const { user } = useUser();
// //   // const user: any = {
// //   //   id: "1",
// //   //   name: "John Doe",
// //   //   email: "john@example.com",
// //   //   image: "https://github.com/shadcn.png?height=32&width=32",
// //   // };
// //   try {
// //     let channel = user;

// //     const videos = [
// //       {
// //         _id: "1",
// //         videotitle: "Amazing Nature Documentary",
// //         filename: "nature-doc.mp4",
// //         filetype: "video/mp4",
// //         filepath: "/videos/nature-doc.mp4",
// //         filesize: "500MB",
// //         videochanel: "Nature Channel",
// //         Like: 1250,
// //         views: 45000,
// //         uploader: "nature_lover",
// //         createdAt: new Date().toISOString(),
// //       },
// //       {
// //         _id: "2",
// //         videotitle: "Cooking Tutorial: Perfect Pasta",
// //         filename: "pasta-tutorial.mp4",
// //         filetype: "video/mp4",
// //         filepath: "/videos/pasta-tutorial.mp4",
// //         filesize: "300MB",
// //         videochanel: "Chef's Kitchen",
// //         Like: 890,
// //         views: 23000,
// //         uploader: "chef_master",
// //         createdAt: new Date(Date.now() - 86400000).toISOString(),
// //       },
// //     ];
// //     return (
// //       <div className="flex-1 min-h-screen bg-white dark:bg-black">
// //         <div className="max-w-full mx-auto">
// //           <ChannelHeader channel={channel} user={user} />
// //           <Channeltabs />
// //           <div className="px-4 pb-8">
// //             <VideoUploader channelId={id} channelName={channel?.channelname} />
// //           </div>
// //           <div className="px-4 pb-8">
// //             <ChannelVideos videos={videos} />
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   } catch (error) {
// //     console.error("Error fetching channel data:", error);

// //   }
// // };

// // export default index;
