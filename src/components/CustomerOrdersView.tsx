import React from 'react';
import { ShoppingBag, ArrowRight, RotateCcw, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const CustomerOrdersView: React.FC = () => {
  const { orders, addToCart, menuItems, setIsCartOpen, setCurrentView, setConfirmedOrder } =
    useApp();

  const handleReorder = (order: Order) => {
    // Add all items in this order to the cart
    order.items.forEach((ordItem) => {
      const match = menuItems.find((m) => m.id === ordItem.menuItemId);
      if (match) {
        addToCart(match, ordItem.customizations, ordItem.quantity);
      }
    });
    setIsCartOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setConfirmedOrder(order);
  };

  return (
    <div className="py-12 bg-[#F7F2E8] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#68705A] font-semibold mb-2">
            YOUR EVENINGS RECORDED
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24364B]">
            Your Previous Orders
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#765D49]">
            Reorder your favourite cold coffees, pizzas and late-night snacks with a single click.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-8">
            <ShoppingBag className="w-12 h-12 text-[#B99568] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl font-bold text-[#24364B]">
              You haven't placed an order yet.
            </h3>
            <p className="mt-1 text-xs text-[#765D49] max-w-sm mx-auto">
              Our rooftop menu is filled with delicious comfort food and fresh kulhad chai waiting for you.
            </p>
            <button
              onClick={() => {
                setCurrentView('menu');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="mt-6 px-6 py-2.5 bg-[#24364B] hover:bg-[#68705A] text-white rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm text-[#24364B]">
                      {order.id}
                    </span>
                    <span className="text-[10px] text-[#765D49]">·</span>
                    <span className="text-xs text-[#765D49]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs bg-[#F7F2E8] text-[#68705A] border border-[#E9DDC9]">
                      {order.orderType === 'dine_in'
                        ? `Table ${order.tableNumber}`
                        : order.orderType}
                    </span>
                  </div>

                  <div className="text-xs text-[#24364B] font-medium space-x-1">
                    {order.items.map((it, idx) => (
                      <span key={idx}>
                        {it.name} (×{it.quantity})
                        {idx < order.items.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 text-xs font-bold text-[#24364B] font-mono">
                    Total: ₹{order.total} ·{' '}
                    <span className="text-emerald-700 capitalize">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="px-3 py-2 border border-[#24364B] hover:bg-[#24364B] hover:text-white rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-4 py-2 bg-[#24364B] hover:bg-[#68705A] text-white rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#B99568]" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
