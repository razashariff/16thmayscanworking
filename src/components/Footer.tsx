
import { Mail, MapPin, Phone, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
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
    <footer id="contact" className="bg-cyber-dark relative overflow-hidden border-t border-cyber-blue/20">
      <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">CyberSecAI</h3>
            <p className="text-cyber-muted mb-6">
              Specialized cyber security services for new founders and startups, with expertise in vibe coding security practices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center border border-cyber-blue/30 text-cyber-blue hover:border-cyber-neon hover:text-cyber-neon transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center border border-cyber-blue/30 text-cyber-blue hover:border-cyber-neon hover:text-cyber-neon transition-colors">
                <Linkedin size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center border border-cyber-blue/30 text-cyber-blue hover:border-cyber-neon hover:text-cyber-neon transition-colors">
                <Github size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-cyber-text mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="text-cyber-muted hover:text-cyber-neon transition-colors">Security Audits</a></li>
              <li><a href="#services" className="text-cyber-muted hover:text-cyber-neon transition-colors">Vibe Coding Security</a></li>
              <li><a href="#services" className="text-cyber-muted hover:text-cyber-neon transition-colors">Threat Detection</a></li>
              <li><a href="#services" className="text-cyber-muted hover:text-cyber-neon transition-colors">Data Protection</a></li>
              <li><a href="#services" className="text-cyber-muted hover:text-cyber-neon transition-colors">Security Training</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-cyber-text mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-cyber-muted hover:text-cyber-neon transition-colors">Home</a></li>
              <li><a href="#about" className="text-cyber-muted hover:text-cyber-neon transition-colors">About Us</a></li>
              <li><a href="#services" className="text-cyber-muted hover:text-cyber-neon transition-colors">Services</a></li>
              <li><a href="#" className="text-cyber-muted hover:text-cyber-neon transition-colors">Blog</a></li>
              <li><a href="#contact" className="text-cyber-muted hover:text-cyber-neon transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-cyber-text mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cyber-neon mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-cyber-muted">London, United Kingdom</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cyber-neon mr-2 flex-shrink-0" />
                <a href="mailto:contact@cybersecai.co.uk" className="text-cyber-muted hover:text-cyber-neon transition-colors">
                  contact@cybersecai.co.uk
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-cyber-neon mr-2 flex-shrink-0" />
                <span className="text-cyber-muted">+44 (0) 123 456 7890</span>
              </li>
              <li className="pt-4">
                <button 
                  onClick={triggerCalendly}
                  className="inline-flex items-center px-4 py-2 border border-cyber-neon text-cyber-neon hover:bg-cyber-neon/10 rounded-md transition-colors"
                >
                  Book a Consultation
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-cyber-blue/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cyber-muted text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} CyberSecAI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-cyber-muted hover:text-cyber-neon transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-cyber-muted hover:text-cyber-neon transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-cyber-muted hover:text-cyber-neon transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
