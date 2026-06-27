import { createPortal } from 'react-dom';
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import ImagePreviewModal from './ImagePreviewModal';

interface ProductRowProps {
  product: Product;
  index: number;
}

const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const ProductRow: React.FC<ProductRowProps> = ({ product, index }) => {
  const { quantities, setQuantity } = useApp();
  const [showImageModal, setShowImageModal] = useState(false);
  const qty = quantities[product.id] || 0;
  const rowTotal = product.price * qty;

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    // FIX 1: Use Math.min to force the value to never go above 100
    setQuantity(product.id, isNaN(val) || val < 0 ? 0 : Math.min(val, 100));
  };

  return (
  <>
    {showImageModal && createPortal(
      <ImagePreviewModal
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
    <tr
        className={`border-b border-gray-100 hover:bg-yellow-50/30 transition-colors duration-150 ${
          qty > 0 ? 'bg-green-50/40' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
        }`}
      >
        <td className="px-1 sm:px-3 py-1 sm:py-2 text-center text-gray-500 text-[10px] sm:text-[14px] font-medium align-middle translate-x-1 sm:translate-x-16">
          {index + 1}
        </td>

        {/* 1. The translate stays here to move it on Desktop */}
        <td className="px-0 sm:px-1 py-2 sm:py-5 text-center align-middle sm:translate-x-36">
          <button
            onClick={() => setShowImageModal(true)}
            className="cursor-pointer hover:opacity-80 transition-opacity group relative block w-fit mx-auto"
            type="button"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-9 h-9 sm:w-16 sm:h-16 object-contain bg-white rounded-md sm:rounded-lg shadow-sm border border-gray-200 group-hover:border-yellow-400 block p-0.5"
              loading="lazy"
            />
            {/* 4. The pointer-events-none stays to prevent glitching */}
            <div className="absolute inset-0 rounded-md sm:rounded-lg bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
          </button>
        </td>

        <td className="px-1 sm:px-3 py-1 sm:py-2 text-center sm:text-center align-middle">
          <div className="flex flex-col items-center justify-center gap-0 leading-none">
            <p className="font-semibold text-gray-800 text-[10px] sm:text-[14px] leading-tight line-clamp-4 sm:line-clamp-none m-0">
              {product.name}
            </p>
          </div>
        </td>

        <td className="px-1 sm:px-3 py-1 sm:py-2 text-center hidden md:table-cell align-middle sm:-translate-x-36">
          <span className="text-gray-400 text-[11px] sm:text-[14px] line-through">{fmt(product.actualPrice)}</span>
        </td>

        <td className="px-1 sm:px-3 py-1 sm:py-2 text-center align-middle sm:-translate-x-36">
          <div className="flex flex-col items-center justify-center leading-none">
            <span className="text-green-600 font-bold text-[11px] sm:text-[14px]">{fmt(product.price)}</span>
            <span className="block md:hidden text-gray-400 text-[8px] line-through mt-0.5">{fmt(product.actualPrice)}</span>
          </div>
        </td>

        <td className="px-0 sm:px-3 py-1 sm:py-2 align-middle sm:-translate-x-36">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <button
              onClick={() => setQuantity(product.id, Math.max(0, qty - 1))}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
              disabled={qty === 0}
            >
              <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
            <input
              type="number"
              min="0"
              max="100" // FIX 2: Added max attribute here
              value={qty === 0 ? '' : qty}
              placeholder="0"
              onChange={handleQtyChange}
              className="w-6 sm:w-10 text-center border border-gray-200 rounded py-0.5 text-[10px] sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-transparent px-0 m-0"
            />
            <button
              onClick={() => setQuantity(product.id, Math.min(100, qty + 1))} // Safety net on click
              disabled={qty >= 100} // FIX 3: Disables button at 100
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center transition-colors disabled:opacity-40 shrink-0" // Added disabled:opacity-40
            >
              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
          </div>
        </td>

        <td className="px-1 sm:px-3 py-1 sm:py-2 text-center align-middle sm:-translate-x-16">
          <span className={`font-bold text-[11px] sm:text-[14px] leading-none ${qty > 0 ? 'text-red-700' : 'text-gray-400'}`}>
            {qty > 0 ? fmt(rowTotal) : '—'}
          </span>
        </td>
      </tr>
    </>
  );
};

export default ProductRow;