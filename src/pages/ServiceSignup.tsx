
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const ServiceSignup = () => {
  const { plan } = useParams();
  const navigate = useNavigate();
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
      const { error } = await supabase.auth.signUp({
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

      if (error) throw error;

      // Redirect to Stripe checkout
      const { data } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
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
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="w-full p-2 rounded bg-cyber-dark border border-cyber-neon/20 text-cyber-text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                      className="w-full p-2 rounded bg-cyber-dark border border-cyber-neon/20 text-cyber-text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full p-2 rounded bg-cyber-dark border border-cyber-neon/20 text-cyber-text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full p-2 rounded bg-cyber-dark border border-cyber-neon/20 text-cyber-text"
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
