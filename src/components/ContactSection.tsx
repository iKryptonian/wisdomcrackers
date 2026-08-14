import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { shopConfig } from '../config/shopConfig';

const ContactSection: React.FC = () => (
  <section id="contact" className="py-0 -mt-4 sm:py-8 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-2 sm:mb-6">
        <span className="text-orange-700 font-bold sm:text-xl text-xs sm:text-sm uppercase tracking-widest">Get In Touch</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mt-0 sm:mt-2">
          Contact <span className="text-orange-700">Us</span>
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mt-1">We're here to help with your cracker needs</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-5">
        <div className="group flex flex-col items-center p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all text-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-orange-100 group-hover:bg-orange-200 rounded-full flex items-center justify-center mb-2 sm:mb-4 transition-colors">
            <Phone className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
          </div>

          <h3 className="font-bold text-gray-700 text-sm sm:text-base mb-1">
            Call Us
          </h3>

          <a
            href={`tel:${shopConfig.mobile.replace(/\s/g, "")}`}
            className="text-orange-700 font-semibold text-xs sm:text-sm hover:underline"
          >
            {shopConfig.mobile}
          </a>

          <a
            href={`tel:${shopConfig.mobile2.replace(/\s/g, "")}`}
            className="text-orange-700 font-semibold text-xs sm:text-sm hover:underline"
          >
            {shopConfig.mobile2}
          </a>
        </div>

        <a
          href={`mailto:${shopConfig.email}`}
          className="group flex flex-col items-center p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all text-center overflow-hidden"
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-orange-100 group-hover:bg-orange-200 rounded-full flex items-center justify-center mb-2 sm:mb-4 transition-colors">
            <Mail className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-gray-700 text-sm sm:text-base mb-1">Email Us</h3>
          <p className="text-orange-600 font-semibold text-[10px] sm:text-sm break-all">{shopConfig.email}</p>
        </a>
{/*
        <a
          href={`https://wa.me/${shopConfig.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all text-center"
        >
        
        
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center mb-2 sm:mb-4 transition-colors">
            <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-700 text-sm sm:text-base mb-1">WhatsApp</h3>
          <p className="text-green-600 font-semibold text-xs sm:text-sm">{shopConfig.whatsappNumber}</p>
        </a>
*/}
        <div className="group flex flex-col items-center p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all text-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center mb-2 sm:mb-4 transition-colors">
            <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
          </div>

          <h3 className="font-bold text-gray-700 text-sm sm:text-base mb-2">
            WhatsApp
          </h3>

          <a
            href={`https://wa.me/${shopConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 font-semibold text-xs sm:text-sm hover:underline"
          >
            {shopConfig.whatsappNumber}
          </a>

          <a
            href={`https://wa.me/${shopConfig.whatsappNumber2}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 font-semibold text-xs sm:text-sm hover:underline"
          >
            {shopConfig.whatsappNumber2}
          </a>
        </div>



        <div className="flex flex-col items-center p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-2 sm:mb-4">
            <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" />
          </div>
          <h3 className="font-bold text-gray-700 text-sm sm:text-base mb-1">Business Hours</h3>
          <p className="text-gray-500 text-[10px] sm:text-sm">Mon – Sat: 7AM – 10PM</p>
          <p className="text-gray-500 text-[10px] sm:text-sm">Sun: 7AM – 10PM</p>
        </div>
      </div>

      <div className="mt-1 sm:mt-8 bg-gray-50 rounded-2xl p-1 sm:p-6 border border-gray-100">
        <div className="flex flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2">
          <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 flex-shrink-0 mt-1 sm:mt-0" />
          <div>
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">Our Location</h3>
            <p className="text-black-500 text-xs sm:text-sm mt-0.5">{shopConfig.address}</p>
          </div>
        </div>
        
        {/* THE FIX: Added Google Map iframe for Sivakasi */}
        <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1987.815089878638!2d77.81589191523595!3d9.436594758901482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cf007e2c888b%3A0x7a7ab9ffe81dea56!2sWisdom%20Crackers!5e1!3m2!1sen!2sin!4v1786006153527!5m2!1sen!2sin"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Sivakasi Map"
          />
        </div>
      </div>

    </div>
  </section>
);

export default ContactSection;