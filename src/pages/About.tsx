
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  const triggerCalendly = () => {
    const element = document.querySelector('[data-calendly-link]');
    if (element) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(event);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold gradient-text mb-8">About Us</h1>
        <p className="text-cyber-muted mb-8">Content coming soon...</p>
        <div className="flex justify-end">
          <Button 
            onClick={triggerCalendly}
            className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue text-white"
          >
            Vibe Coding Blueprint
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
