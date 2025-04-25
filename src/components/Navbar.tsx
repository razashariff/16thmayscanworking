
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Menu, X } from "lucide-react";
import BookingModal from './BookingModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    console.log("Current location:", location.pathname);
    // This function is only for logging purposes
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-cyber-dark/80 backdrop-blur-lg border-b border-cyber-blue/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center" onClick={() => handleNavigation('/')}>
          <span className="text-2xl font-bold gradient-text">CyberSecAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-colors ${isActive('/') ? 'text-cyber-neon' : 'text-cyber-text hover:text-cyber-neon'}`}
              onClick={() => handleNavigation('/')}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`transition-colors ${isActive('/services') ? 'text-cyber-neon' : 'text-cyber-text hover:text-cyber-neon'}`}
              onClick={() => handleNavigation('/services')}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors ${isActive('/about') ? 'text-cyber-neon' : 'text-cyber-text hover:text-cyber-neon'}`}
              onClick={() => handleNavigation('/about')}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors ${isActive('/contact') ? 'text-cyber-neon' : 'text-cyber-text hover:text-cyber-neon'}`}
              onClick={() => handleNavigation('/contact')}
            >
              Contact
            </Link>
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
            <Link 
              to="/" 
              className={`px-2 py-2 rounded-md ${isActive('/') ? 'text-cyber-neon' : 'text-cyber-text hover:text-cyber-neon'}`} 
              onClick={() => {
                handleNavigation('/');
                toggleMenu();
              }}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`px-2 py-2 rounded-md ${isActive('/services') ? 'text-cyber-neon' : 'text-cyber-text hover:text-cyber-neon'}`} 
              onClick={() => {
                handleNavigation('/services');
                toggleMenu();
              }}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`px-2 py-2 rounded-md ${isActive('/about') ? 'text-cyber-neon' : 'text-cyber-text hover:text-cyber-neon'}`} 
              onClick={() => {
                handleNavigation('/about');
                toggleMenu();
              }}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`px-2 py-2 rounded-md ${isActive('/contact') ? 'text-cyber-neon' : 'text-cyber-text hover:text-cyber-neon'}`} 
              onClick={() => {
                handleNavigation('/contact');
                toggleMenu();
              }}
            >
              Contact
            </Link>
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
