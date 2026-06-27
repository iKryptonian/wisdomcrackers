import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, TrendingDown, ChevronRight, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CartDrawer: React.FC = () => {
  const {
    isCartOpen, setIsCartOpen,
    cartItems, quantities, setQuantity,
    netTotal, totalSavings, overallTotal,
    setIsCheckoutOpen,
  } = useApp();

  const [previewProduct, setPreviewProduct] = useState<any | null>(null);

  // Set your minimum order value here
  const MINIMUM_ORDER_VALUE = 2500;
  const shortfall = MINIMUM_ORDER_VALUE - overallTotal;
  const isBelowMinimum = overallTotal < MINIMUM_ORDER_VALUE;

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      setPreviewProduct(null); 
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleConfirm = () => {
    if (isBelowMinimum) return; 
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Background Dimmer Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[110] backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Main Cart Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white z-[120] shadow-2xl flex flex-col transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Custom In-Cart Image Preview Overlay */}
        {previewProduct && (
          <div className="absolute inset-0 z-[130] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10">
            <div className="bg-white rounded-xl shadow-2xl w-[320px] sm:w-[400px] mx-auto flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
              
              <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate pr-4">
                  {previewProduct.name}
                </h3>
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 bg-white flex flex-col items-center">
                <div className="w-full bg-white rounded-lg p-2 mb-4 flex justify-center">
                  <img
                    src={previewProduct.image}
                    alt={previewProduct.name}
                    className="w-auto h-auto max-h-[200px] sm:max-h-[280px] object-contain drop-shadow-sm"
                  />
                </div>
                
                <div className="w-full text-left space-y-2">
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {previewProduct.content}
                  </p>
                  <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-100">
                    <span className="text-gray-500 text-xs sm:text-sm font-medium">Price per unit:</span>
                    <span className="font-bold text-red-700 text-base sm:text-lg">
                      {fmt(previewProduct.price)}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-red-800 to-red-700 text-white flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-yellow-300" />
            <div>
              <h2 className="font-bold text-sm sm:text-base leading-none">Your Cart</h2>
              <p className="text-yellow-200/70 font-bold text-[10px] sm:text-[10px] mt-0.5">
                {cartItems.length} product{cartItems.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 hover:bg-red-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-6 px-6 text-center">
            
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center transition-all">
              <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300" />
            </div>
            
            <div>
              <p className="text-gray-700 font-bold text-base sm:text-2xl transition-all">
                Your cart is empty
              </p>
              <p className="text-gray-400 text-xs sm:text-base mt-1 sm:mt-2 transition-all">
                Add products from the list below
              </p>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false); 
                setTimeout(() => {
                  const productSection = document.getElementById('products');
                  if (productSection) {
                    productSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 300);
              }}
              className="mt-2 sm:mt-4 bg-red-700 hover:bg-red-600 text-white font-semibold px-5 py-2 sm:px-8 sm:py-3 rounded-full transition-colors text-xs sm:text-base shadow-sm hover:shadow-md"
            >
              Browse Products
            </button>
            
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-3 pt-2 pb-2 space-y-1 sm:space-y-2">
              {cartItems.map(({ product, quantity }) => {
                const rowTotal = product.price * quantity;
                return (
                  <div
                    key={product.id}
                    className="flex gap-5 sm:gap-4 bg-gray-50 rounded-lg p-0 sm:p-1 border border-gray-100 items-center"
                  >
                    {/* 1. IMAGE BUTTON */}
                    <button
                      onClick={() => setPreviewProduct(product)}
                      className="ml-2 sm:ml-0 cursor-pointer hover:opacity-80 transition-opacity group relative inline-block flex-shrink-0 bg-white rounded-md"
                      type="button"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 sm:w-16 sm:h-16 object-contain p-0.5 rounded-md border border-gray-200 shadow-sm group-hover:border-yellow-400 group-hover:shadow-md transition-all"
                      />
                      <div className="absolute inset-0 rounded-md bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </button>
                    
                    {/* 2. TEXT AND PRICING */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-[11px] sm:text-sm leading-tight truncate">{product.name}</p>
                      <p className="text-gray-400 text-[9px] sm:text-xs mt-0.5">{product.content}</p>
                      
                      <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <button
                            onClick={() => setQuantity(product.id, Math.max(0, quantity - 1))}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                          <span className="w-5 sm:w-6 text-center text-[10px] sm:text-sm font-bold text-gray-700">{quantity}</span>
                          <button
                            onClick={() => setQuantity(product.id, quantity + 1)}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-red-700 font-bold text-[11px] sm:text-sm">{fmt(rowTotal)}</p>
                          <p className="text-gray-400 text-[8px] sm:text-[10px]">{fmt(product.price)}/unit</p>
                        </div>
                      </div>
                    </div>

                    {/* 3. DUSTBIN BUTTON */}
                    <button
                      onClick={() => setQuantity(product.id, 0)}
                      className="mr-2 sm:mr-0 flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Totals */}
            <div className="flex-shrink-0 border-t border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-50">
              <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                <div className="flex justify-between text-[10px] sm:text-xs">
                  <span className="text-gray-500">Net Total (MRP)</span>
                  <span className="text-gray-500 line-through">{fmt(netTotal)}</span>
                </div>
                <div className="flex justify-between text-[10px] sm:text-xs items-center">
                  <span className="flex items-center gap-1 text-green-600">
                    <TrendingDown className="w-3 h-3" />
                    Discount
                  </span>
                  <span className="text-green-600 font-semibold">- {fmt(totalSavings)}</span>
                </div>
                <div className="border-t border-gray-200 pt-1.5 flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-xs sm:text-sm">Estimated Total</span>
                  <span className="text-base sm:text-lg font-extrabold text-red-700">{fmt(overallTotal)}</span>
                </div>
              </div>

              {/* The Blue Info Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 sm:p-2.5 mb-2 sm:mb-3 flex items-start gap-1.5 sm:gap-2">
                <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-[10px] sm:text-[11px] text-blue-800 leading-relaxed font-medium space-y-0.5">
                  <p>• 0 Packing Charges applied.</p>
                  <p>• Courier charges are <span className="font-bold underline">not included</span> in this estimation and must be paid separately.</p>
                </div>
              </div>

              {/* Minimum Order Warning Alert */}
              {isBelowMinimum && (
                <div className="mb-3 text-center bg-red-50 text-red-600 rounded-lg py-2 px-3 text-[10px] sm:text-xs font-medium border border-red-100">
                  Minimum order value is <span className="font-bold">{fmt(MINIMUM_ORDER_VALUE)}</span>.<br className="sm:hidden" /> Please add <span className="font-bold underline">{fmt(shortfall)}</span> more to proceed.
                </div>
              )}

              {/* Action Buttons Container */}
              <div className="space-y-2">
                
                {/* NEW: Explicit "Add More Products" button shown when below minimum */}
                {isBelowMinimum && (
                  <button
                    onClick={() => {
                      setIsCartOpen(false); 
                      setTimeout(() => {
                        const productSection = document.getElementById('products');
                        if (productSection) {
                          productSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 300);
                    }}
                    /* CHANGED: Removed the border and made it a solid red button! */
                    className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md font-bold py-2 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-[10px] sm:text-xs tracking-wide"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    ADD MORE PRODUCTS
                  </button>
                )}

                {/* Confirm Estimate Button (Disables if below minimum) */}
                <button
                  onClick={handleConfirm}
                  disabled={isBelowMinimum}
                  className={`w-full text-white font-bold py-2 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs tracking-wide ${
                    isBelowMinimum 
                      ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 shadow-md shadow-red-700/30 hover:shadow-red-600/40 hover:scale-[1.01]'
                  }`}
                >
                  CONFIRM ESTIMATE
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;