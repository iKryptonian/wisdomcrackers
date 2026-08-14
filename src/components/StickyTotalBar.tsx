import React from 'react';
import { ShoppingBag, TrendingDown, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

const fmt = (n: number) => `₹ ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const StickyTotalBar: React.FC = () => {
  // THE FIX 1: Added isCartOpen and isCheckoutOpen to the useApp imports
  const { netTotal, totalSavings, overallTotal, cartItems, setIsCartOpen, isCartOpen, isCheckoutOpen } = useApp();
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  // THE FIX 2: If the cart or checkout is open, completely hide this sticky bar!
  if (isCartOpen || isCheckoutOpen) {
    return null;
  }

  return (
    <>
      {/* ========================================= */}
      {/* 1. DESKTOP VIEW (Pure CSS Sticky - Zero Glitches) */}
      {/* ========================================= */}
      <div 
        className="hidden sm:block sticky top-[80px] lg:top-[70px] z-40 bg-gray-900 border-y border-yellow-500/30"
      >
        <div className="max-w-7xl mx-auto px-0 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 font-bold text-sm">
                {totalItems} item{totalItems !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-48">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm font-bold">Net Total:</span>
                <span className="text-gray-300 text-sm font-medium line-through">{fmt(netTotal)}</span>
              </div>

              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-400 " />
                <span className="text-gray-400 text-sm font-bold">You Save:</span>
                <span className="text-green-400 text-sm font-bold">{fmt(totalSavings)}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-sm font-bold">Overall Total:</span>
                <span className="text-yellow-300 text-lg font-bold">{fmt(overallTotal)}</span>
              </div>
            </div>

            {totalItems > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-red-900 text-sm font-bold px-5 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                View Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. MOBILE VIEW (Bottom Pinned)            */}
      {/* ========================================= */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-yellow-500/30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] pb-safe">
        <div className="px-3 py-2">
          <div className="flex flex-col justify-between gap-1">
            
            {/* Top Row */}
            <div className="flex items-center justify-between w-full gap-1">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-400 text-xs">{totalItems} items</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-[9px] font-bold">Net Total:</span>
                  <span className="text-gray-400 text-[10px] font-medium line-through">{fmt(netTotal)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400 text-[9px] font-bold">You Save:</span>
                  <span className="text-green-400 text-[10px] font-semibold">{fmt(totalSavings)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between w-full pt-1 border-t border-gray-700/50">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xs font-bold">Overall Total:</span>
                <span className="text-yellow-300 text-base font-bold">{fmt(overallTotal)}</span>
              </div>

              {totalItems > 0 && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-red-900 text-xs font-bold px-3 py-1 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Cart
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default StickyTotalBar;