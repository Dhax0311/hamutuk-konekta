import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import Header from '../ui/Header';
import Sidebar from '../ui/Sidebar';
import OfflineBanner from '../ui/OfflineBanner';
import MobileNav from '../ui/MobileNav';

export function AppLayout() {
  // Mobile drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Desktop sidebar collapse state (persisted)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('hamutuk_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Floating Back to Top button when scrolling down on Laptop / PC
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('hamutuk_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] text-[#253246] relative">
      {/* Sidebar: Fixed sticky full-height on Desktop/Laptop (collapsible), slide drawer on Mobile */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Column: Natural, unconstrained smooth vertical scrolling */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200">
        <Header
          toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        <OfflineBanner />

        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 pb-24 lg:pb-12 w-full">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Scroll to Top button for Laptop / PC long page browsing */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-20 lg:bottom-6 right-6 z-40 p-3 bg-[#0B1F3A] hover:bg-[#162C4E] text-[#F4B41A] hover:text-white rounded-full shadow-xl border border-slate-700/80 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center group"
          title="Scroll to top / Sae ba leten"
        >
          <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}

export default AppLayout;
