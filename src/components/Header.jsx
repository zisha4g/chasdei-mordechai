
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ onDonateClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
  ];

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white py-4'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src="/images/logo.png" alt="Chasdei Mordechai" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Chasdei Mordechai</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/raffle"
              className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-200 flex items-center gap-1 ${
                location.pathname === '/raffle'
                  ? 'text-accent font-bold'
                  : 'text-accent hover:text-accent/80'
              }`}
            >
              <Gift size={16} /> Raffle
            </Link>
            <Link
              to="/donate"
              className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                location.pathname === '/donate'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Donate
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                location.pathname === '/contact'
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Contact
            </Link>
            <Button 
              onClick={() => onDonateClick(60)}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 shadow-md hover:shadow-lg transition-all"
            >
              Donate Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-4 px-4 flex flex-col space-y-4 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-lg font-medium text-gray-800 hover:text-primary p-2 rounded-md hover:bg-gray-50"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/raffle"
              className="text-lg font-medium text-accent hover:text-accent/80 p-2 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <Gift size={20} /> Win $1000
            </Link>
            <Link
              to="/donate"
              className="text-lg font-medium text-gray-800 hover:text-primary p-2 rounded-md hover:bg-gray-50"
            >
              Donate
            </Link>
            <Button 
              onClick={() => {
                setIsMenuOpen(false);
                onDonateClick(60);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg mt-4 shadow-md"
            >
              Donate Now
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
