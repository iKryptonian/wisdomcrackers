import React from 'react';
import { Award, Users } from 'lucide-react';

const features = [
  {
    icon: <Award className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-500" />,
    title: "Premium Quality",
    desc: "Sourced directly from licensed manufacturers in Sivakasi — the firecracker capital of India.",
  },
  
  {
    icon: <Users className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-500" />,
    title: "Trusted by Thousands",
    desc: "Your trusted destination for quality firecrackers at competitive prices.",
  },
  
];

const AboutSection: React.FC = () => (
  <section id="about" className="py-0 -mt-3 sm:py-8 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-12 items-center">
        <div>
          <span className="text-orange-700 text-[12px] font-extrabold sm:text-[18px] uppercase tracking-widest">About Us</span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mt-1 mb-2 sm:mb-4">
            India's Most Trusted<br />
            <span className="text-orange-700">Cracker Retailer</span>
          </h2>
          <p className="text-gray-600 text-xs sm:text-base leading-relaxed mb-1 sm:mb-4">
            we have been bringing joy to millions of Indian households with our premium quality
            firecrackers. Based in Sivakasi, Tamil Nadu — the hub of India's fireworks industry — we ensure
            every product meets the highest safety and quality standards.
          </p>
          <p className="text-gray-600 text-xs sm:text-base leading-relaxed mb-1 sm:mb-6">
            We offer direct factory prices with up to 80% savings on MRP, making your celebrations affordable
            without compromising on the magic of fireworks.
          </p>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/*
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-extrabold text-orange-700">10+</p>
              <p className="text-gray-500 text-[9px] sm:text-sm">Years Exp.</p>
            </div> 
            */}
            <div className="w-px h-8 sm:h-12 bg-gray-200" />
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-extrabold text-orange-700">5K+</p>
              <p className="text-gray-500 text-[9px] sm:text-sm">Happy Customers</p>
            </div>
            <div className="w-px h-8 sm:h-12 bg-gray-200" />
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-extrabold text-orange-700">100+</p>
              <p className="text-gray-500 text-[9px] sm:text-sm">Products</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {features.map(f => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-3 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-1.5 sm:mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 text-xs sm:text-base mb-0.5">{f.title}</h3>
              <p className="text-gray-500 text-[10px] sm:text-sm leading-relaxed">{f.desc}</p> 
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;