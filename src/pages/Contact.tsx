
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-24 relative z-10 flex flex-col justify-center">
        <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-8">Contact Us</h1>
          <div className="text-cyber-muted text-lg">We're here to help. Please reach out for any inquiries.</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;

