import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import MobileNavigation from '../components/layout/MobileNavigation';
import { useMediaQuery } from '../hooks/useMediaQuery';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open for better UX
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex">
        {/* Sidebar - Always visible on desktop, toggleable on mobile */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          !isMobile && sidebarOpen ? 'ml-64' : 'ml-0'
        }`}>
          <div className="min-h-screen p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavigation 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
