import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { storeSettings } = useApp();

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      'Hello Jam Sham Rooftop Cafe! I would like to know more about your menu/order.'
    );
    window.open(`https://wa.me/${storeSettings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={handleWhatsAppClick}
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-white"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        <span className="text-xs font-bold tracking-wide uppercase pr-1 hidden sm:inline">
          Chat With Us
        </span>
      </button>
    </div>
  );
};
