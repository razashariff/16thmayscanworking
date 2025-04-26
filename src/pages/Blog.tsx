
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
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-[#1a1528] to-[#1f1f35]">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="relative mb-12 text-center">
          <h1 className="text-5xl font-bold gradient-text mb-4">VibeCoding Community Blog</h1>
          <p className="text-cyber-text text-xl mb-8 max-w-2xl mx-auto">
            Latest security news, updates, and community discussions about AI and cybersecurity
          </p>
          <Button 
            onClick={() => setIsCreatePostOpen(true)}
            className="bg-gradient-to-r from-cyber-purple via-cyber-neon to-cyber-blue hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-cyber-neon/20"
          >
            Write Something
          </Button>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center text-cyber-muted">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-cyber-muted">No posts yet. Be the first to share!</div>
          ) : (
            posts.map((post) => (
              <BlogPost key={post.id} post={post} onUpdate={fetchPosts} />
            ))
          )}
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
