import React from 'react';
import { Sparkles, Moon, Coffee, Pizza, Users, PartyPopper, Wind } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RooftopExperience: React.FC = () => {
  const { setCurrentView } = useApp();

  const experiences = [
    {
      icon: <Wind className="w-5 h-5 text-[#B99568]" />,
      title: 'Rooftop Ambience',
      desc: 'Open skies, gentle sea breeze across Jamnagar, and ambient warm string lights.',
    },
    {
      icon: <Coffee className="w-5 h-5 text-[#B99568]" />,
      title: 'Chai & Coffee',
      desc: 'Simmered spiced kulhad tea and thick chilled espresso blended with dairy cream.',
    },
    {
      icon: <Pizza className="w-5 h-5 text-[#B99568]" />,
      title: 'Comfort Food',
      desc: 'Thin-crust pizzas, sizzling platters, crispy fries, pastas, burgers and Maggi.',
    },
    {
      icon: <Moon className="w-5 h-5 text-[#B99568]" />,
      title: 'Evening Hangouts',
      desc: 'The favourite late-night corner in town, operating daily until 3:00 AM.',
    },
    {
      icon: <Users className="w-5 h-5 text-[#B99568]" />,
      title: 'Friends & Family',
      desc: 'Comfortable terrace seating crafted for memorable conversations and shared platters.',
    },
    {
      icon: <PartyPopper className="w-5 h-5 text-[#B99568]" />,
      title: 'Casual Celebrations',
      desc: 'Birthdays, reunions, and anniversary dinners under the Gujarati starlight.',
    },
  ];

  return (
    <section className="py-20 bg-[#24364B] text-[#FFFDF8] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-radial from-[#B99568]/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#B99568]/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#B99568]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#B99568] font-bold mb-3">
            TERRACE NIGHTS AT JAM SHAM
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFDF8] leading-tight">
            Come For The Food.
            <span className="block font-serif font-light italic text-[#E9DDC9]">
              Stay For The Rooftop.
            </span>
          </h2>
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-[1px] w-12 bg-[#B99568]/40" />
            <div className="text-[#B99568] text-xs">✦</div>
            <div className="h-[1px] w-12 bg-[#B99568]/40" />
          </div>
          <p className="text-xs sm:text-sm text-[#E9DDC9]/80 font-light">
            An elevated sanctuary high above the bustling Pandit Nehru Marg, where evenings unfold at your own gentle pace.
          </p>
        </div>

        {/* 6 Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#FFFDF8]/5 border border-[#B99568]/20 hover:border-[#B99568]/60 rounded-sm transition-all duration-300 backdrop-blur-xs group hover:bg-[#FFFDF8]/10"
            >
              <div className="w-10 h-10 rounded-sm bg-[#B99568]/20 border border-[#B99568]/40 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {exp.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#FFFDF8] mb-2 group-hover:text-[#E9DDC9] transition-colors">
                {exp.title}
              </h3>
              <p className="text-xs text-[#E9DDC9]/75 leading-relaxed font-light">
                {exp.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Terrace Reservation / Table Order CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => {
              setCurrentView('menu');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="px-8 py-3.5 bg-[#B99568] hover:bg-[#a37f52] text-[#24364B] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors shadow-lg cursor-pointer"
          >
            Explore Rooftop Menu & Order
          </button>
        </div>
      </div>
    </section>
  );
};
