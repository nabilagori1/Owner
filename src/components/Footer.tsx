import React from 'react';
import { Sparkles, Phone, MessageCircle, Instagram, MapPin, ArrowUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { storeSettings, setCurrentView, replayOpeningAnimation } = useApp();

  const handleNav = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#24364B] text-[#FFFDF8] pt-16 pb-8 border-t border-[#B99568]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Monogram (2 cols) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-sm bg-[#B99568] flex items-center justify-center font-serif font-bold text-xl text-[#24364B]">
                JS
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#FFFDF8] block leading-none">
                  JAM SHAM
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#E9DDC9]">
                  ROOFTOP CAFE
                </span>
              </div>
            </div>

            <p className="font-serif italic text-lg text-[#E9DDC9] mb-3">
              "{storeSettings.tagline}"
            </p>

            <p className="text-xs text-white/70 max-w-sm leading-relaxed mb-6">
              A serene 5th-floor terrace overlooking Jamnagar, dedicated to authentic chais, hand-crafted coffees, comfort food, and warm conversations under the evening sky.
            </p>

            <div className="flex items-center gap-3">
              <a
                href={`https://instagram.com/${storeSettings.instagramHandle}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#B99568] hover:text-[#24364B] flex items-center justify-center transition-colors text-white"
                title="Follow on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <button
                onClick={replayOpeningAnimation}
                title="Replay Calligraphy Opening Animation"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-[#B99568] hover:text-[#24364B] text-xs text-[#E9DDC9] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Replay Intro</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B99568] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Digital Menu (30+ Categories)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('menu')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Order Online
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Jam Sham
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Photo Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Find & Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B99568] mb-4">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <button
                  onClick={() => handleNav('track-order')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('orders')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Order History
                </button>
              </li>
              <li>
                <a
                  href={`tel:${storeSettings.phone}`}
                  className="hover:text-white transition-colors no-underline block"
                >
                  Call +91 96696 75375
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${storeSettings.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors no-underline block"
                >
                  WhatsApp Assistance
                </a>
              </li>
              <li>
                <button
                  onClick={() => handleNav('kitchen')}
                  className="text-[#E9DDC9] hover:underline cursor-pointer"
                >
                  Kitchen Order Screen (KDS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="text-[#B99568] hover:underline cursor-pointer"
                >
                  Staff Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Hours & Address */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B99568] mb-4">
              Hours & Terrace
            </h4>
            <p className="text-xs text-[#E9DDC9] font-medium mb-1">
              MONDAY — SUNDAY
            </p>
            <p className="text-xs text-white/70 mb-4">
              5:00 PM — 3:00 AM (Midnight)
            </p>
            <p className="text-xs text-white/80 leading-relaxed">
              5th Floor, Zaver Chambers, Pandit Nehru Marg, Opposite NEO Square, Jamnagar, Gujarat
            </p>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <div>
            © {new Date().getFullYear()} JAM SHAM ROOFTOP CAFE. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Refund & Cancellation</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#E9DDC9] hover:text-white cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
