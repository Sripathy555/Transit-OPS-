import React from 'react';
import { ArrowRight, Compass, User, AlertCircle, HelpCircle } from 'lucide-react';

export default function RecentTripsTable({ data, loading, error, triggerToast }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success/10 text-success border-success/20';
      case 'On Trip':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Draft':
        return 'bg-white/5 text-gray-400 border-white/10';
      case 'Delayed':
        return 'bg-danger/10 text-danger border-danger/20';
      default:
        return 'bg-white/5 text-gray-400 border-white/5';
    }
  };

  const handleRowClick = (tripId) => {
    triggerToast(`Viewing details for trip ${tripId}`, "info");
  };

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 flex flex-col h-full min-h-[300px]">
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h3 className="text-sm font-bold text-white">Recent Trips</h3>
          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Trips dispatched in last 24 hours</p>
        </div>
        <button
          onClick={() => triggerToast("Navigating to all trips...", "info")}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/80 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto mt-3 relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-xl">
            <div className="skeleton-shimmer absolute inset-0 w-full h-full" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-danger gap-2 min-h-[200px]">
            <AlertCircle className="w-6 h-6" />
            <span className="text-xs font-bold">Failed to load recent trips</span>
            <span className="text-[10px] text-gray-500 font-semibold">{error}</span>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 gap-2 min-h-[200px]">
            <HelpCircle className="w-6 h-6" />
            <span className="text-xs font-semibold">No recent trips dispatched</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Trip ID</th>
                <th className="py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Route</th>
                <th className="py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((trip) => (
                <tr
                  key={trip.id}
                  onClick={() => handleRowClick(trip.id)}
                  className="group cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3.5 text-xs font-bold text-white group-hover:text-primary transition-colors">
                    {trip.id}
                  </td>
                  <td className="py-3.5 text-xs font-semibold text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-gray-500" />
                      <span>{trip.vehicle}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-xs font-semibold text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      <span>{trip.driver}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-xs text-gray-400 font-medium">
                    {trip.route}
                  </td>
                  <td className="py-3.5 text-xs">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(trip.status)}`}>
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
