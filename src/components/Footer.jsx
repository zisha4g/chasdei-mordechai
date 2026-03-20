
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Donate', path: '/donate' },
  ];

  const giveLinks = [
    '$12 - One Child',
    '$60 - Fill the Fridge',
    '$120 - Full Shabbos',
  ];

  return (
    <footer className="border-t border-white/8 bg-[#091031] text-white/62">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <div className="font-display text-[2rem] font-semibold uppercase tracking-[0.03em] text-white">
              Chasdei Mordechai
            </div>
            <p className="max-w-xs text-sm leading-8 text-white/42">
              Restoring dignity. Filling tables.<br />
              Transforming communities - one<br />
              Shabbos at a time.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-extrabold uppercase tracking-[0.24em] text-[#efd37a]">Navigate</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/52 transition-colors hover:text-white"
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
                <li key={link} className="text-sm text-white/52">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-xs text-white/30">
          <p>
            © {new Date().getFullYear()} Chasdei Mordechai. All Rights Reserved. | 501(c)(3) Tax-Exempt Organization
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
