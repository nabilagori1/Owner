import React from 'react';
import { Compass, Leaf, ShoppingBag, Smartphone, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickInfoBar: React.FC = () => {
  const { storeSettings, setCurrentView } = useApp();

  const items = [
    {
      icon: <Compass className="w-4 h-4 text-[#B99568]" />,
      title: 'ROOFTOP DINING',
      subtitle: '5th Floor Terrace, Jamnagar',
    },
    {
      icon: <Leaf className="w-4 h-4 text-emerald-700" />,
      title: 'VEGETARIAN MENU',
      subtitle: '100% Pure Dairy & Veg',
    },
    {
      icon: <ShoppingBag className="w-4 h-4 text-[#B99568]" />,
      title: 'TAKEAWAY AVAILABLE',
      subtitle: 'Quick Counter Pickup',
    },
    {
      icon: <Smartphone className="w-4 h-4 text-[#B99568]" />,
      title: 'ORDER ONLINE',
      subtitle: 'Live Tracking & Dine-In QR',
      onClick: () => {
        setCurrentView('menu');
        window.scrollTo({ top: 400, behavior: 'smooth' });
      },
    },
    {
      icon: <PhoneCall className="w-4 h-4 text-[#B99568]" />,
      title: 'CALL US',
      subtitle: storeSettings.phone,
      href: `tel:${storeSettings.phone}`,
    },
  ];

  return (
    <section className="bg-[#FFFDF8] border-y border-[#E9DDC9] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#E9DDC9]/60">
          {items.map((item, idx) => {
            const content = (
              <div
                key={idx}
                onClick={item.onClick}
                className={`flex items-center gap-3 pt-3 lg:pt-0 lg:px-3 first:pt-0 first:pl-0 ${
                  item.onClick || item.href ? 'cursor-pointer group' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-sm bg-[#F7F2E8] border border-[#B99568]/30 flex items-center justify-center shrink-0 group-hover:bg-[#E9DDC9]/50 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-[#24364B] uppercase group-hover:text-[#68705A] transition-colors">
                    {item.title}
                  </div>
                  <div className="text-xs text-[#765D49] font-medium leading-tight">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            );

            if (item.href) {
              return (
                <a key={idx} href={item.href} className="no-underline">
                  {content}
                </a>
              );
            }
            return <div key={idx}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
};
