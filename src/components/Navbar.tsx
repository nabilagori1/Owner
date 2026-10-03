import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Phone,
  Clock,
  Sparkles,
  UtensilsCrossed,
  ShieldCheck,
  MapPin,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setIsCartOpen,
    selectedTable,
    setSelectedTable,
    storeSettings,
    replayOpeningAnimation,
    setIsBookingModalOpen,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Menu', view: 'menu' },
    { label: 'Order Online', view: 'menu' },
    { label: 'Track Order', view: 'track-order' },
    { label: 'My Orders', view: 'orders' },
    { label: 'About', view: 'about' },
    { label: 'Gallery', view: 'gallery' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-[#24364B] text-[#FFFDF8] text-[11px] md:text-xs py-1.5 px-4 border-b border-[#B99568]/20 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#E9DDC9]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              {storeSettings.isOpen ? 'ROOFTOP OPEN NOW' : 'OPENS AT 5:00 PM'}
            </span>
            <span className="hidden sm:inline text-[#B99568]">·</span>
            <span className="hidden sm:inline text-white/80">
              5th Floor, Zaver Chambers, Pandit Nehru Marg, Jamnagar
            </span>
          </div>

          <div className="flex items-center gap-4">
            {selectedTable && (
              <span className="bg-[#B99568]/20 text-[#E9DDC9] px-2 py-0.5 rounded text-[10px] tracking-wide border border-[#B99568]/40">
                Table {selectedTable} Connected
              </span>
            )}
            <a
              href={`tel:${storeSettings.phone}`}
              className="hidden md:flex items-center gap-1 text-[#E9DDC9] hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#B99568]" />
              {storeSettings.phone}
            </a>
            <button
              onClick={replayOpeningAnimation}
              title="Replay Calligraphy Intro"
              className="flex items-center gap-1 text-[#B99568] hover:text-[#FFFDF8] transition-colors cursor-pointer text-[11px]"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Intro</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="text-[#E9DDC9] hover:text-white font-semibold transition-colors flex items-center gap-1 text-[11px] cursor-pointer bg-[#B99568]/20 px-2 py-0.5 rounded border border-[#B99568]/40"
            >
              <ShieldCheck className="w-3 h-3 text-[#B99568]" />
              <span>Owner Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFFDF8]/95 backdrop-blur-md shadow-sm border-b border-[#E9DDC9] py-2.5'
            : 'bg-[#F7F2E8] border-b border-[#B99568]/20 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer group flex items-center gap-3 select-none"
          >
            {/* Elegant Monogram Seal */}
            <div className="w-10 h-10 rounded-sm bg-[#24364B] flex items-center justify-center border border-[#B99568] shadow-xs group-hover:bg-[#68705A] transition-colors">
              <span className="font-serif font-bold text-lg text-[#FFFDF8] tracking-tighter">
                JS
              </span>
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#24364B] leading-none group-hover:text-[#68705A] transition-colors">
                JAM SHAM
              </div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#765D49] font-medium mt-0.5">
                ROOFTOP CAFE
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.slice(0, 7).map((link) => {
              const isActive =
                currentView === link.view ||
                (link.label === 'Order Online' && currentView === 'menu');
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.view)}
                  className={`relative py-1 text-sm tracking-wide font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#24364B] font-semibold'
                      : 'text-[#765D49] hover:text-[#24364B]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B99568] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Kitchen Display button */}
            <button
              onClick={() => handleNavClick('kitchen')}
              title="Kitchen Order Display (KDS)"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#68705A]/30 text-xs font-medium text-[#68705A] hover:bg-[#68705A]/10 transition-colors cursor-pointer"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Kitchen</span>
            </button>

            {/* Book Table CTA */}
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="hidden md:inline-flex items-center px-3.5 py-2 text-xs font-semibold tracking-wider uppercase bg-[#B99568] text-[#24364B] hover:bg-[#a88457] transition-all rounded-sm shadow-xs cursor-pointer"
            >
              Book Table
            </button>

            {/* View Menu CTA */}
            <button
              onClick={() => handleNavClick('menu')}
              className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-semibold tracking-wider uppercase text-[#24364B] border border-[#24364B] hover:bg-[#24364B] hover:text-[#FFFDF8] transition-all rounded-sm cursor-pointer"
            >
              View Menu
            </button>

            {/* Order Now CTA */}
            <button
              onClick={() => handleNavClick('menu')}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-wider uppercase bg-[#24364B] text-[#FFFDF8] hover:bg-[#68705A] transition-all rounded-sm shadow-xs cursor-pointer"
            >
              Order Now
            </button>

            {/* Cart Icon Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Cart"
              className="relative p-2.5 rounded-sm text-[#24364B] hover:bg-[#E9DDC9]/50 transition-colors cursor-pointer border border-[#B99568]/30"
            >
              <ShoppingBag className="w-5 h-5 text-[#24364B]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#6E3030] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-sm text-[#24364B] hover:bg-[#E9DDC9]/50 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFDF8] border-b border-[#E9DDC9] px-6 py-6 shadow-xl animate-fadeIn">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.view)}
                  className="text-left py-2.5 text-base font-medium text-[#24364B] hover:text-[#68705A] border-b border-[#E9DDC9]/40 flex items-center justify-between cursor-pointer"
                >
                  <span>{link.label}</span>
                  <span className="text-[#B99568] text-xs">→</span>
                </button>
              ))}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsBookingModalOpen(true);
                }}
                className="w-full py-2.5 bg-[#B99568] hover:bg-[#a88457] text-[#24364B] font-bold text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Book A Rooftop Table</span>
              </button>

              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleNavClick('kitchen')}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 border border-[#68705A] text-xs font-semibold text-[#68705A] rounded-sm cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Kitchen Board
                </button>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#24364B] text-xs font-semibold text-[#FFFDF8] rounded-sm cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E9DDC9] text-xs text-[#765D49] space-y-1">
                <p>📍 5th Floor, Zaver Chambers, Pandit Nehru Marg, Jamnagar</p>
                <p>⏰ Open Today: 5:00 PM – 3:00 AM</p>
                <p>📞 +91 96696 75375</p>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
