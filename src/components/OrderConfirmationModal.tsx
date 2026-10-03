import React from 'react';
import {
  CheckCircle,
  X,
  Phone,
  MessageCircle,
  Compass,
  ArrowRight,
  Clock,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderConfirmationModal: React.FC = () => {
  const { confirmedOrder, setConfirmedOrder, storeSettings, setCurrentView } = useApp();

  if (!confirmedOrder) return null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Jam Sham Rooftop Cafe! I placed an order ${confirmedOrder.id} for ₹${confirmedOrder.total}. Please confirm status.`
    );
    window.open(`https://wa.me/${storeSettings.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleTrackClick = () => {
    setConfirmedOrder(null);
    setCurrentView('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statuses = [
    { key: 'new', label: 'Order Received' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: confirmedOrder.orderType === 'delivery' ? 'Out for Delivery' : 'Ready' },
    { key: 'completed', label: 'Completed' },
  ];

  const currentStatusIndex = statuses.findIndex(
    (s) => s.key === confirmedOrder.orderStatus
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#FFFDF8] border border-[#B99568]/40 shadow-2xl rounded-sm overflow-hidden my-8 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => setConfirmedOrder(null)}
          className="absolute top-4 right-4 z-10 text-[#765D49] hover:text-[#24364B] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Celebration Banner */}
        <div className="p-8 text-center bg-[#24364B] text-[#FFFDF8] relative overflow-hidden">
          <div className="w-14 h-14 rounded-full bg-[#B99568]/20 border border-[#B99568] flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-[#B99568]" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#B99568] font-bold">
            ORDER CONFIRMED ✓
          </span>
          <h2 className="font-serif text-3xl font-bold mt-1">
            Thank You, {confirmedOrder.customerName}
          </h2>
          <p className="mt-1 text-xs text-[#E9DDC9]/90 max-w-sm mx-auto">
            Your evening order is received and our rooftop kitchen team is already on it!
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-5">
          {/* Order ID & Type Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E9DDC9]">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#765D49]">
                Order Reference
              </span>
              <div className="text-xl font-bold font-mono text-[#24364B]">
                {confirmedOrder.id}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#765D49]">
                Service Type
              </span>
              <div className="text-sm font-bold text-[#68705A] uppercase">
                {confirmedOrder.orderType === 'dine_in'
                  ? `Dine-In (Table ${confirmedOrder.tableNumber})`
                  : confirmedOrder.orderType === 'takeaway'
                  ? 'Takeaway Pickup'
                  : 'Home Delivery'}
              </div>
            </div>
          </div>

          {/* Status Progression Bar */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#24364B] mb-2 flex items-center justify-between">
              <span>Live Order Status</span>
              <span className="text-[11px] text-[#B99568] font-mono capitalize">
                {confirmedOrder.orderStatus}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-center">
              {statuses.map((s, idx) => {
                const isPassed = idx <= (currentStatusIndex >= 0 ? currentStatusIndex : 0);
                const isCurrent = idx === currentStatusIndex;
                return (
                  <div key={s.key} className="flex flex-col items-center">
                    <div
                      className={`w-full h-1.5 rounded-full mb-1.5 transition-all ${
                        isPassed ? 'bg-[#24364B]' : 'bg-[#E9DDC9]'
                      } ${isCurrent ? 'ring-2 ring-[#B99568]' : ''}`}
                    />
                    <span
                      className={`text-[9px] font-medium leading-tight ${
                        isPassed ? 'text-[#24364B] font-bold' : 'text-[#765D49]/60'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary */}
          <div className="p-3.5 bg-[#F7F2E8] border border-[#E9DDC9] rounded-sm">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#765D49] mb-2">
              Ordered Items
            </div>
            <div className="space-y-1.5 text-xs">
              {confirmedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-[#24364B]">
                  <span>
                    {it.name} <span className="text-[#765D49]">× {it.quantity}</span>
                  </span>
                  <span className="font-mono tabular-nums font-medium">₹{it.itemTotal}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#E9DDC9] flex justify-between font-bold text-sm text-[#24364B]">
                <span>Total Paid / Payable</span>
                <span className="font-mono">₹{confirmedOrder.total}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={handleTrackClick}
              className="py-2.5 px-3 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] rounded-sm text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Track My Order</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B99568]" />
            </button>

            <button
              onClick={handleWhatsApp}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Cafe</span>
            </button>

            <a
              href={`tel:${storeSettings.phone}`}
              className="py-2.5 px-3 border border-[#24364B] hover:bg-[#24364B] hover:text-[#FFFDF8] text-[#24364B] rounded-sm text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors no-underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Kitchen</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
