import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { CartItem, CustomerDetails, PageView, Product } from '../types';
import { products as hardcodedProducts } from '../data/products';
import { supabase } from '../lib/supabase';

interface AppContextType {
  productsLoading: boolean;
  products: Product[];
  quantities: Record<number, number>;
  setQuantity: (productId: number, qty: number) => void;
  cartItems: CartItem[];
  netTotal: number;
  totalSavings: number;
  overallTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  customerDetails: CustomerDetails | null;
  setCustomerDetails: (details: CustomerDetails) => void;
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  enquiryNumber: string;
  orderDate: string;
  resetCart: () => void;
  dbOnline: boolean;
  refreshProducts: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateEnquiryNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CR${timestamp}${random}`;
};

const formatDate = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts]         = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [dbOnline, setDbOnline]         = useState(false);
  const [quantities, setQuantities]     = useState<Record<number, number>>({});
  const [isCartOpen, setIsCartOpen]     = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [currentPage, setCurrentPage]   = useState<PageView>('home');
  const [enquiryNumber]                 = useState(generateEnquiryNumber);
  const [orderDate]                     = useState(formatDate);

  const fetchProducts = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 5000);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id')
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (!error && data && data.length > 0) {
        const mapped = data.map(p => ({
          id: p.id,
          name: p.name,
          content: p.content ?? '',
          image: p.image ?? '',
          images: p.images ?? [],
          actualPrice: p.actual_price,
          price: p.price,
          unit: p.unit ?? '',
          category: p.category ?? '',
        }));
        setProducts(mapped);
        setDbOnline(true);
      } else {
        setProducts(hardcodedProducts);
        setDbOnline(false);
      }
    } catch (e) {
      console.log('Fetch error:', e);
      setProducts(hardcodedProducts);
      setDbOnline(false);
    }
    setProductsLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    if (currentPage === 'home') {
      fetchProducts();
    }
  }, [currentPage]);

  const setQuantity = useCallback((productId: number, qty: number) => {
    setQuantities(prev => {
      if (qty <= 0) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
      return { ...prev, [productId]: qty };
    });
  }, []);

  const cartItems: CartItem[] = useMemo(() =>
    Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = products.find(p => p.id === Number(id));
        return product ? { product, quantity: qty } : null;
      })
      .filter(Boolean) as CartItem[],
    [quantities, products]
  );

  const netTotal = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.product.actualPrice * item.quantity, 0),
    [cartItems]
  );

  const overallTotal = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  );

  const totalSavings = netTotal - overallTotal;

  const resetCart = useCallback(() => {
    setQuantities({});
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
  }, []);

  return (
    <AppContext.Provider value={{
      productsLoading,
      products,
      quantities,
      setQuantity,
      cartItems,
      netTotal,
      totalSavings,
      overallTotal,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      customerDetails,
      setCustomerDetails,
      currentPage,
      setCurrentPage,
      enquiryNumber,
      orderDate,
      resetCart,
      dbOnline,
      refreshProducts: fetchProducts,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};