
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ServiceSignup = () => {
  const { plan } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [productName, setProductName] = useState('');

  const planDetails = {
    basic: {
      name: "Basic Security Review",
      price: "£20",
      duration: "3 months minimum",
      features: [
        "Basic security review of your product/service",
        "Security rating assessment",
        "3 months rating listing on our website",
        "Basic vulnerability assessment",
      ]
    },
    premium: {
      name: "Comprehensive Security Review",
      price: "£30",
      duration: "3 months minimum",
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

  const selectedPlan = plan === 'premium' ? planDetails.premium : planDetails.basic;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
            product_name: productName,
            subscription_plan: plan
          }
        }
      });

      if (authError) throw authError;

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });

      if (checkoutError) throw checkoutError;

      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred during signup",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 gradient-text text-center">
            Sign Up for {selectedPlan.name}
          </h1>
          
          <Card className="glass-panel p-8 rounded-xl border border-cyber-neon/20 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Plan Details</h2>
                <div className="mb-4">
                  <p className="text-3xl font-bold">{selectedPlan.price}<span className="text-sm text-cyber-muted"> /month</span></p>
                  <p className="text-cyber-muted">{selectedPlan.duration}</p>
                </div>
                <ul className="space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-cyber-neon">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Company Details</h2>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="bg-cyber-dark border-cyber-neon/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input
                      id="product-name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                      className="bg-cyber-dark border-cyber-neon/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-cyber-dark border-cyber-neon/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-cyber-dark border-cyber-neon/20"
                    />
                  </div>
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyber-blue to-cyber-neon hover:opacity-90 transition-opacity"
                  >
                    {loading ? "Processing..." : "Continue to Payment"}
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceSignup;
