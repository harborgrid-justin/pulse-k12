
import React, { useState, useEffect } from 'react';
import { ViewState } from '../../types';
import { 
  LayoutDashboard, Users, ClipboardList, Pill, Bot, Stethoscope, Building, Building2, 
  FileText, Contact, AlertTriangle, Lock, Menu, X, MessageSquare, Syringe, BarChart2, 
  Map, Landmark, Search, ChevronRight, Plus
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

const NavItem: React.FC<NavItemProps> = ({ view, current, icon: Icon, label, onClick, mobile = false }) => {
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Handle Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Breadcrumbs Logic
  const getBreadcrumbs = () => {
    const path = [
        { label: 'Dashboard', view: ViewState.DASHBOARD }
    ];
    
    if (currentView === ViewState.STUDENTS || currentView === ViewState.STUDENT_PROFILE) path.push({ label: 'Students', view: ViewState.STUDENTS });
    if (currentView === ViewState.STUDENT_PROFILE) path.push({ label: 'Profile', view: ViewState.STUDENT_PROFILE });
    
    if (currentView === ViewState.VISITS || currentView === ViewState.VISIT_DETAIL || currentView === ViewState.NEW_VISIT) path.push({ label: 'Visits', view: ViewState.VISITS });
    if (currentView === ViewState.VISIT_DETAIL) path.push({ label: 'Details', view: ViewState.VISIT_DETAIL });
    if (currentView === ViewState.NEW_VISIT) path.push({ label: 'New Log', view: ViewState.NEW_VISIT });

    return path;
  };

  const navItems = [
    { view: ViewState.DASHBOARD, label: 'Command Center', icon: LayoutDashboard },
    { view: ViewState.STUDENTS, label: 'Student Roster', icon: Users },
    { view: ViewState.VISITS, label: 'Visit Logs', icon: ClipboardList },
    { view: ViewState.MEDICATIONS, label: 'Pharmacy (MAR)', icon: Pill },
    { view: ViewState.INCIDENTS, label: 'Incident Reports', icon: AlertTriangle }, 
    { view: ViewState.COMMUNICATION, label: 'Secure Msgs', icon: MessageSquare },
  ];

  const complianceItems = [
    { view: ViewState.REPORT_VACCINE, label: 'Immunizations', icon: Syringe },
    { view: ViewState.REPORTS, label: 'State Reporting', icon: FileText },
    { view: ViewState.REPORT_SCREENING, label: 'Screenings', icon: Stethoscope },
  ];

  const adminItems = [
    { view: ViewState.SCHOOL_PROFILE, label: 'School Admin', icon: Building },
    { view: ViewState.DISTRICT_PROFILE, label: 'District Admin', icon: Building2 },
    { view: ViewState.COUNTY_PROFILE, label: 'County Admin', icon: Map },
    { view: ViewState.STATE_PROFILE, label: 'State Admin', icon: Landmark },
    { view: ViewState.TEACHERS, label: 'Staff Directory', icon: Contact },
    { view: ViewState.GRADE_LIST, label: 'Grade Analysis', icon: BarChart2 },
    { view: ViewState.SECURITY_AUDIT, label: 'Audit Logs', icon: Lock },
  ];

  const assistantItems = [
    { view: ViewState.AI_ASSISTANT, label: 'AI Clinical Assist', icon: Bot },
  ];

  const handleMobileNav = (view: ViewState) => {
      onNavigate(view);
      setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen h-[100dvh] bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full shadow-sm z-10">
        <div className="p-6 flex items-center space-x-2 border-b border-slate-100">
          <div className="bg-primary-600 p-2 rounded-lg text-white shadow-md">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pulse K12</h1>
            <p className="text-xs text-slate-500 font-medium">Enterprise Clinic</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operations</p>
          {navItems.map(item => (
            <NavItem key={item.view} {...item} current={currentView} onClick={onNavigate} />
          ))}

          <div className="my-4 border-t border-slate-100" />
          <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance</p>
          {complianceItems.map(item => (
            <NavItem key={item.view} {...item} current={currentView} onClick={onNavigate} />
          ))}

          <div className="my-4 border-t border-slate-100" />
          <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Administration</p>
          {adminItems.map(item => (
            <NavItem key={item.view} {...item} current={currentView} onClick={onNavigate} />
          ))}

          <div className="my-4 border-t border-slate-100" />
          {assistantItems.map(item => (
            <NavItem key={item.view} {...item} current={currentView} onClick={onNavigate} />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs ring-2 ring-white border border-indigo-200">
              MS
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-700 truncate">Mrs. Melinda Saadein</p>
              <p className="text-xs text-slate-500 truncate">Head Nurse • Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between z-20 shrink-0">
            <div className="flex items-center space-x-2 md:hidden">
                 <div className="bg-primary-600 p-1.5 rounded text-white">
                    <Stethoscope size={18} />
                 </div>
                 <span className="font-bold text-lg text-slate-800">Pulse K12</span>
            </div>

            {/* Desktop Breadcrumbs / Search Trigger */}
            <div className="hidden md:flex items-center flex-1 max-w-xl">
                <div className="flex items-center text-sm text-slate-500 mr-6">
                    {getBreadcrumbs().map((crumb, idx) => (
                        <React.Fragment key={crumb.view}>
                            {idx > 0 && <ChevronRight size={14} className="mx-1 text-slate-300" />}
                            <button 
                                onClick={() => onNavigate(crumb.view)}
                                className={`hover:text-primary-600 transition-colors ${idx === getBreadcrumbs().length - 1 ? 'font-bold text-slate-800' : ''}`}
                            >
                                {crumb.label}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search (Ctrl+K)" 
                        readOnly
                        onClick={() => setShowSearch(true)}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border-transparent rounded-md text-sm text-slate-600 focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all cursor-pointer hover:bg-slate-200"
                    />
                </div>
            </div>

            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-600 p-2 rounded-lg hover:bg-slate-100">
                <Menu size={24} />
            </button>
        </header>

        {/* Global Search Overlay */}
        {showSearch && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4" onClick={() => setShowSearch(false)}>
                <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                    <div className="p-4 border-b border-slate-100 flex items-center">
                        <Search size={20} className="text-slate-400 mr-3" />
                        <input 
                            autoFocus 
                            placeholder="Search students, pages, or actions..." 
                            className="flex-1 outline-none text-lg text-slate-800"
                        />
                        <button onClick={() => setShowSearch(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-2">
                        <div className="text-xs font-bold text-slate-400 uppercase px-3 py-2">Quick Links</div>
                        <button onClick={() => { onNavigate(ViewState.NEW_VISIT); setShowSearch(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 text-sm flex items-center">
                            <Plus size={14} className="mr-2" /> New Visit Log
                        </button>
                        <button onClick={() => { onNavigate(ViewState.STUDENTS); setShowSearch(false); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 text-sm flex items-center">
                            <Users size={14} className="mr-2" /> Student Directory
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Content Scrollable */}
        <div 
            id="main-content" 
            className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-32 md:pb-8"
        >
          <div className="max-w-7xl mx-auto w-full h-full">
             {children}
          </div>
        </div>

        {/* Mobile FAB (Floating Action Button) */}
        <button 
            onClick={() => onNavigate(ViewState.NEW_VISIT)}
            className="md:hidden fixed bottom-20 right-4 bg-primary-600 text-white p-4 rounded-full shadow-xl hover:bg-primary-700 active:scale-95 transition-all z-40"
        >
            <Plus size={24} />
        </button>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around px-2 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-pb">
           <NavItem view={ViewState.DASHBOARD} current={currentView} label="Home" icon={LayoutDashboard} onClick={onNavigate} mobile />
           <NavItem view={ViewState.VISITS} current={currentView} label="Visits" icon={ClipboardList} onClick={onNavigate} mobile />
           <NavItem view={ViewState.COMMUNICATION} current={currentView} label="Msgs" icon={MessageSquare} onClick={onNavigate} mobile />
           <NavItem view={ViewState.INCIDENTS} current={currentView} label="Alerts" icon={AlertTriangle} onClick={onNavigate} mobile />
           <button 
             onClick={() => setIsMobileMenuOpen(true)}
             className={`flex flex-col items-center justify-center w-full py-2 text-xs font-medium transition-colors ${isMobileMenuOpen ? 'text-primary-600' : 'text-slate-500'}`}
           >
             <Menu size={20} className="mb-1" />
             <span>Menu</span>
           </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h3 className="font-bold text-lg text-slate-800">Navigation</h3>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-6">
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Clinical</p>
                            {navItems.map(item => (
                                <button 
                                    key={item.view}
                                    onClick={() => handleMobileNav(item.view)}
                                    className={`flex items-center space-x-3 w-full py-2 text-sm font-medium ${currentView === item.view ? 'text-primary-600 bg-primary-50 rounded-lg px-2' : 'text-slate-600 px-2'}`}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Compliance</p>
                            {complianceItems.map(item => (
                                <button 
                                    key={item.view}
                                    onClick={() => handleMobileNav(item.view)}
                                    className={`flex items-center space-x-3 w-full py-2 text-sm font-medium ${currentView === item.view ? 'text-primary-600 bg-primary-50 rounded-lg px-2' : 'text-slate-600 px-2'}`}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Administration</p>
                            {adminItems.map(item => (
                                <button 
                                    key={item.view}
                                    onClick={() => handleMobileNav(item.view)}
                                    className={`flex items-center space-x-3 w-full py-2 text-sm font-medium ${currentView === item.view ? 'text-primary-600 bg-primary-50 rounded-lg px-2' : 'text-slate-600 px-2'}`}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};
