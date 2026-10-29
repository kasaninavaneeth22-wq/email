import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { ClassificationType, RiskLevelType } from '../types';

interface RiskBadgeProps {
  type: 'classification' | 'level';
  value: ClassificationType | RiskLevelType | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  type,
  value,
  size = 'md',
  showIcon = true,
}) => {
  const val = value.toLowerCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm md:text-base px-3.5 py-1.5 gap-2',
  }[size];

  if (type === 'classification') {
    switch (val) {
      case 'phishing':
        return (
          <span className={`inline-flex items-center font-medium rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 ${sizeClasses}`}>
            {showIcon && <ShieldAlert className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>Phishing Detected</span>
          </span>
        );
      case 'spam':
        return (
          <span className={`inline-flex items-center font-medium rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 ${sizeClasses}`}>
            {showIcon && <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>Spam Email</span>
          </span>
        );
      case 'legitimate':
        return (
          <span className={`inline-flex items-center font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${sizeClasses}`}>
            {showIcon && <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />}
            <span>Legitimate Email</span>
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center font-medium rounded-full bg-slate-700 text-slate-300 ${sizeClasses}`}>
            {value}
          </span>
        );
    }
  }

  // Risk Level
  switch (val) {
    case 'critical':
      return (
        <span className={`inline-flex items-center font-semibold rounded-md bg-red-950/60 text-red-400 border border-red-500/40 ${sizeClasses}`}>
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
          Critical Risk
        </span>
      );
    case 'high':
      return (
        <span className={`inline-flex items-center font-semibold rounded-md bg-rose-950/50 text-rose-300 border border-rose-500/30 ${sizeClasses}`}>
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
          High Risk
        </span>
      );
    case 'medium':
      return (
        <span className={`inline-flex items-center font-semibold rounded-md bg-amber-950/50 text-amber-300 border border-amber-500/30 ${sizeClasses}`}>
          {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
          Medium Risk
        </span>
      );
    case 'low':
      return (
        <span className={`inline-flex items-center font-semibold rounded-md bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 ${sizeClasses}`}>
          {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
          Low Risk
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses}`}>
          {value}
        </span>
      );
  }
};
