import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    setCurrentView,
    storeSettings,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(
    null
  );

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
        discountAmount = appliedCoupon.maxDiscount;
      }
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  // Tax 5%
  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const tax = Math.round((taxableAmount * storeSettings.taxPercentage) / 100);

  // Delivery estimation (shown in cart, final delivery fee configured in checkout depending on order type)
  const estimatedTotal = taxableAmount + tax;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF8] border-l border-[#B99568]/40 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#E9DDC9] flex items-center justify-between bg-[#F7F2E8]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#24364B]" />
              <h2 className="font-serif text-xl font-bold text-[#24364B]">
                Your Evening Order
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-sm text-[#765D49] hover:text-[#24364B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#E9DDC9]/50 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-[#765D49]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#24364B]">
                Your cart is waiting for something delicious.
              </h3>
              <p className="mt-2 text-xs text-[#765D49] max-w-xs">
                Explore our sunset cold coffees, cheesy fries, sizzlers or freshly brewed chai.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentView('menu');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="mt-6 px-6 py-2.5 bg-[#24364B] text-[#FFFDF8] hover:bg-[#68705A] transition-colors rounded-sm text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#E9DDC9]/60">
                {cart.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-sm bg-[#E9DDC9]/40 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-bold text-[#24364B] truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#765D49] hover:text-[#6E3030] p-0.5 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customizations Tag */}
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.customizations.map((c, i) => (
                            <span
                              key={i}
                              className="text-[10px] text-[#765D49] bg-[#F7F2E8] border border-[#E9DDC9] px-1.5 py-0.5 rounded-xs"
                            >
                              +{c.name} (₹{c.price})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quantity & Item Total */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-[#E9DDC9] rounded-sm bg-white overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-1 text-[#24364B] hover:bg-[#F7F2E8] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#24364B] font-mono tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-1 text-[#24364B] hover:bg-[#F7F2E8] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs font-bold text-[#24364B] font-mono tabular-nums">
                          ₹{item.itemTotal}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="p-4 bg-[#F7F2E8] border-t border-[#E9DDC9]">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-sm text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-emerald-800 font-mono">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-emerald-700">
                        (-₹{discountAmount})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-800 hover:text-emerald-950 font-semibold uppercase text-[10px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon (e.g. WELCOME10)"
                      className="flex-1 px-3 py-1.5 bg-white border border-[#E9DDC9] rounded-sm text-xs font-mono uppercase focus:outline-none focus:border-[#B99568]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#24364B] text-[#FFFDF8] rounded-sm text-xs font-semibold uppercase cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponFeedback && (
                  <p
                    className={`mt-1.5 text-[11px] ${
                      couponFeedback.success ? 'text-emerald-600' : 'text-[#6E3030]'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Bill Details */}
              <div className="p-5 border-t border-[#E9DDC9] bg-[#FFFDF8] space-y-2 text-xs">
                <div className="flex justify-between text-[#765D49]">
                  <span>Item Subtotal</span>
                  <span className="font-mono tabular-nums">₹{cartSubtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span className="font-mono tabular-nums">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#765D49]">
                  <span>GST Taxes ({storeSettings.taxPercentage}%)</span>
                  <span className="font-mono tabular-nums">₹{tax}</span>
                </div>

                <div className="pt-2 border-t border-[#E9DDC9] flex justify-between items-center text-sm font-bold text-[#24364B]">
                  <span>Estimated Total</span>
                  <span className="text-base font-mono tabular-nums text-[#24364B]">
                    ₹{estimatedTotal}
                  </span>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full mt-3 py-3 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] rounded-sm text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#B99568]" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
