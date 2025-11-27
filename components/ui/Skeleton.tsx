
import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  variant = 'rounded' 
}) => {
  const baseClasses = "animate-pulse bg-slate-200";
  
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
      style={{ width, height }}
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
    <div className="bg-slate-50 p-4 border-b border-slate-200">
      <div className="flex justify-between">
        <Skeleton width={150} height={24} />
        <div className="flex gap-2">
            <Skeleton width={80} height={32} />
            <Skeleton width={80} height={32} />
        </div>
      </div>
    </div>
    <div className="p-4 space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton width={40} height={40} variant="circular" />
          <div className="flex-1 space-y-2">
            <Skeleton width="30%" height={16} />
            <Skeleton width="20%" height={12} />
          </div>
          <Skeleton width={80} height={24} />
        </div>
      ))}
    </div>
  </div>
);

export const PageSkeleton = () => (
    <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
            <div>
                <Skeleton width={200} height={32} className="mb-2" />
                <Skeleton width={300} height={20} />
            </div>
            <Skeleton width={120} height={40} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} height={120} />
            ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
            <Skeleton className="col-span-2" height={400} />
            <Skeleton className="col-span-1" height={400} />
        </div>
    </div>
);
