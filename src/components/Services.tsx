
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileSearch, ShieldCheck, ShieldAlert } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Shield className="h-10 w-10 text-cyber-neon" />,
      title: "Security Audits",
      description: "Comprehensive review of your application security including penetration testing and code review.",
      link: "/security-audits"
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-cyber-neon" />,
      title: "Security Training",
      description: "Educational programs to help your team understand security best practices.",
      link: "/security-training"
    },
    {
      icon: <FileSearch className="h-10 w-10 text-cyber-neon" />,
      title: "Vulnerability Scanner",
      description: "Automated security testing to identify vulnerabilities in your websites and applications.",
      link: "/vulnerability-scanner",
      highlighted: true
    },
    {
      icon: <ShieldAlert className="h-10 w-10 text-cyber-neon" />,
      title: "Incident Response",
      description: "Fast professional response when security incidents occur.",
      link: "/incident-response"
    },
  ];

  return (
    <section id="services" className="py-24 bg-cyber-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 gradient-text">Our Services</h2>
          <p className="max-w-2xl mx-auto text-cyber-muted">
            Comprehensive security solutions to protect your digital assets and ensure your business stays ahead of cyber threats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link to={service.link} key={index}>
              <div className={`h-full glass-panel p-6 rounded-xl border border-cyber-neon/20 transition-all duration-300 hover:border-cyber-neon/50 hover:scale-[1.03] hover:shadow-glow ${service.highlighted ? 'border-cyber-purple/40 hover:border-cyber-purple/70' : ''}`}>
                <div className="mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-cyber-muted">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
