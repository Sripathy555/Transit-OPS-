import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ChevronRight,
  User,
  Sparkles,
  Command
} from 'lucide-react';

export default function Navbar({ onMenuOpen, activeTab, onSearch, triggerToast }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [searchVal, setSearchVal] = useState('');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    triggerToast(
      isDarkMode ? "Theme set to Light Mode (simulated)" : "Theme set to Dark Mode (default)",
      "info"
    );
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleNotificationClick = () => {
    if (notificationsCount > 0) {
      setNotificationsCount(0);
      triggerToast("All notifications marked as read", "success");
    } else {
      triggerToast("No new notifications", "info");
    }
  };

  const getBreadcrumbName = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'vehicles': return 'Vehicles';
      case 'drivers': return 'Drivers';
      case 'trips': return 'Trips';
      case 'maintenance': return 'Maintenance';
      case 'fuel': return 'Fuel & Expenses';
      case 'reports': return 'Reports';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 glass-nav text-white">
      {/* Left side: Breadcrumb & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuOpen}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
            <span>Home</span>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className="text-gray-300 font-semibold">{getBreadcrumbName(activeTab)}</span>
          </div>
          <h1 className="text-base font-semibold tracking-tight text-white mt-0.5">
            {getBreadcrumbName(activeTab)}
          </h1>
        </div>
      </div>

      {/* Right side: Search, Actions, Profile */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center w-64">
          <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search fleet, trips..."
            value={searchVal}
            onChange={handleSearchChange}
            className="w-full h-9 pl-9 pr-8 text-xs font-medium bg-[#111827] text-white border border-white/5 rounded-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-gray-500"
          />
          <div className="absolute right-2 px-1.5 py-0.5 text-[9px] font-medium bg-white/5 border border-white/10 text-gray-500 rounded flex items-center gap-0.5 pointer-events-none">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Notification Bell */}
          <button 
            onClick={handleNotificationClick}
            className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            {notificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-[#090D16] animate-pulse" />
            )}
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-warning" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>
        </div>

        {/* Divider */}
        <span className="h-5 w-px bg-white/10 hidden sm:block" />

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-white">Alex Mercer</p>
            <div className="flex items-center gap-1 justify-end mt-0.5">
              <Sparkles className="w-2.5 h-2.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-1.5 py-0.25 bg-primary/10 rounded-full border border-primary/20">
                Fleet Manager
              </span>
            </div>
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
              AM
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full ring-2 ring-[#090D16]" />
          </div>
        </div>
      </div>
    </header>
  );
}
