
import { Button } from "@/components/ui/button";
import { Shield, Code, Lock } from "lucide-react";

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
              <span className="text-sm">AppSec for Vibe Coders</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">Security</span> for 
              <span className="relative ml-3">
                <span className="code-line">Innovation</span>
              </span>
            </h1>
            
            <p className="text-lg text-cyber-muted max-w-lg">
              In today's fast-paced development environments, security cannot be an afterthought. We empower Vibe Coders with practical, developer-friendly security strategies.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-xl animate-float">
                <Shield className="text-cyber-neon mb-4 h-8 w-8" />
                <h3 className="text-xl font-semibold mb-2">OWASP Aligned</h3>
                <p className="text-cyber-muted">Clear visibility into critical vulnerabilities and real-world attack patterns</p>
              </div>
              
              <div className="glass-panel p-6 rounded-xl animate-float delay-100">
                <Code className="text-cyber-neon mb-4 h-8 w-8" />
                <h3 className="text-xl font-semibold mb-2">Secure Innovation</h3>
                <p className="text-cyber-muted">Partnership throughout the SDLC with automated checks and secure coding patterns</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8 animate-fade-in delay-200">
            <div className="glass-panel p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 gradient-text">Our Approach</h2>
              <div className="space-y-6 text-cyber-muted">
                <p>We align our support with industry standards like the OWASP Top 10, giving coders clear visibility into the most common and critical vulnerabilities — from injection flaws and insecure design to broken access controls and cryptographic failures.</p>
                <p>By demystifying application security and making it actionable, we help developers not only fix issues, but think like defenders — reducing the risk of breaches before the code ever goes live.</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-neon text-white px-8 py-6">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VibeSecurity;
