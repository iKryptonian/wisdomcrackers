import React, { useState, useMemo } from 'react';
import { Search, X, Package, Filter, Download } from 'lucide-react';
import ProductCard from './ProductCard';
import { useApp } from '../context/AppContext';

// Set the order you want categories to appear in.
// Names below MUST match your product.category values EXACTLY.
const CATEGORY_PRIORITY = [
  'New Arrivals',
  'Sparklers',
  'Ground Chakkaras',
  'Flower Pots',
  'Fountains',
  'Twinkling Stars (Rope crackers)',
  'Pencil Crackers',
  'Rockets',
  'Atom Bombs',
  'One Sound Crackers',
  'Bijili',
  'Garlands',
  'SkyShots',
  'RollCap',
  // add more category names here, in the order you want them shown
];


const PRICE_LIST_URL = '/pricelist.pdf';

const ProductTable: React.FC = () => {
  const { products, productsLoading } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Extract categories (removes blanks and 'Other'), sorted by CATEGORY_PRIORITY
  const categoriesInOrder = useMemo(() => {
    const unique = Array.from(new Set(
      products.map(p => p.category).filter((cat): cat is string => Boolean(cat) && cat !== 'Other')
    ));

    return unique.sort((a, b) => {
      const indexA = CATEGORY_PRIORITY.indexOf(a);
      const indexB = CATEGORY_PRIORITY.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [products]);

  const filtered = useMemo(() =>
    products.filter(p => {
      const productCat = p.category || '';
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || productCat === selectedCategory;
      return matchesSearch && matchesCategory;
    }),
    [search, selectedCategory, products]
  );

  // Group filtered products into { category: Product[] } buckets, in categoriesInOrder order.
  // Uncategorized products go in their own bucket at the end.
  const groupedProducts = useMemo(() => {
    const groups = new Map<string, typeof filtered>();

    categoriesInOrder.forEach(cat => groups.set(cat, []));
    groups.set('Uncategorized', []);

    filtered.forEach(p => {
      const key = p.category && groups.has(p.category) ? p.category : 'Uncategorized';
      groups.get(key)!.push(p);
    });

    // Drop empty groups
    return Array.from(groups.entries()).filter(([, items]) => items.length > 0);
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
    <section id="products" className="py-2 sm:py-3 -mt-0 bg-gray-50">
      <div className="max-w-full sm:max-w-[90%] mx-auto px-2 sm:px-4">

        {/* ========================================== */}
        {/* SEARCH + CATEGORY FILTER CONTROLS          */}
        {/* ========================================== */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between gap-2 mb-3 px-1 pt-1 sm:pt-3 sm:px-0">

          {/* Search box */}
          <div className="col-span-1 sm:flex-1 sm:min-w-[140px] sm:max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 text-gray-400 sm:text-gray-600" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-0.5 sm:py-3 border border-gray-200 rounded-xl text-sm sm:text-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Category dropdown */}
          <div className="col-span-1 sm:flex-1 sm:min-w-[140px] sm:max-w-xs relative sm:order-1">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full flex items-center justify-between pl-4 pr-4 py-0.5 sm:py-3 border border-gray-200 rounded-xl text-sm sm:text-lg bg-white shadow-sm text-gray-700 cursor-pointer"
              type="button"
            >
              <span className="truncate font-medium">
                {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
              </span>
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0 ml-1" />
            </button>

            {isCategoryOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCategoryOpen(false)}
                />
                <div className="absolute right-0 sm:left-0 mt-1 w-48 sm:w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto py-1">
                  <button
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-orange-50 transition-colors ${
                      selectedCategory === 'All' ? 'bg-orange-200 text-orange-700 font-bold' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedCategory('All');
                      setIsCategoryOpen(false);
                    }}
                    type="button"
                  >
                    All Categories
                  </button>

                  {categoriesInOrder.map(cat => (
                    <button
                      key={cat}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-orange-200 transition-colors ${
                        selectedCategory === cat ? 'bg-orange-200 text-orange-700 font-bold' : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsCategoryOpen(false);
                      }}
                      type="button"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Showing count + Download button — same row on mobile */}
          <div className="col-span-2 sm:contents flex items-center justify-between gap-2 px-1 ">
            <p className="sm:order-3 text-[13px] sm:text-[16px] text-gray-700 whitespace-nowrap">
              Showing <span className="font-bold text-orange-700">{filtered.length}</span> Products
            </p>

            <a
              href={PRICE_LIST_URL}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="sm:order-2 sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 sm:py-2.5 border border-orange-200 rounded-xl text-[12.5px] sm:text-[14px] font-extrabold text-white bg-orange-500 hover:bg-orange-800 shadow-sm transition-colors shrink-0"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Download Price List</span>
            </a>
          </div>
        </div>

        {/* ========================================== */}
        {/* CATEGORY SECTIONS (header bar + card grid) */}
        {/* ========================================== */}
        {groupedProducts.length > 0 ? (
          groupedProducts.map(([category, items]) => (
            <div key={category} className="mb-3">
              {/* Category header bar */}
              <div className="flex items-center justify-between bg-orange-100 border-l-4 border-orange-500 rounded-r-xl px-4 py-0.5 sm:py-3 mb-2 sm:mb-4">
                <h2 className="text-sm sm:text-[18px] font-bold sm:font-extrabold text-gray-900 uppercase tracking-wide">
                  {category}
                </h2>
                <span className="w-7 h-7 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border border-orange-300 text-orange-600 font-extrabold text-sm sm:text-xl bg-white">
                  {items.length}
                </span>
              </div>

              {/* Card grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                {items.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-gray-500">
            <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No products found</p>
          </div>
        )}

        <p className="mt-4 text-xs text-gray-400 text-center px-2">
          {/* Prices subject to change. GST included. Images are for illustration only. */}
        </p>
      </div>
    </section>
  );
};

export default ProductTable;
















{/*




import React, { useState, useMemo } from 'react';
import { Search, X, Package, Filter, Download } from 'lucide-react';
import ProductCard from './ProductCard';
import { useApp } from '../context/AppContext';

// Set the order you want categories to appear in.
// Names below MUST match your product.category values EXACTLY.
const CATEGORY_PRIORITY = [
  'New Arrivals',
  'Sparklers',
  'Ground Chakkaras',
  'Flower Pots',
  'Fountains',
  'Twinkling Stars (Rope crackers)',
  'Pencil Crackers',
  'Rockets',
  'Atom Bombs',
  'One Sound Crackers',
  'Bijili',
  'Garlands',
  'SkyShots',
  'RollCap',
  // add more category names here, in the order you want them shown
];


const PRICE_LIST_URL = '/pricelist.pdf';

const ProductTable: React.FC = () => {
  const { products, productsLoading } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Extract categories (removes blanks and 'Other'), sorted by CATEGORY_PRIORITY
  const categoriesInOrder = useMemo(() => {
    const unique = Array.from(new Set(
      products.map(p => p.category).filter((cat): cat is string => Boolean(cat) && cat !== 'Other')
    ));

    return unique.sort((a, b) => {
      const indexA = CATEGORY_PRIORITY.indexOf(a);
      const indexB = CATEGORY_PRIORITY.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [products]);

  const filtered = useMemo(() =>
    products.filter(p => {
      const productCat = p.category || '';
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || productCat === selectedCategory;
      return matchesSearch && matchesCategory;
    }),
    [search, selectedCategory, products]
  );

  // Group filtered products into { category: Product[] } buckets, in categoriesInOrder order.
  // Uncategorized products go in their own bucket at the end.
  const groupedProducts = useMemo(() => {
    const groups = new Map<string, typeof filtered>();

    categoriesInOrder.forEach(cat => groups.set(cat, []));
    groups.set('Uncategorized', []);

    filtered.forEach(p => {
      const key = p.category && groups.has(p.category) ? p.category : 'Uncategorized';
      groups.get(key)!.push(p);
    });

    // Drop empty groups
    return Array.from(groups.entries()).filter(([, items]) => items.length > 0);
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
    <section id="products" className="py-2 sm:py-3 -mt-0 bg-gray-50">
      <div className="max-w-full sm:max-w-[90%] mx-auto px-2 sm:px-4">

       // {/* ========================================== 
       // {/* SEARCH + CATEGORY FILTER CONTROLS          
       // {/* ========================================== 
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1 pt-1 sm:pt-3 sm:px-0">
          <div className="flex-1 min-w-[140px] sm:max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-0.5 sm:py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        <a
          href={PRICE_LIST_URL}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="order-2 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-1 sm:py-2.5 border border-orange-200 rounded-xl text-sm sm:text-[14px] font-extrabold text-white bg-orange-500 hover:bg-orange-100 shadow-sm transition-colors shrink-0"
        >
 
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Download Price List</span>
        </a>

          <div className="flex-1 min-w-[140px] sm:max-w-xs relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full flex items-center justify-between pl-4 pr-4 py-0.5 sm:py-3 border border-gray-200 rounded-xl text-sm bg-white shadow-sm text-gray-700 cursor-pointer"
              type="button"
            >
              <span className="truncate font-medium">
                {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
              </span>
              <Filter className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
            </button>

            {isCategoryOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCategoryOpen(false)}
                />
                <div className="absolute right-0 sm:left-0 mt-1 w-48 sm:w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto py-1">
                  <button
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-orange-50 transition-colors ${
                      selectedCategory === 'All' ? 'bg-orange-200 text-orange-700 font-bold' : 'text-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedCategory('All');
                      setIsCategoryOpen(false);
                    }}
                    type="button"
                  >
                    All Categories
                  </button>

                  {categoriesInOrder.map(cat => (
                    <button
                      key={cat}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-orange-200 transition-colors ${
                        selectedCategory === cat ? 'bg-orange-200 text-orange-700 font-bold' : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsCategoryOpen(false);
                      }}
                      type="button"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <p className="text-[11px] text-gray-500 whitespace-nowrap w-full sm:w-auto text-right sm:text-left">
            Showing <span className="font-bold text-orange-700">{filtered.length}</span> Products
          </p>
        </div>

       // {/* ========================================== 
       // {/* CATEGORY SECTIONS (header bar + card grid) 
       // {/* ========================================== 
        {groupedProducts.length > 0 ? (
          groupedProducts.map(([category, items]) => (
            <div key={category} className="mb-3">
              //{/* Category header bar 
              <div className="flex items-center justify-between bg-orange-100 border-l-4 border-orange-500 rounded-r-xl px-4 py-0.5 sm:py-3 mb-2 sm:mb-4">
                <h2 className="text-sm sm:text-[18px] font-bold sm:font-extrabold text-gray-900 uppercase tracking-wide">
                  {category}
                </h2>
                <span className="w-7 h-7 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border border-orange-300 text-orange-600 font-extrabold text-sm sm:text-xl bg-white">
                  {items.length}
                </span>
              </div>

              //{/* Card grid 
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                {items.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-gray-500">
            <Search className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No products found</p>
          </div>
        )}

        <p className="mt-4 text-xs text-gray-400 text-center px-2">
          //{/* Prices subject to change. GST included. Images are for illustration only.
        </p>
      </div>
    </section>
  );
};

export default ProductTable;

*/}