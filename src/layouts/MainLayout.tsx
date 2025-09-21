import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import MobileNavigation from '../components/layout/MobileNavigation';
import MobileNav from '../components/MobileNav';
import { useMediaQuery } from '../hooks/useMediaQuery';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open for better UX
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();
  
  // Hide sidebar on landing page
  const isLandingPage = location.pathname === '/';

  // Handle scroll events for responsive behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className={`min-h-screen ${isLandingPage ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'}`}>
      <div className="flex">
        {/* Sidebar - Hidden on landing page, visible on other pages */}
        {!isLandingPage && (
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          !isLandingPage && !isMobile && sidebarOpen ? 'ml-64' : 'ml-0'
        } ${isMobile && !isLandingPage ? 'pb-20' : ''}`}>
          <div className={`min-h-screen ${isLandingPage ? 'p-0' : 'p-4 sm:p-6 lg:p-8'}`}>
            <div className="container-responsive">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation - Hidden on landing page */}
      {isMobile && !isLandingPage && (
        <>
          <MobileNavigation 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <MobileNav />
        </>
      )}

      {/* Footer - Hidden on landing page */}
      {!isLandingPage && <Footer />}
    </div>
  );
};

export default MainLayout;
