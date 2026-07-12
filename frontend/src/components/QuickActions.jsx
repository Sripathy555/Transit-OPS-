import React from 'react';
import { Truck, UserPlus, Milestone, Fuel, Wrench, Plus } from 'lucide-react';

export default function QuickActions({ triggerToast }) {
  const actions = [
    {
      label: 'Register Vehicle',
      icon: Truck,
      color: 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20',
      actionId: 'register_vehicle',
    },
    {
      label: 'Register Driver',
      icon: UserPlus,
      color: 'bg-success/10 hover:bg-success/20 text-success border-success/20',
      actionId: 'register_driver',
    },
    {
      label: 'Create Trip',
      icon: Milestone,
      color: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500/20',
      actionId: 'create_trip',
    },
    {
      label: 'Log Fuel',
      icon: Fuel,
      color: 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border-pink-500/20',
      actionId: 'log_fuel',
    },
    {
      label: 'Maintenance',
      icon: Wrench,
      color: 'bg-warning/10 hover:bg-warning/20 text-warning border-warning/20',
      actionId: 'schedule_maintenance',
    },
  ];

  const handleActionClick = (label) => {
    triggerToast(`Opening wizard: "${label}"`, "success");
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300">
      <div className="pb-4 border-b border-white/5 mb-4">
        <h3 className="text-sm font-bold text-white">Quick Actions</h3>
        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Quickly dispatch resources or log updates</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.actionId}
              onClick={() => handleActionClick(act.label)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border font-bold text-xs transition-all duration-200 hover:scale-102 hover:shadow-lg hover:shadow-black/20 group relative overflow-hidden ${act.color}`}
            >
              <div className="absolute top-2 right-2 text-white/40 group-hover:text-white transition-colors duration-200">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <div className="p-2.5 bg-[#0B0F19] border border-white/5 rounded-xl group-hover:scale-105 transition-transform duration-200">
                <Icon className="w-5 h-5" />
              </div>
              <span className="mt-3 text-center tracking-tight text-white/90 group-hover:text-white transition-colors">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
