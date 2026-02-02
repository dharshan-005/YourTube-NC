import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { Globe2, ThumbsUp, ThumbsDown } from "lucide-react";

interface Comment {
  _id: string;
  commentbody: string;
  usercommented: string;
  commentedon: string;
  city: string;
  likes?: number;
  dislikes?: number;
}

const Comments = ({ videoId }: { videoId: string }) => {
  const { user } = useUser();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedLang, setSelectedLang] = useState("en");
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/comment/${videoId}`);
      setComments(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/comment/postcomment", {
        videoid: videoId,
        userid: user._id,
        usercommented: user.name, // ✅ FIX
        commentbody: newComment,
      });

      setComments((prev) => [res.data.comment, ...prev]);
      setNewComment("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    // optional – not implemented backend-side
  };

  const handleDislike = async (id: string) => {
    try {
      const res = await axiosInstance.put(`/comment/dislike/${id}`);

      if (res.data.deleted) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      } else {
        setComments((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, dislikes: res.data.dislikes } : c,
          ),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleTranslate = async (id: string, text: string) => {
    try {
      const res = await axiosInstance.post("/comment/translate", {
        commentText: text,
        targetLanguage: selectedLang,
      });

      setTranslations((prev) => ({
        ...prev,
        [id]: res.data.translatedText,
      }));
    } catch {
      alert("Translation failed");
    }
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      await axiosInstance.put(`/comment/edit/${editingId}`, {
        commentbody: editingText,
      });

      setComments((prev) =>
        prev.map((c) =>
          c._id === editingId ? { ...c, commentbody: editingText } : c,
        ),
      );

      setEditingId(null);
      setEditingText("");
    } catch {
      alert("Edit failed");
    }
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

      {/* COMMENT INPUT */}
      {user && (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setNewComment("")}>
                Cancel
              </Button>
              <Button
                disabled={isSubmitting || !newComment.trim()}
                onClick={handleSubmitComment}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* COMMENT LIST */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c._id}
            className="flex gap-3 p-3 rounded-lg bg-gray-100 dark:bg-[#2b2b2b]"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.usercommented}`}
              />
              <AvatarFallback>{c.usercommented?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <span className="font-medium">{c.usercommented}</span>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(c.commentedon))} ago
                </span>
                {c.city && <span className="text-xs">{c.city}</span>}
              </div>

              {/* BODY / EDIT */}
              {editingId === c._id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-1">{c.commentbody}</p>
              )}

              {/* ACTIONS */}
              <div className="flex gap-4 mt-2 text-sm">
                <button
                  onClick={() => handleLike(c._id)}
                  className="flex items-center gap-1 text-gray-600"
                >
                  <ThumbsUp size={16} /> {c.likes || 0}
                </button>

                <button
                  onClick={() => handleDislike(c._id)}
                  className="flex items-center gap-1 text-gray-600"
                >
                  <ThumbsDown size={16} /> {c.dislikes || 0}
                </button>

                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="border px-2 py-0.5 rounded"
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
                  onClick={() => handleTranslate(c._id, c.commentbody)}
                >
                  <Globe2 size={16} /> Translate
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => startEditing(c._id, c.commentbody)}
                >
                  Edit
                </Button>
              </div>

              {/* TRANSLATED TEXT */}
              {translations[c._id] && (
                <p className="italic text-green-600 mt-2">
                  Translated: {translations[c._id]}
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

// import React, { useEffect, useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { Textarea } from "./ui/textarea";
// import { Button } from "./ui/button";
// import { formatDistanceToNow } from "date-fns";
// import { useUser } from "@/lib/AuthContext";
// import axiosInstance from "@/lib/axiosinstance";
// import { Globe2, ThumbsUp, ThumbsDown } from "lucide-react";

// interface Comment {
//   _id: string;
//   videoid: string;
//   userid: string;
//   commentbody: string;
//   usercommented: string;
//   commentedon: string;
//   city?: string;
//   likes?: number;
//   dislikes?: number;
// }

// const Comments = ({ videoId }: any) => {
//   const { user } = useUser();

//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedLang, setSelectedLang] = useState("en");
//   const [translations, setTranslations] = useState<Record<string, string>>({});
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editingText, setEditingText] = useState("");

//   useEffect(() => {
//        loadComments();
//   }, [videoId]);

//   // ===========================
//   // LOAD COMMENTS
//   // ===========================
//   const loadComments = async () => {
//     try {
//       const res = await axiosInstance.get(`/comment/${videoId}`);
//       setComments(res.data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===========================
//   // POST NEW COMMENT
//   // ===========================
//   const handleSubmitComment = async () => {
//     if (!newComment.trim() || !user) return;

//     setIsSubmitting(true);
//     try {
//       const res = await axiosInstance.post("/comment/postcomment", {
//         videoid: videoId,
//         userid: user._id,
//         commentbody: newComment,
//         userCommented: user.name,
//         // city,
//       });

//       setComments((prev) => [res.data.comment, ...prev]);
//       setNewComment("");
//     } catch (error: any) {
//       alert(error.response?.data?.message || "Failed to post");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ===========================
//   // LIKE COMMENT
//   // ===========================
//   const handleLike = async (id: string) => {
//     try {
//       const res = await axiosInstance.post(`/comment/like/${id}`);

//       setComments((prev) =>
//         prev.map((c) =>
//           c._id === id ? { ...c, likes: res.data.likes } : c
//         )
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // ===========================
//   // DISLIKE COMMENT
//   // ===========================
//   const handleDislike = async (id: string) => {
//     try {
//       const res = await axiosInstance.put(`/comment/dislike/${id}`);

//       // auto-delete
//       if (res.data.deleted) {
//         setComments((prev) => prev.filter((c) => c._id !== id));
//         return;
//       }

//       setComments((prev) =>
//         prev.map((c) =>
//           c._id === id ? { ...c, dislikes: res.data.dislikes } : c
//         )
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // ===========================
//   // TRANSLATE COMMENT
//   // ===========================
//   const handleTranslate = async (commentId: string, text: string) => {
//     try {
//       const res = await axiosInstance.post("/comment/translate", {
//         commentText: text,
//         targetLanguage: selectedLang,
//       });

//       setTranslations((prev) => ({
//         ...prev,
//         [commentId]: res.data.translatedText,
//       }));
//     } catch (error) {
//       console.log(error);
//       alert("Translation failed");
//     }
//   };

//   // ===========================
//   // EDIT COMMENT
//   // ===========================
//   const startEditing = (id: string, text: string) => {
//     setEditingId(id);
//     setEditingText(text);
//   };

//   const saveEdit = async () => {
//     if (!editingId) return;

//     try {
//       await axiosInstance.put(`/comment/edit/${editingId}`, {
//         commentbody: editingText,
//       });

//       setComments((prev) =>
//         prev.map((c) =>
//           c._id === editingId ? { ...c, commentbody: editingText } : c
//         )
//       );

//       setEditingId(null);
//       setEditingText("");
//     } catch (error) {
//       alert("Edit failed");
//     }
//   };

//   // ===========================
//   // UI
//   // ===========================
//   if (loading) return <div>Loading comments...</div>;

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

//       {/* COMMENT INPUT */}
//       {user && (
//         <div className="flex gap-4">
//           <Avatar className="w-10 h-10">
//             <AvatarImage src={user.image || ""} />
//             <AvatarFallback>{user.name?.[0]}</AvatarFallback>
//           </Avatar>

//           <div className="flex-1 space-y-2">
//             <Textarea
//               placeholder="Add a comment..."
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//             />

//             <div className="flex justify-end gap-2">
//               <Button variant="ghost" onClick={() => setNewComment("")}>
//                 Cancel
//               </Button>
//               <Button disabled={isSubmitting || !newComment.trim()} onClick={handleSubmitComment}>
//                 Comment
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* COMMENT LIST */}
//       <div className="space-y-4">
//         {comments.map((c) => (
//           <div key={c._id} className="flex gap-3 p-3 rounded-lg bg-gray-100 dark:bg-[#2b2b2b]">
//             <Avatar className="w-10 h-10">
//               <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.usercommented}`} />
//               <AvatarFallback>{c.usercommented?.charAt(0)}</AvatarFallback>
//             </Avatar>

