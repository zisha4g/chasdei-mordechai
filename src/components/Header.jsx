
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
      className="fixed top-0 z-40 w-full transition-all duration-300"
      style={{background:'rgba(7,15,48,0.97)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', borderBottom:'1px solid rgba(255,255,255,0.10)', height:'72px', display:'flex', alignItems:'center', boxShadow:'0 4px 22px rgba(0,0,0,0.12)'}}
    >
      <nav className="w-full px-[6%] flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="font-display uppercase text-white" style={{fontSize:'1.65rem', letterSpacing:'1.5px'}}>Chasdei <span style={{color:'#F2DFA8'}}>Mordechai</span></span>
        </Link>

          <div className="hidden md:flex items-center" style={{gap:'2.5rem'}}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="transition-colors duration-200"
                style={{color: location.pathname === link.path ? '#fff' : 'rgba(255,255,255,0.55)', fontSize:'0.88rem', fontWeight:500, letterSpacing:'0.4px'}}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/raffle"
              className="flex items-center gap-1 transition-colors duration-200"
              style={{color: location.pathname === '/raffle' ? '#F2DFA8' : 'rgba(255,255,255,0.55)', fontSize:'0.88rem', fontWeight:500}}
            >
              <Gift size={15} /> Raffle
            </Link>
            <Link
              to="/donate"
              className="transition-colors duration-200"
              style={{color: location.pathname === '/donate' ? '#fff' : 'rgba(255,255,255,0.55)', fontSize:'0.88rem', fontWeight:500}}
            >
              Donate
            </Link>
            <Link
              to="/contact"
              className="transition-colors duration-200"
              style={{color: location.pathname === '/contact' ? '#fff' : 'rgba(255,255,255,0.55)', fontSize:'0.88rem', fontWeight:500}}
            >
              Contact
            </Link>
            <Button 
              onClick={() => onDonateClick(60)}
              className="rounded-full bg-transparent transition-all hover:-translate-y-0.5 hover:bg-[#F2DFA8] hover:text-[#0B1A4F]"
              style={{color:'#F2DFA8', border:'1.5px solid #F2DFA8', fontSize:'0.82rem', fontWeight:800, letterSpacing:'1px', textTransform:'uppercase', padding:'0.58rem 1.5rem'}}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute left-0 top-full w-full border-t border-white/10 bg-[#0B1A4F] px-4 py-4 shadow-xl md:hidden">
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
              className="flex items-center gap-2 rounded-xl px-3 py-3 text-base font-medium text-[#F2DFA8] transition-colors hover:bg-white/5"
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
              className="mt-4 w-full rounded-full bg-transparent py-6 text-base font-extrabold uppercase text-[#F2DFA8]"
              style={{border:'1.5px solid #F2DFA8', letterSpacing:'1px'}}
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
