
import Navbar from '@/components/Navbar';
import Services from '@/components/Services';
import About from '@/components/About';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-center my-12">
          <iframe
            src="https://youtube.com/embed/w4xKAwM1Ca8"
            width="800"
            height="450"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Cyber Security"
            className="shadow-lg rounded-lg"
          ></iframe>
        </div>
      </div>
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
