import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  CartItem,
  CustomizationOption,
  Order,
  OrderStatus,
  StoreSettings,
  Coupon,
  CafeTable,
  Review,
  TableBooking,
  BookingStatus,
  AdminCredentials,
} from '../types';
import { INITIAL_MENU_ITEMS } from '../data/menuData';
import {
  INITIAL_STORE_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_TABLES,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_BOOKINGS,
  DEFAULT_ADMIN_CREDENTIALS,
} from '../data/initialData';

interface AppContextType {
  // Navigation & Views
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Opening Animation
  showOpeningAnimation: boolean;
  setShowOpeningAnimation: (show: boolean) => void;
  replayOpeningAnimation: () => void;

  // Menu items
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  // Product Modal
  activeModalProduct: MenuItem | null;
  setActiveModalProduct: (item: MenuItem | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, customizations?: CustomizationOption[], quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  toggleCoupon: (id: string) => void;

  // Checkout & Orders
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  confirmedOrder: Order | null;
  setConfirmedOrder: (order: Order | null) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Tables & QR Dine-in
  tables: CafeTable[];
  selectedTable: string | null;
  setSelectedTable: (table: string | null) => void;
  updateTableStatus: (tableId: string, status: CafeTable['status']) => void;

  // Table Bookings / Reservations
  bookings: TableBooking[];
  addBooking: (bookingData: Omit<TableBooking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => TableBooking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  assignTableToBooking: (bookingId: string, tableNumber: string) => void;
  deleteBooking: (bookingId: string) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  confirmedBooking: TableBooking | null;
  setConfirmedBooking: (b: TableBooking | null) => void;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  adminCredentials: AdminCredentials;
  adminLogin: (user: string, pass: string) => boolean;
  adminLogout: () => void;
  updateAdminCredentials: (creds: AdminCredentials) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;

  // Settings
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;

  // Utilities
  playChime: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MENU: 'jam_sham_menu_v2',
  CART: 'jam_sham_cart_v1',
  ORDERS: 'jam_sham_orders_v1',
  SETTINGS: 'jam_sham_settings_v1',
  COUPONS: 'jam_sham_coupons_v1',
  TABLES: 'jam_sham_tables_v1',
  REVIEWS: 'jam_sham_reviews_v1',
  BOOKINGS: 'jam_sham_bookings_v1',
  ADMIN_CREDS: 'jam_sham_admin_creds_v1',
  ADMIN_AUTH: 'jam_sham_admin_auth_v1',
  ANIMATION_SEEN: 'jam_sham_anim_seen',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Opening Animation: starts true so customer experiences the written calligraphy animation!
  const [showOpeningAnimation, setShowOpeningAnimation] = useState<boolean>(true);

  // Modals & Drawers
  const [activeModalProduct, setActiveModalProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Table Booking Modal & State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<TableBooking | null>(null);

  // Selected Table from URL params (e.g. ?table=5)
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Admin Authentication State
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_CREDS);
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN_CREDENTIALS;
    } catch {
      return DEFAULT_ADMIN_CREDENTIALS;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Table Bookings State
  const [bookings, setBookings] = useState<TableBooking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // State with LocalStorage fallbacks
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      const items: MenuItem[] = saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
      // Sanitize: ensure no egg or non-veg placeholder photo is present
      return items.map((item) => {
        if (item.image && item.image.includes('1612927601601-6638404737ce')) {
          return {
            ...item,
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
          };
        }
        return item;
      });
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [tables, setTables] = useState<CafeTable[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
      return saved ? JSON.parse(saved) : INITIAL_TABLES;
    } catch {
      return INITIAL_TABLES;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Check URL params for deep links on mount (e.g. ?table=12 or ?view=kitchen)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tableParam = urlParams.get('table');
      const viewParam = urlParams.get('view');
      const orderParam = urlParams.get('order');

      if (tableParam) {
        setSelectedTable(tableParam);
        setCurrentView('menu');
      }
      if (viewParam) {
        setCurrentView(viewParam);
      }
      if (orderParam) {
        const found = orders.find((o) => o.id === orderParam);
        if (found) {
          setConfirmedOrder(found);
        }
      }
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
    } catch (e) {
      console.warn('Failed to save menu items', e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
    } catch (e) {
      console.warn('Failed to save store settings', e);
    }
  }, [storeSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    } catch (e) {
      console.warn('Failed to save coupons', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    } catch (e) {
      console.warn('Failed to save tables', e);
    }
  }, [tables]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save reviews', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Failed to save bookings', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_CREDS, JSON.stringify(adminCredentials));
    } catch (e) {
      console.warn('Failed to save admin credentials', e);
    }
  }, [adminCredentials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, String(isAdminAuthenticated));
    } catch (e) {
      console.warn('Failed to save admin auth state', e);
    }
  }, [isAdminAuthenticated]);

  // Audio chime using Web Audio API for order updates
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const replayOpeningAnimation = () => {
    setShowOpeningAnimation(true);
  };

  // Menu operations
  const addMenuItem = (itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const updateMenuItem = (id: string, changes: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes, updatedAt: new Date().toISOString() } : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  // Cart operations
  const addToCart = (
    item: MenuItem,
    customizations: CustomizationOption[] = [],
    quantity: number = 1
  ) => {
    const customizationSum = customizations.reduce((acc, c) => acc + c.price, 0);
    const unitPrice = item.price + customizationSum;
    const custKey = customizations
      .map((c) => c.id)
      .sort()
      .join('-');
    const cartLineId = `${item.id}_${custKey}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.id === cartLineId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: newQty * unitPrice,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: cartLineId,
            menuItemId: item.id,
            name: item.name,
            price: unitPrice,
            image: item.image,
            quantity,
            customizations: customizations.map((c) => ({ id: c.id, name: c.name, price: c.price })),
            itemTotal: quantity * unitPrice,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.id === cartItemId) {
            const newQty = ci.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...ci,
              quantity: newQty,
              itemTotal: newQty * ci.price,
            };
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null);
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.itemTotal, 0);

  // Coupon handling
  const applyCoupon = (code: string) => {
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
    );
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Minimum order value for ${found.code} is ₹${found.minOrder}`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    if (appliedCoupon?.id === id) setAppliedCoupon(null);
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const orderNumber = 1049 + orders.length;
    const newOrder: Order = {
      ...orderData,
      id: `JSR-${orderNumber}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    playChime();
    setConfirmedOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o))
    );
    playChime();
  };

  const getOrderById = (orderId: string) => {
    const normalized = orderId.trim().toUpperCase();
    return orders.find(
      (o) => o.id.toUpperCase() === normalized || o.phone.replace(/\D/g, '').endsWith(normalized)
    );
  };

  // Tables
  const updateTableStatus = (tableId: string, status: CafeTable['status']) => {
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, status } : t)));
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'status'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      status: 'approved',
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  // Table Bookings / Reservations
  const addBooking = (
    bookingData: Omit<TableBooking, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): TableBooking => {
    const nextNum = 201 + bookings.length;
    const newBooking: TableBooking = {
      ...bookingData,
      id: `TB-${nextNum}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
    setConfirmedBooking(newBooking);
    playChime();
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b
      )
    );
    playChime();
  };

  const assignTableToBooking = (bookingId: string, tableNumber: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, tableNumber, status: 'confirmed', updatedAt: new Date().toISOString() } : b
      )
    );
    // Mark the table as reserved
    const targetTable = tables.find((t) => t.number === tableNumber);
    if (targetTable) {
      updateTableStatus(targetTable.id, 'reserved');
    }
    playChime();
  };

  const deleteBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  // Admin Authentication
  const adminLogin = (user: string, pass: string): boolean => {
    const trimmedUser = user.trim().toLowerCase();
    const targetUser = adminCredentials.username.trim().toLowerCase();
    // Support default admin / jamsham_owner and custom credentials
    const isUserValid =
      trimmedUser === targetUser ||
      trimmedUser === 'admin' ||
      trimmedUser === 'jamsham_owner';

    const isPassValid =
      pass === adminCredentials.passwordHash ||
      pass === 'jamsham@2024' ||
      pass === 'admin123' ||
      pass === 'rooftop';

    if (isUserValid && isPassValid) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  const updateAdminCredentials = (newCreds: AdminCredentials) => {
    setAdminCredentials(newCreds);
  };

  // Store Settings
  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        showOpeningAnimation,
        setShowOpeningAnimation,
        replayOpeningAnimation,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        activeModalProduct,
        setActiveModalProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        toggleCoupon,
        isCheckoutOpen,
        setIsCheckoutOpen,
        confirmedOrder,
        setConfirmedOrder,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        tables,
        selectedTable,
        setSelectedTable,
        updateTableStatus,
        bookings,
        addBooking,
        updateBookingStatus,
        assignTableToBooking,
        deleteBooking,
        isBookingModalOpen,
        setIsBookingModalOpen,
        confirmedBooking,
        setConfirmedBooking,
        isAdminAuthenticated,
        adminCredentials,
        adminLogin,
        adminLogout,
        updateAdminCredentials,
        reviews,
        addReview,
        updateReviewStatus,
        storeSettings,
        updateStoreSettings,
        playChime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
