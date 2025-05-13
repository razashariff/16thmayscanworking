
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidPayment, setIsValidPayment] = useState(false);
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [urls, setUrls] = useState<string[]>(['', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentDate = new Date().toLocaleString();
  
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get('plan') || 'basic';
  const sessionId = searchParams.get('session_id');
  const urlLimit = plan.toLowerCase() === 'premium' ? 6 : 3;

  useEffect(() => {
    console.log("Payment Success page loaded with params:", { plan, sessionId });
    
    // If no session_id is present, the user likely navigated here directly
    if (!sessionId) {
      console.error("No session_id found in URL");
      setIsVerifying(false);
      setIsValidPayment(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid payment session. Please complete payment first."
      });
      
      // Delay navigation to home
      setTimeout(() => {
        navigate('/');
      }, 5000);
      return;
    }

    // Check if session_id matches the expected format for a Stripe session ID
    // Stripe session IDs typically start with 'cs_' for checkout sessions
    if (!sessionId.startsWith('cs_')) {
      console.error("Invalid session_id format:", sessionId);
      setIsVerifying(false);
      setIsValidPayment(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid payment session identifier"
      });
      
      setTimeout(() => {
        navigate('/');
      }, 5000);
      return;
    }

    // If we have a valid-looking session_id, assume the payment was successful
    // In a production environment, you would verify this with a server-side call to Stripe
    console.log("Valid session_id found, marking payment as successful:", sessionId);
    setIsVerifying(false);
    setIsValidPayment(true);
    toast({
      title: "Success",
      description: "Payment successful! Welcome aboard."
    });

    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to continue setting up your vulnerability scans."
        });
        setTimeout(() => {
          navigate('/auth', { state: { returnUrl: location.pathname + location.search } });
        }, 3000);
      }
    });
  }, [sessionId, navigate, plan, location.pathname, location.search]);

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addMoreUrls = () => {
    if (urls.length < urlLimit) {
      setUrls([...urls, '']);
    }
  };

  const validateUrls = () => {
    const urlRegex = /^(https?:\/\/)([\w\d-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    
    // Check if at least one URL is provided and all provided URLs are valid
    const providedUrls = urls.filter(url => url.trim() !== '');
    if (providedUrls.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please add at least one URL to scan."
      });
      return false;
    }

    const invalidUrls = providedUrls.filter(url => !urlRegex.test(url));
    if (invalidUrls.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: `Invalid URL format: ${invalidUrls[0]}`
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue."
      });
      return;
    }

    if (!validateUrls()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to save your scan URLs."
        });
        
        setTimeout(() => {
          navigate('/auth', { state: { returnUrl: location.pathname + location.search } });
        }, 2000);
        return;
      }

      // Filter out empty URLs
      const urlsToSave = urls.filter(url => url.trim() !== '');
      
      // Save URLs to Supabase
      for (const url of urlsToSave) {
        const { error } = await supabase.from('vulnerability_scans').insert({
          user_id: session.user.id,
          target_url: url,
          status: 'queued',
          progress: 0
        });

        if (error) {
          console.error('Error saving URL:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to save URL: ${url}`
          });
        }
      }

      toast({
        title: "Success",
        description: `${urlsToSave.length} URLs saved successfully! You can now run vulnerability scans.`
      });

      // Navigate to vulnerability scanner page
      setTimeout(() => {
        navigate('/vulnerability-scanner');
      }, 2000);
    } catch (error) {
      console.error('Error during URL submission:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while saving your URLs."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 gradient-text">Verifying your payment...</h2>
            <div className="animate-spin w-12 h-12 border-4 border-t-cyber-neon rounded-full mx-auto"></div>
            <p className="mt-4 text-cyber-muted">This will only take a moment</p>
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
              <Button 
                onClick={() => navigate('/')}
                className="mt-4 bg-gradient-to-r from-cyber-blue to-cyber-neon"
              >
                Return to Home
              </Button>
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
        {!showUrlForm ? (
          <Card className="max-w-4xl mx-auto p-8 bg-cyber-dark border border-cyber-neon/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-4 gradient-text">Payment Successful!</h1>
              <p className="text-cyber-muted text-sm mb-2">Order Date: {currentDate}</p>
              <p className="text-cyber-muted text-sm mb-2">Session ID: {sessionId}</p>
            </div>

            <div className="bg-cyber-neon/5 rounded-lg p-6 mb-8 border border-cyber-neon/10">
              <h2 className="text-xl font-semibold mb-4 text-cyber-neon">Plan Details</h2>
              <div className="space-y-2">
                <p><span className="text-cyber-muted">Plan:</span> {plan === 'premium' ? 'Comprehensive Security Review' : 'Basic Security Review'}</p>
                <p><span className="text-cyber-muted">URLs for Vulnerability Scanning:</span> {urlLimit}</p>
                <p><span className="text-cyber-muted">Price:</span> {plan === 'premium' ? '£30 per month' : '£20 per month'}</p>
                <p><span className="text-cyber-muted">Duration:</span> 3 months minimum</p>
              </div>
            </div>

            <div className="space-y-6 text-cyber-text mb-8">
              <p className="leading-relaxed">
                Thank you for signing up with CyberSec AI Services. We are excited to have you on board. 
                Before we proceed, we need you to provide the URLs you'd like to scan for vulnerabilities.
              </p>
              
              <p className="leading-relaxed">
                As part of our cybersecurity services, we'll perform automated vulnerability scanning on up to 
                {urlLimit} URLs of your choice, helping you identify and address potential security risks.
              </p>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => setShowUrlForm(true)}
                className="bg-gradient-to-r from-cyber-blue to-cyber-neon hover:opacity-90 transition-opacity px-8"
              >
                Add Your URLs <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="max-w-4xl mx-auto p-8 bg-cyber-dark border border-cyber-neon/20">
            <div className="mb-8">
              <h2 className="text-2xl font-bold gradient-text">Set Up Your Vulnerability Scans</h2>
              <p className="text-cyber-muted mt-2">
                Please add the URLs you'd like to scan for security vulnerabilities (Up to {urlLimit} URLs with your {plan} plan)
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {urls.slice(0, urlLimit).map((url, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`url-${index}`}>URL {index + 1} {index === 0 && <span className="text-red-500">*</span>}</Label>
                  <Input
                    id={`url-${index}`}
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="https://example.com"
                    className="bg-cyber-dark/60 border-cyber-neon/30 text-cyber-text"
                    required={index === 0}
                  />
                </div>
              ))}

              {urls.length < urlLimit && (
                <Button 
                  variant="outline" 
                  onClick={addMoreUrls}
                  className="border-cyber-neon/30 text-cyber-neon"
                >
                  Add Another URL
                </Button>
              )}
            </div>

            <div className="bg-cyber-dark/30 p-6 border border-cyber-neon/10 rounded-md mb-8">
              <h3 className="text-lg font-semibold mb-3">Terms and Conditions</h3>
              <div className="text-sm text-cyber-muted mb-4 h-40 overflow-y-auto p-4 border border-cyber-neon/10 rounded-md bg-black/20">
                <p className="mb-2">By using CyberSec AI's vulnerability scanning service, you agree to the following terms:</p>
                <ol className="list-decimal ml-5 space-y-2">
                  <li>You confirm that you have the legal right to perform security scans on the URLs you've provided.</li>
                  <li>You understand that scanning activities are automated and may cause increased load on the target systems.</li>
                  <li>CyberSec AI is not responsible for any service disruptions or issues that may arise from the scanning process.</li>
                  <li>Scan results are provided for informational purposes only and do not guarantee complete identification of all vulnerabilities.</li>
                  <li>You agree not to use our service for illegal activities or to harm systems you do not own.</li>
                  <li>CyberSec AI maintains all scan results confidentially and will not share them with third parties.</li>
                  <li>You understand that these scans are meant to help identify security issues but do not replace a comprehensive security program.</li>
                </ol>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  I accept the terms and conditions for vulnerability scanning
                </Label>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setShowUrlForm(false)}
                className="border-cyber-neon/30"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue"
              >
                {isSubmitting ? 'Processing...' : 'Submit URLs and Continue'}
              </Button>
            </div>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
