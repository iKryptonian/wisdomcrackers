import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const dos = [
  "Always buy crackers from licensed shops only.",
  "Store crackers in a dry place away from fire.",
  "Burst crackers in open spaces only.",
  "Keep a bucket of sand or water nearby.",
  "Supervise children at all times during use.",
  "Read the instructions on each cracker before use.",
  "Dispose of used crackers safely with water.",
];

const donts = [
  "Never burst crackers near flammable materials.",
  "Do not allow small children to handle crackers.",
  "Do not re-ignite a cracker that did not burst.",
  "Never experiment by opening or modifying crackers.",
  "Do not burst crackers near animals or elderly people.",
  "Do not use crackers indoors or in closed spaces.",
];

const SafetySection: React.FC = () => (
  <section id="safety" className="py-0 -mt-4 sm:py-8 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-3 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-yellow-100 text-yellow-700 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-sm font-semibold mb-2 sm:mb-3">
          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
          Safety First
        </div>
        <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-800">
          Cracker Safety <span className="text-orange-700">Guidelines</span>
        </h2>
        <p className="text-gray-500 text-xs sm:text-base mt-1.5">Follow these guidelines for a safe and joyful celebration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-6">
        <div className="bg-white rounded-2xl border border-orange-200 overflow-hidden shadow-sm">
          <div className="bg-green-700 px-3 py-2 sm:px-6 sm:py-4 flex items-center gap-2 sm:gap-3 text-white">
            <CheckCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <h3 className="font-bold text-sm sm:text-lg">DO's</h3>
          </div>
          <ul className="px-3 py-3 sm:px-6 sm:py-5 space-y-1.5 sm:space-y-3">
            {dos.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 sm:gap-3">
                <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-orange-100 text-orange-600 text-[9px] sm:text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  {i + 1}
                </span>
                <span className="text-gray-600 text-[11px] sm:text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
                                                                                                                                                                                                            
        <div className="bg-white rounded-2xl border border-orange-200 overflow-hidden shadow-sm">
          <div className="bg-red-700 px-3 py-2 sm:px-6 sm:py-4 flex items-center gap-2 sm:gap-3 text-white">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            <h3 className="font-bold text-sm sm:text-lg">DON'Ts</h3>
          </div>
          <ul className="px-3 py-3 sm:px-6 sm:py-5 space-y-1.5 sm:space-y-3">
            {donts.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 sm:gap-3">
                <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-orange-100 text-orange-600 text-[9px] sm:text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                  ✕
                </span>
                <span className="text-gray-600 text-[11px] sm:text-sm leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default SafetySection;