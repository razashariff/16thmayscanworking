
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  postId: string;
  onUpdate: () => void;
}

const CommentSection = ({ postId, onUpdate }: CommentSectionProps) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Please login to comment");

      const { error } = await supabase.from("comments").insert({
        content: newComment,
        post_id: postId,
        user_id: user.id,
        author_name: user.email?.split("@")[0],
      });

      if (error) throw error;

      setNewComment("");
      fetchComments();
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border-t border-border">
      <form onSubmit={handleSubmit} className="mb-4">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          className="mb-2"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-neon"
        >
          {isLoading ? "Posting..." : "Post Comment"}
        </Button>
      </form>
      <div className="space-y-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="p-3 rounded-md bg-cyber-dark/50">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium">
                {comment.author_name || "Anonymous"}
              </span>
              <span className="text-xs text-cyber-muted">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-sm text-cyber-text">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
