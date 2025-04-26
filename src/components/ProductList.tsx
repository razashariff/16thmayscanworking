import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const products = [
  {
    title: "Databutton AI",
    subtitle: "AI-Built Software",
    description: "Full-Stack No Code Tool with Human Help. Your hunt for a CTO ends here.",
    action: "Security Scores",
    color: "from-emerald-400 to-teal-500"
  },
  {
    title: "CopyCoder",
    subtitle: "Clone Any Project",
    description: "Turn designs into code instantly! Create powerful prompts for AI coding tools.",
    action: "Security Scores",
    color: "from-indigo-400 to-purple-500"
  },
  {
    title: "Sofgen AI",
    subtitle: "Automate Everything",
    description: "No-code AI automation! Build AI-powered workflows effortlessly.",
    action: "Security Scores",
    color: "from-fuchsia-400 to-pink-500"
  }
];

const ProductList = ({ showSecurityButton = true }) => {
  return (
    <div className="space-y-6 p-6">
      {showSecurityButton && (
        <div className="transform transition-all duration-500 ease-in-out hover:scale-105 opacity-90 hover:opacity-100">
          <div className="glass-panel p-6 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple transition-all duration-500">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-cyber-neon h-6 w-6" />
              <h3 className="text-lg font-semibold text-white">Security Analysis</h3>
            </div>
            <p className="text-sm text-white/80 mb-4">
              See Security Scores for AI tooling and our reviews on key security features of the AI tools.
            </p>
            <Button 
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/20 transition-all duration-300"
              asChild
            >
              <Link to="/security-scores">Security Scores</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
