
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Shield, Loader, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Progress } from "@/components/ui/progress";

const TestScanButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [scanId, setScanId] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const checkScanStatus = async () => {
    if (!scanId) return;
    
    try {
      setIsCheckingStatus(true);
      console.log(`Checking status for scan ${scanId}`);
      
      // Simple GET request with query parameter
      const { data, error } = await supabase.functions.invoke('zap-scan', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        queryParams: { scan_id: scanId }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not check scan status. Please try again later."
        });
        return;
      }
      
      if (data) {
        console.log(`Scan status response:`, data);
        setScanStatus(data.status);
        setScanProgress(data.progress || 0);
        
        if (data.status === 'completed') {
          setResults(data.results);
          toast({
            title: "Scan Completed",
            description: "Vulnerability scan completed successfully!"
          });
        } else if (data.status === 'failed') {
          toast({
            variant: "destructive",
            title: "Scan Failed",
            description: data.error || "An error occurred during the scan"
          });
        }
      }
    } catch (error) {
      console.error('Error checking scan status:', error);
    } finally {
      setIsCheckingStatus(false);
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
    setScanProgress(0);
    
    try {
      // Generate a temporary scan ID for test scans
      const tempScanId = `test-${Date.now()}`;
      
      // Simplify the payload to match the direct ZAP API requirements
      const payload = {
        target_url: url,
        scan_id: tempScanId
      };
      
      console.log("Sending test scan request with payload:", payload);
      
      // Simple POST request
      const { data, error } = await supabase.functions.invoke('zap-scan', {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      console.log("Test scan response:", data);
      setScanId(data.scan_id || tempScanId);
      setScanStatus('pending');
      setScanProgress(0);
      
      toast({
        title: "Success",
        description: "Test scan initiated successfully"
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

            {scanStatus && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Status: {scanStatus === 'pending' ? 'Initializing' : 
                         scanStatus === 'running' || scanStatus === 'in_progress' ? 'In Progress' : 
                         scanStatus === 'completed' ? 'Completed' : 'Failed'}</span>
                  <span>{scanProgress}%</span>
                </div>
                
                <Progress value={scanProgress} className="h-2" />
                
                {(scanStatus === 'pending' || scanStatus === 'running' || scanStatus === 'in_progress') && (
                  <div className="flex justify-end">
                    <Button 
                      onClick={checkScanStatus} 
                      variant="outline" 
                      size="sm" 
                      disabled={isCheckingStatus}
                      className="flex items-center gap-1 text-xs"
                    >
                      {isCheckingStatus ? 
                        <Loader className="h-3 w-3 animate-spin" /> : 
                        <RefreshCw className="h-3 w-3" />
                      }
                      Check Status
                    </Button>
                  </div>
                )}
              </div>
            )}

            {results && (
              <div className="bg-cyber-dark/80 border border-cyber-neon/30 p-4 rounded-md max-h-60 overflow-auto">
                <h3 className="text-sm font-semibold mb-2">Scan Results:</h3>
                <pre className="text-xs whitespace-pre-wrap text-cyber-text">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Close
            </Button>
            <Button 
              onClick={runTestScan} 
              disabled={isLoading || scanStatus === 'pending' || scanStatus === 'running' || scanStatus === 'in_progress'}
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
