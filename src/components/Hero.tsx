
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Lock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-24 overflow-hidden">
      <div className="hero-gradient absolute inset-0 z-0"></div>
      
      {/* Particles for visual effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      <div className="container mx-auto px-4 pt-16 pb-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/30">
              <Lock size={14} className="text-cyber-neon mr-2" />
              <span className="text-sm">Securing Startups & New Founders</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">Cyber Security</span> for the 
              <span className="relative ml-3">
                <span className="code-line">Future</span>
              </span>
            </h1>
            
            <p className="text-lg text-cyber-muted max-w-lg">
              Expert guidance on modern cyber security practices with specialized focus on vibe coding techniques to protect your digital innovation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})}
                className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue text-white px-8 py-6 text-lg"
              >
                <Shield className="mr-2 h-5 w-5" /> 
                Secure Your Business
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('about')?.scrollIntoView({behavior: 'smooth'})}
                className="border-cyber-neon text-cyber-neon hover:bg-cyber-neon/10 px-8 py-6 text-lg"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyber-blue to-cyber-purple flex items-center justify-center text-white font-medium">JS</div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyber-purple to-cyber-neon flex items-center justify-center text-white font-medium">KL</div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyber-neon to-cyber-accent flex items-center justify-center text-white font-medium">AM</div>
              </div>
              <div className="text-sm">
                <span className="text-cyber-muted">Trusted by</span>
                <span className="block font-medium">Innovative Founders</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex justify-center">
            <div className="relative animate-float w-full max-w-md">
              <div className="hexagon bg-cyber-dark p-8 border border-cyber-blue/30 shadow-lg backdrop-blur-sm">
                <div className="absolute inset-0 hexagon bg-cyber-grid opacity-20"></div>
                <div className="relative z-10 space-y-6 p-4 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-cyber-purple/20 flex items-center justify-center animate-pulse-glow">
                    <Shield size={40} className="text-cyber-neon" />
                  </div>
                  <h3 className="text-xl font-bold gradient-text">Next-Gen Security</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-cyber-dark/50 p-3 rounded-lg border border-cyber-blue/20">
                      <div className="text-lg font-bold text-cyber-neon">100%</div>
                      <div className="text-xs text-cyber-muted">Success Rate</div>
                    </div>
                    <div className="bg-cyber-dark/50 p-3 rounded-lg border border-cyber-blue/20">
                      <div className="text-lg font-bold text-cyber-neon">24/7</div>
                      <div className="text-xs text-cyber-muted">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center flex-col">
          <span className="text-cyber-muted text-sm mb-2">Discover More</span>
          <div className="w-6 h-10 border-2 border-cyber-muted rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-cyber-muted rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
