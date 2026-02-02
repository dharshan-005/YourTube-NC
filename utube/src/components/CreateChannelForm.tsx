import { useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

const CreateChannelForm = ({ onCreated }: any) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Channel name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/channel", {
        name,
        description,
      });

      toast.success("Channel created successfully");
      onCreated(res.data); // 🔑 update parent state
    } catch (error) {
      console.error("Create channel error:", error);
      toast.error("Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-lg bg-white dark:bg-black">
      <h2 className="text-xl font-semibold mb-4">Create your channel</h2>

      <div className="space-y-4">
        <Input
          placeholder="Channel name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          placeholder="Channel description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create Channel"}
        </Button>
      </div>
    </div>
  );
};

export default CreateChannelForm;
