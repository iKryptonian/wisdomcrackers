import React from 'react';
import { ShoppingBag, TrendingDown, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

const fmt = (n: number) => `₹ ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const StickyTotalBar: React.FC = () => {
  const { netTotal, totalSavings, overallTotal, cartItems, setIsCartOpen, isCartOpen, isCheckoutOpen } = useApp();
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  if (isCartOpen || isCheckoutOpen) {
    return null;
  }

  return (
    <>
      {/* ========================================= */}
      {/* 1. DESKTOP VIEW (Pure CSS Sticky - Zero Glitches) */}
      {/* ========================================= */}
      <div 
        className="hidden sm:block sticky top-[80px] lg:top-[60px] z-40 bg-gray-900 border-y border-yellow-500/30"
      >
        {/* max-w-none: content spans full bar width, no centered column, no empty side margins */}
        <div className="max-w-none px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between gap-2 lg:gap-4">

            {/* Items selected — pinned to left border by justify-between */}
            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <ShoppingBag className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-400 shrink-0" />
              <span className="text-gray-400 font-bold text-sm lg:text-xl">
                {totalItems} item{totalItems !== 1 ? 's' : ''} selected
              </span>
            </div>

            {/* Net Total — hidden on cramped lg screens, shown from xl up to save space */}
            <div className="hidden xl:flex items-center gap-2 shrink-0 whitespace-nowrap">
              <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 shrink-0" />
              <span className="text-gray-400 text-xl font-bold">Net Total:</span>
              <span className="text-gray-300 text-xl font-medium line-through">{fmt(netTotal)}</span>
            </div>

            {/* You Save */}
            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <TrendingDown className="w-4 h-4 lg:w-6 lg:h-6 text-green-400 shrink-0" />
              <span className="text-gray-400 text-sm lg:text-xl font-bold">You Save:</span>
              <span className="text-green-400 text-sm lg:text-xl font-bold">{fmt(totalSavings)}</span>
            </div>

            {/* Overall Total */}
            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <span className="text-yellow-400 text-sm lg:text-xl font-bold">Overall Total:</span>
              <span className="text-yellow-300 text-sm lg:text-xl font-bold">{fmt(overallTotal)}</span>
            </div>

            {/* Cart button — pinned to right border by justify-between */}
            {totalItems > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-red-900 text-sm lg:text-xl font-bold px-3 lg:px-4 py-1 lg:py-1.5 rounded-full transition-colors flex items-center gap-1 lg:gap-1.5 shrink-0 whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4 lg:w-6 lg:h-6 shrink-0" />
                View Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. MOBILE VIEW (Bottom Pinned)            */}
      {/* ========================================= */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-yellow-500/30 pb-safe">
        <div className="px-2 py-2">
          <div className="flex flex-col justify-between gap-1">
            
            {/* Top Row */}
            <div className="flex items-center justify-between w-full gap-2 ">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-400 text-xs">{totalItems} items</span>
              </div>

              <div className="flex items-center gap-9 ">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400 text-[10px] font-bold">Net Total:</span>
                  <span className="text-gray-400 text-[10px] font-medium line-through">{fmt(netTotal)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400 text-[10px] font-bold">You Save:</span>
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
