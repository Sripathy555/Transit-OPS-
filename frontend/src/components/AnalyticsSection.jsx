import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { MoreVertical, Fuel, HelpCircle, ArrowUpRight, DollarSign } from 'lucide-react';

// Custom Tooltip component for premium styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111827] border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold text-white mb-1.5">{label || payload[0].name}</p>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color || item.payload.fill }}
            />
            <span className="text-gray-400 font-medium">{item.name}:</span>
            <span className="text-white font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Dropdown Action Menu
function ActionMenu({ onSelect, options = ["Export PDF", "Export CSV", "Refresh"] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors duration-200"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-36 bg-[#1F2937] border border-white/10 rounded-xl py-1.5 shadow-2xl z-20 animate-in fade-in slide-in-from-top-1 duration-150">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setIsOpen(false);
                  if (onSelect) onSelect(opt);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-150"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// 1. VehicleStatusChart
function VehicleStatusChart({ triggerToast }) {
  const data = [
    { name: 'Available', value: 41, color: '#22C55E' },
    { name: 'On Trip', value: 15, color: '#2563EB' },
    { name: 'Maintenance', value: 7, color: '#F59E0B' },
    { name: 'Retired', value: 3, color: '#6B7280' },
  ];

  const handleAction = (action) => {
    triggerToast(`Vehicle Status Chart: ${action}`, "info");
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 flex flex-col h-[350px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Vehicle Status</h3>
          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Real-time status breakdown</p>
        </div>
        <ActionMenu onSelect={handleAction} />
      </div>

      <div className="flex-1 relative flex items-center justify-center min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="focus:outline-none" />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center overlay label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold text-white tracking-tight">66</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Fleet</span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 px-2.5 py-1.5 bg-[#0B0F19] border border-white/5 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500">{item.name}</span>
              <span className="text-xs font-bold text-white">{item.value} vehicles</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. FuelTrendChart
function FuelTrendChart({ triggerToast }) {
  const data = [
    { name: 'Mon', consumption: 420 },
    { name: 'Tue', consumption: 460 },
    { name: 'Wed', consumption: 400 },
    { name: 'Thu', consumption: 480 },
    { name: 'Fri', consumption: 510 },
    { name: 'Sat', consumption: 350 },
    { name: 'Sun', consumption: 310 },
  ];

  const handleAction = (action) => {
    triggerToast(`Fuel Trend Chart: ${action}`, "info");
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 flex flex-col h-[350px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Fuel Consumption Trend</h3>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-success/15 text-success border border-success/10">
              <ArrowUpRight className="w-2.5 h-2.5" />
              -4.2% efficiency
            </span>
          </div>
          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Daily gallons consumed this week</p>
        </div>
        <ActionMenu onSelect={handleAction} />
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="fuelColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="consumption"
              stroke="#2563EB"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#fuelColor)"
              name="Gallons"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// 3. ExpenseChart
function ExpenseChart({ triggerToast }) {
  const data = [
    { name: 'Fuel', amount: 18400, fill: '#2563EB' },
    { name: 'Maintenance', amount: 9200, fill: '#F59E0B' },
    { name: 'Repairs', amount: 4800, fill: '#EF4444' },
    { name: 'Tolls', amount: 2100, fill: '#8B5CF6' },
    { name: 'Insurance', amount: 7500, fill: '#10B981' },
  ];

  const handleAction = (action) => {
    triggerToast(`Expenses Chart: ${action}`, "info");
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 flex flex-col h-[350px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Expense Overview</h3>
          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Operational expenditure distribution (USD)</p>
        </div>
        <ActionMenu onSelect={handleAction} />
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar
              dataKey="amount"
              radius={[6, 6, 0, 0]}
              name="Spent ($)"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function AnalyticsSection({ triggerToast }) {
  return (
    <div className="space-y-6">
      {/* 2-Column Section (Status Pie & Fuel Consumption Trend) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VehicleStatusChart triggerToast={triggerToast} />
        <FuelTrendChart triggerToast={triggerToast} />
      </div>

      {/* Large Expense Bar Chart */}
      <ExpenseChart triggerToast={triggerToast} />
    </div>
  );
}
