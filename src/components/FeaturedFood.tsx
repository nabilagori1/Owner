import React from 'react';
import { Plus, Sparkles, Flame, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MenuItem } from '../types';

export const FeaturedFood: React.FC = () => {
  const { menuItems, addToCart, setActiveModalProduct, setCurrentView } = useApp();

  const featuredItems = menuItems.filter((item) => item.featured).slice(0, 10);

  const handleCardClick = (item: MenuItem) => {
    setActiveModalProduct(item);
  };

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    if (item.customizationOptions && item.customizationOptions.length > 0) {
      setActiveModalProduct(item);
    } else {
      addToCart(item);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#E9DDC9] pb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#68705A] font-semibold mb-2">
              CURATED SELECTIONS
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#24364B] tracking-tight">
              Favourites From Jam Sham
            </h2>
            <p className="mt-2 text-sm text-[#765D49] max-w-xl">
              Signature comfort food, authentic Gujarati kulhad chai, hand-churned cold coffees, and sizzling specials cherished every evening.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="mt-4 md:mt-0 text-xs font-semibold tracking-wider uppercase text-[#24364B] hover:text-[#68705A] transition-colors underline underline-offset-8 decoration-[#B99568] cursor-pointer"
          >
            VIEW FULL 30+ CATEGORY MENU →
          </button>
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer hover:border-[#B99568]/50"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E9DDC9]/30">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Vegetarian Indicator Symbol (Green square with circle) */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs p-1 rounded-xs border border-gray-200 shadow-xs">
                  <div className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center p-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  </div>
                </div>

                {/* Optional Custom Badge */}
                {item.badge && (
                  <div className="absolute top-3 right-3 bg-[#24364B] text-[#FFFDF8] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                    {item.badge}
                  </div>
                )}

                {/* Quick Add Overlay on Hover */}
                <button
                  onClick={(e) => handleQuickAdd(e, item)}
                  className="absolute bottom-3 right-3 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-1 shadow-md transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Item Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] tracking-widest text-[#765D49] font-medium uppercase mb-1">
                    {item.category}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#24364B] group-hover:text-[#68705A] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#765D49]/80 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Price & Customize prompt */}
                <div className="mt-4 pt-3 border-t border-[#E9DDC9]/50 flex items-center justify-between">
                  <div className="text-base font-bold text-[#24364B] font-mono tabular-nums">
                    ₹{item.price}
                  </div>

                  {item.customizationOptions && item.customizationOptions.length > 0 ? (
                    <span className="text-[11px] text-[#B99568] font-medium underline underline-offset-2">
                      Customizable
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#68705A] font-medium">
                      Freshly Prepared
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
