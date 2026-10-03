import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Users,
  Compass,
  Sparkles,
  Phone,
  User,
  Mail,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Heart,
  PartyPopper,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TableBooking } from '../types';

export const TableBookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    addBooking,
    confirmedBooking,
    setConfirmedBooking,
    storeSettings,
  } = useApp();

  const [dateOption, setDateOption] = useState<'Tonight' | 'Tomorrow' | 'Custom'>('Tonight');
  const [customDate, setCustomDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('8:00 PM');
  const [guestsCount, setGuestsCount] = useState(4);
  const [seatingPreference, setSeatingPreference] = useState<
    'terrace_edge' | 'cozy_corner' | 'family_lounge' | 'open_deck'
  >('terrace_edge');
  const [occasion, setOccasion] = useState<
    'birthday' | 'anniversary' | 'casual_hangout' | 'reunion' | 'other'
  >('casual_hangout');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isBookingModalOpen) return null;

  const timeSlots = [
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
    '9:30 PM',
    '10:00 PM',
    '10:30 PM',
    '11:00 PM',
    '11:30 PM',
    '12:00 AM',
    '1:00 AM',
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    const selectedBookingDate =
      dateOption === 'Custom' ? customDate || 'Upcoming date' : dateOption;

    addBooking({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      guestsCount,
      bookingDate: selectedBookingDate,
      bookingTime: timeSlot,
      seatingPreference,
      occasion,
      specialRequests: specialRequests.trim() || undefined,
    });
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setConfirmedBooking(null);
  };

  const handleWhatsAppBookingConfirm = (booking: TableBooking) => {
    const text = encodeURIComponent(
      `Hello Jam Sham Rooftop Cafe! I booked a terrace table:\nBooking ID: ${booking.id}\nName: ${booking.customerName}\nDate: ${booking.bookingDate} at ${booking.bookingTime}\nGuests: ${booking.guestsCount} people\nPreference: ${booking.seatingPreference}`
    );
    window.open(`https://wa.me/${storeSettings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#FFFDF8] border border-[#B99568]/50 shadow-2xl rounded-sm overflow-hidden my-8 animate-fadeIn">
        {/* Header */}
        <div className="p-6 bg-[#24364B] text-[#FFFDF8] relative overflow-hidden flex items-start justify-between">
          <div className="relative z-10">
            <span className="text-[10px] tracking-[0.25em] text-[#B99568] uppercase font-bold">
              5TH FLOOR TERRACE RESERVATIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-0.5">
              Book Your Rooftop Table
            </h2>
            <p className="text-xs text-[#E9DDC9]/90 mt-1 max-w-md">
              Secure your evening table under the stars with cool breezes, sunset views over Jamnagar, and pure comfort food.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-sm text-[#E9DDC9] hover:text-white transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {confirmedBooking ? (
          <div className="p-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#B99568]/20 border border-[#B99568] flex items-center justify-center mx-auto text-[#24364B]">
              <CheckCircle2 className="w-9 h-9 text-[#B99568]" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#68705A] font-bold">
                TABLE RESERVED SUCCESSFULLY
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#24364B] mt-1">
                We're Ready For You, {confirmedBooking.customerName}!
              </h3>
              <p className="text-xs text-[#765D49] mt-1 max-w-md mx-auto">
                Your table request has been received by the rooftop manager. Your booking code is below.
              </p>
            </div>

            {/* Booking Card Details */}
            <div className="p-5 bg-[#F7F2E8] border border-[#E9DDC9] rounded-sm max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#E9DDC9]">
                <span className="text-[#765D49] font-medium">Reservation Code:</span>
                <span className="font-mono text-base font-bold text-[#24364B]">
                  {confirmedBooking.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#765D49]">Date & Time:</span>
                <span className="font-semibold text-[#24364B]">
                  {confirmedBooking.bookingDate} at {confirmedBooking.bookingTime}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#765D49]">Party Size:</span>
                <span className="font-semibold text-[#24364B]">
                  {confirmedBooking.guestsCount} Guests
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#765D49]">Seating Preference:</span>
                <span className="font-semibold text-[#68705A] capitalize">
                  {confirmedBooking.seatingPreference?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#765D49]">Status:</span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs uppercase text-[10px]">
                  {confirmedBooking.status}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleWhatsAppBookingConfirm(confirmedBooking)}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send to WhatsApp Cafe</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#24364B] hover:bg-[#68705A] text-white rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
            {formError && (
              <div className="p-3 bg-[#6E3030]/10 border border-[#6E3030]/30 text-[#6E3030] rounded-sm text-xs font-medium">
                {formError}
              </div>
            )}

            {/* 1. Date & Time Selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#24364B] mb-2">
                1. Select Reservation Date & Time
              </label>

              {/* Date quick pills */}
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                {(['Tonight', 'Tomorrow', 'Custom'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDateOption(opt)}
                    className={`py-2 px-3 border rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                      dateOption === opt
                        ? 'bg-[#24364B] text-white border-[#24364B]'
                        : 'bg-white text-[#765D49] border-[#E9DDC9] hover:border-[#B99568]'
                    }`}
                  >
                    {opt === 'Tonight'
                      ? '🌙 Tonight'
                      : opt === 'Tomorrow'
                      ? '☀️ Tomorrow'
                      : '📅 Pick Date'}
                  </button>
                ))}
              </div>

              {dateOption === 'Custom' && (
                <input
                  type="date"
                  required
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full mb-3 px-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs text-[#24364B]"
                />
              )}

              {/* Time Slots Chips */}
              <div>
                <span className="text-[11px] text-[#765D49] block mb-1.5 font-medium">
                  Rooftop Evening Time Slot (Open 5:00 PM – 3:00 AM)
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-[#F7F2E8] border border-[#E9DDC9] rounded-sm">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`px-2.5 py-1 text-xs rounded-xs border transition-colors cursor-pointer ${
                        timeSlot === slot
                          ? 'bg-[#B99568] text-[#24364B] font-bold border-[#B99568]'
                          : 'bg-white text-[#765D49] border-[#E9DDC9] hover:border-[#B99568]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Number of Guests & Seating Preference */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#24364B] mb-2">
                2. Guests & Terrace Preference
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Number of Guests */}
                <div>
                  <label className="block text-xs text-[#765D49] mb-1">
                    Number of Guests: <span className="font-bold text-[#24364B]">{guestsCount} People</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[2, 4, 6, 8, 10, 12].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestsCount(num)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-sm border transition-colors cursor-pointer ${
                          guestsCount === num
                            ? 'bg-[#24364B] text-white border-[#24364B]'
                            : 'bg-white text-[#765D49] border-[#E9DDC9] hover:border-[#B99568]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seating Preference */}
                <div>
                  <label className="block text-xs text-[#765D49] mb-1">
                    Terrace Area Preference
                  </label>
                  <select
                    value={seatingPreference}
                    onChange={(e) => setSeatingPreference(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs text-[#24364B]"
                  >
                    <option value="terrace_edge">🌟 Terrace Edge (Skyline & Street View)</option>
                    <option value="cozy_corner">🏮 Cozy Corner (Quiet & Lantern lit)</option>
                    <option value="family_lounge">👨‍👩‍👧 Family Lounge (Spacious Comfort)</option>
                    <option value="open_deck">🌿 Open Sky Deck (Open Air Stars)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Occasion */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#24364B] mb-2">
                3. Occasion / Celebration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'casual_hangout', label: '☕ Chill Hangout' },
                  { id: 'birthday', label: '🎂 Birthday Party' },
                  { id: 'anniversary', label: '🌹 Anniversary' },
                  { id: 'reunion', label: '🎉 Friends Reunion' },
                ].map((occ) => (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setOccasion(occ.id as any)}
                    className={`py-2 px-2 text-xs font-semibold rounded-sm border transition-colors cursor-pointer text-center ${
                      occasion === occ.id
                        ? 'bg-[#24364B] text-white border-[#24364B]'
                        : 'bg-white text-[#765D49] border-[#E9DDC9] hover:border-[#B99568]'
                    }`}
                  >
                    {occ.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Contact Details */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#24364B] mb-2">
                4. Primary Guest Contact Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#765D49] mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#765D49]" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Yashpal Singh"
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
                      placeholder="e.g. 98251 12345"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs text-[#24364B] focus:outline-none focus:border-[#B99568]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs text-[#765D49] mb-1">
                  Special Arrangements / Cooking Requests (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Arranging birthday cake with sparklers, table overlooking road"
                  className="w-full px-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs text-[#24364B] focus:outline-none focus:border-[#B99568]"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] rounded-sm text-xs sm:text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Confirm Rooftop Table Reservation</span>
              <ArrowRight className="w-4 h-4 text-[#B99568]" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
