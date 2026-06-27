import React, { useState } from 'react';
import { Sparkles, Star, Send, X, Download } from 'lucide-react';

const HeroBanner: React.FC = () => {
  const [showChitPage, setShowChitPage] = useState(false);

  const handleEnquiry = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>
        {`
          /* Your existing blue bar scroll animation */
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll-left 20s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }

          /* NEW: Seamless Ticker Animation */
          @keyframes ticker-seamless {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-ticker {
            display: flex;
            width: max-content;
            animation: ticker-seamless 30s linear infinite;
          }
          /* Pauses when the user touches/hovers over it */
          .animate-ticker:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <section
        id="home"
        className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-red-950 pt-20 pb-24 sm:pt-28 sm:pb-32"
        style={{
          background: 'linear-gradient(135deg, #1a0000 0%, #4a0000 30%, #7f0000 60%, #3b1404 100%)',
        }}
      >
        {/* --- WHITE RUNNING DISCLAIMER TICKER (Seamless Loop) --- */}
        <div className="absolute top-[61px] sm:top-[70px] left-0 w-full bg-white border-b border-gray-200 overflow-hidden py-0.5 sm:py-1 shadow-sm z-50">
          <div className="animate-ticker">
            
            {/* FIRST COPY OF TEXT */}
            <div className="pr-10 sm:pr-20 text-black text-[10px] sm:text-sm font-medium tracking-wide cursor-default whitespace-nowrap">
              As per 2018 supreme court order, online sale of firecrackers are not permitted! We value our customers and at the same time, respect jurisdiction. We request you to add your products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call.{' '}
              <span className="text-red-700 font-bold ml-1">
                Please add and submit your enquiries and enjoy your Diwali with Sivakasi Sri Krishna Traders.
              </span>
              {/* This little star separates the end of the sentence from the beginning of the next one! */}
              <span className="inline-block mx-8 sm:mx-16 text-gray-300">★</span>
            </div>

            {/* SECOND COPY OF TEXT (Creates the seamless loop effect) */}
            <div className="pr-10 sm:pr-20 text-black text-[11px] sm:text-sm font-medium tracking-wide cursor-default whitespace-nowrap">
              As per 2018 supreme court order, online sale of firecrackers are not permitted! We value our customers and at the same time, respect jurisdiction. We request you to add your products to the cart and submit the required crackers through the enquiry button. We will contact you within 24 hrs and confirm the order through WhatsApp or phone call.{' '}
              <span className="text-red-700 font-bold ml-1">
                Please add and submit your enquiries and enjoy your Diwali with Sivakasi Sri Krishna Traders.
              </span>
              <span className="inline-block mx-8 sm:mx-16 text-gray-300">★</span>
            </div>

          </div>
        </div>

        {/* Animated Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              <Star
                className="text-yellow-400 opacity-40"
                style={{ width: `${8 + Math.random() * 16}px`, height: `${8 + Math.random() * 16}px` }}
                fill="currentColor"
              />
            </div>
          ))}
        </div>

        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-15 mix-blend-luminosity"
          style={{
            backgroundImage: `url('/hero-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Darkening Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* --- TOP HALF CONTENT --- */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
          
          <div className="flex justify-center mb-4 sm:mb-6 mt-8 sm:mt-0">
            <div className="flex items-center gap-2 sm:gap-3 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/40 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              <span className="text-yellow-300 text-[10px] sm:text-sm font-semibold tracking-widest uppercase">
                Diwali Special Offers
              </span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black sm:font-extrabold leading-tight mb-3 sm:mb-4 whitespace-normal sm:whitespace-nowrap px-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 bg-[length:200%_auto] animate-gradient [animation-duration:2.5s]">            
              Sri Krishna Traders
            </span>
          </h1>

          <p className="text-yellow-100/80 text-sm sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Premium Quality Firecrackers Since 2016 - Your Trusted Source for Diwali Celebrations
          </p>
        </div>

        {/* --- EDGE-TO-EDGE SCROLLING BLUE BAR --- */}
        <div className="relative z-10 w-full bg-blue-950/50 border-y border-blue-400/30 backdrop-blur-sm mb-6 sm:mb-8 py-2.5 shadow-[0_0_15px_rgba(37,99,235,0.15)] overflow-hidden">
          <div className="flex flex-nowrap w-max animate-scroll cursor-default">
            
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-1.5 shrink-0">
                <button 
                  onClick={() => setShowChitPage(true)}
                  className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 text-red-950 text-[10px] sm:text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap shadow-[0_0_15px_rgba(250,204,21,0.7)] border border-yellow-200 hover:scale-105 transition-transform cursor-pointer"
                >
                  🔥 Diwali Chit Scheme 2027
                </button>

                <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-sm border border-blue-400/50">
                  🎁 Gift Boxes Available
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-sm border border-blue-400/50">
                  💥 upto 80% Offer
                </span>
              </div>
            ))}

          </div>
        </div>

        {/* --- BOTTOM HALF CONTENT --- */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full pb-8">
          
          <div className="flex flex-col gap-8 sm:gap-10 justify-center items-center">
            
            <div className="flex flex-row gap-2 sm:gap-6 w-full sm:w-auto px-2 sm:px-0">
              
              <button
                onClick={handleEnquiry}
                className="group flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-red-900 font-bold px-2 sm:px-12 py-3 sm:py-5 rounded-full text-[11px] sm:text-lg transition-all duration-300 hover:scale-105 animate-button-glow"
              >
                <Send className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                Enquiry
              </button>

              <button
                onClick={() => setShowChitPage(true)}
                className="group flex flex-1 sm:flex-none items-center justify-center gap-1 sm:gap-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-red-900 font-bold px-2 sm:px-10 py-3 sm:py-5 rounded-full text-[11px] sm:text-lg transition-all duration-300 hover:scale-105 shadow-[0_0_10px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.6)]"
              >
                🔥 <span className="hidden sm:inline ml-1">Diwali</span>
                Chit Scheme
                <span className="sm:hidden">&nbsp;2027</span>
                <span className="hidden sm:inline">&nbsp;2027</span>
              </button>

            </div>

            {/* ROW 2: Stats */}
            <div className="flex items-center justify-center gap-5 sm:gap-10 text-yellow-200/70 text-[10px] sm:text-sm">
              <div className="text-center">
                <p className="text-xl sm:text-3xl font-bold text-yellow-400">100+</p>
                <p className="mt-1">Products</p>
              </div>
              <div className="w-px h-8 sm:h-12 bg-yellow-500/30" />
              <div className="text-center">
                <p className="text-xl sm:text-3xl font-bold text-yellow-400">upto 80%</p>
                <p className="mt-1">Max Savings</p>
              </div>
              <div className="w-px h-8 sm:h-12 bg-yellow-500/30" />
              <div className="text-center">
                <p className="text-xl sm:text-3xl font-bold text-yellow-400">TN</p>
                <p className="mt-1">Delivery</p>
              </div>
            </div>

          </div>

          {/* Features List */}
          <div className="mt-4 sm:mt-12 grid grid-cols-2 lg:flex lg:justify-center gap-x-8 gap-y-3 sm:gap-8 mx-auto w-fit px-2">
            {['100% Genuine Products', 'Best Price Guarantee', 'Safe & Secure Delivery', 'Bulk Order Discount'].map(tag => (
              <div key={tag} className="flex items-start sm:items-center justify-start gap-1.5 sm:gap-2 text-yellow-200/80 text-[10px] sm:text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0 mt-1 sm:mt-0" />
                <span className="leading-tight text-left">{tag}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-14 sm:bottom-14 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-1 sm:gap-2 text-yellow-400/60 animate-bounce">
            <span className="text-[10px] sm:text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-4 h-6 sm:w-5 sm:h-8 border-2 border-yellow-400/40 rounded-full flex justify-center pt-1">
              <div className="w-1 h-1.5 sm:h-2 bg-yellow-400/60 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* --- SEPARATE FULL-SCREEN CHIT PAGE --- */}
      {showChitPage && (
        <div className="fixed inset-0 z-[9999] bg-red-950 flex flex-col overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
          
          <div className="sticky top-0 z-50 flex items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 bg-red-950/90 backdrop-blur-md border-b border-yellow-500/20 shadow-md">
            
            <a 
              href="/chitscheme_26-27.png" 
              download="Sri-Krishna-Traders-Chit-Scheme.png"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(22,163,74,0.5)] border border-green-400 hover:scale-105"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">Save</span>
            </a>

            <button 
              onClick={() => setShowChitPage(false)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-400 hover:scale-105"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </button>

          </div>

          <div className="flex-1 flex flex-col items-center p-4 sm:p-8 max-w-5xl mx-auto w-full">
            <p className="text-yellow-100/80 mb-6 text-center sm:text-lg">
              Join our Diwali Chit Scheme today and secure the best firecrackers for your family at unbeatable prices!
            </p>
            
            <div className="w-full bg-red-900/40 rounded-xl border border-yellow-500/20 shadow-2xl p-2 sm:p-4 flex items-center justify-center">
              <img 
                src="/chitscheme_26-27.png" 
                alt="Diwali Chit Scheme Details" 
                className="w-full max-h-[70vh] object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<p class="text-yellow-400 text-center py-20 text-lg sm:text-xl font-bold">Will update the Diwali Chit Scheme details soon!</p>';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroBanner;