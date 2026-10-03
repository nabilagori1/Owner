import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle,
  Truck,
  Store,
  UtensilsCrossed,
  Phone,
  User,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderType, PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    appliedCoupon,
    storeSettings,
    tables,
    selectedTable,
    setSelectedTable,
    createOrder,
  } = useApp();

  // Form states
  const [orderType, setOrderType] = useState<OrderType>(
    selectedTable ? 'dine_in' : 'dine_in'
  );
  const [tableNum, setTableNum] = useState<string>(selectedTable || '4');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('Within 20-30 mins');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('361008');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

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

  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const tax = Math.round((taxableAmount * storeSettings.taxPercentage) / 100);

  // Delivery charge rule
  let deliveryFee = 0;
  if (orderType === 'delivery') {
    if (cartSubtotal < storeSettings.freeDeliveryThreshold) {
      deliveryFee = storeSettings.deliveryFee;
    }
  }

  const grandTotal = taxableAmount + tax + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(null);

    // Validation
    if (!customerName.trim()) {
      setFormErrors('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setFormErrors('Please enter a valid 10-digit mobile number');
      return;
    }
    if (orderType === 'dine_in' && !tableNum) {
      setFormErrors('Please select your Rooftop Table number');
      return;
    }
    if (orderType === 'delivery' && !streetAddress.trim()) {
      setFormErrors('Please enter your delivery street address in Jamnagar');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCheckoutOpen(false);

      createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        orderType,
        tableNumber: orderType === 'dine_in' ? tableNum : undefined,
        pickupTime: orderType === 'takeaway' ? pickupTime : undefined,
        address:
          orderType === 'delivery'
            ? {
                street: streetAddress.trim(),
                landmark: landmark.trim(),
                pincode: pincode.trim(),
                city: 'Jamnagar',
              }
            : undefined,
        items: cart.map((ci) => ({
          menuItemId: ci.menuItemId,
          name: ci.name,
          price: ci.price,
          quantity: ci.quantity,
          customizations: ci.customizations,
          itemTotal: ci.itemTotal,
        })),
        subtotal: cartSubtotal,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        tax,
        deliveryFee,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod_counter' ? 'pending' : 'paid',
        orderStatus: 'new',
        notes: orderNotes.trim() || undefined,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#FFFDF8] border border-[#B99568]/40 shadow-2xl rounded-sm overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-[#24364B] text-[#FFFDF8] flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-widest text-[#B99568] uppercase font-bold">
              JAM SHAM ROOFTOP
            </span>
            <h2 className="font-serif text-2xl font-bold">Complete Your Order</h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 rounded-sm text-[#E9DDC9] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handlePlaceOrder} className="p-6 space-y-6">
          {formErrors && (
            <div className="p-3 bg-[#6E3030]/10 border border-[#6E3030]/30 text-[#6E3030] rounded-sm text-xs font-medium">
              {formErrors}
            </div>
          )}

          {/* 1. ORDER TYPE SELECTOR */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#24364B] mb-2">
              1. Select Dining Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`p-3 rounded-sm border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  orderType === 'dine_in'
                    ? 'bg-[#24364B] text-[#FFFDF8] border-[#24364B] shadow-xs'
                    : 'bg-white border-[#E9DDC9] text-[#765D49] hover:border-[#B99568]'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Dine-In
                </span>
                <span className="text-[10px] opacity-80">Rooftop Table</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`p-3 rounded-sm border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  orderType === 'takeaway'
                    ? 'bg-[#24364B] text-[#FFFDF8] border-[#24364B] shadow-xs'
                    : 'bg-white border-[#E9DDC9] text-[#765D49] hover:border-[#B99568]'
                }`}
              >
                <Store className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Takeaway
                </span>
                <span className="text-[10px] opacity-80">Self Pickup</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                disabled={!storeSettings.deliveryAvailable}
                className={`p-3 rounded-sm border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  orderType === 'delivery'
                    ? 'bg-[#24364B] text-[#FFFDF8] border-[#24364B] shadow-xs'
                    : 'bg-white border-[#E9DDC9] text-[#765D49] hover:border-[#B99568]'
                } ${!storeSettings.deliveryAvailable ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <Truck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Delivery
                </span>
                <span className="text-[10px] opacity-80">Jamnagar City</span>
              </button>
            </div>
          </div>

          {/* 2. ORDER SPECIFIC FIELDS */}
          <div className="p-4 bg-[#F7F2E8] border border-[#E9DDC9] rounded-sm space-y-4">
            {orderType === 'dine_in' && (
              <div>
                <label className="block text-xs font-semibold text-[#24364B] mb-1.5">
                  Select Your Rooftop Table Number *
                </label>
                <div className="flex flex-wrap gap-2">
                  {tables.map((tbl) => (
                    <button
                      key={tbl.id}
                      type="button"
                      onClick={() => setTableNum(tbl.number)}
                      className={`w-10 h-10 rounded-sm text-xs font-bold border transition-colors cursor-pointer ${
                        tableNum === tbl.number
                          ? 'bg-[#24364B] text-white border-[#24364B] shadow-xs'
                          : 'bg-white text-[#765D49] border-[#E9DDC9] hover:border-[#B99568]'
                      }`}
                    >
                      {tbl.number}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-[#765D49]">
                  Orders are served fresh right to your terrace table.
                </p>
              </div>
            )}

            {orderType === 'takeaway' && (
              <div>
                <label className="block text-xs font-semibold text-[#24364B] mb-1.5">
                  Expected Pickup Time
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs text-[#24364B] focus:outline-none focus:border-[#B99568]"
                >
                  <option value="Within 15-20 mins">Within 15–20 minutes</option>
                  <option value="Within 30-40 mins">Within 30–40 minutes</option>
                  <option value="In 1 hour">In 1 hour</option>
                  <option value="Later tonight">Later tonight (mention in notes)</option>
                </select>
              </div>
            )}

            {orderType === 'delivery' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#24364B] mb-1">
                    Street Address / Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. 302 Nilkanth Flats, Near Digjam Circle"
                    className="w-full px-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs text-[#24364B] focus:outline-none focus:border-[#B99568]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#24364B] mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Opp. City Hall"
                      className="w-full px-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs text-[#24364B] focus:outline-none focus:border-[#B99568]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#24364B] mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs text-[#24364B] focus:outline-none focus:border-[#B99568]"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-[#68705A]">
                  Free delivery for orders above ₹{storeSettings.freeDeliveryThreshold}. Otherwise ₹{storeSettings.deliveryFee}.
                </p>
              </div>
            )}
          </div>

          {/* 3. CUSTOMER CONTACT DETAILS */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#24364B] mb-2">
              2. Contact Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#765D49] mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#765D49]" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Siddharth Joshi"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs text-[#24364B] focus:outline-none focus:border-[#B99568]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#765D49] mb-1">Mobile Number (WhatsApp) *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#765D49]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98250 12345"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs text-[#24364B] focus:outline-none focus:border-[#B99568]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs text-[#765D49] mb-1">Special Cooking Requests / Notes</label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Less spicy, extra napkins, serve coffee extra hot"
                className="w-full px-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs text-[#24364B] focus:outline-none focus:border-[#B99568]"
              />
            </div>
          </div>

          {/* 4. PAYMENT METHOD */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#24364B] mb-2">
              3. Payment Option
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <label
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 border rounded-sm flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-[#24364B] text-white border-[#24364B]'
                    : 'bg-white text-[#765D49] border-[#E9DDC9] hover:border-[#B99568]'
                }`}
              >
                <QrCode className="w-5 h-5 text-[#B99568]" />
                <span className="text-[11px] font-bold">UPI / QR</span>
                <span className="text-[9px] opacity-80">GPay, PhonePe</span>
              </label>

              <label
                onClick={() => setPaymentMethod('card')}
                className={`p-3 border rounded-sm flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#24364B] text-white border-[#24364B]'
                    : 'bg-white text-[#765D49] border-[#E9DDC9] hover:border-[#B99568]'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#B99568]" />
                <span className="text-[11px] font-bold">Cards</span>
                <span className="text-[9px] opacity-80">Debit / Credit</span>
              </label>

              <label
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 border rounded-sm flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'bg-[#24364B] text-white border-[#24364B]'
                    : 'bg-white text-[#765D49] border-[#E9DDC9] hover:border-[#B99568]'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-[#B99568]" />
                <span className="text-[11px] font-bold">Net Banking</span>
                <span className="text-[9px] opacity-80">All Banks</span>
              </label>

              <label
                onClick={() => setPaymentMethod('cod_counter')}
                className={`p-3 border rounded-sm flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center transition-all ${
                  paymentMethod === 'cod_counter'
                    ? 'bg-[#24364B] text-white border-[#24364B]'
                    : 'bg-white text-[#765D49] border-[#E9DDC9] hover:border-[#B99568]'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#B99568]" />
                <span className="text-[11px] font-bold">Pay At Counter</span>
                <span className="text-[9px] opacity-80">Cash / Card</span>
              </label>
            </div>
          </div>

          {/* Bill Summary Strip */}
          <div className="p-4 bg-[#F7F2E8] border border-[#E9DDC9] rounded-sm space-y-1.5 text-xs">
            <div className="flex justify-between text-[#765D49]">
              <span>Items Total ({cart.length})</span>
              <span className="font-mono">₹{cartSubtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon ({appliedCoupon?.code})</span>
                <span className="font-mono">-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-[#765D49]">
              <span>GST ({storeSettings.taxPercentage}%)</span>
              <span className="font-mono">₹{tax}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="flex justify-between text-[#765D49]">
                <span>Delivery Charge</span>
                <span className="font-mono">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-[#E9DDC9] flex justify-between items-center text-sm font-bold text-[#24364B]">
              <span>Amount Payable</span>
              <span className="text-lg font-mono text-[#24364B]">₹{grandTotal}</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] rounded-sm text-xs sm:text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Securing Order with Jam Sham Kitchen...</span>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <span className="font-mono font-bold">(₹{grandTotal})</span>
                <ArrowRight className="w-4 h-4 text-[#B99568]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
