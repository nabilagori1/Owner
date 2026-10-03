import React, { useState } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarDays,
  Tag,
  QrCode,
  Settings,
  Star,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Lock,
  LogOut,
  ChevronDown,
  Clock,
  DollarSign,
  TrendingUp,
  Search,
  ExternalLink,
  Printer,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Phone,
  MessageCircle,
  Users,
  CheckCircle2,
  Key,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_LIST } from '../data/menuData';
import { MenuItem, OrderStatus, Coupon, CafeTable, TableBooking, BookingStatus, Order } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCoupon,
    tables,
    updateTableStatus,
    bookings,
    addBooking,
    updateBookingStatus,
    assignTableToBooking,
    deleteBooking,
    reviews,
    updateReviewStatus,
    storeSettings,
    updateStoreSettings,
    isAdminAuthenticated,
    adminCredentials,
    adminLogin,
    adminLogout,
    updateAdminCredentials,
    setCurrentView,
  } = useApp();

  // Authentication state
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('jamsham@2024');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'bookings' | 'tables' | 'customers' | 'menu' | 'coupons' | 'reviews' | 'settings'
  >('overview');

  // Search & Filters in Orders
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'dine_in' | 'takeaway' | 'delivery'>('all');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Search & Filters in Bookings
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [manualBookingForm, setManualBookingForm] = useState({
    customerName: '',
    phone: '',
    guestsCount: 4,
    bookingDate: 'Tonight',
    bookingTime: '8:30 PM',
    seatingPreference: 'terrace_edge' as const,
    occasion: 'casual_hangout' as const,
    specialRequests: '',
  });

  // Menu item modal state
  const [isEditingProduct, setIsEditingProduct] = useState<MenuItem | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<{
    name: string;
    category: string;
    description: string;
    price: number;
    image: string;
    vegetarian: boolean;
    featured: boolean;
    available: boolean;
  }>({
    name: '',
    category: 'COMBOS',
    description: '',
    price: 149,
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600',
    vegetarian: true,
    featured: false,
    available: true,
  });

  // Table QR Modal
  const [qrModalTable, setQrModalTable] = useState<CafeTable | null>(null);

  // Coupon form
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(300);
  const [newCouponDesc, setNewCouponDesc] = useState('Special discount');

  // Settings form
  const [tempSettings, setTempSettings] = useState(storeSettings);

  // Admin Credentials form
  const [newAdminUser, setNewAdminUser] = useState(adminCredentials.username);
  const [newAdminPass, setNewAdminPass] = useState(adminCredentials.passwordHash);
  const [credsSavedMsg, setCredsSavedMsg] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(usernameInput, passwordInput);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setUsernameInput(adminCredentials.username);
    setPasswordInput(adminCredentials.passwordHash);
    adminLogin(adminCredentials.username, adminCredentials.passwordHash);
  };

  // Analytics Metrics Calculation
  const totalSales = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter((o) =>
    ['new', 'confirmed', 'preparing', 'ready'].includes(o.orderStatus)
  ).length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;
  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (orderTypeFilter !== 'all' && order.orderType !== orderTypeFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.phone.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterStatus !== 'all' && b.status !== bookingFilterStatus) return false;
    return true;
  });

  // Unique customers aggregated from orders and bookings
  const customerMap = new Map<string, { name: string; phone: string; totalSpent: number; ordersCount: number; bookingsCount: number; lastActivity: string }>();

  orders.forEach((o) => {
    const key = o.phone.replace(/\D/g, '') || o.customerName;
    const existing = customerMap.get(key) || {
      name: o.customerName,
      phone: o.phone,
      totalSpent: 0,
      ordersCount: 0,
      bookingsCount: 0,
      lastActivity: o.createdAt,
    };
    existing.totalSpent += o.total;
    existing.ordersCount += 1;
    if (new Date(o.createdAt) > new Date(existing.lastActivity)) {
      existing.lastActivity = o.createdAt;
    }
    customerMap.set(key, existing);
  });

  bookings.forEach((b) => {
    const key = b.phone.replace(/\D/g, '') || b.customerName;
    const existing = customerMap.get(key) || {
      name: b.customerName,
      phone: b.phone,
      totalSpent: 0,
      ordersCount: 0,
      bookingsCount: 0,
      lastActivity: b.createdAt,
    };
    existing.bookingsCount += 1;
    if (new Date(b.createdAt) > new Date(existing.lastActivity)) {
      existing.lastActivity = b.createdAt;
    }
    customerMap.set(key, existing);
  });

  const uniqueCustomersList = Array.from(customerMap.values());

  // Save product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingProduct) {
      updateMenuItem(isEditingProduct.id, productForm);
      setIsEditingProduct(null);
    } else {
      addMenuItem(productForm);
      setIsAddingProduct(false);
    }
    // reset
    setProductForm({
      name: '',
      category: 'COMBOS',
      description: '',
      price: 149,
      image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600',
      vegetarian: true,
      featured: false,
      available: true,
    });
  };

  const openEditProduct = (item: MenuItem) => {
    setIsEditingProduct(item);
    setProductForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image,
      vegetarian: item.vegetarian,
      featured: item.featured,
      available: item.available,
    });
  };

  // Create Coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      id: `coupon-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: 'percentage',
      discountValue: Number(newCouponVal),
      minOrder: Number(newCouponMin),
      maxDiscount: 150,
      description: newCouponDesc,
      active: true,
    });
    setNewCouponCode('');
    setIsAddingCoupon(false);
  };

  // Save Store Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(tempSettings);
    alert('Jam Sham Cafe settings updated successfully!');
  };

  // Save Admin Credentials
  const handleSaveAdminCreds = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminCredentials({
      username: newAdminUser.trim(),
      passwordHash: newAdminPass.trim(),
      lastLogin: new Date().toISOString(),
    });
    setCredsSavedMsg(true);
    setTimeout(() => setCredsSavedMsg(false), 2500);
  };

  // Submit manual table booking by staff
  const handleManualBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBooking({
      customerName: manualBookingForm.customerName.trim(),
      phone: manualBookingForm.phone.trim(),
      guestsCount: manualBookingForm.guestsCount,
      bookingDate: manualBookingForm.bookingDate,
      bookingTime: manualBookingForm.bookingTime,
      seatingPreference: manualBookingForm.seatingPreference,
      occasion: manualBookingForm.occasion,
      specialRequests: manualBookingForm.specialRequests.trim() || undefined,
    });
    setIsManualBookingOpen(false);
    setManualBookingForm({
      customerName: '',
      phone: '',
      guestsCount: 4,
      bookingDate: 'Tonight',
      bookingTime: '8:30 PM',
      seatingPreference: 'terrace_edge',
      occasion: 'casual_hangout',
      specialRequests: '',
    });
  };

  // ==========================================
  // 1. LOGIN SCREEN (If not authenticated)
  // ==========================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F2E8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FFFDF8] border border-[#B99568]/50 p-8 shadow-2xl rounded-sm">
          {/* Brand & Emblem */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-sm bg-[#24364B] text-[#FFFDF8] flex items-center justify-center mx-auto mb-3 font-serif font-bold text-2xl border border-[#B99568] shadow-md">
              JS
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B99568] font-bold block mb-1">
              AUTHORIZED MANAGEMENT ACCESS
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#24364B]">
              Jam Sham Rooftop
            </h1>
            <p className="text-xs text-[#765D49] mt-0.5">
              Owner & Restaurant Management Portal
            </p>
          </div>

          {/* Prominent Login Credentials Box Requested by User */}
          <div className="mb-6 p-4 bg-[#F7F2E8] border border-[#B99568]/40 rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#68705A] flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-[#B99568]" />
                <span>Admin Login Credentials:</span>
              </span>
              <span className="text-[10px] bg-[#24364B] text-white px-2 py-0.5 rounded-xs font-semibold">
                Owner Access
              </span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-xs border border-[#E9DDC9]">
                <span className="text-[#765D49]">Username:</span>
                <span className="font-bold text-[#24364B] select-all">
                  {adminCredentials.username}
                </span>
              </div>
              <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-xs border border-[#E9DDC9]">
                <span className="text-[#765D49]">Password:</span>
                <span className="font-bold text-[#24364B] select-all">
                  {adminCredentials.passwordHash}
                </span>
              </div>
            </div>

            {/* Quick 1-Click Login Button */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="mt-3 w-full py-2 bg-[#B99568] hover:bg-[#a88457] text-[#24364B] text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Fast Login As Owner</span>
            </button>
          </div>

          {/* Traditional Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#24364B] mb-1">
                Username / Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#765D49]" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs sm:text-sm text-[#24364B] focus:outline-none focus:border-[#B99568]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#24364B] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#765D49]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-9 pr-10 py-2 bg-white border border-[#E9DDC9] rounded-sm text-xs sm:text-sm text-[#24364B] focus:outline-none focus:border-[#B99568]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#765D49] hover:text-[#24364B] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-xs text-[#6E3030] font-semibold bg-red-50 p-2 rounded border border-red-200">
                Invalid credentials. Please use the credentials provided above.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] font-semibold text-xs tracking-wider uppercase rounded-sm transition-colors cursor-pointer shadow-md"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E9DDC9] text-center">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-[#765D49] hover:text-[#24364B] underline cursor-pointer"
            >
              ← Back to Jam Sham Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. AUTHENTICATED ADMIN PORTAL
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F7F2E8] flex flex-col">
      {/* Top Console Bar */}
      <header className="bg-[#24364B] text-[#FFFDF8] px-4 sm:px-6 py-3.5 border-b border-[#B99568]/40 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-[#B99568] text-[#24364B] flex items-center justify-center font-bold font-serif text-base shadow-xs">
            JS
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-bold leading-tight">
              Jam Sham Rooftop · Owner Console
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-[#E9DDC9]">
              <span>5th Floor Zaver Chambers, Jamnagar</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                Live Sync
              </span>
            </div>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="hidden sm:flex items-center gap-2 bg-[#1E293B] px-3 py-1.5 rounded-sm border border-slate-700 text-xs">
            <span className="text-slate-400">Terrace Status:</span>
            <span className={`font-bold ${storeSettings.isOpen ? 'text-emerald-400' : 'text-amber-400'}`}>
              {storeSettings.isOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>

          <button
            onClick={() => setCurrentView('kitchen')}
            className="px-3 py-1.5 bg-[#68705A] hover:bg-[#585f4c] text-white text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Kitchen Display</span>
          </button>

          <button
            onClick={() => setCurrentView('home')}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs rounded-sm transition-colors cursor-pointer"
          >
            Public Site
          </button>

          <button
            onClick={adminLogout}
            className="px-3 py-1.5 bg-[#6E3030] hover:bg-[#592626] text-white text-xs font-semibold rounded-sm flex items-center gap-1 cursor-pointer transition-colors"
            title="Log Out of Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Subheader Navigation Tabs */}
      <div className="bg-[#FFFDF8] border-b border-[#E9DDC9] px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-2">
          {[
            { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
            { id: 'orders', label: `Customer Orders (${orders.length})`, icon: <ShoppingBag className="w-3.5 h-3.5" /> },
            { id: 'bookings', label: `Table Bookings (${bookings.length})`, icon: <CalendarDays className="w-3.5 h-3.5" />, badge: pendingBookingsCount },
            { id: 'tables', label: `Terrace Floor (${tables.length})`, icon: <QrCode className="w-3.5 h-3.5" /> },
            { id: 'customers', label: `Customers (${uniqueCustomersList.length})`, icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'menu', label: `Menu (${menuItems.length})`, icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
            { id: 'coupons', label: `Coupons (${coupons.length})`, icon: <Tag className="w-3.5 h-3.5" /> },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <Star className="w-3.5 h-3.5" /> },
            { id: 'settings', label: 'Settings & Password', icon: <Settings className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#24364B] text-[#FFFDF8] shadow-xs'
                  : 'text-[#765D49] hover:bg-[#E9DDC9]/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="w-4 h-4 rounded-full bg-[#6E3030] text-white text-[10px] flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & DASHBOARD                                    */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FFFDF8] border border-[#E9DDC9] p-5 rounded-sm shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#765D49]">
                  Total Order Sales
                </span>
                <div className="text-2xl font-bold font-mono text-[#24364B] mt-1">
                  ₹{totalSales}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{orders.length} orders placed</span>
                </div>
              </div>

              <div className="bg-[#FFFDF8] border border-[#E9DDC9] p-5 rounded-sm shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#765D49]">
                  Table Reservations
                </span>
                <div className="text-2xl font-bold font-mono text-[#68705A] mt-1">
                  {totalBookingsCount}
                </div>
                <div className="text-[11px] text-[#765D49] mt-1">
                  {pendingBookingsCount} awaiting confirmation
                </div>
              </div>

              <div className="bg-[#FFFDF8] border border-[#E9DDC9] p-5 rounded-sm shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#765D49]">
                  Active Kitchen Orders
                </span>
                <div className="text-2xl font-bold font-mono text-[#24364B] mt-1">
                  {activeOrdersCount}
                </div>
                <div className="text-[11px] text-[#765D49] mt-1">
                  In preparation or dispatch
                </div>
              </div>

              <div className="bg-[#FFFDF8] border border-[#E9DDC9] p-5 rounded-sm shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#765D49]">
                  Customer Database
                </span>
                <div className="text-2xl font-bold font-mono text-[#24364B] mt-1">
                  {uniqueCustomersList.length}
                </div>
                <div className="text-[11px] text-[#68705A] mt-1">
                  Unique guests registered
                </div>
              </div>
            </div>

            {/* Quick Two-Column View: Latest Orders & Tonight's Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Latest Orders */}
              <div className="bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-[#24364B]">
                    Live Incoming Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#24364B] font-semibold hover:text-[#68705A] underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-3 bg-[#F7F2E8] border border-[#E9DDC9] rounded-sm flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#24364B]">{order.id}</span>
                          <span className="font-bold text-[#68705A] uppercase text-[10px]">
                            {order.orderType === 'dine_in' ? `Table ${order.tableNumber}` : order.orderType}
                          </span>
                        </div>
                        <div className="font-medium text-[#24364B] mt-0.5">
                          {order.customerName} · <span className="font-mono text-[#765D49]">{order.phone}</span>
                        </div>
                        <div className="text-[11px] text-[#765D49] truncate max-w-xs">
                          {order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-sm text-[#24364B]">
                          ₹{order.total}
                        </div>
                        <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-xs">
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Table Bookings */}
              <div className="bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-[#24364B]">
                    Rooftop Table Reservations
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-[#24364B] font-semibold hover:text-[#68705A] underline cursor-pointer"
                  >
                    Manage Reservations →
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-[#F7F2E8] border border-[#E9DDC9] rounded-sm flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#24364B]">{b.id}</span>
                          <span className="font-bold text-[#24364B]">{b.customerName}</span>
                          <span className="text-[#765D49]">({b.guestsCount} Guests)</span>
                        </div>
                        <div className="text-[11px] text-[#68705A] mt-0.5">
                          ⏰ {b.bookingDate} at {b.bookingTime} · Preference: {b.seatingPreference?.replace('_', ' ')}
                        </div>
                        {b.specialRequests && (
                          <div className="text-[10px] text-[#765D49] italic truncate max-w-xs">
                            "{b.specialRequests}"
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs ${
                          b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                        {b.tableNumber && (
                          <div className="text-[10px] font-bold text-[#68705A] mt-1">
                            Table #{b.tableNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: DETAILED CUSTOMER ORDERS                                */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-6 shadow-xs animate-fadeIn space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#24364B]">
                  Customer Order Ledger
                </h3>
                <p className="text-xs text-[#765D49]">
                  Full customer contact info, dining mode, itemized receipts, and order statuses.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#765D49]" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by customer, phone, ID..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E9DDC9] rounded-sm w-56 text-[#24364B]"
                  />
                </div>

                <select
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs bg-white border border-[#E9DDC9] rounded-sm text-[#24364B]"
                >
                  <option value="all">All Types</option>
                  <option value="dine_in">Dine-In</option>
                  <option value="takeaway">Takeaway</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F2E8] text-[#765D49] uppercase font-bold border-y border-[#E9DDC9]">
                  <tr>
                    <th className="py-3 px-3">Order ID & Date</th>
                    <th className="py-3 px-3">Customer Information</th>
                    <th className="py-3 px-3">Type / Table / Address</th>
                    <th className="py-3 px-3">Ordered Items</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Order Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9DDC9]/60">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F7F2E8]/40">
                      <td className="py-3 px-3 font-mono">
                        <div className="font-bold text-[#24364B] text-sm">{order.id}</div>
                        <div className="text-[10px] text-[#765D49]">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-[#24364B]">{order.customerName}</div>
                        <div className="text-[11px] text-[#765D49] font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#B99568]" />
                          <span>{order.phone}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-[#68705A] uppercase text-xs">
                          {order.orderType === 'dine_in'
                            ? `Table #${order.tableNumber}`
                            : order.orderType === 'takeaway'
                            ? `Takeaway (${order.pickupTime || 'Soon'})`
                            : 'Delivery'}
                        </span>
                        {order.address && (
                          <div className="text-[10px] text-[#765D49] max-w-xs truncate mt-0.5">
                            📍 {order.address.street}, {order.address.landmark}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] truncate">
                            <span className="font-medium">{it.name}</span>{' '}
                            <span className="font-bold text-[#24364B]">×{it.quantity}</span>
                            {it.customizations && it.customizations.length > 0 && (
                              <span className="text-[10px] text-[#B99568] ml-1">
                                (+{it.customizations.map((c) => c.name).join(', ')})
                              </span>
                            )}
                          </div>
                        ))}
                      </td>

                      <td className="py-3 px-3 uppercase text-[11px]">
                        <span className="font-bold">{order.paymentMethod}</span>
                        <div className={`text-[10px] ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          ({order.paymentStatus})
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-sm text-[#24364B]">
                        ₹{order.total}
                      </td>

                      <td className="py-3 px-3">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2 py-1.5 bg-white border border-[#E9DDC9] rounded-xs text-xs font-semibold text-[#24364B] cursor-pointer"
                        >
                          <option value="new">New</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReceiptOrder(order)}
                            className="p-1.5 text-[#24364B] hover:bg-[#E9DDC9] rounded-xs cursor-pointer"
                            title="Print KOT / Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`https://wa.me/${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${order.customerName}, regarding your Jam Sham Rooftop order ${order.id}...`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xs cursor-pointer"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Printable KOT / Receipt Modal */}
            {selectedReceiptOrder && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white max-w-sm w-full p-6 border-2 border-dashed border-[#24364B] shadow-2xl rounded-sm text-xs font-mono space-y-3">
                  <div className="text-center pb-2 border-b border-dashed border-gray-400">
                    <h4 className="font-bold text-base text-[#24364B]">JAM SHAM ROOFTOP</h4>
                    <p className="text-[10px] text-gray-500">5th Floor, Zaver Chambers, Jamnagar</p>
                    <p className="text-[10px] text-gray-500">Ph: +91 96696 75375</p>
                    <div className="font-bold text-sm mt-1">KITCHEN ORDER TICKET (KOT)</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-bold">{selectedReceiptOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span className="font-bold">{selectedReceiptOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span>{selectedReceiptOrder.phone}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Type:</span>
                      <span>
                        {selectedReceiptOrder.orderType === 'dine_in'
                          ? `TABLE #${selectedReceiptOrder.tableNumber}`
                          : selectedReceiptOrder.orderType.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Time:</span>
                      <span>{new Date(selectedReceiptOrder.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="py-2 border-y border-dashed border-gray-400 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>ITEM</span>
                      <span>QTY · AMT</span>
                    </div>
                    {selectedReceiptOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.name}</span>
                        <span>{it.quantity} × ₹{it.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 text-right">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{selectedReceiptOrder.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (5%):</span>
                      <span>₹{selectedReceiptOrder.tax}</span>
                    </div>
                    {selectedReceiptOrder.deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span>₹{selectedReceiptOrder.deliveryFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm pt-1 border-t border-dashed">
                      <span>GRAND TOTAL:</span>
                      <span>₹{selectedReceiptOrder.total}</span>
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Payment: {selectedReceiptOrder.paymentMethod.toUpperCase()} ({selectedReceiptOrder.paymentStatus.toUpperCase()})
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-1.5 bg-[#24364B] text-white rounded-xs text-xs font-bold uppercase cursor-pointer"
                    >
                      Print Ticket
                    </button>
                    <button
                      onClick={() => setSelectedReceiptOrder(null)}
                      className="px-4 py-1.5 border border-gray-400 rounded-xs text-xs cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TABLE BOOKINGS & RESERVATIONS                           */}
        {/* ============================================================== */}
        {activeTab === 'bookings' && (
          <div className="bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-6 shadow-xs animate-fadeIn space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#24364B]">
                  Rooftop Table Reservations
                </h3>
                <p className="text-xs text-[#765D49]">
                  Manage table bookings, guest sizes, terrace preferences, and assign tables.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={bookingFilterStatus}
                  onChange={(e) => setBookingFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-[#E9DDC9] rounded-sm text-[#24364B]"
                >
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="seated">Seated</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => setIsManualBookingOpen(true)}
                  className="px-3.5 py-1.5 bg-[#24364B] hover:bg-[#68705A] text-white text-xs font-semibold rounded-sm uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Take Phone Reservation</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F2E8] text-[#765D49] uppercase font-bold border-y border-[#E9DDC9]">
                  <tr>
                    <th className="py-3 px-3">Booking ID</th>
                    <th className="py-3 px-3">Guest Information</th>
                    <th className="py-3 px-3">Date & Slot</th>
                    <th className="py-3 px-3">Party Size</th>
                    <th className="py-3 px-3">Terrace Preference</th>
                    <th className="py-3 px-3">Assign Table</th>
                    <th className="py-3 px-3">Booking Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9DDC9]/60">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F7F2E8]/40">
                      <td className="py-3 px-3 font-mono font-bold text-[#24364B]">
                        {b.id}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-[#24364B]">{b.customerName}</div>
                        <div className="text-[11px] text-[#765D49] font-mono">{b.phone}</div>
                        {b.specialRequests && (
                          <div className="text-[10px] text-[#68705A] italic mt-0.5 max-w-xs">
                            Note: "{b.specialRequests}"
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-[#24364B]">{b.bookingDate}</div>
                        <div className="text-[11px] text-[#765D49]">⏰ {b.bookingTime}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold text-sm text-[#24364B]">{b.guestsCount}</span> Guests
                        <div className="text-[10px] uppercase text-[#765D49]">
                          {b.occasion?.replace('_', ' ')}
                        </div>
                      </td>

                      <td className="py-3 px-3 capitalize font-medium text-[#68705A]">
                        {b.seatingPreference?.replace('_', ' ')}
                      </td>

                      {/* Table Assignment Dropdown */}
                      <td className="py-3 px-3">
                        <select
                          value={b.tableNumber || ''}
                          onChange={(e) => assignTableToBooking(b.id, e.target.value)}
                          className="px-2 py-1 bg-white border border-[#E9DDC9] rounded-xs text-xs font-semibold text-[#24364B]"
                        >
                          <option value="">-- Assign Table --</option>
                          {tables.map((t) => (
                            <option key={t.id} value={t.number}>
                              Table #{t.number} ({t.capacity} Seats - {t.status})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-3">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                          className="px-2 py-1 bg-white border border-[#E9DDC9] rounded-xs text-xs font-semibold text-[#24364B]"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="seated">Seated</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${b.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${b.customerName}, your table booking ${b.id} at Jam Sham Rooftop Cafe is confirmed for ${b.bookingDate} at ${b.bookingTime}!`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xs cursor-pointer"
                            title="Send WhatsApp Confirmation"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`tel:${b.phone}`}
                            className="p-1.5 text-[#24364B] hover:bg-gray-100 rounded-xs cursor-pointer"
                            title="Call Guest"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => {
                              if (confirm(`Remove reservation ${b.id}?`)) {
                                deleteBooking(b.id);
                              }
                            }}
                            className="p-1.5 text-[#6E3030] hover:bg-red-50 rounded-xs cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Manual Phone Booking Modal */}
            {isManualBookingOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#FFFDF8] border border-[#B99568] max-w-md w-full p-6 rounded-sm shadow-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E9DDC9]">
                    <h4 className="font-serif text-lg font-bold text-[#24364B]">
                      Take Phone / Walk-in Reservation
                    </h4>
                    <button
                      onClick={() => setIsManualBookingOpen(false)}
                      className="text-gray-500 hover:text-black cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleManualBookingSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Customer Full Name *</label>
                      <input
                        type="text"
                        required
                        value={manualBookingForm.customerName}
                        onChange={(e) =>
                          setManualBookingForm({ ...manualBookingForm, customerName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Mobile Phone *</label>
                        <input
                          type="tel"
                          required
                          value={manualBookingForm.phone}
                          onChange={(e) =>
                            setManualBookingForm({ ...manualBookingForm, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Guests Count</label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={30}
                          value={manualBookingForm.guestsCount}
                          onChange={(e) =>
                            setManualBookingForm({ ...manualBookingForm, guestsCount: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Date</label>
                        <input
                          type="text"
                          value={manualBookingForm.bookingDate}
                          onChange={(e) =>
                            setManualBookingForm({ ...manualBookingForm, bookingDate: e.target.value })
                          }
                          placeholder="Tonight / Date"
                          className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Time Slot</label>
                        <input
                          type="text"
                          value={manualBookingForm.bookingTime}
                          onChange={(e) =>
                            setManualBookingForm({ ...manualBookingForm, bookingTime: e.target.value })
                          }
                          placeholder="8:30 PM"
                          className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Terrace Seating Preference</label>
                      <select
                        value={manualBookingForm.seatingPreference}
                        onChange={(e) =>
                          setManualBookingForm({ ...manualBookingForm, seatingPreference: e.target.value as any })
                        }
                        className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                      >
                        <option value="terrace_edge">Terrace Edge</option>
                        <option value="cozy_corner">Cozy Corner</option>
                        <option value="family_lounge">Family Lounge</option>
                        <option value="open_deck">Open Deck</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Notes / Requests</label>
                      <input
                        type="text"
                        value={manualBookingForm.specialRequests}
                        onChange={(e) =>
                          setManualBookingForm({ ...manualBookingForm, specialRequests: e.target.value })
                        }
                        placeholder="e.g. Birthday cake arrangement"
                        className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#24364B] hover:bg-[#68705A] text-white font-semibold uppercase tracking-wider rounded-sm cursor-pointer"
                    >
                      Confirm Table Reservation
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: TERRACE TABLES & QR CODES                               */}
        {/* ============================================================== */}
        {activeTab === 'tables' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#24364B]">
                  Terrace Tables & QR Menu Stands
                </h3>
                <p className="text-xs text-[#765D49]">
                  Manage all 15 open-air tables on the 5th floor terrace and print QR stands for tableside ordering.
                </p>
              </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {tables.map((tbl) => (
                <div
                  key={tbl.id}
                  className="bg-[#FFFDF8] border border-[#E9DDC9] p-4 rounded-sm shadow-xs flex flex-col justify-between"
                >
                  <div className="text-center">
                    <span className="text-[10px] text-[#765D49] uppercase tracking-wider font-semibold">
                      Terrace
                    </span>
                    <div className="font-serif text-2xl font-bold text-[#24364B] my-1">
                      Table #{tbl.number}
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase tracking-wider ${
                        tbl.status === 'available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tbl.status === 'occupied'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {tbl.status}
                    </span>
                    <div className="text-[11px] text-[#765D49] mt-1 font-medium">
                      Capacity: {tbl.capacity} People
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E9DDC9] space-y-2">
                    <select
                      value={tbl.status}
                      onChange={(e) => updateTableStatus(tbl.id, e.target.value as any)}
                      className="w-full px-2 py-1 bg-white border border-[#E9DDC9] rounded-xs text-[10px] cursor-pointer"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="reserved">Reserved</option>
                    </select>

                    <button
                      onClick={() => setQrModalTable(tbl)}
                      className="w-full py-1 bg-[#24364B] hover:bg-[#68705A] text-white rounded-xs text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-3 h-3" />
                      <span>Print Stand QR</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Table QR Stand Preview Modal */}
            {qrModalTable && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#FFFDF8] border border-[#B99568] max-w-sm w-full p-8 rounded-sm shadow-2xl text-center space-y-4">
                  <div className="w-10 h-10 rounded-sm bg-[#24364B] text-[#FFFDF8] flex items-center justify-center mx-auto font-serif font-bold text-lg">
                    JS
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-bold text-[#24364B]">
                      JAM SHAM ROOFTOP
                    </h4>
                    <p className="text-xs uppercase tracking-widest text-[#B99568] font-bold">
                      TABLE #{qrModalTable.number}
                    </p>
                  </div>

                  {/* QR SVG Mockup */}
                  <div className="p-4 bg-white border border-[#E9DDC9] rounded-sm inline-block shadow-inner">
                    <svg viewBox="0 0 100 100" className="w-40 h-40 mx-auto">
                      <rect width="100" height="100" fill="#FFF" />
                      <rect x="10" y="10" width="24" height="24" fill="#24364B" />
                      <rect x="14" y="14" width="16" height="16" fill="#FFF" />
                      <rect x="18" y="18" width="8" height="8" fill="#24364B" />

                      <rect x="66" y="10" width="24" height="24" fill="#24364B" />
                      <rect x="70" y="14" width="16" height="16" fill="#FFF" />
                      <rect x="74" y="18" width="8" height="8" fill="#24364B" />

                      <rect x="10" y="66" width="24" height="24" fill="#24364B" />
                      <rect x="14" y="70" width="16" height="16" fill="#FFF" />
                      <rect x="18" y="74" width="8" height="8" fill="#24364B" />

                      <rect x="42" y="15" width="8" height="8" fill="#24364B" />
                      <rect x="45" y="32" width="14" height="6" fill="#24364B" />
                      <rect x="42" y="45" width="16" height="16" fill="#B99568" />
                      <rect x="65" y="45" width="10" height="8" fill="#24364B" />
                      <rect x="65" y="75" width="18" height="12" fill="#24364B" />
                      <rect x="40" y="70" width="12" height="18" fill="#24364B" />
                    </svg>
                  </div>

                  <p className="text-xs text-[#765D49]">
                    Guests scan this QR code with their mobile phone camera to order directly to Table #{qrModalTable.number}.
                  </p>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        window.open(`/?table=${qrModalTable.number}`, '_blank');
                      }}
                      className="flex-1 py-2 bg-[#24364B] text-white rounded-sm text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      Test Table Link
                    </button>
                    <button
                      onClick={() => setQrModalTable(null)}
                      className="py-2 px-4 border border-[#E9DDC9] rounded-sm text-xs font-semibold uppercase cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: CUSTOMER DATABASE (CRM)                                 */}
        {/* ============================================================== */}
        {activeTab === 'customers' && (
          <div className="bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-6 shadow-xs animate-fadeIn space-y-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#24364B]">
                Customer Directory & Guest History
              </h3>
              <p className="text-xs text-[#765D49]">
                Aggregated records of guests who have ordered or reserved terrace tables at Jam Sham.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F2E8] text-[#765D49] uppercase font-bold border-y border-[#E9DDC9]">
                  <tr>
                    <th className="py-3 px-3">Customer Name</th>
                    <th className="py-3 px-3">Mobile Contact</th>
                    <th className="py-3 px-3">Total Orders</th>
                    <th className="py-3 px-3">Table Reservations</th>
                    <th className="py-3 px-3">Total Lifetime Spend</th>
                    <th className="py-3 px-3 text-right">Quick Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9DDC9]/60">
                  {uniqueCustomersList.map((c, i) => (
                    <tr key={i} className="hover:bg-[#F7F2E8]/40">
                      <td className="py-3 px-3">
                        <div className="font-bold text-sm text-[#24364B]">{c.name}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#765D49]">
                        {c.phone}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#24364B]">
                        {c.ordersCount} orders
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#68705A]">
                        {c.bookingsCount} bookings
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-sm text-[#24364B]">
                        ₹{c.totalSpent}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/${c.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-xs text-[10px] font-bold uppercase flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                          <a
                            href={`tel:${c.phone}`}
                            className="px-2.5 py-1 border border-[#24364B] text-[#24364B] rounded-xs text-[10px] font-bold uppercase flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: MENU & PRODUCT MANAGEMENT                               */}
        {/* ============================================================== */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#24364B]">
                  Menu & Food Catalog
                </h3>
                <p className="text-xs text-[#765D49]">
                  Add new dishes, adjust prices, edit descriptions, toggle stock / sold out, and verify pure veg images.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsEditingProduct(null);
                  setIsAddingProduct(true);
                }}
                className="px-4 py-2 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            {/* Menu Items Table */}
            <div className="bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-4 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F2E8] text-[#765D49] uppercase font-bold border-y border-[#E9DDC9]">
                  <tr>
                    <th className="py-2.5 px-3">Photo</th>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Featured</th>
                    <th className="py-2.5 px-3">Availability</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9DDC9]/60">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F7F2E8]/40">
                      <td className="py-2 px-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-sm bg-[#E9DDC9]"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-bold text-[#24364B]">{item.name}</div>
                        <div className="text-[10px] text-[#765D49] max-w-xs truncate">
                          {item.description}
                        </div>
                      </td>
                      <td className="py-2 px-3 uppercase text-[#68705A] font-semibold">
                        {item.category}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-sm">
                        ₹{item.price}
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => updateMenuItem(item.id, { featured: !item.featured })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                            item.featured
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {item.featured ? 'Featured' : 'Standard'}
                        </button>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => toggleItemAvailability(item.id)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                            item.available
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.available ? 'In Stock' : 'Sold Out'}
                        </button>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditProduct(item)}
                            className="p-1.5 text-[#24364B] hover:bg-[#E9DDC9] rounded-xs cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${item.name}" from menu?`)) {
                                deleteMenuItem(item.id);
                              }
                            }}
                            className="p-1.5 text-[#6E3030] hover:bg-red-50 rounded-xs cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal for Add / Edit Product */}
            {(isAddingProduct || isEditingProduct) && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#FFFDF8] border border-[#B99568] max-w-lg w-full p-6 rounded-sm shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E9DDC9]">
                    <h4 className="font-serif text-xl font-bold text-[#24364B]">
                      {isEditingProduct ? 'Edit Dish' : 'Add New Dish'}
                    </h4>
                    <button
                      onClick={() => {
                        setIsAddingProduct(false);
                        setIsEditingProduct(null);
                      }}
                      className="text-gray-500 hover:text-black cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-[#24364B] mb-1">
                        Dish Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#24364B] mb-1">
                          Category *
                        </label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                        >
                          {CATEGORIES_LIST.filter((c) => c !== 'ALL').map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#24364B] mb-1">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#24364B] mb-1">
                        Image URL (Pure Vegetarian Dish Photo) *
                      </label>
                      <input
                        type="url"
                        required
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#24364B] mb-1">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                      />
                    </div>

                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        />
                        <span>Featured Favourite</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.available}
                          onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                        />
                        <span>In Stock</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 py-2.5 bg-[#24364B] hover:bg-[#68705A] text-white font-semibold uppercase tracking-wider rounded-sm cursor-pointer"
                    >
                      Save Dish Changes
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: COUPONS & DISCOUNTS                                     */}
        {/* ============================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#24364B]">
                  Coupon & Promo Code Engine
                </h3>
                <p className="text-xs text-[#765D49]">
                  Create discount codes for evening rooftop diners and online orders.
                </p>
              </div>

              <button
                onClick={() => setIsAddingCoupon(true)}
                className="px-4 py-2 bg-[#24364B] hover:bg-[#68705A] text-[#FFFDF8] rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#FFFDF8] border border-[#E9DDC9] p-5 rounded-sm shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-base font-bold text-[#24364B] bg-[#F7F2E8] px-2 py-0.5 rounded-xs border border-[#E9DDC9]">
                        {c.code}
                      </span>
                      <button
                        onClick={() => toggleCoupon(c.id)}
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded cursor-pointer ${
                          c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {c.active ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-[#765D49]">{c.description}</p>
                    <div className="mt-3 text-[11px] text-[#24364B] font-medium">
                      Min Order: ₹{c.minOrder} · Discount: {c.discountValue}%
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E9DDC9] flex justify-end">
                    <button
                      onClick={() => deleteCoupon(c.id)}
                      className="text-xs text-[#6E3030] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Coupon Modal */}
            {isAddingCoupon && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-[#FFFDF8] border border-[#B99568] max-w-sm w-full p-6 rounded-sm shadow-xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E9DDC9]">
                    <h4 className="font-serif text-lg font-bold text-[#24364B]">
                      Create New Coupon
                    </h4>
                    <button onClick={() => setIsAddingCoupon(false)} className="text-gray-500 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Coupon Code (Uppercase)</label>
                      <input
                        type="text"
                        required
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. ROOFTOP30"
                        className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Discount Percentage (%)</label>
                      <input
                        type="number"
                        required
                        value={newCouponVal}
                        onChange={(e) => setNewCouponVal(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Minimum Order Amount (₹)</label>
                      <input
                        type="number"
                        required
                        value={newCouponMin}
                        onChange={(e) => setNewCouponMin(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Description</label>
                      <input
                        type="text"
                        required
                        value={newCouponDesc}
                        onChange={(e) => setNewCouponDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#24364B] text-white font-semibold uppercase tracking-wider rounded-sm cursor-pointer"
                    >
                      Save Coupon
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: CUSTOMER REVIEWS MODERATION                             */}
        {/* ============================================================== */}
        {activeTab === 'reviews' && (
          <div className="bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-6 shadow-xs animate-fadeIn space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#24364B]">
              Customer Reviews Moderation
            </h3>
            <p className="text-xs text-[#765D49]">
              Approve, hide or remove public customer reviews.
            </p>

            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-[#F7F2E8] border border-[#E9DDC9] rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#24364B]">{rev.name}</span>
                      <span className="text-amber-500 text-xs">
                        {'★'.repeat(rev.rating)}
                      </span>
                      <span className="text-[10px] text-[#765D49]">{rev.date}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#765D49]">{rev.comment}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateReviewStatus(
                          rev.id,
                          rev.status === 'approved' ? 'hidden' : 'approved'
                        )
                      }
                      className={`px-3 py-1 rounded text-xs font-semibold uppercase cursor-pointer ${
                        rev.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {rev.status === 'approved' ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 9: SETTINGS & PASSWORD CHANGE                              */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            {/* General Store Settings */}
            <div className="bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#24364B]">
                Cafe Operating Settings
              </h3>
              <p className="text-xs text-[#765D49]">
                Configure live open/close state, hours, delivery rules and telephone.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                {/* Open / Closed Toggle */}
                <div className="p-4 bg-[#F7F2E8] border border-[#E9DDC9] rounded-sm flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-[#24364B] block">
                      Rooftop Cafe Is Open Tonight
                    </span>
                    <span className="text-[11px] text-[#765D49]">
                      Controls the live "OPEN TODAY" banner on public site
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempSettings.isOpen}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, isOpen: e.target.checked })
                    }
                    className="w-5 h-5 accent-[#24364B] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#24364B]">
                    Display Hours Text
                  </label>
                  <input
                    type="text"
                    value={tempSettings.openingHoursDisplay}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, openingHoursDisplay: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[#24364B]">
                      Delivery Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={tempSettings.deliveryFee}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, deliveryFee: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#24364B]">
                      Free Delivery Threshold (₹)
                    </label>
                    <input
                      type="number"
                      value={tempSettings.freeDeliveryThreshold}
                      onChange={(e) =>
                        setTempSettings({
                          ...tempSettings,
                          freeDeliveryThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[#24364B]">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={tempSettings.phone}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#24364B]">
                      WhatsApp Contact Number
                    </label>
                    <input
                      type="text"
                      value={tempSettings.whatsappNumber}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#24364B]">
                    Jamnagar Address
                  </label>
                  <textarea
                    rows={2}
                    value={tempSettings.address}
                    onChange={(e) =>
                      setTempSettings({ ...tempSettings, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#24364B] hover:bg-[#68705A] text-white font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Save Store Settings
                </button>
              </form>
            </div>

            {/* Admin Password & Security Settings Requested by User */}
            <div className="bg-[#FFFDF8] border border-[#E9DDC9] rounded-sm p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#B99568]" />
                <h3 className="font-serif text-xl font-bold text-[#24364B]">
                  Admin Credentials & Password
                </h3>
              </div>
              <p className="text-xs text-[#765D49]">
                Change your admin username and password. Saved to your browser memory.
              </p>

              <form onSubmit={handleSaveAdminCreds} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[#24364B]">
                    Admin Username
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminUser}
                    onChange={(e) => setNewAdminUser(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#24364B]">
                    Admin Password
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E9DDC9] rounded-sm bg-white font-mono"
                  />
                  <span className="text-[11px] text-[#765D49] mt-1 block">
                    Current active password: <span className="font-bold text-[#24364B] font-mono">{adminCredentials.passwordHash}</span>
                  </span>
                </div>

                {credsSavedMsg && (
                  <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-xs border border-emerald-200">
                    ✓ Admin credentials updated successfully!
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#B99568] hover:bg-[#a88457] text-[#24364B] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
                >
                  Update Admin Username & Password
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
