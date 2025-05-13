
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Shield, Loader } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const TestScanButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

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
    
    try {
      // Use POST request with JSON body
      const response = await fetch(`https://fastapi-scanner-211605900220.us-central1.run.app/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_url: url,
          scan_type: 'full'
        }),
        mode: 'cors', // Use cors mode for proper response handling
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data);
      toast({
        title: "Success",
        description: "Scan completed successfully"
      });
    } catch (error) {
      console.error('Error during test scan:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete scan. Check console for details."
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
              disabled={isLoading}
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
