
import { Button } from "@/components/ui/button";
import { Shield, Code, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const VibeSecurity = () => {
  return (
    <section className="relative min-h-screen pt-24 overflow-hidden">
      <div className="hero-gradient absolute inset-0 z-0"></div>
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-16 pb-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/30">
              <Lock size={14} className="text-cyber-neon mr-2" />
              <span className="text-sm">AppSec for AI Innovators</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">Secure</span> Your 
              <span className="relative ml-3">
                <span className="code-line">AI Innovation</span>
              </span>
            </h1>
            
            <p className="text-lg text-cyber-muted max-w-lg">
              In the rapidly evolving world of AI, security isn't just a feature—it's your competitive advantage. We provide cutting-edge security strategies tailored for AI-driven startups and innovative founders.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-xl animate-float">
                <Shield className="text-cyber-neon mb-4 h-8 w-8" />
                <h3 className="text-xl font-semibold mb-2">Protect Your AI Vision</h3>
                <p className="text-cyber-muted">Comprehensive security insights into critical vulnerabilities and emerging AI threat landscapes</p>
              </div>
              
              <div className="glass-panel p-6 rounded-xl animate-float delay-100">
                <Code className="text-cyber-neon mb-4 h-8 w-8" />
                <h3 className="text-xl font-semibold mb-2">Secure Your Innovation</h3>
                <p className="text-cyber-muted">End-to-end security guidance throughout your AI development lifecycle</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-6 ml-auto max-w-[480px]">
            <div className="glass-panel p-8 rounded-xl hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-cyber-neon/20 bg-gradient-to-br from-[#1a1528]/90 via-cyber-purple/20 to-[#1f1f35]/90 border-2 border-cyber-purple/30">
              <h3 className="text-2xl font-semibold mb-4 gradient-text">Sign-up to CyberAI Army</h3>
              <p className="text-cyber-muted mb-6">Let us know about your issue. This community is our place to ensure your AI Innovation is Security-centric and your brand is protected. Be a Secure Founder now and join us!</p>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-neon text-white px-6 py-3 w-full hover:opacity-90 transition-all duration-300">
                  Sign-up to CyberAI Army
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VibeSecurity;
