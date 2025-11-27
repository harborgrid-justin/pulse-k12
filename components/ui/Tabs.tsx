
import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  activeTab, 
  onChange, 
  variant = 'underline',
  className = ''
}) => {
  // Mobile View (Dropdown for Underline, Stacked for Pills if needed, though horizontal scroll is often better for pills)
  // For this design system, we'll use a select for "underline" style on very small screens if many tabs, 
  // but standard horizontal scroll is often preferred for "app-like" feel.
  // Let's stick to the horizontal scroll logic from StudentProfile for consistency as it's very mobile-friendly.

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-all ${
                isActive 
                  ? 'bg-primary-50 text-primary-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {tab.icon && <tab.icon size={16} className="mr-2 shrink-0" />}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary-200 text-primary-800' : 'bg-slate-100 text-slate-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'underline' variant
  return (
    <div className={`w-full ${className}`}>
        {/* Mobile Dropdown for dense navigation */}
        <div className="md:hidden mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Navigate Section</label>
            <div className="relative">
                <select 
                    value={activeTab}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-700 py-2 pl-3 pr-10 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm appearance-none"
                >
                    {tabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>{tab.label}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>

        {/* Desktop Horizontal List */}
        <div className="hidden md:flex border-b border-slate-200 space-x-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button 
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`pb-4 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
                            isActive 
                                ? 'border-primary-600 text-primary-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                        }`}
                    >
                        {tab.icon && <tab.icon size={16} className="mr-2" />}
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    </div>
  );
};
