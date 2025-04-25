
import { ShieldCheck, Search, Code, Database, Zap, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: <ShieldCheck className="h-12 w-12 text-cyber-neon" />,
    title: "Security Audits",
    description: "Comprehensive assessment of your startup's security posture with actionable recommendations."
  },
  {
    icon: <Code className="h-12 w-12 text-cyber-purple" />,
    title: "Vibe Coding Security",
    description: "Specialized security practices for modern development methodologies and frameworks."
  },
  {
    icon: <Search className="h-12 w-12 text-cyber-blue" />,
    title: "Threat Detection",
    description: "Proactive monitoring and identification of potential security threats before they become breaches."
  },
  {
    icon: <Database className="h-12 w-12 text-cyber-accent" />,
    title: "Data Protection",
    description: "Implementation of robust data security measures to safeguard your valuable information."
  },
  {
    icon: <UserCheck className="h-12 w-12 text-cyber-neon" />,
    title: "Security Training",
    description: "Custom security awareness training for your team to build a security-first culture."
  },
  {
    icon: <Zap className="h-12 w-12 text-cyber-purple" />,
    title: "Incident Response",
    description: "Rapid and effective response strategies for security incidents to minimize impact."
  }
];

const Services = () => {
  return (
    <section id="services" className="py-20 relative overflow-hidden bg-cyber-dark">
      <div className="absolute inset-0 bg-cyber-grid opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Our Security Services</h2>
          <p className="text-lg text-cyber-muted max-w-2xl mx-auto">
            Specialized cyber security solutions designed for new founders and startups, with focus on modern development practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-cyber-dark border border-cyber-blue/20 hover:border-cyber-neon/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyber-neon/10">
              <CardHeader>
                <div className="mb-4 p-3 inline-block rounded-lg bg-cyber-purple/10">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-bold text-cyber-text">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-cyber-muted text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 border border-cyber-neon/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-cyber-text mb-4">
                Not sure which service you need?
              </h3>
              <p className="text-cyber-muted mb-6">
                Book a free consultation call, and we'll help identify the best security approach for your specific needs.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <button 
                onClick={() => document.querySelector('[data-calendly-link]')?.click()}
                className="px-6 py-3 bg-cyber-neon text-cyber-dark font-medium rounded-lg hover:bg-opacity-90 transition-all shadow-lg shadow-cyber-neon/20"
              >
                Book Your Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
