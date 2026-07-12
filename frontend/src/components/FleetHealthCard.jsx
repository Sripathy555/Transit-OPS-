import React from 'react';
import { ShieldCheck, Heart, AlertCircle, Zap } from 'lucide-react';

export default function FleetHealthCard() {
  const score = 92;
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-white/10 hover:shadow-[0_4px_25px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col items-center justify-between text-center relative overflow-hidden group">

      {/* Background radial glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-success/5 blur-3xl pointer-events-none group-hover:bg-success/10 transition-all duration-500" />

      {/* Title */}
      <div className="w-full flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4.5 h-4.5 text-success fill-success/10" />
          <span className="text-sm font-bold text-white">Fleet Health Score</span>
        </div>
        <span className="text-[10px] font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Optimal
        </span>
      </div>

      {/* Circle Gauge */}
      <div className="relative my-6 flex items-center justify-center">
        <svg className="w-36 h-36 transform -rotate-90">
          {/* Base Circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-white/5"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle with glow */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-success transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: 'drop-shadow(0px 0px 6px rgba(34, 197, 94, 0.4))'
            }}
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight text-white">{score}</span>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Status Details */}
      <div className="space-y-2">
        <h4 className="text-base font-bold text-white">Excellent Condition</h4>
        <p className="text-xs text-gray-400 max-w-[220px]">
          Fleet running optimally. Maintenance intervals are within perfect operational ranges.
        </p>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-3 gap-2 w-full mt-6 pt-5 border-t border-white/5">
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-white">0</span>
          <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">Critical</span>
        </div>
        <div className="flex flex-col items-center border-x border-white/5">
          <span className="text-xs font-bold text-warning">3</span>
          <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">Warnings</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-success">63</span>
          <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">Healthy</span>
        </div>
      </div>
    </div>
  );
}
