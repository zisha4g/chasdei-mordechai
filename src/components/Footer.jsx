
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Donate', path: '/donate' },
    { name: 'Raffle', path: '/raffle' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Heart size={24} fill="currentColor" className="text-primary" />
              <span className="text-2xl font-bold tracking-tight">Chasdei Mordechai</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Restoring homes, tables, and hearts. We stand with families in crisis, ensuring no one faces their darkest moments alone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Navigation</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary transition-colors flex items-center"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Chasdei Mordechai. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 italic">
            Restoring dignity, one table at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
