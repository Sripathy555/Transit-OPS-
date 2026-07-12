import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  Wrench, 
  Fuel, 
  BarChart3, 
  Settings, 
  LogOut,
  X,
  Navigation
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose, activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'drivers', label: 'Drivers', icon: Users },
    { id: 'trips', label: 'Trips', icon: Route },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'fuel', label: 'Fuel & Expenses', icon: Fuel },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-[260px] bg-[#0B0F19] border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
              <Navigation className="w-4 h-4 fill-primary/10 rotate-45" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Transit<span className="text-primary font-medium">Ops</span>
            </span>
          </div>
          
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-white/5 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`flex items-center w-full gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'text-white bg-primary/10 border border-primary/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 w-1 h-5 rounded-r bg-primary" />
                )}
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-300'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 bg-[#080B13]">
          <button
            onClick={() => {
              setActiveTab('settings');
              onClose();
            }}
            className={`flex items-center w-full gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              activeTab === 'settings'
                ? 'text-white bg-primary/10 border border-primary/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4 transition-transform duration-200 group-hover:rotate-45" />
            <span>Settings</span>
          </button>
          
          <button
            onClick={() => alert('Logging out...')}
            className="flex items-center w-full gap-3 px-4 py-2.5 mt-1 rounded-xl text-sm font-medium text-gray-400 hover:text-danger hover:bg-danger/10 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
