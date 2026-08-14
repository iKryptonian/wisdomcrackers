import React from 'react';
import Header from '../components/Header';
import StickyTotalBar from '../components/StickyTotalBar';
import ProductTable from '../components/ProductTable';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import CheckoutForm from '../components/CheckoutForm';

const ProductsPage: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex-1 pt-20 sm:pt-24 lg:pt-28">
      <StickyTotalBar />
      <ProductTable />
    </div>
    <Footer />
    <CartDrawer />
    <CheckoutForm />
  </div>
);

export default ProductsPage;