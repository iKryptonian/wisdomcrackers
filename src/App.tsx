import LegalNoticePopup from './components/LegalNoticePopup';
import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SafetyPage from './pages/SafetyPage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import InvoicePage from './pages/InvoicePage';
import AdminPage from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { currentPage, setCurrentPage } = useApp();

  useEffect(() => {
    if (window.location.hash === '#admin') {
      setCurrentPage('admin');
    }
  }, []);

  if (currentPage === 'invoice') return <InvoicePage />;
  if (currentPage === 'admin')   return <AdminPage />;
  if (currentPage === 'about')   return <AboutPage />;
  if (currentPage === 'safety')  return <SafetyPage />;
   if (currentPage === 'products') return <ProductsPage />;
  if (currentPage === 'contact')  return <ContactPage />;
  return <HomePage />;
};

function App() {
  return (
    <AppProvider>
      <LegalNoticePopup />
      <AppContent />
    </AppProvider>
  );
}

export default App;