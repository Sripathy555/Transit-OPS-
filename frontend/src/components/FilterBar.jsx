import React, { useState } from 'react';
import { Filter, RotateCcw, Calendar, MapPin, Truck, ShieldAlert } from 'lucide-react';

export default function FilterBar({ onFilterChange, triggerToast }) {
  const [filters, setFilters] = useState({
    vehicleType: 'all',
    status: 'all',
    region: 'all',
    dateRange: '7days',
  });

  const handleSelectChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    if (onFilterChange) onFilterChange(updatedFilters);
    
    // Notify user with a toast for premium UX
    const optLabels = {
      vehicleType: { all: 'All Vehicles', truck: 'Trucks', van: 'Vans', sedan: 'Sedans' },
      status: { all: 'All Statuses', available: 'Available', ontrip: 'On Trip', maintenance: 'Maintenance' },
      region: { all: 'All Regions', east: 'East Coast', west: 'West Coast', midwest: 'Midwest' },
      dateRange: { today: 'Today', '7days': 'Last 7 Days', '30days': 'Last 30 Days' }
    };
    triggerToast(`Filter: ${optLabels[key][value]} selected`, "success");
  };

  const handleReset = () => {
    const resetFilters = {
      vehicleType: 'all',
      status: 'all',
      region: 'all',
      dateRange: '7days',
    };
    setFilters(resetFilters);
    if (onFilterChange) onFilterChange(resetFilters);
    triggerToast("Filters reset to default", "info");
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-300 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Left side: dropdowns group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Vehicle Type Dropdown */}
        <div className="relative flex items-center min-w-[120px] flex-1 sm:flex-initial">
          <Truck className="absolute left-3 w-3.5 h-3.5 text-gray-500" />
          <select
            value={filters.vehicleType}
            onChange={(e) => handleSelectChange('vehicleType', e.target.value)}
            className="w-full text-xs font-semibold bg-[#0B0F19] text-gray-300 border border-white/5 rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:border-primary/50 transition-colors"
          >
            <option value="all">All Vehicles</option>
            <option value="truck">Trucks</option>
            <option value="van">Vans</option>
            <option value="sedan">Sedans</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="relative flex items-center min-w-[120px] flex-1 sm:flex-initial">
          <ShieldAlert className="absolute left-3 w-3.5 h-3.5 text-gray-500" />
          <select
            value={filters.status}
            onChange={(e) => handleSelectChange('status', e.target.value)}
            className="w-full text-xs font-semibold bg-[#0B0F19] text-gray-300 border border-white/5 rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:border-primary/50 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="ontrip">On Trip</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Region Dropdown */}
        <div className="relative flex items-center min-w-[120px] flex-1 sm:flex-initial">
          <MapPin className="absolute left-3 w-3.5 h-3.5 text-gray-500" />
          <select
            value={filters.region}
            onChange={(e) => handleSelectChange('region', e.target.value)}
            className="w-full text-xs font-semibold bg-[#0B0F19] text-gray-300 border border-white/5 rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:border-primary/50 transition-colors"
          >
            <option value="all">All Regions</option>
            <option value="east">East Coast</option>
            <option value="west">West Coast</option>
            <option value="midwest">Midwest</option>
          </select>
        </div>

        {/* Date Range Dropdown */}
        <div className="relative flex items-center min-w-[120px] flex-1 sm:flex-initial">
          <Calendar className="absolute left-3 w-3.5 h-3.5 text-gray-500" />
          <select
            value={filters.dateRange}
            onChange={(e) => handleSelectChange('dateRange', e.target.value)}
            className="w-full text-xs font-semibold bg-[#0B0F19] text-gray-300 border border-white/5 rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:border-primary/50 transition-colors"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Right side: Filter Indicator & Reset */}
      <div className="flex items-center justify-end gap-3 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
          <Filter className="w-3.5 h-3.5" />
          <span>Active filters: {Object.values(filters).filter(v => v !== 'all' && v !== '7days').length}</span>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-400 hover:text-white bg-[#0B0F19] border border-white/5 hover:border-white/10 rounded-xl transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
