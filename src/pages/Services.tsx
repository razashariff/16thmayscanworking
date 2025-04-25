
import { Shield, Code, Search, Database, GraduationCap, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: <Shield className="h-12 w-12 text-cyber-neon" />,
    title: "🧪 Security Audits",
    subtitle: "Audit smarter, not harder.",
    description: "Custom-built security audits for startups, covering source code, cloud configs, microservices, and AI/ML models. Get actionable, founder-readable recommendations.",
    features: [
      "Source code & GitOps pipelines",
      "Cloud configs (AWS/GCP/Azure)",
      "SaaS & microservice architectures",
      "AI & ML models security",
      "Secrets management & key rotation"
    ],
    benefits: [
      "What's vulnerable",
      "Why it matters",
      "How to fix it (with code examples)"
    ]
  },
  {
    icon: <Code className="h-12 w-12 text-cyber-purple" />,
    title: "👨‍💻 Vibe Coding Security",
    subtitle: "Security that flows with your code, not against it.",
    description: "Our signature approach to secure modern development, speaking the language of React, Next.js, Node, Python, Go, and AI/ML technologies.",
    features: [
      "Secure code review with AI-assisted analysis",
      "LLM security guidance and prompt injection protection",
      "Real-time dev feedback via GitHub PR reviews"
    ],
    technologies: [
      "React, Next.js, Node, Python, Go",
      "Vector databases & embeddings",
      "Open-source LLM APIs",
      "Cloud-native CI/CD pipelines"
    ]
  },
  {
    icon: <Search className="h-12 w-12 text-cyber-blue" />,
    title: "👁️‍🗨️ Threat Detection",
    subtitle: "Smart, fast, and scalable visibility.",
    description: "24/7 monitoring and detection across your entire stack, from authentication flows to AI inputs.",
    features: [
      "Authentication & API endpoint monitoring",
      "Anomaly detection across users and services",
      "Suspicious prompt activity detection",
      "Insider threats & credential stuffing detection"
    ]
  },
  {
    icon: <Database className="h-12 w-12 text-cyber-accent" />,
    title: "🔐 Data Protection",
    subtitle: "Protecting your data like gold.",
    description: "End-to-end data protection and compliance, from encryption to access management.",
    features: [
      "End-to-end encryption",
      "Least privilege IAM models",
      "Tokenization of user data",
      "Geo-aware compliance",
      "Secure key management"
    ]
  },
  {
    icon: <GraduationCap className="h-12 w-12 text-cyber-neon" />,
    title: "📚 Security Training",
    subtitle: "Security is a team sport.",
    description: "Role-specific, engaging security training focused on real-world threats and prevention.",
    features: [
      "How to think like a hacker",
      "OWASP Top 10 for modern frameworks",
      "Secure AI & LLM usage",
      "Breach simulation workshops",
      "Security 101 for new hires"
    ]
  },
  {
    icon: <ShieldAlert className="h-12 w-12 text-cyber-purple" />,
    title: "🚨 Incident Response",
    subtitle: "Swift, decisive breach response.",
    description: "Real-time incident response, from triage to recovery and future prevention.",
    features: [
      "Real-time breach triage",
      "Secure comms & legal coordination",
      "Forensic analysis",
      "Containment and rollback plans",
      "Public response support"
    ]
  }
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
        
        <div className="text-center mb-16 relative">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Our Security Services</h1>
          <p className="text-lg text-cyber-muted max-w-3xl mx-auto">
            We're a next-gen cybersecurity company built for modern founders, AI startups, and fast-moving innovators.
            Today's tech landscape isn't just cloud-native — it's AI-native. We help you secure your innovation without slowing you down.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="bg-cyber-dark border border-cyber-blue/20 hover:border-cyber-neon/50 transition-all duration-300">
              <CardHeader>
                <div className="mb-4 p-3 inline-block rounded-lg bg-cyber-purple/10">
                  {service.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-cyber-text">{service.title}</CardTitle>
                <CardDescription className="text-lg text-cyber-purple">{service.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-cyber-muted">{service.description}</p>
                <div className="space-y-2">
                  {service.features && (
                    <ul className="list-disc list-inside text-cyber-muted space-y-1 ml-4">
                      {service.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 border border-cyber-neon/20 text-center">
          <h2 className="text-3xl font-bold mb-4">🚀 Ready to Launch Secure?</h2>
          <p className="text-cyber-muted mb-8 max-w-2xl mx-auto">
            We work with founders building the next big thing — and help them stay secure while they scale.
            Let's make your product resilient, respected, and ready for prime time.
          </p>
          <Button className="bg-cyber-neon hover:bg-cyber-neon/90 text-cyber-dark font-medium px-8 py-3">
            Get Started
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServicesPage;
