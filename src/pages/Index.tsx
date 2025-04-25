
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Footer />
      
      {/* Hidden Calendly link */}
      <a 
        href="https://calendly.com/breach2020" 
        className="hidden" 
        data-calendly-link 
        onClick={(e) => {
          e.preventDefault();
          const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          document.querySelector('.calendly-inline-widget')?.dispatchEvent(event);
        }}
      >
        Book a Call
      </a>
    </div>
  );
};

export default Index;
