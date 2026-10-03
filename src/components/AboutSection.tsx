import React from 'react';
import { Sparkles, Coffee, Moon, Users, Utensils, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutSection: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="py-20 bg-[#FFFDF8] border-b border-[#E9DDC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div>
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#F7F2E8] border border-[#B99568]/40 mb-4">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#68705A]">
                ROOFTOP · FOOD · CHAI · COFFEE
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#24364B] tracking-tight leading-[1.15]">
              Your Evening,
              <span className="block font-serif font-light italic text-[#765D49]">
                Served Differently.
              </span>
            </h2>

            <div className="w-12 h-[2px] bg-[#B99568] my-6" />

            <p className="text-sm sm:text-base text-[#765D49] leading-relaxed mb-6">
              Jam Sham Rooftop Cafe is a relaxed rooftop destination in Jamnagar where comfort food,
              refreshing drinks, chai, coffee and good conversations come together under the evening sky.
            </p>

            <p className="text-xs sm:text-sm text-[#765D49]/80 leading-relaxed mb-8">
              Perched on the 5th floor of Zaver Chambers opposite NEO Square, our open-air terrace is
              designed for slow hours, after-work chai breaks, late-night midnight cravings until 3:00 AM,
              and memories made over sizzling platters with friends and family.
            </p>

            {/* Feature Bullets with Old Money touches */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-xs font-medium text-[#24364B]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E9DDC9]/50 flex items-center justify-center text-[#B99568]">
                  ✦
                </div>
                <span>5th Floor Open-Air Ambience</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E9DDC9]/50 flex items-center justify-center text-[#B99568]">
                  ✦
                </div>
                <span>100% Pure Vegetarian Kitchen</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E9DDC9]/50 flex items-center justify-center text-[#B99568]">
                  ✦
                </div>
                <span>Midnight Dining (Till 3:00 AM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E9DDC9]/50 flex items-center justify-center text-[#B99568]">
                  ✦
                </div>
                <span>QR Table & Online Ordering</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentView('menu');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              Explore Our Offerings
            </button>
          </div>

          {/* Right Image Composition */}
          <div className="relative">
            {/* Primary Frame */}
            <div className="relative z-10 rounded-sm overflow-hidden border-2 border-[#E9DDC9] shadow-xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&auto=format&fit=crop&q=80"
                alt="Jam Sham Rooftop Cafe Terrace Seating"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlapping Secondary Card */}
            <div className="hidden sm:block absolute -bottom-6 -left-6 z-20 w-48 p-4 bg-[#FFFDF8] border border-[#B99568]/40 shadow-lg rounded-sm text-center">
              <span className="font-serif text-3xl font-bold text-[#24364B] block">
                5:00 PM
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#765D49] font-semibold">
                Till 3:00 AM Everyday
              </span>
              <div className="mt-1 text-[11px] text-[#68705A] font-medium">
                Jamnagar's Rooftop Haven
              </div>
            </div>

            {/* Subtle decorative background outline */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-[#B99568]/30 rounded-sm pointer-events-none -z-0" />
          </div>
        </div>
      </div>
    </section>
  );
};
