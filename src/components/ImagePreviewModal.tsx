import React, { useEffect, useState } from 'react';
import { X, Package, ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext'; // adjust path if needed

interface ImagePreviewModalProps {
  productId: number; // NEW: needed to look up/set quantity in cart
  image: string;
  images?: string[];
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  content?: string;
  unit?: string;
  price: number;        // NEW: selling price
  actualPrice?: number;  // NEW: optional MRP/original price for strikethrough
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  productId,
  image,
  images,
  productName,
  isOpen,
  onClose,
  content,
  unit,
  price,
  actualPrice
}) => {
  const { quantities, setQuantity } = useApp();

  const imageList = images && images.length > 0 ? images : [image];
  const [currentIndex, setCurrentIndex] = useState(0);

  const qty = quantities[productId] || 0;

  useEffect(() => {
    if (isOpen) setCurrentIndex(0);
  }, [isOpen, productName]);

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

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(productId, qty + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(productId, qty - 1);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(productId, 1);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[280px] sm:max-w-[500px] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-xs sm:text-base leading-tight pr-2">
            {productName}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-orange-600 transition-colors bg-orange-600 hover:bg-orange-50 p-1 sm:p-1.5 rounded-full shadow-sm border border-gray-100 shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* IMAGE GALLERY CONTAINER */}
        <div className="w-full aspect-square bg-white flex items-center justify-center p-4 sm:p-6 relative group">

          <img
            src={imageList[currentIndex]}
            alt={`${productName} - View ${currentIndex + 1}`}
            className="w-full h-full object-contain drop-shadow-md animate-in fade-in duration-300"
            key={currentIndex}
          />

          {imageList.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-orange-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-orange-600 shadow-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5 pr-0.5" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-orange-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-orange-600 shadow-md transition-colors"
              >
                <ChevronRight className="w-5 h-5 pl-0.5" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imageList.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      idx === currentIndex ? 'bg-orange-600 scale-125' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

        </div>

        {/* Package Details */}
        {(content || unit) && (
          <div className="px-3 sm:px-4 pt-3 sm:pt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-center">
            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 shrink-0" />
            <p className="text-[10px] sm:text-sm text-gray-700 font-medium">
              Package Details: <span className="font-bold text-orange-600">{content} {unit ? `/ ${unit}` : ''}</span>
            </p>
          </div>
        )}

        {/* Price + Add to Cart */}
        <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-2xl font-bold text-orange-600">₹{price}</span>
            {actualPrice && actualPrice > price && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">₹{actualPrice}</span>
            )}
          </div>

          {qty === 0 ? (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full shadow-sm transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3 bg-orange-50 border border-orange-200 rounded-full px-1 py-1">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-white hover:bg-orange-100 border border-orange-200 rounded-full flex items-center justify-center text-orange-600 shadow-sm transition-colors"
              >
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <span className="min-w-[1.5rem] text-center font-bold text-gray-800 text-sm sm:text-base">
                {qty}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-white hover:bg-orange-100 border border-orange-200 rounded-full flex items-center justify-center text-orange-600 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;