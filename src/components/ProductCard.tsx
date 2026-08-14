import { createPortal } from 'react-dom';
import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Flame } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import ImagePreviewModal from './ImagePreviewModal';

interface ProductCardProps {
  product: Product;
}

const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { quantities, setQuantity, setIsCartOpen } = useApp();
  const [showImageModal, setShowImageModal] = useState(false);
  const qty = quantities[product.id] || 0;

  const discountPct = product.actualPrice > 0
    ? Math.round(((product.actualPrice - product.price) / product.actualPrice) * 100)
    : 0;
  const savedAmount = product.actualPrice - product.price;

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setQuantity(product.id, isNaN(val) || val < 0 ? 0 : Math.min(val, 100));
  };

  // Total units across the whole cart (sum of every product's quantity), matching
  // the number CartDrawer shows — used for the "View Cart (N)" button.
  const cartCount = Object.values(quantities).reduce(
    (sum: number, q) => sum + (typeof q === 'number' ? q : 0),
    0
  );

  return (
    <>
      {showImageModal && createPortal(
        <ImagePreviewModal
            productId={product.id}
            price={product.price}
            actualPrice={product.actualPrice}
            image={product.image}
            images={product.images}
            productName={product.name}
            content={product.content}
            unit={product.unit}
            isOpen={showImageModal}
            onClose={() => setShowImageModal(false)}
        />,
        document.body
      )}

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
        {/* Image + discount badge */}
        <div className="relative p-12 sm:p-14 pt-7 sm:pt-6 pb-0">
          {discountPct > 0 && (
            <span className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-10 inline-flex items-center gap-0.5 sm:gap-1 bg-gradient-to-r from-orange-600 to-yellow-600 text-white text-[8px] sm:text-[11px] font-extrabold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
              
              🔥 UPTO {discountPct}% OFF
            </span>
          )}
          <button
            onClick={() => setShowImageModal(true)}
            className="w-full aspect-square cursor-pointer hover:opacity-90 transition-opacity block"
            type="button"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </button>
        </div>

        {/* Details */}
        <div className="p-1 sm:p-4 pt-1 sm:pt-0 sm:-mt-9 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-800 text-[11px] sm:text-[15px] leading-snug mb-0 sm:mb-2 line-clamp-2 min-h-[2.2em] sm:min-h-[2.5em]">
            {product.name}
          </h3>

          <div className="flex items-center pt-0 sm:pt-0 -mt-2 sm:-mt-5 gap-1 sm:gap-2 mb-1 sm:mb-1 flex-wrap">
            <span className="text-sm sm:text-2xl font-bold text-gray-900">{fmt(product.price)}</span>
            {product.actualPrice > product.price && (
              <span className="text-gray-500 text-[10px] sm:text-sm line-through">{fmt(product.actualPrice)}</span>
            )}
            {discountPct > 0 && (
              <span className="hidden sm:inline-block bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">
                {discountPct}%
              </span>
            )}
          </div>

          {savedAmount > 0 && (
            <span className="inline-block w-fit bg-green-50 text-green-700 text-[9px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full mb-1.5 sm:mb-3">
              You save {fmt(savedAmount)}
            </span>
          )}

          {/* Quantity stepper */}
          <div className="flex items-center justify-center gap-1 sm:gap-3 mb-1.5 sm:mb-3 mt-auto">
            <button
              onClick={() => setQuantity(product.id, Math.max(0, qty - 1))}
              className="w-5 h-5 sm:w-8 sm:h-8 rounded sm:rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
              disabled={qty === 0}
              type="button"
            >
              <Minus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            </button>
            <input
              type="number"
              min="0"
              max="100"
              value={qty === 0 ? '' : qty}
              placeholder="1"
              onChange={handleQtyChange}
              className="w-7 sm:w-12 text-center border border-gray-200 rounded sm:rounded-lg py-0.5 sm:py-1 text-[11px] sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-transparent"
            />
            <button
              onClick={() => setQuantity(product.id, Math.min(100, qty + 1))}
              disabled={qty >= 100}
              className="w-5 h-5 sm:w-8 sm:h-8 rounded sm:rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
              type="button"
            >
              <Plus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

          {/* Add to cart / view cart */}
          {qty > 0 ? (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl transition-colors text-[10px] sm:text-sm"
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
              View Cart ({cartCount})
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setQuantity(product.id, 1)}
              className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl transition-colors text-[10px] sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
