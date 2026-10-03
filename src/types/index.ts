export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  vegetarian: boolean;
  featured: boolean;
  customizationOptions?: CustomizationOption[];
  badge?: string;
  spicyLevel?: 0 | 1 | 2 | 3;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartCustomization {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart line item id
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customizations: CartCustomization[];
  itemTotal: number;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export type OrderStatus = 'new' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod_counter';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations: CartCustomization[];
  itemTotal: number;
}

export interface Order {
  id: string; // e.g. "JSR-1048"
  customerId?: string;
  customerName: string;
  phone: string;
  orderType: OrderType;
  tableNumber?: string;
  pickupTime?: string;
  address?: {
    street: string;
    landmark?: string;
    pincode: string;
    city: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
  active: boolean;
  expiry?: string;
}

export interface CafeTable {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  floor: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';

export interface TableBooking {
  id: string; // e.g. "TB-201"
  customerName: string;
  phone: string;
  email?: string;
  guestsCount: number;
  bookingDate: string; // e.g. "2026-10-04"
  bookingTime: string; // e.g. "19:30"
  tableNumber?: string;
  seatingPreference?: 'terrace_edge' | 'cozy_corner' | 'family_lounge' | 'open_deck';
  occasion?: 'birthday' | 'anniversary' | 'casual_hangout' | 'reunion' | 'other';
  specialRequests?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verifiedOrder: boolean;
  status: 'approved' | 'pending' | 'hidden';
}

export interface AdminCredentials {
  username: string;
  passwordHash: string;
  lastLogin?: string;
}

export interface StoreSettings {
  name: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  googleMapsUrl: string;
  isOpen: boolean;
  openingHoursDisplay: string;
  openingTime: string;
  closingTime: string;
  deliveryAvailable: boolean;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  taxPercentage: number; // 5% GST
  instagramHandle: string;
}
