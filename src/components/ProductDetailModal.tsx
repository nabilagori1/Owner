import React, { useState } from 'react';
import { X, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomizationOption } from '../types';

export const ProductDetailModal: React.FC = () => {
  const { activeModalProduct, setActiveModalProduct, addToCart } = useApp();
  const [selectedCustomizations, setSelectedCustomizations] = useState<CustomizationOption[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  if (!activeModalProduct) return null;

  const handleToggleCustomization = (opt: CustomizationOption) => {
    setSelectedCustomizations((prev) => {
      const exists = prev.some((c) => c.id === opt.id);
      if (exists) {
        return prev.filter((c) => c.id !== opt.id);
      } else {
        return [...prev, opt];
      }
    });
  };

  const customizationsTotal = selectedCustomizations.reduce((sum, c) => sum + c.price, 0);
  const unitPrice = activeModalProduct.price + customizationsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(activeModalProduct, selectedCustomizations, quantity);
    setActiveModalProduct(null);
    setSelectedCustomizations([]);
    setQuantity(1);
  };

  const handleClose = () => {
    setActiveModalProduct(null);
    setSelectedCustomizations([]);
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FFFDF8] border border-[#B99568]/40 shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#24364B] flex items-center justify-center shadow-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="relative h-56 sm:h-64 w-full bg-[#E9DDC9]/30 shrink-0">
          <img
            src={activeModalProduct.image}
            alt={activeModalProduct.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Vegetarian Badge & Category on top of image */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <div className="bg-white/95 p-1 rounded-xs border border-gray-200 shadow-xs">
              <div className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center p-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-white drop-shadow-md">
              100% Pure Vegetarian · {activeModalProduct.category}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#24364B]">
                {activeModalProduct.name}
              </h2>
              <p className="mt-1 text-sm text-[#765D49] leading-relaxed">
                {activeModalProduct.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-[#24364B] font-mono tabular-nums">
                ₹{activeModalProduct.price}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[#765D49]">
                Base Price
              </div>
            </div>
          </div>

          {/* Customization Options */}
          {activeModalProduct.customizationOptions &&
            activeModalProduct.customizationOptions.length > 0 && (
              <div className="mt-6 pt-5 border-t border-[#E9DDC9]">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-[#24364B] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B99568]" />
                  <span>Customise Your Dish</span>
                </h3>

                <div className="space-y-2.5">
                  {activeModalProduct.customizationOptions.map((opt) => {
                    const isChecked = selectedCustomizations.some((c) => c.id === opt.id);
                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleToggleCustomization(opt)}
                        className={`flex items-center justify-between p-3 rounded-sm border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#F7F2E8] border-[#24364B] shadow-xs'
                            : 'bg-white border-[#E9DDC9] hover:border-[#B99568]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-xs border flex items-center justify-center ${
                              isChecked
                                ? 'bg-[#24364B] border-[#24364B] text-white'
                                : 'border-[#765D49]/50'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-medium text-[#24364B]">
                            {opt.name}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#68705A] font-mono">
                          +{opt.price > 0 ? `₹${opt.price}` : 'Free'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
        </div>

        {/* Modal Footer with Quantity & Add to Cart */}
        <div className="p-4 sm:p-5 bg-[#F7F2E8] border-t border-[#E9DDC9] flex items-center justify-between gap-4 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center border border-[#B99568]/50 rounded-sm bg-white overflow-hidden shadow-xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-2.5 text-[#24364B] hover:bg-[#F7F2E8] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3.5 text-sm font-bold text-[#24364B] font-mono tabular-nums min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2.5 text-[#24364B] hover:bg-[#F7F2E8] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-6 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] rounded-sm text-xs sm:text-sm font-semibold tracking-wider uppercase flex items-center justify-between shadow-md transition-colors cursor-pointer"
          >
            <span>Add To Cart</span>
            <span className="font-mono tabular-nums font-bold">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
