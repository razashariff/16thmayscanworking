
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 mb-6">
            <FileText size={16} className="text-cyber-neon mr-2" />
            <span className="text-sm">Legal</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-cyber-muted mb-8">Effective Date: 25 April 2025</p>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-cyber-muted">Welcome to Cybersecai.co.uk. By using our services, you agree to these Terms of Service.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Use of Services</h2>
            <p className="text-cyber-muted">You agree to use our services only for lawful purposes and in accordance with these terms.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. User Accounts</h2>
            <p className="text-cyber-muted">If you create an account, you are responsible for maintaining the confidentiality of your credentials and all activities under your account.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Intellectual Property</h2>
            <p className="text-cyber-muted">All content, trademarks, logos, and software are the property of Cybersecai.co.uk or its licensors.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitation of Liability</h2>
            <p className="text-cyber-muted">We are not liable for any indirect, incidental, or consequential damages arising out of your use of our services.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Modifications to the Service</h2>
            <p className="text-cyber-muted">We may modify or discontinue our services at any time without notice.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Governing Law</h2>
            <p className="text-cyber-muted">These terms are governed by the laws of England and Wales.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact</h2>
            <p className="text-cyber-muted">For questions about these terms, email us at contactus@cybersecai.co.uk</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
