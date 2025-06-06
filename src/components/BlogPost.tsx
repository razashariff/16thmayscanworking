
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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-[#1a1528]/90 to-[#1f1f35]/90 border border-cyber-purple/20 backdrop-blur-sm shadow-xl hover:shadow-cyber-neon/10 transition-all duration-300">
      {/* Decorative gradient background that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/5 via-cyber-neon/5 to-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-neon group-hover:to-cyber-purple transition-all duration-300">
              {post.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-cyber-muted">
              <span className="text-cyber-purple">{post.author_name || "Anonymous"}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              {post.categories?.name && (
                <>
                  <span>•</span>
                  <span className="text-cyber-neon">{post.categories.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <p className="text-cyber-text whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-cyber-purple/10 pt-4 relative z-10">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 hover:text-cyber-neon hover:bg-cyber-neon/10 transition-colors ${
              isLiked ? "text-cyber-neon" : "text-cyber-text"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>{post.likes_count || 0}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 hover:text-cyber-neon hover:bg-cyber-neon/10 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments?.length || 0}</span>
          </Button>
        </div>
      </CardFooter>
      
      {showComments && (
        <div className="border-t border-cyber-purple/10 p-4 relative z-10">
          <CommentSection postId={post.id} onUpdate={onUpdate} />
        </div>
      )}
    </Card>
  );
};

export default BlogPost;
