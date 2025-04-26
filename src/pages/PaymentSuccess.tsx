
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleString();

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <Card className="max-w-4xl mx-auto p-8 bg-cyber-dark border border-cyber-neon/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4 gradient-text">Payment Successful!</h1>
            <p className="text-cyber-muted text-sm mb-2">Order Date: {currentDate}</p>
          </div>

          <div className="space-y-6 text-cyber-text mb-8">
            <p className="leading-relaxed">
              Thank you for signing up with CyberSec AL Services. We are excited to have you on board.
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
            
            <p className="leading-relaxed font-medium">
              Thank you for choosing CyberSec AL Services — we look forward to helping you strengthen
              your cybersecurity posture.
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