//             <div className="flex-1">
//               <div className="flex gap-2 items-center">
//                 <span className="font-medium">{c.usercommented}</span>
//                 <span className="text-xs text-gray-400">
//                   {formatDistanceToNow(new Date(c.commentedon))} ago
//                 </span>
//                 {c.city && <span className="text-xs">{c.city}</span>}
//               </div>

//               {/* BODY / EDIT */}
//               {editingId === c._id ? (
//                 <div className="space-y-2">
//                   <Textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} />
//                   <div className="flex gap-2">
//                     <Button size="sm" onClick={saveEdit}>Save</Button>
//                     <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="mt-1">{c.commentbody}</p>
//               )}

//               {/* ACTIONS */}
//               <div className="flex gap-4 mt-2 text-sm">
//                 <button onClick={() => handleLike(c._id)} className="flex items-center gap-1 text-gray-600">
//                   <ThumbsUp size={16} /> {c.likes || 0}
//                 </button>

//                 <button onClick={() => handleDislike(c._id)} className="flex items-center gap-1 text-gray-600">
//                   <ThumbsDown size={16} /> {c.dislikes || 0}
//                 </button>

//                 <select
//                   value={selectedLang}
//                   onChange={(e) => setSelectedLang(e.target.value)}
//                   className="border px-2 py-0.5 rounded"
//                 >
//                   <option value="en">English</option>
//                   <option value="hi">Hindi</option>
//                   <option value="ta">Tamil</option>
//                   <option value="te">Telugu</option>
//                   <option value="ml">Malayalam</option>
//                   <option value="kn">Kannada</option>
//                 </select>

//                 <Button size="sm" variant="ghost" onClick={() => handleTranslate(c._id, c.commentbody)}>
//                   <Globe2 size={16} /> Translate
//                 </Button>

//                 <Button size="sm" variant="ghost" onClick={() => startEditing(c._id, c.commentbody)}>
//                   Edit
//                 </Button>
//               </div>

//               {/* TRANSLATED TEXT */}
//               {translations[c._id] && (
//                 <p className="italic text-green-600 mt-2">
//                   Translated: {translations[c._id]}
//                 </p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Comments;
