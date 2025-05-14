
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Shield, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const TestScanButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Get the JWT token from Supabase session when component mounts
  useEffect(() => {
    const getToken = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setToken(data.session.access_token);
      }
    };
    
    getToken();
    
    // Set up auth state listener to update token when auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setToken(session?.access_token || null);
      }
    );
    
    return () => {
      subscription.unsubscribe();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  // Effect to poll for scan status
  useEffect(() => {
    if (scanId && scanStatus === 'pending') {
      const interval = setInterval(async () => {
        await checkScanStatus();
      }, 5000);
      
      setPollInterval(interval);
      
      return () => clearInterval(interval);
    } else if (scanStatus === 'completed' || scanStatus === 'failed') {
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
    }
  }, [scanId, scanStatus]);

  const checkScanStatus = async () => {
    if (!scanId) return;
    
    try {
      console.log(`Checking status for scan ${scanId}`);
      setRetryCount(0); // Reset retry count on new attempt
      
      // Using Supabase edge function to check scan status (using queryparams for GET request)
      const { data, error } = await supabase.functions.invoke('zap-scan', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        query: { scan_id: scanId }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        
        // Implement retry logic
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          console.log(`Retrying... Attempt ${retryCount + 1}/${MAX_RETRIES}`);
          
          // Wait before retrying
          setTimeout(checkScanStatus, RETRY_DELAY);
        } else {
          // After max retries, show error to user
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Could not check scan status. Please try again later."
          });
        }
        
        return;
      }
      
      if (data) {
        console.log(`Scan status: ${data.status}, progress: ${data.progress}`);
        setScanStatus(data.status);
        
        if (data.status === 'completed') {
          setResults(data.results);
          toast({
            title: "Scan Completed",
            description: "Vulnerability scan completed successfully!"
          });
          
          if (pollInterval) {
            clearInterval(pollInterval);
            setPollInterval(null);
          }
        } else if (data.status === 'failed') {
          toast({
            variant: "destructive",
            title: "Scan Failed",
            description: data.error || "An error occurred during the scan"
          });
          
          if (pollInterval) {
            clearInterval(pollInterval);
            setPollInterval(null);
          }
        }
      }
    } catch (error) {
      console.error('Error checking scan status:', error);
    }
  };

  const runTestScan = async () => {
    if (!url) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a URL"
      });
      return;
    }

    try {
      new URL(url);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL with http:// or https://"
      });
      return;
    }

    setIsLoading(true);
    setResults(null);
    setScanId(null);
    setScanStatus(null);
    
    try {
      // Generate a temporary scan ID for test scans
      const tempScanId = `test-${Date.now()}`;
      
      // Using Supabase edge function with appropriate parameters
      const { data, error } = await supabase.functions.invoke('zap-scan', {
        method: 'POST',
        body: {
          target_url: url,
          scan_type: 'quick',
          scan_id: tempScanId,
          user_id: 'test-scan' // Special identifier for test scans
        },
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      console.log("Scan response:", data);
      setScanId(data.scan_id || tempScanId);
      setScanStatus('pending');
      
      toast({
        title: "Success",
        description: "Scan initiated successfully"
      });
    } catch (error) {
      console.error('Error during test scan:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete scan"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        size="sm"
        className="bg-cyber-dark/60 border-cyber-neon/30 hover:bg-cyber-neon/10 text-cyber-text"
      >
        <Shield className="mr-2 h-4 w-4" /> Quick Scan Test
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-cyber-dark border-cyber-neon/20 text-cyber-text">
          <DialogHeader>
            <DialogTitle className="gradient-text">Quick Vulnerability Scan</DialogTitle>
            <DialogDescription className="text-cyber-muted">
              Test our scanner without signing up. Enter a URL to scan for vulnerabilities.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-cyber-dark/60 border-cyber-neon/30 text-cyber-text"
            />

            {scanStatus === 'pending' && (
              <div className="bg-blue-950/30 border border-blue-500/30 p-3 rounded-md text-blue-200 text-sm flex items-center">
                <Loader className="animate-spin h-4 w-4 mr-2" />
                Scan in progress... This may take several minutes.
              </div>
            )}

            {results && (
              <div className="bg-cyber-dark/80 border border-cyber-neon/30 p-4 rounded-md max-h-60 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap text-cyber-text">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={runTestScan} 
              disabled={isLoading || scanStatus === 'pending'}
              className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue"
            >
              {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
              Run Test Scan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestScanButton;
