import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OpeningAnimation: React.FC = () => {
  const { showOpeningAnimation, setShowOpeningAnimation } = useApp();
  const [writtenProgress, setWrittenProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play subtle pen scratching/writing audio tone when opening
  useEffect(() => {
    if (!showOpeningAnimation) return;

    let timer: NodeJS.Timeout;
    const interval = setInterval(() => {
      setWrittenProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    // Auto dismiss after 3.8s if user hasn't clicked
    timer = setTimeout(() => {
      handleComplete();
    }, 4200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [showOpeningAnimation]);

  const handleComplete = () => {
    setShowOpeningAnimation(false);
  };

  if (!showOpeningAnimation) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7F2E8] px-4 overflow-hidden selection:bg-[#B99568]/20"
      >
        {/* Vintage Paper Background & Delicate Textures */}
        <div className="absolute inset-0 paper-pattern opacity-60 pointer-events-none" />
        
        {/* Subtle Ambient Vignette & Warm Glow */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#E9DDC9]/30 to-[#24364B]/10 pointer-events-none" />

        {/* Old Money Classic Ornate Border Box */}
        <div className="relative w-full max-w-2xl bg-[#FFFDF8]/90 border border-[#B99568]/40 p-8 md:p-14 shadow-2xl rounded-sm backdrop-blur-sm">
          {/* Inner hairline border */}
          <div className="absolute inset-3 border border-[#B99568]/20 pointer-events-none" />

          {/* Corner Flourishes */}
          <div className="absolute top-2 left-2 text-[#B99568] text-xs font-serif select-none">✦</div>
          <div className="absolute top-2 right-2 text-[#B99568] text-xs font-serif select-none">✦</div>
          <div className="absolute bottom-2 left-2 text-[#B99568] text-xs font-serif select-none">✦</div>
          <div className="absolute bottom-2 right-2 text-[#B99568] text-xs font-serif select-none">✦</div>

          {/* Top Skip / Sound Controls */}
          <div className="flex justify-between items-center mb-8 text-xs tracking-widest text-[#765D49]/70 uppercase">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#68705A] animate-ping" />
              Jamnagar, Gujarat
            </span>
            <button
              onClick={handleComplete}
              className="text-[#765D49] hover:text-[#24364B] transition-colors underline underline-offset-4 decoration-[#B99568] font-medium cursor-pointer"
            >
              Skip Intro
            </button>
          </div>

          {/* Central Animated Calligraphy Header */}
          <div className="text-center my-6">
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-xs md:text-sm tracking-[0.25em] text-[#68705A] uppercase font-medium mb-3"
            >
              EST. 2024 · 5TH FLOOR TERRACE
            </motion.p>

            {/* Hand-Written SVG Calligraphy Animation */}
            <div className="relative my-4 flex justify-center items-center py-2">
              <svg
                viewBox="0 0 760 170"
                className="w-full max-w-[580px] h-auto drop-shadow-sm select-none"
              >
                {/* Shadow/Ghost baseline */}
                <text
                  x="50%"
                  y="110"
                  textAnchor="middle"
                  className="font-script text-7xl md:text-8xl fill-none stroke-[#E9DDC9]/60"
                  strokeWidth="1.5"
                  style={{ fontFamily: "'Alex Brush', cursive" }}
                >
                  Jam Sham Rooftop
                </text>

                {/* Animated Inked Calligraphy Stroke */}
                <text
                  x="50%"
                  y="110"
                  textAnchor="middle"
                  className="font-script text-7xl md:text-8xl fill-[#24364B]"
                  style={{
                    fontFamily: "'Alex Brush', cursive",
                    stroke: '#24364B',
                    strokeWidth: '1.2px',
                    strokeDasharray: '600',
                    strokeDashoffset: Math.max(0, 600 - (writtenProgress / 100) * 600),
                    transition: 'stroke-dashoffset 0.08s ease-out, fill 0.8s ease-in',
                    fillOpacity: writtenProgress > 65 ? (writtenProgress - 65) / 35 : 0,
                  }}
                >
                  Jam Sham Rooftop
                </text>
              </svg>
            </div>

            {/* Gold Divider with Botanical / Star Flourish */}
            <div className="flex items-center justify-center gap-3 my-4">
              <div className="h-[1px] w-16 bg-[#B99568]/40" />
              <div className="text-[#B99568] text-sm">✦</div>
              <div className="h-[1px] w-16 bg-[#B99568]/40" />
            </div>

            {/* Sub-tagline with refined Old Money Serif */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: writtenProgress > 40 ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              className="font-serif italic text-lg md:text-xl text-[#765D49] max-w-md mx-auto"
            >
              "Good Food · Great Chai · Rooftop Vibes"
            </motion.p>
          </div>

          {/* Bottom Progress & Action Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#B99568]/20">
            {/* Writing Progress Indicator */}
            <div className="w-full sm:w-48 bg-[#E9DDC9]/50 h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#24364B] h-full transition-all duration-150 ease-out"
                style={{ width: `${writtenProgress}%` }}
              />
            </div>

            {/* Enter Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              className="w-full sm:w-auto px-7 py-2.5 bg-[#24364B] text-[#FFFDF8] hover:bg-[#68705A] transition-colors rounded-sm text-xs md:text-sm font-medium tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Step Onto The Rooftop</span>
              <ArrowRight className="w-4 h-4 text-[#B99568]" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
