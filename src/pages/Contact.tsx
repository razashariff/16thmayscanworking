
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 relative z-10">
        <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-8">Contact Us</h1>
          <div className="text-cyber-muted text-lg">Content coming soon...</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
