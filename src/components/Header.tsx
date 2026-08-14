import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { shopConfig } from '../config/shopConfig';

const navLinks = [
  { label: 'Home', target: 'home' },
  { label: 'About Us',  target: 'about' },
  { label: 'Quick Purchase',  target: 'products' },
  { label: 'Safety Tips',  target: 'safety' },
  { label: 'Contact Us', target: 'contact' },
] as const;

const Header: React.FC = () => {
  const { cartItems, setIsCartOpen, currentPage, setCurrentPage } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  {/*
  const handleNavClick = (link: (typeof navLinks)[number]) => {
    if (link.type === 'page') {
      // Switch to a standalone page (About / Safety)
      setCurrentPage(link.target);
      window.scrollTo({ top: 0 });
    } else {
      // Scroll-based section (Home / Products / Contact)
      if (currentPage !== 'home') {
        setCurrentPage('home');
        setTimeout(() => {
          document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        if (link.target === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.getElementById(link.target)?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };
  */}
  const handleNavClick = (link: (typeof navLinks)[number]) => {
    setCurrentPage(link.target);
    window.scrollTo({ top: 0 });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] py-0.5 sm:py-1 bg-gray-200 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
    >
      {/* DANCE ANIMATION */}
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

          {/* LOGO */}
          <div className="flex items-center gap-1 sm:gap-3 min-w-0">
            <img
              src="/wc_logo.png"
              alt={shopConfig.name}
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain drop-shadow-lg transition-transform hover:scale-105"
            />

            <div className="min-w-0">
              <h1 className="text-orange-700 font-bold leading-tight tracking-wide whitespace-nowrap text-base sm:text-xl md:text-2xl lg:text-3xl">
                {shopConfig.name}
              </h1>
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="text-black hover:text-orange-700 px-3 py-2 text-[18px] font-medium rounded-md hover:bg-orange-100 transition-all duration-200"
              >
                <span
                  className={
                    link.label === 'Quick Purchase'
                      ? 'animate-dance text-orange-700 font-bold'
                      : ''
                  }
                >
                  {link.label}
                </span>
              </button>
            ))}
          </nav>

          {/* CONTACT + CART */}
          <div className="flex items-center gap-4 sm:gap-14">

            <a
              href={`tel:${shopConfig.mobile}`}
              className="hidden md:flex items-center gap-1.5 bg-orange-600 hover:bg-orange-600 text-white text-sm font-bold px-4 py-3 rounded-full transition-colors"
            >
            
              <Phone className="w-5 h-5" />
              <span className="text-[16px]">{shopConfig.mobile}</span>
            </a>
            <a
              href={`tel:${shopConfig.mobile2.replace(/\s/g, "")}`}
              className="hidden md:flex items-center gap-1.5 bg-orange-600 hover:bg-orange-600 text-white text-sm font-bold px-4 py-3 rounded-full transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="text-[16px]">{shopConfig.mobile2}</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-orange-600 hover:bg-orange-500 text-white p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-orange-500/30 hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5 sm:w-7 sm:h-7" />

              {totalQty > 0 && (
                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] sm:text-xs font-bold h-4 min-w-4 sm:h-5 sm:min-w-5 px-1 sm:px-1.5 rounded-full flex items-center justify-center border-2 border-white whitespace-nowrap">
                  {totalQty > 99 ? '99+' : totalQty}
                </span>
              )}
            </button>

            <button
              className="lg:hidden text-gray-900 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden mt-3 pb-3 border-t border-gray-200 bg-gray-200">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => {
                  handleNavClick(link);
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-gray-900 hover:text-orange-700 px-4 py-2.5 text-sm font-bold hover:bg-orange-100 rounded-md transition-colors mt-1"
              >
                <span
                  className={
                    link.label === 'Quick Purchase'
                      ? 'animate-dance text-orange-700 font-bold'
                      : ''
                  }
                >
                  {link.label}
                </span>
              </button>
            ))}

            <a
              href={`tel:${shopConfig.mobile}`}
              className="flex items-center gap-2 text-orange-700 px-4 py-2.5 text-sm font-bold mt-1 bg-orange-100 rounded-md hover:bg-orange-300 transition-colors"
            >
              <Phone className="w-4 h-4" />
              {shopConfig.mobile}
            </a>

            <a
              href={`tel:${shopConfig.mobile2}`}
              className="flex items-center gap-2 text-orange-700 px-4 py-2.5 text-sm font-bold mt-1 bg-orange-100 rounded-md hover:bg-orange-300 transition-colors"
            >
              <Phone className="w-4 h-4" />
              {shopConfig.mobile2}
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;