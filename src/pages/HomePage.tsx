import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import StickyTotalBar from '../components/StickyTotalBar';
import ProductTable from '../components/ProductTable';
import CartDrawer from '../components/CartDrawer';
import CheckoutForm from '../components/CheckoutForm';

import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  {/*
  useEffect(() => {
    const timer = setTimeout(() => {
      const productSection = document.getElementById('products');
      if (productSection) {
        
        // THE FIX: Check if the screen is mobile (< 640px) or laptop/desktop
        // Mobile headers are usually shorter than laptop headers!
        const isMobile = window.innerWidth < 640; 
        
        // Adjust these numbers until it lands EXACTLY where you want it!
        // - Larger number = stops earlier (higher up)
        // - Smaller number = stops later (lower down)
        const headerOffset = isMobile ? 60 : 110; 
        
        const elementPosition = productSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  */}
  return (
    <div className="min-h-screen">
      <Header />
      <HeroBanner />
      <StickyTotalBar />
      <ProductTable />
    
      <ContactSection />
      <Footer />
      <CartDrawer />
      <CheckoutForm />
    </div>
  );
};

export default HomePage;