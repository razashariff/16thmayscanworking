
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check URL for error parameters
  useEffect(() => {
    const url = new URL(window.location.href);
    const errorCode = url.hash.includes("error_code=") 
      ? url.hash.split("error_code=")[1].split("&")[0]
      : null;
    
    if (errorCode === "otp_expired") {
      setError("The verification link has expired. Please request a new one.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) throw error;

        // Show registration success message
        setRegistrationSuccess(true);
        
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/blog");  // Changed from "/" to "/blog" to redirect to blog page
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToHome = () => {
    navigate("/blog");  // Changed from "/" to "/blog"
  };

  // Registration success screen
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-cyber-dark">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4 pt-24 pb-12">
          <Card className="w-full max-w-md glass-panel border border-cyber-blue/20">
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold gradient-text">
                  Thanks for registering!
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center mb-6 text-cyber-text">
                Please check your email to verify your account. Once verified, you can log in and access all features.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={navigateToHome}
                className="w-full bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-neon hover:from-cyber-purple hover:to-cyber-blue"
              >
                Return to Blog
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 pt-24 pb-12">
        <Card className="w-full max-w-md glass-panel border border-cyber-blue/20">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center gradient-text">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h2>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-cyber-text">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    className="bg-cyber-dark/50 border-cyber-blue/30 text-cyber-text"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyber-text">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-cyber-dark/50 border-cyber-blue/30 text-cyber-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-cyber-text">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-cyber-dark/50 border-cyber-blue/30 text-cyber-text"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-neon hover:from-cyber-purple hover:to-cyber-blue"
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </Button>
            <Button
              variant="ghost"
              className="w-full text-cyber-text hover:text-cyber-neon"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;

