import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/initialData';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<(typeof GALLERY_ITEMS)[0] | null>(null);

  const categories = ['All', 'Rooftop', 'Chai & Coffee', 'Food', 'Evenings'];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <section className="py-20 bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#68705A] font-semibold mb-2">
            MOMENTS AT 5TH FLOOR
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#24364B] tracking-tight">
            The Visual Journal
          </h2>
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-[1px] w-12 bg-[#B99568]/40" />
            <div className="text-[#B99568] text-xs">✦</div>
            <div className="h-[1px] w-12 bg-[#B99568]/40" />
          </div>
          <p className="text-xs sm:text-sm text-[#765D49]">
            A glimpse into breezy twilight skies, artisan brew pours, smoking sizzlers, and rooftop conversations in Jamnagar.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-[#24364B] text-[#FFFDF8] border-[#24364B]'
                  : 'bg-white text-[#765D49] border-[#E9DDC9] hover:border-[#B99568]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative aspect-[4/3] rounded-sm overflow-hidden bg-[#E9DDC9]/30 border border-[#E9DDC9] shadow-xs cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Hover Dark Overlay with Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#B99568] font-bold">
                  {item.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#FFFDF8] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2 mt-1">
                  {item.description}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-[#E9DDC9] font-medium">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>View Larger</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxItem && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setLightboxItem(null)}
          >
            <div
              className="relative max-w-3xl w-full bg-[#1E293B] rounded-sm overflow-hidden border border-[#B99568]/40 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative aspect-[16/10] w-full bg-black">
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-[#24364B] text-[#FFFDF8]">
                <span className="text-[10px] uppercase tracking-widest text-[#B99568] font-bold">
                  {lightboxItem.category}
                </span>
                <h3 className="font-serif text-2xl font-bold mt-0.5">
                  {lightboxItem.title}
                </h3>
                <p className="mt-1 text-xs text-[#E9DDC9]/90">
                  {lightboxItem.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
