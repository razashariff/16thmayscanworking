
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-24 relative z-10 flex flex-col justify-center">
        <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-8 text-center">Contact Us</h1>
          <div className="text-cyber-muted text-lg mb-12 text-center">
            We're here to help. Please fill out the form below and we'll get back to you as soon as possible.
          </div>
          <ContactForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
