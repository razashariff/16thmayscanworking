
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import CommentSection from "./CommentSection";

interface BlogPostProps {
  post: any;
  onUpdate: () => void;
}

const BlogPost = ({ post, onUpdate }: BlogPostProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "Please login to like posts",
          variant: "destructive",
        });
        return;
      }

      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .match({ post_id: post.id, user_id: user.id });
      } else {
        await supabase
          .from("likes")
          .insert({ post_id: post.id, user_id: user.id });
      }

      setIsLiked(!isLiked);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-sm text-cyber-muted">
              Posted by {post.author_name || "Anonymous"} •{" "}
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-cyber-text whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 ${
              isLiked ? "text-red-500" : "text-cyber-text"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>{post.likes_count || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments?.length || 0}</span>
          </Button>
        </div>
      </CardFooter>
      {showComments && (
        <CommentSection postId={post.id} onUpdate={onUpdate} />
      )}
    </Card>
  );
};

export default BlogPost;
