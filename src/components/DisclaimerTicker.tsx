import React from 'react';

const DisclaimerTicker: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 overflow-hidden py-2 sm:py-2.5 shadow-sm relative flex items-center z-40">
      
      {/* We use a quick <style> block here so you don't have to mess 
        with your tailwind.config.js file! This handles the smooth train animation.
      */}
      <style>
        {`
          @keyframes ticker {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
          .animate-ticker {
            display: inline-block;
            white-space: nowrap;
            animation: ticker 35s linear infinite;
            will-change: transform;
          }
          /* Pause the train when the user hovers over it! */
          .animate-ticker:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* The Running Text */}
      <div className="w-full flex items-center">
        <div className="animate-ticker text-black text-[11px] sm:text-sm font-medium px-4 tracking-wide cursor-default">
          As per 2018 supreme court order, online sale of firecrackers are not permitted! We value our customers and at the same time, respect jurisdiction. We request you to add your products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call.{' '}
          <span className="text-red-700 font-bold ml-1">
            Please add and submit your enquiries and enjoy your Diwali with Sivakasi Wisdom Crackers.
          </span>
        </div>
      </div>
      
    </div>
  );
};

export default DisclaimerTicker;