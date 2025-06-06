
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import BlogPost from "@/components/BlogPost";
import CreatePostDialog from "@/components/CreatePostDialog";
import BlogSearch from "@/components/BlogSearch";
import { Rocket, LogOut } from "lucide-react";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchPosts = async (query = "") => {
    try {
      setIsLoading(true);
      let supabaseQuery = supabase
        .from("posts")
        .select(`
          *,
          likes(count),
          comments(count)
        `)
        .order("created_at", { ascending: false });

      if (query) {
        supabaseQuery = supabaseQuery.ilike("title", `%${query}%`);
      }

      const { data, error } = await supabaseQuery;

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

  useEffect(() => {
    fetchPosts(searchQuery);
  }, [searchQuery]);

  const handlePostCreated = () => {
    setIsCreatePostOpen(false);
    fetchPosts(searchQuery);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Successfully logged out",
      });
      
      // Delay navigation to show the toast
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-[#1a1528] to-[#1f1f35] bg-fixed">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="relative mb-12 text-center">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-5xl font-bold gradient-text">VibeCoding Community Blog</h1>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-cyber-text hover:text-cyber-neon flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
            <p className="text-cyber-text text-xl mb-8 max-w-2xl mx-auto">
              Latest security news, updates, and community discussions about AI and cybersecurity
            </p>
            <Button 
              onClick={() => setIsCreatePostOpen(true)}
              className="bg-gradient-to-r from-cyber-purple via-cyber-neon to-cyber-blue hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-cyber-neon/20 group"
            >
              <Rocket className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:rotate-12" />
              Write Something
            </Button>
          </div>
          
          <div className="absolute inset-0 -z-10 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyber-purple rounded-full filter blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyber-neon rounded-full filter blur-[100px]" />
          </div>
        </div>

        <BlogSearch onSearch={setSearchQuery} />

        <div className="grid gap-8 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center text-cyber-muted">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-cyber-muted">
              {searchQuery 
                ? "No posts found matching your search. Try a different query!"
                : "No posts yet. Be the first to share!"}
            </div>
          ) : (
            posts.map((post) => (
              <BlogPost key={post.id} post={post} onUpdate={() => fetchPosts(searchQuery)} />
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
