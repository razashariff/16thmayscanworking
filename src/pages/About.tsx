
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-8">About Us</h1>
          
          <div className="space-y-8 text-cyber-muted">
            <p className="text-lg">
              At Cybersecai.co.uk, we exist to help new founders, entrepreneurs, and modern developers build securely from the start — with expert-led guidance rooted in real-world experience, next-generation thinking, and a deep understanding of today's most advanced threats.
            </p>

            <div className="bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-cyber-text mb-4">Our Founder</h2>
              <p className="mb-4">
                Our founder, Raza Sharif, brings over 20 years of frontline cybersecurity leadership, having operated at the highest levels across government agencies, the financial sector, and the global enterprise space. His career spans everything from Advanced Forensic Investigations and E-Crime Prevention to PCI-DSS Compliance, AI Security, and Cyber Defense Strategy.
              </p>
              <p>
                Raza has worked with some of the world's most high-stakes environments, including British Nuclear Fuel, Barclays, HSBC, the Abu Dhabi Stock Exchange, and national security agencies across the UK and the UAE. Notably, he played a pivotal role in mitigating the nationwide DDoS attack against the Estonian Ministry of Foreign Affairs, helping restore critical digital infrastructure during one of Europe's earliest and most high-profile cyber incidents.
              </p>
            </div>

            <p>
              From securing millions of payment transactions to managing end-to-end PCI-DSS remediation following a 57,000-card breach at a UK government body, Raza's work has consistently focused on reducing risk and safeguarding reputation through intelligent, scalable security architecture.
            </p>

            <div className="bg-cyber-dark/50 border border-cyber-neon/20 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-cyber-text mb-4">Certifications & Leadership Roles</h2>
              <p className="mb-4">With a portfolio of certifications including CISSP, CSSLP, Ethical Hacking, and Forensic Security, Raza has held leadership roles such as:</p>
              <ul className="list-none space-y-2">
                {[
                  "Lead Security Architect – UK Government",
                  "Director of Security Practice – Symantec UK",
                  "Head of Professional Services – Verizon Business (Cybertrust)",
                  "Compliance Director – PCI-DSS Programs for Public Sector & Financial Services",
                  "Security Advisor – Ministry of Interior (UAE)"
                ].map((role, index) => (
                  <li key={index} className="flex items-center">
                    <Shield className="h-4 w-4 text-cyber-neon mr-2" />
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p>
              He continues to be a lead advisor and educator on breach prevention strategies, secure development, and how real-world attacks actually unfold — shaping the next generation of developers and security-minded founders through our flagship initiative: Vibe Coding Security.
            </p>

            <div className="bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 rounded-lg p-6 border border-cyber-neon/20">
              <p className="text-lg font-medium text-cyber-text">
                At Cybersecai, we go beyond best practices. We give founders and developers the strategic clarity and practical tools they need to build securely, scale confidently, and defend the future.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
