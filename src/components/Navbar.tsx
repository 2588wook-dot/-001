/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Portfolio', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/admin' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-natural-bg/90 backdrop-blur-md border-b border-natural-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-5 group">
          <div className="w-12 h-12 bg-natural-dark flex items-center justify-center text-white font-serif italic text-xl group-hover:bg-natural-accent transition-colors shadow-lg">
            D
          </div>
          <h1 className="text-xl md:text-2xl font-serif tracking-[0.3em] text-natural-dark uppercase font-bold leading-none">
            Design Work Group
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-12">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[11px] uppercase tracking-[0.3em] font-bold transition-all hover:text-natural-accent ${
                location.pathname === link.path 
                  ? 'text-natural-accent border-b-2 border-natural-accent pb-1' 
                  : 'text-natural-dark'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2" onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6 text-natural-dark" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-natural-dark flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-white font-serif italic text-xl tracking-widest">MENU</span>
              <button onClick={() => setIsOpen(false)} className="p-2">
                <X className="w-8 h-8 text-white" />
              </button>
            </div>
            
            <ul className="space-y-10">
              {links.map((link, i) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-3xl font-serif italic hover:text-natural-accent transition-colors ${
                       location.pathname === link.path ? 'text-natural-accent' : 'text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto pt-10 border-t border-white/10 text-white/50 text-[10px] uppercase tracking-[0.3em] font-bold">
              <p className="mb-2">Contact</p>
              <p className="text-white text-sm tracking-widest">+82 02-1234-5678</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
