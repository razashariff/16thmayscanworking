
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const About = () => {
  const triggerCalendly = () => {
    const element = document.querySelector('[data-calendly-link]');
    if (element) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(event);
    }
  };

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-cyber-dark"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 rounded-lg bg-cyber-blue/30 animate-pulse-glow"></div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-lg bg-cyber-purple/30 animate-pulse-glow"></div>
              
              <div className="relative rounded-xl overflow-hidden border-2 border-cyber-neon/30 shadow-xl shadow-cyber-blue/10">
                <div className="aspect-[4/3] bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 p-8 flex items-center justify-center">
                  <div className="max-w-xs text-center space-y-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-cyber-neon/20 p-4">
                      <svg className="w-full h-full text-cyber-neon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    
                    <h3 className="text-xl font-bold text-cyber-text">CyberSecAI</h3>
                    <p className="text-cyber-muted">Securing tomorrow's innovations today with specialized cyber security expertise for modern startups.</p>
                  </div>
                </div>
                
                <div className="absolute top-3 right-3 bg-cyber-dark/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-cyber-neon border border-cyber-neon/30">
                  Est. 2023
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="gradient-text">About</span> CyberSecAI
              </h2>
              <p className="text-lg text-cyber-muted mb-6">
                At CyberSecAI, we specialize in providing cutting-edge cyber security solutions tailored specifically for new founders and innovative startups. Our expertise in vibe coding security practices ensures your business is protected while maintaining agility and innovation.
              </p>
              <p className="text-lg text-cyber-muted">
                With years of experience in the cyber security landscape, we understand the unique challenges faced by emerging businesses and provide practical, effective security strategies that grow with you.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-cyber-text">Why Choose Us?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Specialized in startup security",
                  "Experts in vibe coding protection",
                  "Scalable security solutions",
                  "Founder-focused approach",
                  "Cutting-edge methodologies",
                  "Clear, actionable advice"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyber-neon mr-2 flex-shrink-0" />
                    <span className="text-cyber-muted">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={triggerCalendly}
              className="bg-cyber-purple hover:bg-cyber-blue text-white transition-colors"
            >
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
