import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { Globe2, ThumbsUp, ThumbsDown } from "lucide-react";
import axios from "axios";

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon: string;
  city?: string;
  likes?: string[];
  dislikes?: string[];
}

const Comments = ({ videoId }: any) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/comment/${videoId}`);
      setComments(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/comment/postcomment", {
        videoid: videoId,
        userid: user._id,
        commentbody: newComment,
      });

      if (res.data.comment) {
        setComments([res.data.comment, ...comments]);
      }

      setNewComment("");
      console.log("City:", res.data.comment.city);
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const res = await axiosInstance.post(`/comment/like/${id}`, {
        userid: user?._id,
      });
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDislike = async (id: string) => {
    try {
      const res = await axiosInstance.post(`/comment/dislike/${id}`, {
        userid: user?._id,
      });
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTranslate = async (commentId: string, text: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/comment/translate",
        {
          commentText: text,
          targetLanguage: selectedLang,
        }
      );

      // console.log("Translated:", response.data.translatedText);
      // setTranslated(response.data.translatedText);
      setTranslations((prev) => ({
        ...prev,
        [commentId]: response.data.translatedText,
      }));
    } catch (error) {
      console.error("Translate error:", error);
    }
  };

  if (loading) return <div>Loading comments...</div>;
  console.log("Sending language:", selectedLang);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

      {/* COMMENT INPUT */}
      {user && (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-20 resize-none border-0 border-b-2 rounded-none"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => setNewComment("")}
                disabled={!newComment.trim()}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* COMMENTS LIST */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="flex gap-4 p-3 rounded-lg dark:bg-[#313131] bg-gray-100"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.usercommented}`} />
              <AvatarFallback>
                {comment.usercommented?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              {/* HEADER */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">
                  {comment.usercommented || "Unknown User"}
                </span>
                <span className="text-xs text-gray-200">
                  {formatDistanceToNow(new Date(comment.commentedon))} ago
                </span>
                {comment.city && (
                  <span className="text-xs px-2 py-0.5 rounded-full">
                    {comment.city}
                  </span>
                )}
              </div>

              {/* BODY */}
              <p className="text-sm mb-2">{comment.commentbody}</p>

              {/* ACTIONS */}
              <div className="flex gap-4 items-center text-sm text-gray-200">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleLike(comment._id)}
                >
                  <ThumbsUp size={16} /> {comment.likes?.length || 0}
                </button>

                <button
                  className="flex items-center gap-1"
                  onClick={() => handleDislike(comment._id)}
                >
                  <ThumbsDown size={16} /> {comment.dislikes?.length || 0}
                </button>

                <select
                  className="border rounded px-2 py-1 dark:text-white dark:bg-[#313131]"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="ml">Malayalam</option>
                  <option value="kn">Kannada</option>
                </select>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    handleTranslate(comment._id, comment.commentbody)
                  }
                >
                  <Globe2 size={16} /> Translate
                </Button>
              </div>

              {/* TRANSLATED TEXT FOR THIS COMMENT ONLY */}
              {translations[comment._id] && (
                <p className="mt-2 text-sm italic text-blue-600">
                  {translations[comment._id]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;