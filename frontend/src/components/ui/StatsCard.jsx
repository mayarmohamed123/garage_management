import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatsCard = ({ title, value, icon, color, trend, trendValue }) => {
  const Icon = icon;
  return (
    <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          {Icon && <Icon className={color.replace('bg-', 'text-')} size={24} />}
        </div>
        {trend && (
          <span className={`flex items-center text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'} bg-slate-50 px-2 py-1 rounded-full`}>
            <TrendingUp size={12} className="mr-1" /> {trendValue}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-extrabold text-slate-900 tracking-tighter">{value}</p>
    </div>
  );
};

export default StatsCard;
