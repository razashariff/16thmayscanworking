
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SecurityScan = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12 flex-grow">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={28} className="text-cyber-neon" />
            <h1 className="text-3xl font-bold gradient-text">Security Tools</h1>
          </div>
          <p className="text-cyber-muted max-w-2xl">
            Access our suite of security tools to assess and enhance your security posture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-cyber-neon/20">
            <h2 className="text-xl font-bold mb-4 gradient-text">Security Assessment</h2>
            <p className="text-cyber-muted mb-6">
              Evaluate your organization's security posture with our comprehensive assessment tool.
              Answer a series of questions about your security controls and receive a detailed report.
            </p>
            <Button 
              onClick={() => navigate('/security-assessment')}
              className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue"
            >
              <Shield className="mr-2 h-4 w-4" />
              Get Your Security Score
            </Button>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-cyber-neon/20">
            <h2 className="text-xl font-bold mb-4 gradient-text">Vulnerability Scanner</h2>
            <p className="text-cyber-muted mb-6">
              Scan your websites for security vulnerabilities using our advanced scanner.
              Get detailed reports on potential weaknesses and recommendations for fixing them.
            </p>
            <Button 
              onClick={() => navigate('/vulnerability-scanner')}
              className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue"
            >
              <Shield className="mr-2 h-4 w-4" />
              Scan Your Websites
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SecurityScan;
