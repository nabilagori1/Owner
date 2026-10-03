import React from 'react';
import { ArrowRight, Navigation, MessageCircle, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Hero: React.FC = () => {
  const { storeSettings, setCurrentView, setIsBookingModalOpen } = useApp();

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      'Hello Jam Sham Rooftop Cafe! I would like to know more about your menu/order.'
    );
    window.open(`https://wa.me/${storeSettings.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleDirectionsClick = () => {
    window.open(storeSettings.googleMapsUrl, '_blank');
  };

  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#24364B]">
      {/* Background Image with Warm Old-Money Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&auto=format&fit=crop&q=85"
          alt="Jam Sham Rooftop Cafe Jamnagar Ambience"
          className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
          loading="eager"
        />
        {/* Editorial Gradients: Navy bottom, warm camel center wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#24364B] via-[#24364B]/60 to-[#24364B]/40" />
        <div className="absolute inset-0 bg-radial from-[#B99568]/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Decorative hairline frame inside */}
      <div className="absolute inset-6 md:inset-10 border border-[#B99568]/25 pointer-events-none z-10 hidden sm:block">
        <div className="absolute top-2 left-2 text-[#B99568]/60 text-xs">✦</div>
        <div className="absolute top-2 right-2 text-[#B99568]/60 text-xs">✦</div>
        <div className="absolute bottom-2 left-2 text-[#B99568]/60 text-xs">✦</div>
        <div className="absolute bottom-2 right-2 text-[#B99568]/60 text-xs">✦</div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-[#FFFDF8]">
        {/* Status Indicator */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-sm bg-[#FFFDF8]/10 border border-[#B99568]/40 backdrop-blur-md mb-6">
          <span
            className={`w-2 h-2 rounded-full ${
              storeSettings.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="text-xs tracking-widest uppercase font-semibold text-[#E9DDC9]">
            {storeSettings.isOpen ? 'OPEN TODAY' : 'CURRENTLY CLOSED'} ·{' '}
            <span className="text-white/90">{storeSettings.openingHoursDisplay}</span>
          </span>
        </div>

        {/* Brand Kicker */}
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#B99568] font-medium mb-3">
          5TH FLOOR TERRACE · PANDIT NEHRU MARG, JAMNAGAR
        </p>

        {/* Main Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FFFDF8] leading-[1.08] mb-4">
          JAM SHAM
          <span className="block font-serif font-light italic text-[#E9DDC9] text-3xl sm:text-5xl md:text-6xl mt-1">
            Rooftop Cafe
          </span>
        </h1>

        {/* Tagline */}
        <p className="font-serif italic text-xl sm:text-2xl text-[#E9DDC9] mb-4">
          "{storeSettings.tagline}"
        </p>

        {/* Supporting Text */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#FFFDF8]/85 font-light leading-relaxed mb-8">
          An easygoing rooftop café in the heart of Jamnagar serving comfort food, refreshing
          beverages, chai, coffee, Chinese favourites, wood-fired style pizzas and more.
        </p>

        {/* Primary & Secondary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
          <button
            onClick={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#B99568] hover:bg-[#a58256] text-[#24364B] font-bold rounded-sm text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ORDER ONLINE</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#FFFDF8] hover:bg-[#E9DDC9] text-[#24364B] font-bold rounded-sm text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center cursor-pointer"
          >
            BOOK A TABLE
          </button>

          <button
            onClick={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#FFFDF8]/15 hover:bg-[#FFFDF8]/25 text-[#FFFDF8] border border-[#FFFDF8]/40 font-semibold rounded-sm text-xs sm:text-sm tracking-wider uppercase transition-all backdrop-blur-xs flex items-center justify-center cursor-pointer"
          >
            EXPLORE MENU
          </button>
        </div>

        {/* Micro Buttons: Directions & WhatsApp */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <button
            onClick={handleDirectionsClick}
            className="inline-flex items-center gap-1.5 text-[#E9DDC9] hover:text-white transition-colors underline underline-offset-4 decoration-[#B99568]/60 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-[#B99568]" />
            <span>GET DIRECTIONS (GOOGLE MAPS)</span>
          </button>
          <span className="text-[#B99568]/40 hidden sm:inline">|</span>
          <button
            onClick={handleWhatsAppClick}
            className="inline-flex items-center gap-1.5 text-[#E9DDC9] hover:text-white transition-colors underline underline-offset-4 decoration-emerald-500/60 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WHATSAPP US (+91 96696 75375)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
