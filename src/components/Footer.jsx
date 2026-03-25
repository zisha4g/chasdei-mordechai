
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ onDonateClick }) => {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Raffle', path: '/raffle' },
    { name: 'Donate', path: '/donate' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const giveLinks = [
    { label: '$12 — One Child\'s Shabbos', amount: 12 },
    { label: '$60 — Fill the Fridge', amount: 60 },
    { label: '$120 — Full Shabbos Table', amount: 120 },
  ];

  return (
    <footer className="border-t border-white/8 bg-[#091031] text-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <div className="font-display text-[2rem] font-semibold uppercase tracking-[0.03em] text-white">
              Chasdei <span style={{ color: '#F2DFA8' }}>Mordechai</span>
            </div>
            <p className="max-w-xs text-sm leading-8 text-white/60">
              Restoring dignity. Filling tables.<br />
              Transforming communities — one<br />
              Shabbos at a time.
            </p>
            {onDonateClick && (
              <button
                onClick={() => onDonateClick(60)}
                className="mt-2 rounded-full border border-[#e8cc74] px-6 py-2 text-sm font-extrabold uppercase tracking-[0.08em] text-[#efd37a] transition-colors hover:bg-[#efd37a] hover:text-[#091031]"
              >
                YES. I WILL BE THE ANSWER.
              </button>
            )}
          </div>

          <div>
            <h3 className="mb-5 text-xs font-extrabold uppercase tracking-[0.24em] text-[#efd37a]">Navigate</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-extrabold uppercase tracking-[0.24em] text-[#efd37a]">Give</h3>
            <ul className="space-y-3">
              {giveLinks.map((link) => (
                <li key={link.amount}>
                  <button
                    onClick={() => onDonateClick && onDonateClick(link.amount)}
                    className="text-sm text-white/70 transition-colors hover:text-white text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>


      </div>
    </footer>
  );
};

export default Footer;
