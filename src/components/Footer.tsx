import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { shopConfig } from '../config/shopConfig';
import { useApp } from '../context/AppContext';
import type { PageView } from '../types';

const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  const handleLinkClick = (target: PageView) => {
    setCurrentPage(target);
    window.scrollTo({ top: 0 });
  };

  const quickLinks: { name: string; target: PageView }[] = [
    { name: 'Home', target: 'home' },
    { name: 'About Us', target: 'about' },
    { name: 'Quick Purchase', target: 'products' },
    { name: 'Safety Tips', target: 'safety' },
    { name: 'Contact Us', target: 'contact' },
  ];

  return (
    <footer className="bg-orange-600 text-white">
      {/* Kept pb-28 for the mobile sticky cart bar, but increased padding heavily for md (desktop) */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-28 md:pt-16 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          
          <div>
            <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-6">
              {/* Increased desktop logo to w-16 h-16 */}
              <img 
                src="/wc_logo.png" 
                alt={`${shopConfig.name} Logo`} 
                className="w-10 h-10 md:w-16 md:h-16 object-contain rounded-full shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                {/* Increased desktop shop name to text-2xl */}
                <h3 className="font-bold text-base md:text-2xl leading-none">{shopConfig.name}</h3>
                <p className="text-yellow-400 text-[10px] md:text-sm mt-1 md:mt-1.5">{shopConfig.tagline}</p>
              </div>
            </div>
            {/* Increased desktop paragraph to text-base */}
            <p className="text-white-600 text-[11px] md:text-base leading-relaxed">
              Premium quality firecrackers sourced directly from Sivakasi.
            </p>
          </div>

          <div>
            {/* Increased desktop heading to text-base */}
            <h4 className="font-bold text-yellow-400 mb-2 md:mb-6 uppercase tracking-wider text-xs md:text-base">Quick Links</h4>
            <ul className="space-y-1.5 md:space-y-3 text-[11px] md:text-base text-white-200">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link.target)}
                    className="hover:text-yellow-400 transition-colors cursor-pointer"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-yellow-400 mb-2 md:mb-6 uppercase tracking-wider text-xs md:text-base">Contact Info</h4>
            <div className="space-y-2 md:space-y-4 text-[11px] md:text-base text-white-200">
              <div className="flex items-start gap-2 md:gap-3">
                {/* Increased desktop icons to w-5 h-5 */}
                <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5 text-yellow-500 flex-shrink-0 mt-0.5 md:mt-1" />
                <span>{shopConfig.address}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Phone className="w-3.5 h-3.5 md:w-5 md:h-5 text-yellow-500" />
                <a href={`tel:${shopConfig.mobile}`} className="hover:text-yellow-400 transition-colors">
                  {shopConfig.mobile}
                </a>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Mail className="w-3.5 h-3.5 md:w-5 md:h-5 text-yellow-500" />
                <a href={`mailto:${shopConfig.email}`} className="hover:text-yellow-400 transition-colors">
                  {shopConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Increased top border spacing and text size for desktop copyright row */}
        <div className="border-t border-red-800 mt-6 pt-4 md:mt-10 md:pt-8 flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-4 text-[10px] md:text-sm text-gray-300">
          <p className="text-center sm:text-left">&copy; 2026 {shopConfig.name}. All rights reserved.</p>
          <p className="text-center sm:text-right">Burst responsibly. Follow all safety guidelines.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
