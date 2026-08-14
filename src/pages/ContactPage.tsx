import React from 'react';
import Header from '../components/Header';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex-1 pt-20 sm:pt-24 lg:pt-28">
      <ContactSection />
    </div>
    <Footer />
  </div>
);

export default ContactPage;