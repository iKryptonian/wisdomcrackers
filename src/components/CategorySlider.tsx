import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { id: 1, name: "Rockets", image: "/images/rockets.png" },
  { id: 2, name: "Ground Chakkar", image: "/images/chakkar.png" },
  { id: 3, name: "Flower Pots", image: "/images/flower-pots.png" },
  { id: 4, name: "Sparklers", image: "/images/sparklers.png" },
  { id: 5, name: "Pencils", image: "/images/pencils.png" },
  { id: 6, name: "Colour Matches", image: "/images/matches.png" },
  { id: 7, name: "Fancy Fountains", image: "/images/fountains.png" },
  { id: 8, name: "Sky Shots", image: "/images/skyshots.png" },
  { id: 9, name: "Twinkling Stars", image: "/images/stars.png" },
  { id: 10, name: "Atom Bombs", image: "/images/bombs.png" },
  { id: 11, name: "One Sound", image: "/images/onesound.png" },
  { id: 12, name: "Loose Crackers", image: "/images/loose.png" },
  { id: 13, name: "Wala Crackers", image: "/images/wala.png" },
];

const CategorySlider: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (!scrollWidth || !clientWidth) return;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const cardWidth = scrollRef.current.children[0]?.clientWidth || 180;
          scrollRef.current.scrollBy({ left: cardWidth + 16, behavior: 'smooth' });
        }
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [isHovered]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 180;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -(cardWidth + 16) : cardWidth + 16,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      className="w-full relative py-8 px-2 sm:px-6 bg-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
    >
      
      <h2 className="text-xl sm:text-2xl font-bold text-center text-red-800 mb-6 uppercase tracking-wider">
        Shop By Category
      </h2>

      <button 
        onClick={() => scroll('left')} 
        className="flex absolute left-1 sm:left-2 top-[55%] -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 shadow-lg border border-gray-200 rounded-full items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 pr-0.5" />
      </button>

      <button 
        onClick={() => scroll('right')} 
        className="flex absolute right-1 sm:right-2 top-[55%] -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 shadow-lg border border-gray-200 rounded-full items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 pl-0.5" />
      </button>

      <div 
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 px-8 sm:px-12"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>

        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="relative w-[140px] sm:w-[160px] flex-shrink-0 snap-center cursor-pointer group"
          >
            <div className="h-[180px] sm:h-[210px] border-[1.5px] border-dashed border-yellow-300 rounded-lg p-1 transition-all duration-300 bg-white group-hover:border-solid group-hover:border-yellow-200 group-hover:bg-[#FFF2CC]">
              
              <div className="w-full h-[82%] bg-[#FFF6E5] rounded-t-md rounded-b-[50px] sm:rounded-b-[60px] flex items-center justify-center relative transition-colors duration-300 group-hover:bg-[#FFB800]">
                
                {/* REMOVED THE HIDING LOGIC! You will now always see the image box! */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md" 
                  />
                </div>

                <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[11px] sm:text-xs font-bold py-1.5 px-3 sm:px-4 rounded-full whitespace-nowrap shadow-md tracking-wide">
                  {cat.name}
                </div>
                
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CategorySlider;