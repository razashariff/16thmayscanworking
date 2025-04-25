
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 mb-6">
            <Shield size={16} className="text-cyber-neon mr-2" />
            <span className="text-sm">Legal</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-cyber-muted mb-8">Effective Date: 25 April 2025</p>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-cyber-muted">Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">1. Who We Are</h2>
            <p className="text-cyber-muted">We are Cybersecai.co.uk, a cybersecurity and AI security services company based in the United Kingdom.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. What Information We Collect</h2>
            <ul className="list-disc pl-6 text-cyber-muted">
              <li>Personal identifiers (e.g., name, email address, contact details)</li>
              <li>Technical data (e.g., IP address, browser type, time zone)</li>
              <li>Usage data (e.g., pages visited, interaction history)</li>
              <li>Any information you provide through forms or account registration</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-cyber-muted">
              <li>To provide and maintain our services</li>
              <li>To respond to enquiries</li>
              <li>To improve our website and user experience</li>
              <li>For compliance with legal obligations</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Sharing Your Information</h2>
            <p className="text-cyber-muted">We do not sell your data. We may share your information with:</p>
            <ul className="list-disc pl-6 text-cyber-muted">
              <li>Service providers under contract (data processors)</li>
              <li>Legal and regulatory authorities when required by law</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Rights Under UK GDPR</h2>
            <p className="text-cyber-muted">You have the right to:</p>
            <ul className="list-disc pl-6 text-cyber-muted">
              <li>Access your personal data</li>
              <li>Request correction or deletion</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Data Security</h2>
            <p className="text-cyber-muted">We use appropriate technical and organizational measures to secure your personal data against unauthorized access, alteration, or disclosure.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Data Retention</h2>
            <p className="text-cyber-muted">We retain personal data only for as long as necessary to fulfill the purposes we collected it for, including legal, accounting, or reporting requirements.</p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact Us</h2>
            <p className="text-cyber-muted">If you have questions about this policy or your data, contact: contactus@cybersecai.co.uk</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
