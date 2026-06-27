import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import HomePage from './pages/HomePage';
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
  return <HomePage />;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;