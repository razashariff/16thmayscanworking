
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidPayment, setIsValidPayment] = useState(false);
  const currentDate = new Date().toLocaleString();
  
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan') || 'Basic';
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    console.log("Payment Success page loaded with params:", { plan, sessionId });
    
    // If no session_id is present, the user likely navigated here directly
    // which means they didn't complete a payment
    if (!sessionId) {
      console.error("No session_id found in URL");
      setIsVerifying(false);
      setIsValidPayment(false);
      toast.error("Invalid payment session. Please complete payment first.");
      
      // Delay navigation to home to allow user to see the error
      setTimeout(() => {
        navigate('/');
      }, 3000);
      return;
    }

    // Check if session_id matches the expected format for a Stripe session ID
    // Stripe session IDs typically start with 'cs_' for checkout sessions
    if (!sessionId.startsWith('cs_')) {
      console.error("Invalid session_id format:", sessionId);
      setIsVerifying(false);
      setIsValidPayment(false);
      toast.error("Invalid payment session identifier");
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
      return;
    }

    // If we have a valid-looking session_id, assume the payment was successful
    // In a production environment, you would verify this with Stripe
    console.log("Valid session_id found, marking payment as successful");
    setIsVerifying(false);
    setIsValidPayment(true);
  }, [sessionId, navigate, plan]);

  const getPlanDetails = (planType: string) => {
    switch(planType.toLowerCase()) {
      case 'basic':
        return {
          name: "Basic Security Review",
          price: "£20 per month",
          duration: "3 months minimum"
        };
      case 'premium':
        return {
          name: "Comprehensive Security Review",
          price: "£30 per month",
          duration: "3 months minimum"
        };
      default:
        return {
          name: planType,
          price: "Custom pricing",
          duration: "Custom duration"
        };
    }
  };

  const planDetails = getPlanDetails(plan);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 gradient-text">Verifying your payment...</h2>
            <div className="animate-spin w-12 h-12 border-4 border-t-cyber-neon rounded-full mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isValidPayment) {
    return (
      <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-24 flex items-center justify-center">
          <Card className="max-w-md p-8 bg-cyber-dark border border-red-500/50">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Invalid Payment Session</h2>
              <p className="text-cyber-muted mb-4">You must complete the payment process first.</p>
              <p className="text-cyber-muted mb-4">Redirecting to home page...</p>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24">
        <Card className="max-w-4xl mx-auto p-8 bg-cyber-dark border border-cyber-neon/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4 gradient-text">Payment Successful!</h1>
            <p className="text-cyber-muted text-sm mb-2">Order Date: {currentDate}</p>
          </div>

          <div className="bg-cyber-neon/5 rounded-lg p-6 mb-8 border border-cyber-neon/10">
            <h2 className="text-xl font-semibold mb-4 text-cyber-neon">Plan Details</h2>
            <div className="space-y-2">
              <p><span className="text-cyber-muted">Plan:</span> {planDetails.name}</p>
              <p><span className="text-cyber-muted">Price:</span> {planDetails.price}</p>
              <p><span className="text-cyber-muted">Duration:</span> {planDetails.duration}</p>
            </div>
          </div>

          <div className="space-y-6 text-cyber-text mb-8">
            <p className="leading-relaxed">
              Thank you for signing up with CyberSec AI Services. We are excited to have you on board. 
              Shortly, you will receive our on-boarding email along with an engagement pack outlining 
              the next steps.
            </p>
            
            <p className="leading-relaxed">
              As part of our commitment to cybersecurity excellence, particularly in assessment and 
              ratings review, we prioritize secure communications from the outset.
            </p>
            
            <p className="leading-relaxed">
              Please note that for security reasons, we do not request information about your products 
              or services via email at this stage. Instead, preferred communication methods will be 
              discussed and confirmed during the initial onboarding.
            </p>
            
            <p className="leading-relaxed">
              Thank you for choosing CyberSec AI Services — we look forward to helping you strengthen 
              your cybersecurity posture and protecting your brand as well as your and your clients data. 
              As part of the process we will send you a Non-Disclosure Document. This is a standard part 
              of our process and security governance. We never discuss any aspect of your product or 
              service specifics with any third party.
            </p>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-cyber-blue to-cyber-neon hover:opacity-90 transition-opacity px-8"
            >
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
