
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
  },
  {
    title: "ExpertAI Solutions",
    subtitle: "AI Consulting Platform",
    description: "Comprehensive AI strategy and implementation services for enterprises.",
    action: "Security Scores",
    color: "from-green-200 to-green-400",
    rating: "A"
  },
  {
    title: "IntelliCode Pro",
    subtitle: "Advanced Code Generation",
    description: "AI-powered code generation with enterprise-level security protocols.",
    action: "Security Scores",
    color: "from-amber-200 to-amber-400",
    rating: "B"
  },
  {
    title: "RiskGuard AI",
    subtitle: "Security Risk Assessment",
    description: "Automated AI security risk analysis and mitigation strategies.",
    action: "Security Scores",
    color: "from-red-200 to-red-400",
    rating: "C"
  },
  {
    title: "SecureFlow AI",
    subtitle: "Compliance Automation",
    description: "AI-driven security compliance tracking and reporting.",
    action: "Security Scores",
    color: "from-red-300 to-red-500",
    rating: "D"
  },
  {
    title: "SafeNet Intelligence",
    subtitle: "Threat Detection AI",
    description: "Real-time AI-powered cybersecurity threat detection system.",
    action: "Security Scores",
    color: "from-green-300 to-green-500",
    rating: "A"
  },
  {
    title: "CodeShield",
    subtitle: "Security Code Review",
    description: "Automated AI-driven security code review and vulnerability detection.",
    action: "Security Scores",
    color: "from-amber-300 to-amber-500",
    rating: "B"
  }
];

const SecurityScores = () => {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A':
        return {
          text: 'text-green-900 font-bold',
          bg: 'bg-green-100',
          iconColor: 'text-green-900'
        };
      case 'B':
        return {
          text: 'text-orange-900 font-bold',
          bg: 'bg-orange-100',
          iconColor: 'text-orange-900'
        };
      case 'C':
      case 'D':
        return {
          text: 'text-red-900 font-bold',
          bg: 'bg-red-100',
          iconColor: 'text-red-900'
        };
      default:
        return {
          text: 'text-gray-900',
          bg: 'bg-gray-100',
          iconColor: 'text-gray-900'
        };
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
          {products.map((product, index) => {
            const ratingColors = getRatingColor(product.rating);
            return (
              <Card 
                key={index} 
                className={`glass-panel p-6 rounded-xl bg-gradient-to-br ${product.color} hover:scale-105 transition-transform duration-300`}
              >
                <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
                <p className="text-white/80 text-sm mb-2">{product.subtitle}</p>
                <p className="text-white/90 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <div className={`flex items-center gap-2 ${ratingColors.bg} px-3 py-1 rounded-full`}>
                    {product.rating === 'A' || product.rating === 'B' ? (
                      <Star className={`h-5 w-5 ${ratingColors.iconColor}`} />
                    ) : (
                      <StarOff className={`h-5 w-5 ${ratingColors.iconColor}`} />
                    )}
                    <span className={`font-semibold ${ratingColors.text}`}>
                      Rating {product.rating}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors duration-300">
                    View Details
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SecurityScores;
