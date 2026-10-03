import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Clock,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  Bell,
  Volume2,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus, Order } from '../types';

export const KitchenDisplayView: React.FC = () => {
  const { orders, updateOrderStatus, playChime, setCurrentView } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'dine_in' | 'takeaway' | 'delivery'>('all');

  const columns: { status: OrderStatus; title: string; color: string }[] = [
    { status: 'new', title: '1. NEW ORDERS', color: 'border-amber-400 bg-amber-500/10' },
    { status: 'confirmed', title: '2. CONFIRMED', color: 'border-blue-400 bg-blue-500/10' },
    { status: 'preparing', title: '3. IN KITCHEN', color: 'border-orange-400 bg-orange-500/10' },
    { status: 'ready', title: '4. READY / DISPATCH', color: 'border-emerald-500 bg-emerald-500/10' },
    { status: 'completed', title: '5. COMPLETED', color: 'border-gray-400 bg-gray-500/10' },
  ];

  const filteredOrders = orders.filter((o) => {
    if (filterType === 'all') return true;
    return o.orderType === filterType;
  });

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'new':
        return 'confirmed';
      case 'confirmed':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'completed';
      default:
        return null;
    }
  };

  const handleAdvance = (orderId: string, current: OrderStatus) => {
    const next = getNextStatus(current);
    if (next) {
      updateOrderStatus(orderId, next);
    }
  };

  const getTimeAgo = (isoString: string) => {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff === 1) return '1 min ago';
    return `${diff} mins ago`;
  };

  return (
    <div className="min-h-screen bg-[#1E293B] text-[#F8FAFC] p-4 sm:p-6 select-none">
      {/* Top Bar for Kitchen Display */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#B99568] text-[#1E293B] flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white flex items-center gap-2">
              Jam Sham Rooftop · Kitchen Display (KDS)
            </h1>
            <p className="text-xs text-slate-400">
              Live order routing for 5th Floor Terrace, Takeaway & Delivery
            </p>
          </div>
        </div>

        {/* Filter & Exit Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-800 p-1 rounded-sm flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-[#B99568] text-[#1E293B] font-bold' : 'text-slate-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('dine_in')}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
                filterType === 'dine_in' ? 'bg-[#B99568] text-[#1E293B] font-bold' : 'text-slate-300'
              }`}
            >
              Dine-In
            </button>
            <button
              onClick={() => setFilterType('takeaway')}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
                filterType === 'takeaway' ? 'bg-[#B99568] text-[#1E293B] font-bold' : 'text-slate-300'
              }`}
            >
              Takeaway
            </button>
            <button
              onClick={() => setFilterType('delivery')}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
                filterType === 'delivery' ? 'bg-[#B99568] text-[#1E293B] font-bold' : 'text-slate-300'
              }`}
            >
              Delivery
            </button>
          </div>

          <button
            onClick={playChime}
            title="Test Kitchen Bell"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-[#B99568] rounded-sm cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs rounded-sm text-slate-200 cursor-pointer"
          >
            Back to Cafe Site
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
        {columns.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.orderStatus === col.status);

          return (
            <div
              key={col.status}
              className="bg-slate-900/80 border border-slate-800 rounded-sm flex flex-col h-[calc(100vh-140px)] min-w-[260px]"
            >
              {/* Column Header */}
              <div className={`p-3 border-b border-l-4 font-bold text-xs uppercase flex items-center justify-between ${col.color}`}>
                <span className="text-white tracking-wider">{col.title}</span>
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[11px] font-mono">
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards Container */}
              <div className="p-2.5 overflow-y-auto flex-1 space-y-3">
                {colOrders.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs italic">
                    No orders in this column
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const nextStatus = getNextStatus(order.orderStatus);

                    return (
                      <div
                        key={order.id}
                        className="bg-slate-800 border border-slate-700 rounded-sm p-3 shadow-md hover:border-slate-500 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono font-bold text-sm text-[#E2E8F0]">
                              {order.id}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              {getTimeAgo(order.createdAt)}
                            </span>
                          </div>

                          {/* Customer & Dining Type */}
                          <div className="mb-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-white">
                                {order.customerName}
                              </span>
                              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-700 text-[#B99568]">
                                {order.orderType === 'dine_in'
                                  ? `Table #${order.tableNumber}`
                                  : order.orderType}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {order.phone}
                            </span>
                          </div>

                          {/* Items List */}
                          <div className="p-2 bg-slate-900/60 rounded-xs space-y-1.5 mb-3 text-xs divide-y divide-slate-800">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="pt-1 first:pt-0">
                                <div className="flex justify-between font-medium text-slate-200">
                                  <span>{item.name}</span>
                                  <span className="font-bold font-mono text-[#B99568]">
                                    ×{item.quantity}
                                  </span>
                                </div>
                                {item.customizations && item.customizations.length > 0 && (
                                  <div className="text-[10px] text-amber-300/80">
                                    {item.customizations.map((c) => c.name).join(', ')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Notes */}
                          {order.notes && (
                            <div className="text-[10px] bg-amber-950/40 border border-amber-800/60 text-amber-200 p-1.5 rounded-xs mb-3">
                              Note: {order.notes}
                            </div>
                          )}
                        </div>

                        {/* Card Advance Action Button */}
                        {nextStatus && (
                          <button
                            onClick={() => handleAdvance(order.id, order.orderStatus)}
                            className="w-full mt-2 py-2 px-3 bg-[#B99568] hover:bg-[#a37f52] text-[#1E293B] font-bold rounded-xs text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>Move to {nextStatus.toUpperCase()}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
