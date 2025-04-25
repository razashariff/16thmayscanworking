import { Mail, MapPin, Linkedin, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const triggerCalendly = () => {
    window.open('https://calendly.com/breach2020', '_blank');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gradient-to-b from-cyber-dark to-black relative overflow-hidden border-t border-cyber-blue/20">
      <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="inline-block mb-6">
              <h3 className="text-2xl font-bold gradient-text">CyberSecAI</h3>
            </Link>
            <p className="text-cyber-muted mb-6 leading-relaxed">
              Specialized cyber security services for new founders and startups, with expertise in vibe coding security practices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-cyber-dark/50 backdrop-blur-sm border border-cyber-blue/30 text-cyber-blue hover:border-cyber-neon hover:text-cyber-neon transition-all duration-300 hover:scale-110">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-cyber-dark/50 backdrop-blur-sm border border-cyber-blue/30 text-cyber-blue hover:border-cyber-neon hover:text-cyber-neon transition-all duration-300 hover:scale-110">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-cyber-dark/50 backdrop-blur-sm border border-cyber-blue/30 text-cyber-blue hover:border-cyber-neon hover:text-cyber-neon transition-all duration-300 hover:scale-110">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-cyber-text mb-6 relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-cyber-neon before:to-cyber-purple">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-cyber-muted hover:text-cyber-neon transition-colors duration-300 flex items-center">Security Audits</Link></li>
              <li><Link to="/services" className="text-cyber-muted hover:text-cyber-neon transition-colors duration-300 flex items-center">Vibe Coding Security</Link></li>
              <li><Link to="/services" className="text-cyber-muted hover:text-cyber-neon transition-colors duration-300 flex items-center">Threat Detection</Link></li>
              <li><Link to="/services" className="text-cyber-muted hover:text-cyber-neon transition-colors duration-300 flex items-center">Data Protection</Link></li>
              <li><Link to="/services" className="text-cyber-muted hover:text-cyber-neon transition-colors duration-300 flex items-center">Security Training</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-cyber-text mb-6 relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-cyber-purple before:to-cyber-neon">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-cyber-muted hover:text-cyber-neon transition-colors duration-300 flex items-center">Home</Link></li>
              <li><Link to="/about" className="text-cyber-muted hover:text-cyber-neon transition-colors duration-300 flex items-center">About Us</Link></li>
              <li><Link to="/services" className="text-cyber-muted hover:text-cyber-neon transition-colors duration-300 flex items-center">Services</Link></li>
              <li><Link to="/contact" className="text-cyber-muted hover:text-cyber-neon transition-colors duration-300 flex items-center">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-cyber-text mb-6 relative pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-cyber-neon before:to-cyber-accent">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 text-cyber-neon mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-cyber-muted group-hover:text-cyber-text transition-colors duration-300">London, United Kingdom</span>
              </li>
              <li className="flex items-center group">
                <Mail className="h-5 w-5 text-cyber-neon mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <a href="mailto:contact@cybersecai.co.uk" className="text-cyber-muted group-hover:text-cyber-neon transition-colors duration-300">
                  contact@cybersecai.co.uk
                </a>
              </li>
              <li className="pt-4">
                <button 
                  onClick={triggerCalendly}
                  className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-cyber-blue to-cyber-purple text-white rounded-md hover:from-cyber-purple hover:to-cyber-blue transition-all duration-300 shadow-lg hover:shadow-cyber-neon/30"
                >
                  Book Your Free Consultation
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-cyber-blue/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cyber-muted text-sm mb-4 md:mb-0">
            © {currentYear} CyberSecAI. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link to="/privacy-policy" className="text-sm text-cyber-muted hover:text-cyber-neon transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-cyber-muted hover:text-cyber-neon transition-colors duration-300">Terms of Service</Link>
            <Link to="/cookie-policy" className="text-sm text-cyber-muted hover:text-cyber-neon transition-colors duration-300">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
