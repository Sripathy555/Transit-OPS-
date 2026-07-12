import React from 'react';
import { AlertTriangle, Calendar, User, Wrench, ChevronRight } from 'lucide-react';

export default function AlertsPanel({ triggerToast }) {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Vehicle Van-02',
      message: 'Oil Change Due',
      time: 'Today',
      icon: Wrench,
      borderColor: 'border-l-warning',
      iconColor: 'text-warning bg-warning/10 border-warning/20',
      actionLabel: 'Schedule Now',
    },
    {
      id: 2,
      type: 'info',
      title: 'Driver Alex Mercer',
      message: 'License expires in 7 Days',
      time: '7 Days',
      icon: User,
      borderColor: 'border-l-primary',
      iconColor: 'text-primary bg-primary/10 border-primary/20',
      actionLabel: 'Renew Doc',
    },
    {
      id: 3,
      type: 'danger',
      title: 'Truck-08',
      message: 'Maintenance Overdue',
      time: 'Overdue by 3d',
      icon: AlertTriangle,
      borderColor: 'border-l-danger',
      iconColor: 'text-danger bg-danger/10 border-danger/20',
      actionLabel: 'Dispatch Shop',
    },
  ];

  const handleAlertAction = (alert) => {
    triggerToast(`Action triggered for alert: "${alert.message}"`, "success");
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h3 className="text-sm font-bold text-white">System Alerts</h3>
          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Critical fleet events requiring attention</p>
        </div>
        <span className="text-xs font-bold text-danger px-2 py-0.5 bg-danger/10 border border-danger/20 rounded-full animate-pulse">
          3 Active
        </span>
      </div>

      <div className="flex-1 space-y-3 mt-4">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <div
              key={alert.id}
              className={`bg-[#0B0F19] border border-white/5 border-l-3 rounded-xl p-3.5 flex items-center justify-between transition-all duration-200 hover:bg-white/[0.01] hover:border-white/10 ${alert.borderColor}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${alert.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">{alert.message}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 mt-1">
                    <Calendar className="w-3 h-3" />
                    {alert.time}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAlertAction(alert)}
                className="group inline-flex items-center gap-0.5 px-2.5 py-1 text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
              >
                <span>{alert.actionLabel}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
