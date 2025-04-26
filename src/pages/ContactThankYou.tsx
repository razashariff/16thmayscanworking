
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useState } from "react";
import BookingModal from "@/components/BookingModal";

const ContactThankYou = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-cyber-dark text-cyber-text">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-24 relative z-10 flex flex-col justify-center">
        <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-8">Thank You!</h1>
          <p className="text-cyber-muted text-lg mb-8">
            We've received your enquiry and one of our team members will get back to you soon.
          </p>
          <p className="text-cyber-muted text-lg mb-8">
            In the meantime, why not schedule a call with us to discuss your needs in detail?
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue text-white"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book a Call
          </Button>
        </div>
      </div>
      <Footer />
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ContactThankYou;
