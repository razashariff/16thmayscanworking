
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BlogCategoriesProps {
  selectedCategory: string | null;
  onCategorySelect: (slug: string | null) => void;
}

const BlogCategories = ({ selectedCategory, onCategorySelect }: BlogCategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("posts")
        .select(`
          categories (
            id,
            name,
            slug
          )
        `)
        .not('categories', 'is', null)
        .order('created_at', { ascending: false });

      if (data) {
        // Extract unique categories from posts
        const uniqueCategories = data
          .map(post => post.categories)
          .filter((category, index, self) => 
            category && 
            index === self.findIndex(c => c?.id === category?.id)
          );
        setCategories(uniqueCategories);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => onCategorySelect(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm transition-all duration-300",
          selectedCategory === null
            ? "bg-gradient-to-r from-cyber-purple to-cyber-neon text-white shadow-lg"
            : "bg-cyber-dark/50 text-cyber-text hover:bg-cyber-dark/70"
        )}
      >
        All Posts
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm transition-all duration-300",
            selectedCategory === category.slug
              ? "bg-gradient-to-r from-cyber-purple to-cyber-neon text-white shadow-lg"
              : "bg-cyber-dark/50 text-cyber-text hover:bg-cyber-dark/70"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default BlogCategories;
