import React from 'react';
import Header from '../components/Header';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex-1 pt-20 sm:pt-24 lg:pt-28">
      <AboutSection />
    </div>
    <Footer />
  </div>
);

export default AboutPage;