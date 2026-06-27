import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { shopConfig } from '../config/shopConfig';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Quick Purchase', href: '#products' },
  { label: 'Safety Tips', href: '#safety' },
  { label: 'Contact Us', href: '#contact' },
];

const Header: React.FC = () => {
  const { cartItems, setIsCartOpen } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      /* THE FIX: z-[100] prevents overlap. Solid bg-red-950 prevents the invisible flash. Fixed py-2 sm:py-3 prevents size jumping! */
      className={`fixed top-0 left-0 right-0 z-[100] bg-red-900 py-0.5 sm:py-1 transition-shadow duration-300 `}
    >
      {/* THE DANCE ANIMATION CSS */}
      <style>
        {`
          @keyframes dance {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(-5deg) scale(1.1); }
            50% { transform: rotate(5deg) scale(1.1); }
            75% { transform: rotate(-5deg) scale(1.1); }
          }
          .animate-dance {
            display: inline-block;
            animation: dance 1.5s ease-in-out infinite;
            transform-origin: center;
          }
        `}
      </style>

      <div className="max-w-[1650px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between">
          
          {/* LOGO AND SHOP NAME SECTION */}
          <div className="flex items-center gap-1 sm:gap-3 min-w-0">
            {/* Custom Image Logo - Size stays perfectly locked! */}
            <img 
              src="/skt_logo.png" 
              alt={shopConfig.name} 
              className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain drop-shadow-lg transition-transform hover:scale-105"
            />
            <div className="min-w-0">
              <h1 className="text-white font-bold leading-tight tracking-wide whitespace-nowrap text-base sm:text-xl md:text-2xl lg:text-3xl drop-shadow-md">
                {shopConfig.name}
              </h1>
              <p className="text-yellow-300 text-xs hidden sm:block opacity-90">
                {shopConfig.tagline}
              </p>
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => { e.preventDefault(); document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' }); }}
                className="text-yellow-100 hover:text-yellow-300 px-3 py-2 text-xl font-medium rounded-md hover:bg-red-700 transition-all duration-200"
              >
                {/* Applies the dance animation ONLY to Quick Purchase */}
                <span className={link.label === 'Quick Purchase' ? 'animate-dance text-yellow-400 font-bold' : ''}>
                  {link.label}
                </span>
              </a>
            ))}
          </nav>

          {/* CONTACT & CART BUTTONS */}
          <div className="flex items-center gap-4 sm:gap-14">
            <a
              href={`tel:${shopConfig.mobile}`}
              className="hidden md:flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-300 text-red-900 text-sm font-bold px-4 py-3 rounded-full transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="text-[16px] ">{shopConfig.mobile}</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-yellow-500 hover:bg-yellow-400 text-red-900 p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-yellow-500/30 hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5 sm:w-7 sm:h-7" />
              
              {totalQty > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] sm:text-xs font-bold h-4 min-w-4 sm:h-5 sm:min-w-5 px-1 sm:px-1.5 rounded-full flex items-center justify-center border-2 border-white whitespace-nowrap">
                  {totalQty > 99 ? '99+' : totalQty}
                </span>
              )}
            </button>

            <button
              className="lg:hidden text-white p-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION MENU */}
        {menuOpen && (
          <div className="lg:hidden mt-3 pb-3 border-t border-red-700">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}
                className="block text-yellow-100 hover:text-yellow-300 px-4 py-2.5 text-sm font-medium hover:bg-red-700 rounded-md transition-colors mt-1"
              >
                {/* Applies the dance animation ONLY to Quick Purchase in the mobile menu */}
                <span className={link.label === 'Quick Purchase' ? 'animate-dance text-yellow-400 font-bold' : ''}>
                  {link.label}
                </span>
              </a>
            ))}
            <a
              href={`tel:${shopConfig.mobile}`}
              className="flex items-center gap-2 text-yellow-300 px-4 py-2.5 text-sm font-medium mt-1"
            >
              <Phone className="w-4 h-4" />
              {shopConfig.mobile}
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;