
import { useState } from 'react';
import { Link } from 'react-router-dom';
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
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold gradient-text">CyberSecAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-cyber-text hover:text-cyber-neon transition-colors">Home</Link>
            <Link to="/services" className="text-cyber-text hover:text-cyber-neon transition-colors">Services</Link>
            <Link to="/about" className="text-cyber-text hover:text-cyber-neon transition-colors">About</Link>
            <Link to="/contact" className="text-cyber-text hover:text-cyber-neon transition-colors">Contact</Link>
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
            <Link to="/" className="text-cyber-text hover:text-cyber-neon px-2 py-2 rounded-md" onClick={toggleMenu}>Home</Link>
            <Link to="/services" className="text-cyber-text hover:text-cyber-neon px-2 py-2 rounded-md" onClick={toggleMenu}>Services</Link>
            <Link to="/about" className="text-cyber-text hover:text-cyber-neon px-2 py-2 rounded-md" onClick={toggleMenu}>About</Link>
            <Link to="/contact" className="text-cyber-text hover:text-cyber-neon px-2 py-2 rounded-md" onClick={toggleMenu}>Contact</Link>
            <Button 
              onClick={() => {
                openModal();
                toggleMenu();
              }}
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
