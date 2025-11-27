
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'dot';
  className?: string;
  icon?: React.ElementType;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '', icon: Icon }) => {
  const variants = {
    success: "bg-emerald-100 text-emerald-700 border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border-amber-200",
    error: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-white border-slate-200 text-slate-700 pl-2 pr-3"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${variants[variant]} ${className}`}>
      {variant === 'dot' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>}
      {Icon && <Icon size={12} className="mr-1.5" />}
      {children}
    </span>
  );
};
