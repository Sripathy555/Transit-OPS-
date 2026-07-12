import React from 'react';
import {
  Truck,
  CheckCircle2,
  Wrench,
  Route,
  Users,
  Gauge,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

function KPICard({ title, value, icon: Icon, trend, trendType, subtitle, progress, iconColor }) {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 tracking-tight">{title}</span>
          <div className={`p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 group-hover:text-white transition-colors duration-300 ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white tracking-tight leading-none">
            {value}
          </span>
          {trend && (
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${trendType === 'positive'
                ? 'bg-success/10 text-success border border-success/10'
                : trendType === 'negative'
                  ? 'bg-danger/10 text-danger border border-danger/10'
                  : 'bg-white/5 text-gray-400 border border-white/5'
              }`}>
              {trendType === 'positive' ? (
                <ArrowUpRight className="w-2.5 h-2.5" />
              ) : (
                <ArrowDownRight className="w-2.5 h-2.5" />
              )}
              {trend}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        {progress !== undefined ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold">
              <span>Target: 85%</span>
              <span>{value}</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase">
            {subtitle || 'System Stable'}
          </span>
        )}
      </div>
    </div>
  );
}

export default function KPIGrid() {
  const cards = [
    {
      title: 'Active Vehicles',
      value: '56',
      icon: Truck,
      trend: '+4 today',
      trendType: 'positive',
      subtitle: '89% operational rate',
      iconColor: 'group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5',
    },
    {
      title: 'Available Vehicles',
      value: '41',
      icon: CheckCircle2,
      trend: 'Optimal',
      trendType: 'neutral',
      subtitle: 'Ready for dispatch',
      iconColor: 'group-hover:text-success group-hover:border-success/30 group-hover:bg-success/5',
    },
    {
      title: 'Vehicles In Maintenance',
      value: '7',
      icon: Wrench,
      trend: '+1 since mon',
      trendType: 'negative',
      subtitle: '2 resolving today',
      iconColor: 'group-hover:text-warning group-hover:border-warning/30 group-hover:bg-warning/5',
    },
    {
      title: 'Active Trips',
      value: '15',
      icon: Route,
      trend: 'Normal load',
      trendType: 'neutral',
      subtitle: '12 standard / 3 express',
      iconColor: 'group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5',
    },
    {
      title: 'Drivers On Duty',
      value: '38',
      icon: Users,
      trend: '86% active',
      trendType: 'positive',
      subtitle: '4 on backup reserve',
      iconColor: 'group-hover:text-indigo-400 group-hover:border-indigo-400/30 group-hover:bg-indigo-400/5',
    },
    {
      title: 'Fleet Utilization',
      value: '81%',
      icon: Gauge,
      progress: 81,
      iconColor: 'group-hover:text-pink-400 group-hover:border-pink-400/30 group-hover:bg-pink-400/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <KPICard key={idx} {...card} />
      ))}
    </div>
  );
}
