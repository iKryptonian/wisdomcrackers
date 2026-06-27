import React, { useState, useMemo } from 'react';
import { Search, X, Package, Filter } from 'lucide-react';
import ProductRow from './ProductRow';
import { useApp } from '../context/AppContext';

const ProductTable: React.FC = () => {
  const { products, productsLoading } = useApp();
  console.log('ProductTable first product:', products[0]?.name);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); // NEW: Controls the custom dropdown

  

  // Extract categories (Removes blanks and 'Other')
  const categoriesInOrder = useMemo(() => {
    return Array.from(new Set(
      products
        .map(p => p.category)
        .filter((cat): cat is string => Boolean(cat) && cat !== 'Other')
    ));
  }, []);

  // Filter products by Search and Category
  const filtered = useMemo(() =>
    products.filter(p => {
      const productCat = p.category || ''; 
      const matchesSearch = 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || productCat === selectedCategory;
      
      return matchesSearch && matchesCategory;
    }),
    [search, selectedCategory]
  );

  // Group by Category (Uncategorized pushed to bottom)
  const sortedAndFiltered = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const indexA = a.category ? categoriesInOrder.indexOf(a.category) : 999; 
      const indexB = b.category ? categoriesInOrder.indexOf(b.category) : 999;
      return indexA - indexB;
    });
  }, [filtered, categoriesInOrder]);

  if (productsLoading) return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading products...</p>
      </div>
    </div>
  );

  return (
    <section id="products" className="py-2 sm:py-3 bg-gray-50">
      <div className="max-w-full sm:max-w-[85%] mx-auto px-1 sm:px-4"> 
        
        {/* ========================================== */}
        {/* DESKTOP BADGE (Hidden completely on mobile) */}
        {/* ========================================== */}
        <div className="hidden sm:block text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-0">
            <Package className="w-4 h-4" />
            All Products
          </div>
        </div>

        {/* ========================================== */}
        {/* THE RESPONSIVE HEADER CONTROLS             */}
        {/* ========================================== */}
        <div className="flex flex-wrap items-center justify-between gap-y-2 sm:gap-y-0 sm:gap-x-3 mb-2 sm:mb-4 px-1 sm:px-0">
          
          {/* 1. MOBILE BADGE (Top Left - Hidden on Desktop) */}
          <div className="w-1/2 flex justify-start sm:hidden order-1 pl-7 sm:pl-0">
            <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-[11px] font-semibold">
              <Package className="w-3.5 h-3.5" />
              All Products
            </div>
          </div>

          {/* 2. PRODUCT COUNT (Mobile: Top Right | Desktop: Far Right) */}
          <div className="w-1/2 sm:w-auto flex justify-end items-center order-2 sm:order-3 pr-4 sm:pr-0">
            <p className="text-[10px] font-bold sm:text-sm text-gray-500 whitespace-nowrap">
              Showing <span className="font-bold text-red-700">{filtered.length}</span> Products
            </p>
          </div>

          {/* 3. SEARCH BOX (Mobile: 55% Bottom Left | Desktop: Left Flex) */}
          <div className="w-[55%] sm:flex-1 sm:max-w-sm order-3 sm:order-1 pr-1 sm:pr-0">
            <div className="relative w-full">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-7 pr-7 sm:pl-9 sm:pr-9 py-1.5 sm:py-2.5 border border-gray-200 rounded-lg sm:rounded-xl text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 4. CUSTOM CATEGORY DROPDOWN (Replaces native select) */}
          <div className="w-[45%] sm:flex-1 sm:max-w-xs relative order-4 sm:order-2 pl-1 sm:pl-0">
            
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full flex items-center justify-between pl-2 pr-2 sm:pl-4 sm:pr-4 py-1.5 sm:py-2.5 border border-gray-200 rounded-lg sm:rounded-xl text-[10px] sm:text-sm bg-white shadow-sm text-gray-700 cursor-pointer"
            >
              <span className="truncate font-medium">
                {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
              </span>
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0 ml-1" />
            </button>

            {isCategoryOpen && (
              <>
                {/* Invisible overlay to close menu when clicking outside */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsCategoryOpen(false)} 
                />

                {/* The floating menu list */}
                <div className="absolute right-0 sm:left-0 mt-1 w-48 sm:w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto py-1">
                  
                  <button
                    className={`w-full text-left px-3 py-2 text-[11px] sm:text-sm hover:bg-red-50 transition-colors ${
                      selectedCategory === 'All' ? 'bg-red-50 text-red-700 font-bold' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedCategory('All');
                      setIsCategoryOpen(false);
                    }}
                  >
                    All Categories
                  </button>

                  {categoriesInOrder.map(cat => (
                    <button
                      key={cat}
                      className={`w-full text-left px-3 py-2 text-[11px] sm:text-sm hover:bg-red-50 transition-colors ${
                        selectedCategory === cat ? 'bg-red-50 text-red-700 font-bold' : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsCategoryOpen(false);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
        {/* ========================================== */}

        {/* Fully Responsive Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="w-full">
            <table className="w-full table-fixed sm:table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-red-800 to-red-700 text-white">
                  <th className="px-1 sm:px-3 py-2 sm:py-3.5 text-center text-[9px] sm:text-sm font-bold uppercase tracking-wider w-7 sm:w-10 sm:translate-x-16">No</th>
                  <th className="px-1 sm:px-3 sm:pl-8 py-2 sm:py-3.5 text-center text-[9px] sm:text-sm font-bold uppercase tracking-wider w-20 sm:w-32 sm:translate-x-36">Img</th>
                  <th className="px-1 sm:px-3 py-2 sm:py-3.5 text-center text-[9px] sm:text-sm font-bold uppercase tracking-wider">Product</th>
                  <th className="px-1 sm:px-3 py-2 sm:py-3.5 text-center text-[9px] sm:text-sm font-bold uppercase tracking-wider hidden md:table-cell sm:-translate-x-36">MRP</th>
                  <th className="px-1 sm:px-3 py-2 sm:py-3.5 text-center text-[9px] sm:text-sm font-bold uppercase tracking-wider w-12 sm:w-auto sm:-translate-x-36">Price</th>
                  <th className="px-1 sm:px-3 py-2 sm:py-3.5 text-center text-[9px] sm:text-sm font-bold uppercase tracking-wider w-[70px] sm:w-24 sm:-translate-x-36">Qty</th>
                  <th className="px-1 sm:px-3 py-2 sm:py-3.5 text-center text-[9px] sm:text-sm font-bold uppercase tracking-wider w-12 sm:w-16 sm:-translate-x-16">Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedAndFiltered.length > 0 ? (
                  sortedAndFiltered.map((product, index) => {
                    const currentCat = product.category;
                    const prevCat = index > 0 ? sortedAndFiltered[index - 1].category : null;
                    const showCategoryHeader = Boolean(currentCat) && currentCat !== prevCat;

                    return (
                      <React.Fragment key={product.id}>
                        
                        {/* THE CATEGORY TAB ROW */}
                        {showCategoryHeader && (
                          <tr className="bg-blue-500"> 
                            
                            {/* 1. This cell takes up exactly 6 columns (Perfect for Mobile) */}
                            <td colSpan={6} className="px-1 sm:px-3 py-1 sm:py-2 border-y border-blue-600 text-center">
                              <div className="flex items-center justify-center gap-2 sm:gap-3">
                                <Package className="w-4 h-4 text-white shrink-0" />
                                
                                <span className="font-bold text-white text-xs sm:text-sm uppercase tracking-widest">
                                  {currentCat}
                                </span>

                                <span className="bg-yellow-400 text-red-900 text-[9px] sm:text-xs font-extrabold px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap ml-1 sm:ml-2">
                                  UP TO 80% OFF
                                </span>
                              </div>
                            </td>

                            {/* 2. THE MAGIC FIX: This is the 7th column! 
                                'hidden' makes it vanish on mobile.
                                'md:table-cell' makes it appear on desktop to fill the extra space! */}
                            <td className="hidden md:table-cell border-y border-blue-600 bg-blue-500"></td>
                          
                          </tr>
                        )}

                        <ProductRow product={product} index={index} />
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 sm:py-16 text-center text-gray-500">
                      <Search className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 text-gray-300" />
                      <p className="text-sm sm:text-lg font-medium">No products found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-2 sm:mt-4 text-[9px] sm:text-xs text-gray-400 text-center px-2">
         {/* Prices subject to change. GST included. Images are for illustration only. */}
        </p>
      </div>
    </section>
  );
};

export default ProductTable;