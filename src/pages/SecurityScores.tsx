
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Star, StarOff } from 'lucide-react';

const products = [
  {
    title: "Databutton AI",
    subtitle: "AI-Built Software",
    description: "Full-Stack No Code Tool with Human Help. Your hunt for a CTO ends here.",
    action: "Security Scores",
    color: "from-emerald-400 to-teal-500",
    rating: "A"
  },
  {
    title: "CopyCoder",
    subtitle: "Clone Any Project",
    description: "Turn designs into code instantly! Create powerful prompts for AI coding tools.",
    action: "Security Scores",
    color: "from-indigo-400 to-purple-500",
    rating: "B"
  },
  {
    title: "Sofgen AI",
    subtitle: "Automate Everything",
    description: "No-code AI automation! Build AI-powered workflows effortlessly.",
    action: "Security Scores",
    color: "from-fuchsia-400 to-pink-500",
    rating: "A"
  },
  {
    title: "AIBuilder Pro",
    subtitle: "Smart App Builder",
    description: "Build sophisticated AI applications with minimal coding expertise required.",
    action: "Security Scores",
    color: "from-blue-400 to-cyan-500",
    rating: "B"
  },
  {
    title: "NeuralStack",
    subtitle: "AI Development Platform",
    description: "Complete AI development environment with built-in security features.",
    action: "Security Scores",
    color: "from-violet-400 to-purple-500",
    rating: "C"
  },
  {
    title: "AIForge",
    subtitle: "AI Model Training",
    description: "Train and deploy custom AI models with enterprise-grade security.",
    action: "Security Scores",
    color: "from-rose-400 to-pink-500",
    rating: "A"
  },
  {
    title: "SmartFlow AI",
    subtitle: "Workflow Automation",
    description: "Intelligent workflow automation with advanced AI capabilities.",
    action: "Security Scores",
    color: "from-amber-400 to-orange-500",
    rating: "D"
  },
  {
    title: "CodeGenius",
    subtitle: "AI Code Generation",
    description: "Generate production-ready code with AI-powered suggestions.",
    action: "Security Scores",
    color: "from-emerald-400 to-green-500",
    rating: "B"
  },
  {
    title: "DataMind",
    subtitle: "AI Data Processing",
    description: "Process and analyze data with intelligent AI algorithms.",
    action: "Security Scores",
    color: "from-sky-400 to-blue-500",
    rating: "C"
  }
];

const SecurityScores = () => {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A':
        return 'text-emerald-400';
      case 'B':
        return 'text-blue-400';
      case 'C':
        return 'text-amber-400';
      case 'D':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8 gradient-text">AI Tools Security Scores</h1>
        <div className="max-w-4xl mb-12">
          <p className="text-lg text-cyber-muted">
            Comprehensive security analysis and detailed reviews of leading AI tools.
            Our expert assessments help you make informed decisions about the security
            features of various AI platforms.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product, index) => (
            <Card key={index} className={`glass-panel p-6 rounded-xl bg-gradient-to-br ${product.color} hover:scale-105 transition-transform duration-300`}>
              <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
              <p className="text-white/80 text-sm mb-2">{product.subtitle}</p>
              <p className="text-white/90 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {product.rating === 'A' || product.rating === 'B' ? (
                    <Star className={`h-5 w-5 ${getRatingColor(product.rating)}`} />
                  ) : (
                    <StarOff className={`h-5 w-5 ${getRatingColor(product.rating)}`} />
                  )}
                  <span className={`font-semibold ${getRatingColor(product.rating)}`}>
                    Rating {product.rating}
                  </span>
                </div>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors duration-300">
                  View Details
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SecurityScores;
