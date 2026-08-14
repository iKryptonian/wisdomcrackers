import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const LegalNoticePopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm" />

      {/* Popup */}
      <div className="fixed inset-0 z-[210] flex items-center justify-center px-4">
        <div className="relative bg-white rounded-2xl shadow-2xl
                w-[100%]
                max-w-[320px]
                sm:max-w-[420px]
                md:max-w-[550px]
                lg:max-w-[550px]
                mx-auto
                p-4 sm:p-6 md:p-8">

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <p className="text-black text-[13px] sm:text-[16px] md:text-[20px] leading-relaxed pr-6">
            As per the 2018 Supreme Court order, online sale of firecrackers are not permitted. We value our customers and at the same time, respect jurisdiction. We request you to add your products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call.
          </p>

        </div>
      </div>
    </>
  );
};

export default LegalNoticePopup;