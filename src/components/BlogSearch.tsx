
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
}

const BlogSearch = ({ onSearch }: BlogSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-text/50" />
        <Input
          type="search"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-cyber-dark/50 border-cyber-purple/20 text-cyber-text placeholder:text-cyber-text/50 w-full"
        />
      </div>
    </form>
  );
};

export default BlogSearch;
