import React from 'react';
import Header from '../components/Header';
import SafetySection from '../components/SafetySection';
import Footer from '../components/Footer';

const SafetyPage: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex-1 pt-20 sm:pt-24 lg:pt-28">
      <SafetySection />
    </div>
    <Footer />
  </div>
);

export default SafetyPage;