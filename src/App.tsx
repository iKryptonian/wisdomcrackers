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
      window.location.hash = '';
    }
  }, []);

  const isAdmin = currentPage === 'admin';

  const renderPage = () => {
    if (currentPage === 'invoice')  return <InvoicePage />;
    if (currentPage === 'admin')    return <AdminPage />;
    if (currentPage === 'about')    return <AboutPage />;
    if (currentPage === 'safety')   return <SafetyPage />;
    if (currentPage === 'products') return <ProductsPage />;
    if (currentPage === 'contact')  return <ContactPage />;
    return <HomePage />;
  };

  return (
    <>
      {!isAdmin && <LegalNoticePopup />}
      {renderPage()}
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;