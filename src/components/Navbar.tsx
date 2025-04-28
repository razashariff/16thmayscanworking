
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isMobile = useMobile();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Vulnerability Scanner', path: '/vulnerability-scanner', protected: true },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-cyber-dark/90 backdrop-blur-md shadow-glow-sm' : 'bg-transparent'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold gradient-text">VIBE::SECURITY</span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              {links.filter(link => !link.protected || user).map((link, index) => (
                <Link 
                  key={index} 
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium hover:text-cyber-neon transition-colors ${
                    location.pathname === link.path ? 'text-cyber-neon' : 'text-cyber-text'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <Button 
                  variant="outline"
                  className="border-cyber-neon/30 hover:bg-cyber-neon/10"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-cyber-blue to-cyber-purple hover:from-cyber-purple hover:to-cyber-blue">
                    Login / Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-cyber-muted hover:text-white hover:bg-cyber-dark/50 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-cyber-dark/95 backdrop-blur-lg shadow-glow-sm`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {links.filter(link => !link.protected || user).map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`block px-3 py-2 text-base font-medium ${
                location.pathname === link.path ? 'text-cyber-neon' : 'text-cyber-text'
              } hover:text-cyber-neon transition-colors`}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <button 
              className="w-full text-left block px-3 py-2 text-base font-medium text-cyber-text hover:text-cyber-neon transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/auth" 
              className="block px-3 py-2 text-base font-medium text-cyber-neon"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
