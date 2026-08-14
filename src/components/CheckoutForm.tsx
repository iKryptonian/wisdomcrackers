import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, FileText, User, Phone, Mail, Home, MapPin, Info, Building, Map } from 'lucide-react';
import { useApp } from '../context/AppContext';
/* import { statesCities } from '../data/locations'; */

const CheckoutForm: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    setCustomerDetails,
    setCurrentPage,
  } = useApp();

  const [form, setForm] = useState<any>({
    name: '',
    mobile: '',
    email: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- MOBILE BACK BUTTON FIX ---
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';

      window.history.pushState({ drawer: 'checkout' }, '', window.location.href);

      const handlePopState = () => {
        setIsCheckoutOpen(false);
      };
      
      window.addEventListener('popstate', handlePopState);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isCheckoutOpen, setIsCheckoutOpen]);

  const closeCheckoutSafely = () => {
    if (window.history.state?.drawer === 'checkout') {
      window.history.back(); 
    } else {
      setIsCheckoutOpen(false);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.mobile.trim() || !/^[6-9]\d{9}$/.test(form.mobile)) errs.mobile = 'Enter valid 10-digit mobile';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter valid email';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.state) errs.state = 'State is required';
    if (!form.city.trim()) errs.city = 'City and District required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit PIN code';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev: any) => {
      const updatedForm = { ...prev, [field]: value };
      
      // If they change the state, automatically clear the old city
      if (field === 'state') {
        updatedForm.city = '';
      }
      return updatedForm;
    });

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setCustomerDetails(form);
    closeCheckoutSafely();
    setTimeout(() => setCurrentPage('invoice'), 50);
  };

  const handleBack = () => {
    closeCheckoutSafely();
    setTimeout(() => setIsCartOpen(true), 50);
  };

  return (
    <>
      {isCheckoutOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[110] backdrop-blur-sm"
          onClick={closeCheckoutSafely}
        />
      )}

      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-white z-[120] shadow-2xl flex flex-col transition-transform duration-300 ${
          isCheckoutOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-orange-800 to-orange-700 text-white flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
            <h2 className="font-bold text-base sm:text-lg">Customer Details</h2>
          </div>
          <button onClick={closeCheckoutSafely} className="p-1.5 sm:p-2 hover:bg-red-700 rounded-full">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">
          
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1 sm:mb-1.5 flex items-center gap-1">
              <User className="w-3 h-3" /> Full Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={`w-full border rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.name && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1 sm:mb-1.5 flex items-center gap-1">
              <Phone className="w-3 h-3" /> Mobile Number *
            </label>
            <input
              type="tel"
              value={form.mobile}
              onChange={e => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              className={`w-full border rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.mobile ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.mobile && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.mobile}</p>}
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1 sm:mb-1.5 flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="your@email.com (optional)"
              className={`w-full border rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.email && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1 sm:mb-1.5 flex items-center gap-1">
              <Home className="w-3 h-3" /> Delivery Address *
            </label>
            <textarea
              value={form.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="Door no, Street, Area..."
              rows={3}
              className={`w-full border rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.address && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 !mt-1 sm:!mt-2">
            
            {/* STATE - MANUAL TEXT INPUT */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1 sm:mb-1.5 flex items-center gap-1">
                <Map className="w-3 h-3" /> State *
              </label>
              <input
                type="text"
                value={form.state}
                onChange={e => handleChange('state', e.target.value)}
                placeholder="Enter state name"
                className={`w-full h-9 sm:h-12 border rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.state ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.state && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.state}</p>}
            </div>

            {/* CITY - ALWAYS MANUAL TEXT INPUT */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1 sm:mb-1.5 flex items-center gap-1">
                <Building className="w-3 h-3" /> City and District *
              </label>
              <input
                type="text"
                value={form.city}
                onChange={e => handleChange('city', e.target.value)}
                disabled={!form.state}
                placeholder={!form.state ? "Select state first" : "Enter city name"}
                className={`w-full h-9 sm:h-12 border rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-50 disabled:text-gray-400 ${errors.city ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.city && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.city}</p>}
            </div>

          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1 sm:mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> PIN Code *
            </label>
            <input
              type="text"
              value={form.pincode}
              onChange={e => handleChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit PIN code"
              className={`w-full border rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.pincode ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.pincode && <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.pincode}</p>}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-4 sm:mt-6 flex items-start gap-1.5 sm:gap-2.5">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-[11px] sm:text-sm text-blue-800 leading-relaxed font-medium">
              <span className="font-bold">Courier charges are not included.</span> You can send the charges separately to us and we will prepay them at the courier office, or you can pay the courier charges directly when you pick up your parcel at the courier office.
            </p>
          </div>

        </div>

        <div className="flex-shrink-0 px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 bg-white flex gap-2 sm:gap-3">
          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-1.5 sm:gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold px-3 sm:px-5 py-2 sm:py-3 rounded-xl transition-colors text-xs sm:text-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-bold py-2 sm:py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg text-xs sm:text-sm"
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Generate Estimate
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;