import React, { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const ChannelHeader = ({ channel, user, channelId }: any) => {
  const isOwner = user?._id === channelId;
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!channel) return null;

  const channelName =
    channel?.channelname || channel?.channelName || channel?.name || "Unknown";

  return (
    <div className="w-full bg-white shadow-md dark:bg-black">
      <div className="relative h-32 md:h-48 lg:h-64 bg-linear-to-r from-blue-400 to-purple-500" />

      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="w-20 h-20 md:w-32 md:h-32">
            <AvatarFallback className="text-2xl">
              {channelName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold dark:text-white">
              {channelName}
            </h1>

            <span className="text-sm text-gray-600">
              @{channelName.toLowerCase().replace(/\s+/g, "")}
            </span>

            {channel?.description && (
              <p className="text-sm text-gray-700 max-w-2xl">
                {channel.description}
              </p>
            )}
          </div>

          {user && user._id !== channel._id && (
            <Button
              onClick={() => setIsSubscribed(!isSubscribed)}
              variant={isSubscribed ? "outline" : "default"}
              className={
                isSubscribed ? "bg-gray-100" : "bg-red-600 hover:bg-red-700"
              }
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          )}
        </div>
      </div>

      {/* {!isOwner && user && (
        <Button className="bg-red-600 hover:bg-red-700">Subscribe</Button>
      )} */}
    </div>
  );
};

export default ChannelHeader;
