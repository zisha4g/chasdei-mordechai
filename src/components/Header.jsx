
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Gift } from 'lucide-react';
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
      className={`fixed top-0 z-40 w-full bg-[#091031] transition-all duration-300 ${
        scrolled
          ? 'shadow-[0_12px_40px_rgba(3,8,30,0.45)] py-3'
          : 'py-4'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <span className="font-display text-2xl font-bold uppercase tracking-tight text-white">Chasdei <span className="text-[#efd37a]">Mordechai</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-white/88 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/raffle"
              className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-200 flex items-center gap-1 ${
                location.pathname === '/raffle'
                  ? 'text-[#efd37a] font-bold'
                  : 'text-[#efd37a]/80 hover:text-[#efd37a]'
              }`}
            >
              <Gift size={16} /> Raffle
            </Link>
            <Link
              to="/donate"
              className={`text-sm font-semibold transition-colors duration-200 ${
                location.pathname === '/donate'
                  ? 'text-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Donate
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-semibold transition-colors duration-200 ${
                location.pathname === '/contact'
                  ? 'text-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Contact
            </Link>
            <Button 
              onClick={() => onDonateClick(60)}
              className="rounded-full border border-[#e8cc74] bg-transparent px-6 py-2 text-sm font-extrabold uppercase tracking-[0.08em] text-[#efd37a] hover:bg-[#efd37a] hover:text-[#091031]"
            >
              Donate Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-full p-2 text-white transition-colors hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute left-0 top-full w-full border-t border-white/10 bg-[#091031] px-4 py-4 shadow-xl md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block rounded-xl px-3 py-3 text-base font-semibold text-white transition-colors hover:bg-white/8 hover:text-white"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/raffle"
              className="flex items-center gap-2 rounded-xl px-3 py-3 text-base font-medium text-[#efd37a] transition-colors hover:bg-white/5"
            >
              <Gift size={18} /> Win $1000
            </Link>
            <Link
              to="/donate"
              className="block rounded-xl px-3 py-3 text-base font-medium text-white/88 transition-colors hover:bg-white/5 hover:text-white"
            >
              Donate
            </Link>
            <Link
              to="/contact"
              className="block rounded-xl px-3 py-3 text-base font-medium text-white/88 transition-colors hover:bg-white/5 hover:text-white"
            >
              Contact
            </Link>
            <Button 
              onClick={() => {
                setIsMenuOpen(false);
                onDonateClick(60);
              }}
              className="mt-4 w-full rounded-full border border-[#e8cc74] bg-transparent py-6 text-base font-extrabold uppercase tracking-[0.08em] text-[#efd37a] hover:bg-[#efd37a] hover:text-[#091031]"
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
