/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { OpeningAnimation } from './components/OpeningAnimation';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickInfoBar } from './components/QuickInfoBar';
import { FeaturedFood } from './components/FeaturedFood';
import { DigitalMenuView } from './components/DigitalMenuView';
import { AboutSection } from './components/AboutSection';
import { RooftopExperience } from './components/RooftopExperience';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationContactSection } from './components/LocationContactSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { CustomerOrdersView } from './components/CustomerOrdersView';
import { KitchenDisplayView } from './components/KitchenDisplayView';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { TableBookingModal } from './components/TableBookingModal';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  // Full-screen dedicated views
  if (currentView === 'kitchen') {
    return <KitchenDisplayView />;
  }

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2E8] text-[#24364B]">
      {/* Sticky Top Navbar */}
      <Navbar />

      {/* Main Page Views */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero />
            <QuickInfoBar />
            <FeaturedFood />
            <AboutSection />
            <RooftopExperience />
            <GallerySection />
            <ReviewsSection />
            <LocationContactSection />
          </>
        )}

        {currentView === 'menu' && <DigitalMenuView />}

        {currentView === 'track-order' && <OrderTrackingView />}

        {currentView === 'orders' && <CustomerOrdersView />}

        {currentView === 'about' && (
          <>
            <AboutSection />
            <RooftopExperience />
          </>
        )}

        {currentView === 'gallery' && <GallerySection />}

        {currentView === 'contact' && <LocationContactSection />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Overlays & Modals */}
      <OpeningAnimation />
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <TableBookingModal />
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
