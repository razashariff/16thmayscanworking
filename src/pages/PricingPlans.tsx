
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Phone } from 'lucide-react';

const PricingPlans = () => {
  const plans = [
    {
      name: "Basic Security Review",
      price: "£20",
      period: "per month",
      features: [
        "Basic security review of your product/service",
        "Security rating assessment",
        "3 months rating listing on our website",
        "Basic vulnerability assessment",
      ],
      buttonText: "Get Started",
      duration: "3 months minimum",
      path: "/service-signup/basic"
    },
    {
      name: "Comprehensive Security Review",
      price: "£30",
      period: "per month",
      features: [
        "Full detailed security review",
        "Everything in Basic plan",
        "Advanced vulnerability assessment",
        "Detailed security recommendations",
        "Priority listing on our website",
        "Monthly security consultation",
      ],
      buttonText: "Get Premium",
      duration: "3 months minimum",
      highlighted: true,
      path: "/service-signup/premium"
    },
    {
      name: "Agency or Enterprise",
      price: "Custom",
      period: "pricing",
      features: [
        "Tailored security review for large organizations",
        "Dedicated security team support",
        "Custom implementation assistance",
        "Priority incident response",
        "Quarterly security assessments",
        "Executive security briefings",
      ],
      buttonText: "Contact Us",
      duration: "",
      path: "/contact",
      isEnterprise: true
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-24 pb-12 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-6 gradient-text">Security Review Plans</h1>
          <p className="text-lg text-cyber-muted">
            Choose the perfect plan to secure your AI product and build customer trust
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto flex-grow">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col glass-panel p-8 rounded-xl border ${
                plan.highlighted
                  ? "border-cyber-neon animate-pulse-glow"
                  : "border-cyber-neon/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyber-neon text-cyber-dark px-4 py-1 rounded-full text-sm font-bold">
                  Recommended
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-cyber-muted ml-2">{plan.period}</span>}
                </div>
                {plan.duration && <p className="text-sm text-cyber-muted">{plan.duration}</p>}
                {plan.isEnterprise && (
                  <p className="text-sm text-cyber-muted mt-4">
                    If you are a large corporate or enterprise with significant AI or SaaS products then reach out to us to discuss a custom security review and support offering.
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Check className="text-cyber-neon h-5 w-5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <Button
                  asChild
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-cyber-blue to-cyber-neon"
                      : plan.isEnterprise
                      ? "bg-cyber-purple"
                      : "bg-cyber-blue"
                  } hover:opacity-90 transition-opacity`}
                >
                  <Link to={plan.path}>{plan.buttonText}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPlans;
