
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Cookie } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 mb-6">
            <Cookie size={16} className="text-cyber-neon mr-2" />
            <span className="text-sm">Legal</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-sm text-cyber-muted mb-8">Effective Date: 25 April 2025</p>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-cyber-muted">This Cookie Policy explains how Cybersecai.co.uk uses cookies and similar technologies on our website in compliance with the Privacy and Electronic Communications Regulations (PECR) and UK GDPR.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. What Are Cookies?</h2>
            <p className="text-cyber-muted">Cookies are small text files stored on your device when you visit a website.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Types of Cookies We Use</h2>
            <ul className="list-disc pl-6 text-cyber-muted">
              <li>Strictly Necessary Cookies: Required for site functionality</li>
              <li>Analytical/Performance Cookies: Help us understand how users interact with our site</li>
              <li>Functional Cookies: Remember your preferences</li>
              <li>Targeting Cookies: Used to deliver relevant advertising</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Consent</h2>
            <p className="text-cyber-muted">On your first visit, we will ask for your consent to use non-essential cookies. You can manage your preferences at any time.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. How to Control Cookies</h2>
            <p className="text-cyber-muted">You can set your browser to refuse all or some cookies or alert you when websites set or access cookies.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Changes to This Policy</h2>
            <p className="text-cyber-muted">We may update this Cookie Policy from time to time. The updated version will be posted on this page.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Contact</h2>
            <p className="text-cyber-muted">For any questions, email us at contactus@cybersecai.co.uk</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
