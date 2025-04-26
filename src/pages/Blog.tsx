
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import BlogPost from "@/components/BlogPost";
import CreatePostDialog from "@/components/CreatePostDialog";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*, likes(count), comments(count)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = () => {
    setIsCreatePostOpen(false);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold gradient-text">VibeCoding Community Blog</h1>
          <p className="text-cyber-text text-lg">
            Latest security news, updates, and community discussions
          </p>
          <Button 
            onClick={() => setIsCreatePostOpen(true)}
            className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-neon"
          >
            Write Something
          </Button>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <BlogPost key={post.id} post={post} onUpdate={fetchPosts} />
          ))}
        </div>

        <CreatePostDialog 
          open={isCreatePostOpen} 
          onOpenChange={setIsCreatePostOpen}
          onPostCreated={handlePostCreated}
        />
      </div>
    </div>
  );
};

export default Blog;
