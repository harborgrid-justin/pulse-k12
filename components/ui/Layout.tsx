
import React from 'react';
import { ViewState } from '../../types';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Pill, 
  Bot, 
  Stethoscope,
  Building,
  Building2,
  FileText,
  GraduationCap,
  ShieldAlert,
  Contact
} from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
}

interface NavItemProps {
  view: ViewState;
  current: ViewState;
  icon: any;
  label: string;
  onClick: (v: ViewState) => void;
  mobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  view, 
  current, 
  icon: Icon, 
  label, 
  onClick,
  mobile = false 
}) => {
  const active = view === current || 
    (view === ViewState.STUDENTS && current === ViewState.STUDENT_PROFILE) || 
    (view === ViewState.VISITS && current === ViewState.VISIT_DETAIL) ||
    (view === ViewState.TEACHERS && current === ViewState.TEACHER_PROFILE);
  
  const baseClasses = mobile
    ? "flex flex-col items-center justify-center w-full py-2 text-xs font-medium transition-colors"
    : "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium";
  
  const activeClasses = mobile
    ? "text-primary-600 bg-primary-50"
    : "bg-primary-50 text-primary-700";
    
  const inactiveClasses = "text-slate-500 hover:text-primary-600 hover:bg-slate-50";

  return (
    <button 
      onClick={() => onClick(view)} 
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      <Icon size={mobile ? 20 : 20} className={mobile ? "mb-1" : ""} />
      <span>{label}</span>
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  const navItems = [
    { view: ViewState.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
    { view: ViewState.STUDENTS, label: 'Students', icon: Users },
    { view: ViewState.VISITS, label: 'Visits', icon: ClipboardList },
    { view: ViewState.MEDICATIONS, label: 'Pharmacy', icon: Pill },
    { view: ViewState.REPORT_VACCINE, label: 'Vaccine Mgmt', icon: ShieldAlert }, // Moved here
    { view: ViewState.AI_ASSISTANT, label: 'AI Helper', icon: Bot },
  ];

  const adminItems = [
    { view: ViewState.TEACHERS, label: 'Staff Directory', icon: Contact }, // New
    { view: ViewState.GRADE_LIST, label: 'Grade Levels', icon: GraduationCap },
    { view: ViewState.SCHOOL_PROFILE, label: 'School Profile', icon: Building },
    { view: ViewState.DISTRICT_PROFILE, label: 'District', icon: Building2 },
  ];

  const reportItems = [
    { view: ViewState.REPORTS, label: 'State Reports', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full shadow-sm z-10">
        <div className="p-6 flex items-center space-x-2 border-b border-slate-100">
          <div className="bg-primary-600 p-2 rounded-lg text-white">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pulse K12</h1>
            <p className="text-xs text-slate-500 font-medium">Clinic Management</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <NavItem 
              key={item.view}
              view={item.view} 
              current={currentView} 
              label={item.label} 
              icon={item.icon} 
              onClick={onNavigate} 
            />
          ))}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Administration</p>
            {adminItems.map(item => (
              <NavItem 
                key={item.view}
                view={item.view} 
                current={currentView} 
                label={item.label} 
                icon={item.icon} 
                onClick={onNavigate} 
              />
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reports</p>
            {reportItems.map(item => (
              <NavItem 
                key={item.view}
                view={item.view} 
                current={currentView} 
                label={item.label} 
                icon={item.icon} 
                onClick={onNavigate} 
              />
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
              RN
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-700 truncate">Nurse Joy</p>
              <p className="text-xs text-slate-500 truncate">Head Nurse</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between z-20">
            <div className="flex items-center space-x-2">
                 <div className="bg-primary-600 p-1.5 rounded text-white">
                    <Stethoscope size={18} />
                 </div>
                 <span className="font-bold text-lg text-slate-800">Pulse K12</span>
            </div>
        </header>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto w-full">
             {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around px-2 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           {navItems.slice(0, 5).map(item => (
            <NavItem 
              key={item.view}
              view={item.view} 
              current={currentView} 
              label={item.label} 
              icon={item.icon} 
              onClick={onNavigate}
              mobile={true}
            />
          ))}
        </div>
      </main>
    </div>
  );
};
