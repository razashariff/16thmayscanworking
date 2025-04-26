
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

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

const SecurityScores = () => {
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
              <div className="text-right">
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
