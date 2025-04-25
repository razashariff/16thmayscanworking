
import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load the Calendly script
  useEffect(() => {
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.setAttribute('src', 'https://assets.calendly.com/assets/external/widget.js');
    script.setAttribute('async', 'true');
    
    if (head && !document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')) {
      head.appendChild(script);
    }

    return () => {
      if (head && script.parentNode === head) {
        head.removeChild(script);
      }
    };
  }, []);

  // Update Calendly when modal opens
  useEffect(() => {
    if (isOpen && iframeRef.current) {
      // Use the correct Calendly URL
      const calendlyUrl = 'https://calendly.com/breach2020';
      iframeRef.current.src = calendlyUrl;
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-cyber-dark border border-cyber-blue/30 text-cyber-text">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Book a Consultation</DialogTitle>
          <DialogDescription className="text-cyber-muted">
            Select a time that works best for you, and I'll help secure your digital future.
          </DialogDescription>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-cyber-muted hover:text-cyber-neon"
          >
            <X size={20} />
          </button>
        </DialogHeader>
        
        <div className="mt-4 h-[600px] w-full">
          <div 
            className="calendly-inline-widget w-full h-full" 
            data-url="https://calendly.com/breach2020"
          >
            <iframe
              ref={iframeRef}
              src="https://calendly.com/breach2020"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Select a Date & Time - Calendly"
              className="bg-white rounded-md"
            ></iframe>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
