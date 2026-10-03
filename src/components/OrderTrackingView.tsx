import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Utensils,
  Truck,
  Store,
  Phone,
  MessageCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';

export const OrderTrackingView: React.FC = () => {
  const { orders, getOrderById, storeSettings, setCurrentView } = useApp();
  const [searchInput, setSearchInput] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    return orders.length > 0 ? orders[0] : null;
  });
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    if (!searchInput.trim()) return;
    const found = getOrderById(searchInput);
    setActiveOrder(found || null);
  };

  const statuses: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'new', label: 'Order Received', desc: 'Received at Jam Sham rooftop counter' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Kitchen supervisor approved your order' },
    { key: 'preparing', label: 'Preparing', desc: 'Chefs are cooking your fresh comfort food' },
    {
      key: 'ready',
      label: activeOrder?.orderType === 'delivery' ? 'Out For Delivery' : 'Ready to Serve',
      desc: activeOrder?.orderType === 'delivery' ? 'Rider is on the way in Jamnagar' : 'Being served to your table / pickup counter',
    },
    { key: 'completed', label: 'Completed', desc: 'Enjoy your rooftop meal & great vibes!' },
  ];

  const getStatusIndex = (status: OrderStatus) => {
    return statuses.findIndex((s) => s.key === status);
  };

  const handleWhatsApp = () => {
    if (!activeOrder) return;
    const text = encodeURIComponent(
      `Hello Jam Sham Rooftop Cafe! I am tracking my order ${activeOrder.id}. Current status query.`
    );
    window.open(`https://wa.me/${storeSettings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="py-12 bg-[#F7F2E8] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#68705A] font-semibold mb-2">
            LIVE KITCHEN DISPATCH
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24364B]">
            Track Your Order
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#765D49]">
            Enter your order reference code (e.g. <span className="font-mono font-bold text-[#24364B]">JSR-1048</span>) or your 10-digit mobile number.
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
          <div className="flex gap-2 p-1.5 bg-[#FFFDF8] border border-[#B99568]/50 rounded-sm shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#765D49]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. JSR-1048) or Phone..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-transparent text-[#24364B] focus:outline-none uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Track
            </button>
          </div>
        </form>

        {/* Order Details Card */}
        {activeOrder ? (
          <div className="bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm shadow-md overflow-hidden animate-fadeIn">
            {/* Top Bar */}
            <div className="p-6 bg-[#24364B] text-[#FFFDF8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#B99568] font-bold">
                  Order Tracking Details
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-2xl font-bold font-mono">
                    {activeOrder.id}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FFFDF8]/20 text-[#E9DDC9]">
                    {activeOrder.orderType === 'dine_in'
                      ? `Table ${activeOrder.tableNumber}`
                      : activeOrder.orderType.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <div className="text-xs text-[#E9DDC9]">Customer</div>
                <div className="text-sm font-semibold">{activeOrder.customerName}</div>
                <div className="text-[11px] text-white/70">{activeOrder.phone}</div>
              </div>
            </div>

            {/* Timeline Progress */}
            <div className="p-6 sm:p-8 border-b border-[#E9DDC9]">
              <h3 className="text-xs uppercase tracking-widest text-[#765D49] font-bold mb-6">
                Progress Status
              </h3>

              <div className="space-y-6">
                {statuses.map((step, idx) => {
                  const currentIdx = getStatusIndex(activeOrder.orderStatus);
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      {/* Icon / Bullet */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-[#24364B] text-white'
                              : isCurrent
                              ? 'bg-[#B99568] text-white ring-4 ring-[#B99568]/30 animate-pulse'
                              : 'bg-[#E9DDC9] text-[#765D49]'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        {idx < statuses.length - 1 && (
                          <div
                            className={`w-0.5 h-10 my-1 ${
                              idx < currentIdx ? 'bg-[#24364B]' : 'bg-[#E9DDC9]'
                            }`}
                          />
                        )}
                      </div>

                      {/* Step Text */}
                      <div className="pt-0.5">
                        <div
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-[#24364B] text-base'
                              : isDone
                              ? 'text-[#24364B]'
                              : 'text-[#765D49]/60'
                          }`}
                        >
                          {step.label}
                        </div>
                        <div className="text-xs text-[#765D49]">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items & Financials */}
            <div className="p-6 bg-[#F7F2E8]/60 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#24364B] mb-3">
                  Items In This Order
                </h4>
                <div className="space-y-2 text-xs">
                  {activeOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-[#E9DDC9]/40">
                      <span>
                        <span className="font-semibold text-[#24364B]">{item.name}</span>{' '}
                        <span className="text-[#765D49]">× {item.quantity}</span>
                      </span>
                      <span className="font-mono font-medium text-[#24364B]">
                        ₹{item.itemTotal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 border border-[#E9DDC9] rounded-sm space-y-1.5 text-xs">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#24364B] mb-2">
                  Order Summary
                </h4>
                <div className="flex justify-between text-[#765D49]">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{activeOrder.subtotal}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-mono">-₹{activeOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#765D49]">
                  <span>GST Taxes</span>
                  <span className="font-mono">₹{activeOrder.tax}</span>
                </div>
                {activeOrder.deliveryFee > 0 && (
                  <div className="flex justify-between text-[#765D49]">
                    <span>Delivery Fee</span>
                    <span className="font-mono">₹{activeOrder.deliveryFee}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#E9DDC9] flex justify-between font-bold text-sm text-[#24364B]">
                  <span>Total Amount</span>
                  <span className="font-mono text-base">₹{activeOrder.total}</span>
                </div>
                <div className="text-[10px] text-[#68705A] uppercase tracking-wider pt-1">
                  Payment Status: {activeOrder.paymentStatus.toUpperCase()} ({activeOrder.paymentMethod.toUpperCase()})
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="p-4 bg-[#FFFDF8] border-t border-[#E9DDC9] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Cafe</span>
                </button>
                <a
                  href={`tel:${storeSettings.phone}`}
                  className="px-4 py-2 border border-[#24364B] hover:bg-[#24364B] hover:text-[#FFFDF8] text-[#24364B] rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors no-underline"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>
              </div>

              <button
                onClick={() => {
                  setCurrentView('menu');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="text-xs font-semibold uppercase text-[#24364B] hover:text-[#68705A] underline cursor-pointer"
              >
                Order More Comfort Food →
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-8">
            <HelpCircle className="w-12 h-12 text-[#B99568] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl font-bold text-[#24364B]">
              {searched ? 'No order found with this ID' : 'Search for your order above'}
            </h3>
            <p className="mt-1 text-xs text-[#765D49] max-w-sm mx-auto">
              Please check the Order ID received in your confirmation screen or WhatsApp message (e.g. JSR-1048).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
