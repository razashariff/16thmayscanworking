
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
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-panel">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold gradient-text">
                Thanks for registering!
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6">
              Please check your email to verify your account. Once verified, you can log in and access all features.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={navigateToHome}
              className="w-full bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-neon"
            >
              Return to Blog
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-panel">
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-neon"
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
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Need an account? Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
