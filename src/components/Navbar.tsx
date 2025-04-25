
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Menu, X } from "lucide-react";
import BookingModal from './BookingModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-cyber-dark/80 backdrop-blur-lg border-b border-cyber-blue/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <span className="text-2xl font-bold gradient-text">CyberSecAI</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center space-x-6">
            <a href="#" className="text-cyber-text hover:text-cyber-neon transition-colors">Home</a>
            <a href="#services" className="text-cyber-text hover:text-cyber-neon transition-colors">Services</a>
            <a href="#about" className="text-cyber-text hover:text-cyber-neon transition-colors">About</a>
            <a href="#contact" className="text-cyber-text hover:text-cyber-neon transition-colors">Contact</a>
          </div>
          <Button 
            onClick={openModal}
            className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue text-white border border-transparent hover:border-cyber-neon transition-all duration-300 shadow-lg hover:shadow-cyber-neon/30"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Book a Call
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-cyber-text" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X size={24} className="text-cyber-neon" />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-cyber-dark border-t border-cyber-blue/20 py-4 animate-fade-in">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <a href="#" className="text-cyber-text hover:text-cyber-neon px-2 py-2 rounded-md">Home</a>
            <a href="#services" className="text-cyber-text hover:text-cyber-neon px-2 py-2 rounded-md">Services</a>
            <a href="#about" className="text-cyber-text hover:text-cyber-neon px-2 py-2 rounded-md">About</a>
            <a href="#contact" className="text-cyber-text hover:text-cyber-neon px-2 py-2 rounded-md">Contact</a>
            <Button 
              onClick={openModal}
              className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue text-white"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book a Call
            </Button>
          </div>
        </div>
      )}

      <BookingModal isOpen={isModalOpen} onClose={closeModal} />
    </nav>
  );
};

export default Navbar;
