import React, { useEffect, useState } from 'react';
import { X, Package, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImagePreviewModalProps {
  image: string;
  images?: string[]; // NEW: Optional array for multiple images
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  content?: string;
  unit?: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ 
  image, 
  images, // Pull in the new array
  productName, 
  isOpen, 
  onClose,
  content,
  unit
}) => {
  // Create a safe list of images (fallback to single image if array doesn't exist)
  const imageList = images && images.length > 0 ? images : [image];
  
  // Track which image we are currently looking at
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset to the first image every time the modal opens
  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen, productName]);

  // Prevent body scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Navigation Functions
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the click from closing the modal
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[280px] sm:max-w-sm bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()} 
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-xs sm:text-base leading-tight pr-2">
            {productName}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-600 transition-colors bg-white hover:bg-red-50 p-1 sm:p-1.5 rounded-full shadow-sm border border-gray-100 shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        {/* IMAGE GALLERY CONTAINER */}
        <div className="w-full aspect-square bg-white flex items-center justify-center p-4 sm:p-6 relative group">
          
          {/* Main Display Image */}
          <img 
            src={imageList[currentIndex]} 
            alt={`${productName} - View ${currentIndex + 1}`} 
            className="w-full h-full object-contain drop-shadow-md animate-in fade-in duration-300" 
            key={currentIndex} // Forces re-animation when image changes
          />

          {/* ARROWS (Only show if there is more than 1 image) */}
          {imageList.length > 1 && (
            <>
              {/* Left Arrow */}
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-red-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-red-600 shadow-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5 pr-0.5" />
              </button>

              {/* Right Arrow */}
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-red-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-red-600 shadow-md transition-colors"
              >
                <ChevronRight className="w-5 h-5 pl-0.5" />
              </button>

              {/* Dot Indicators at the bottom */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imageList.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-red-600 scale-125' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        {(content || unit) && (
          <div className="p-3 sm:p-4 bg-yellow-50/50 border-t border-gray-100 flex items-center justify-center gap-1.5 sm:gap-2 text-center">
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-700 shrink-0" />
            <p className="text-[10px] sm:text-sm text-gray-700 font-medium">
              Package Details: <span className="font-bold text-red-800">{content} {unit ? `/ ${unit}` : ''}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewModal;