import React from 'react';
import { Truck, CheckCircle2, Wrench, Fuel, Clock } from 'lucide-react';

export default function ActivityTimeline() {
  const activities = [
    {
      id: 1,
      time: '09:15 AM',
      title: 'Vehicle Assigned',
      desc: 'Vehicle Van-03 assigned to Trip TR-103',
      icon: Truck,
      color: 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(37,99,235,0.2)]',
    },
    {
      id: 2,
      time: '09:03 AM',
      title: 'Trip Completed',
      desc: 'Driver Alex Mercer completed Trip TR-101',
      icon: CheckCircle2,
      color: 'bg-success/10 text-success border-success/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]',
    },
    {
      id: 3,
      time: '08:42 AM',
      title: 'Maintenance Logged',
      desc: 'Scheduled checkup created for Truck-04',
      icon: Wrench,
      color: 'bg-warning/10 text-warning border-warning/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    },
    {
      id: 4,
      time: '08:10 AM',
      title: 'Fuel Logged',
      desc: 'Fuel log added for Van-02 (18.4 gallons)',
      icon: Fuel,
      color: 'bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.2)]',
    },
  ];

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 flex flex-col h-full">
      <div className="pb-4 border-b border-white/5">
        <h3 className="text-sm font-bold text-white">Recent Activity</h3>
        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Real-time log of fleet operations</p>
      </div>

      <div className="flex-1 mt-5 relative pl-6 space-y-6">
        {/* Timeline vertical bar */}
        <div className="absolute top-1 bottom-1 left-[11px] w-0.5 bg-white/5" />

        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="relative flex gap-4 items-start group">
              {/* Dot Icon */}
              <div className={`absolute -left-[20px] p-1.5 rounded-full border z-10 transition-transform duration-200 group-hover:scale-105 ${act.color}`}>
                <Icon className="w-3 h-3" />
              </div>

              {/* Activity Details Card */}
              <div className="flex-1 bg-[#0B0F19] border border-white/5 hover:border-white/10 rounded-xl p-3.5 transition-all duration-200">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                    {act.title}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                    <Clock className="w-2.5 h-2.5" />
                    {act.time}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-semibold mt-1.5 leading-relaxed">
                  {act.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
