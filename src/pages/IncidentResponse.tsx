
import { ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const IncidentResponse = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 mb-6">
            <ShieldAlert size={16} className="text-cyber-neon mr-2" />
            <span className="text-sm">Security Service</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Incident Response</h1>
          
          <p className="text-xl text-cyber-muted">
            Rapid and effective response strategies for security incidents to minimize impact.
          </p>
        </div>
        
        <div className="glass-panel p-8 rounded-xl border border-cyber-purple/20 mb-12">
          <h2 className="text-2xl font-bold mb-6 gradient-text">Service Overview</h2>
          <p className="text-cyber-muted">Our expert incident response team provides swift, comprehensive solutions to mitigate and resolve security breaches with minimal disruption.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default IncidentResponse;
