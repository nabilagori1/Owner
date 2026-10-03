import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LocationContactSection: React.FC = () => {
  const { storeSettings, setCurrentView } = useApp();

  const handleDirections = () => {
    window.open(storeSettings.googleMapsUrl, '_blank');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      'Hello Jam Sham Rooftop Cafe! I would like to reserve a table / ask about tonight.'
    );
    window.open(`https://wa.me/${storeSettings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section className="py-20 bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Contact & Hours Details (5 cols) */}
          <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#E9DDC9] p-8 sm:p-10 rounded-sm shadow-xs flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#68705A] font-semibold mb-2">
                ROOFTOP LOCATION
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#24364B]">
                Find Jam Sham
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#765D49]">
                High up on the 5th floor terrace of Zaver Chambers, right on Pandit Nehru Marg opposite NEO Square.
              </p>

              <div className="my-6 space-y-4 text-xs">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#F7F2E8] border border-[#B99568]/40 flex items-center justify-center shrink-0 text-[#B99568]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#24364B] block text-sm">
                      Address
                    </span>
                    <span className="text-[#765D49] leading-relaxed">
                      {storeSettings.address}
                    </span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#F7F2E8] border border-[#B99568]/40 flex items-center justify-center shrink-0 text-[#B99568]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#24364B] text-sm">
                        Operating Hours
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase ${
                          storeSettings.isOpen
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {storeSettings.isOpen ? 'OPEN NOW' : 'CLOSED NOW'}
                      </span>
                    </div>
                    <span className="text-[#765D49] block mt-0.5 font-medium">
                      {storeSettings.openingHoursDisplay}
                    </span>
                    <span className="text-[11px] text-[#765D49]/70">
                      Open every evening through late midnight.
                    </span>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#F7F2E8] border border-[#B99568]/40 flex items-center justify-center shrink-0 text-[#B99568]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#24364B] block text-sm">
                      Direct Telephone
                    </span>
                    <a
                      href={`tel:${storeSettings.phone}`}
                      className="text-[#24364B] font-mono font-semibold hover:text-[#68705A] transition-colors"
                    >
                      {storeSettings.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="pt-6 border-t border-[#E9DDC9] grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDirections}
                className="py-3 px-3 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#B99568]" />
                <span>Get Directions</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <a
                href={`tel:${storeSettings.phone}`}
                className="py-2.5 px-3 border border-[#24364B] text-[#24364B] hover:bg-[#24364B] hover:text-[#FFFDF8] rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors no-underline text-center"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>

              <button
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="py-2.5 px-3 border border-[#B99568] bg-[#F7F2E8] hover:bg-[#E9DDC9] text-[#24364B] rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#B99568]" />
                <span>Order Online</span>
              </button>
            </div>
          </div>

          {/* Right Map Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm shadow-xs overflow-hidden flex flex-col justify-between">
            {/* Visual Rooftop Map Presentation with Google Pin */}
            <div className="relative flex-1 min-h-[340px] bg-[#E9DDC9]/40 flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1000&auto=format&fit=crop&q=80"
                alt="Map Background Jamnagar"
                className="w-full h-full object-cover filter contrast-[0.9] opacity-70"
              />
              <div className="absolute inset-0 bg-[#24364B]/40" />

              {/* Floating Pin Card */}
              <div className="relative z-10 bg-[#FFFDF8] border border-[#B99568] p-5 rounded-sm shadow-2xl max-w-sm mx-4 text-center">
                <div className="w-10 h-10 rounded-full bg-[#24364B] text-[#FFFDF8] flex items-center justify-center mx-auto mb-2 shadow-md">
                  <MapPin className="w-5 h-5 text-[#B99568]" />
                </div>
                <div className="font-serif text-lg font-bold text-[#24364B]">
                  Jam Sham Rooftop Cafe
                </div>
                <div className="text-[11px] text-[#765D49] mt-0.5">
                  5th Floor, Zaver Chambers, Pandit Nehru Marg
                </div>
                <div className="text-[10px] text-[#68705A] font-semibold mt-1">
                  Opposite NEO Square · Jamnagar, Gujarat
                </div>

                <button
                  onClick={handleDirections}
                  className="mt-3 w-full py-2 bg-[#24364B] hover:bg-[#68705A] text-white text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom info footer */}
            <div className="p-4 bg-[#F7F2E8] border-t border-[#E9DDC9] flex flex-wrap items-center justify-between text-xs text-[#765D49] gap-2">
              <span className="font-medium">
                📍 Landmark: Opposite NEO Square, Jamnagar
              </span>
              <span className="text-[11px]">
                Elevator available directly to 5th floor terrace
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
