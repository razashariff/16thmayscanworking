import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast"

const ServiceSignup = () => {
  const { plan } = useParams<{ plan: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const plans = {
    basic: {
      name: "Basic Security Review",
      price: "£20 per month",
      features: [
        "Basic security review of your product/service",
        "Security rating assessment",
        "3 months rating listing on our website",
        "Basic vulnerability assessment",
      ]
    },
    premium: {
      name: "Comprehensive Security Review", 
      price: "£30 per month",
      features: [
        "Full detailed security review",
        "Everything in Basic plan",
        "Advanced vulnerability assessment", 
        "Detailed security recommendations",
        "Priority listing on our website",
        "Monthly security consultation",
      ]
    }
  };

  const selectedPlan = plan === 'premium' ? plans.premium : plans.basic;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    toast({
      title: "Signup Complete.",
      description: "Redirecting to payment...",
    })

    navigate(`/payment-success?plan=${plan}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-24 pb-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto bg-cyber-dark/80 rounded-xl p-8 shadow-lg border border-cyber-neon/20">
          <h2 className="text-2xl font-bold text-center mb-8 gradient-text">Sign Up for {selectedPlan.name}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                id="email" 
                className="w-full bg-cyber-dark border-cyber-neon/30 text-cyber-text" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                type="text" 
                id="companyName" 
                className="w-full bg-cyber-dark border-cyber-neon/30 text-cyber-text" 
                placeholder="Company Name" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div>
              <ul className="list-disc pl-5 space-y-2 text-cyber-muted">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue"
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : `Proceed to Payment (${selectedPlan.price})`}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceSignup;
