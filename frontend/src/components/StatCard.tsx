import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'blue' | 'rose' | 'amber' | 'emerald' | 'violet';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'blue',
}) => {
  const variantStyles = {
    blue: 'border-blue-500/20 bg-blue-950/10 text-blue-400 group-hover:border-blue-500/40',
    rose: 'border-rose-500/20 bg-rose-950/10 text-rose-400 group-hover:border-rose-500/40',
    amber: 'border-amber-500/20 bg-amber-950/10 text-amber-400 group-hover:border-amber-500/40',
    emerald: 'border-emerald-500/20 bg-emerald-950/10 text-emerald-400 group-hover:border-emerald-500/40',
    violet: 'border-violet-500/20 bg-violet-950/10 text-violet-400 group-hover:border-violet-500/40',
  }[variant];

  return (
    <div className="relative group bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl lg:text-3xl font-bold text-slate-100 mt-1 font-mono tracking-tight">{value}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-1.5">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl border transition-colors ${variantStyles}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
