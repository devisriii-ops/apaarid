import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Building,
  Users,
  GraduationCap,
  FileSpreadsheet,
  History,
  AlertTriangle,
  GitCompare,
  BookOpen,
  TrendingUp,
  ShieldAlert,
  FileText,
  Clock,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Download,
  User,
  CheckCircle2,
  QrCode
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';
import { appStore } from '../../services/store';

export type ActiveTab =
  | 'overview'
  | 'institutions'
  | 'students'
  | 'qr_identity'
  | 'enrolment'
  | 'import_wizard'
  | 'import_history'
  | 'validation'
  | 'duplicates'
  | 'programmes'
  | 'intake'
  | 'verification'
  | 'reports'
  | 'exports'
  | 'audit'
  | 'settings';

interface AppShellProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onSignOut: () => void;
  onOpenRoleSwitcher: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onTabChange,
  onSignOut,
  onOpenRoleSwitcher,
  children
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(appStore.getCurrentUser());
  const [institutions, setInstitutions] = useState(appStore.getInstitutions());
  const [activeInstId, setActiveInstId] = useState(appStore.getActiveInstitutionId());
  const [activeYear, setActiveYear] = useState(appStore.getActiveAcademicYear());
  const [notifications, setNotifications] = useState(appStore.getNotifications());
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setCurrentUser(appStore.getCurrentUser());
      setInstitutions(appStore.getInstitutions());
      setActiveInstId(appStore.getActiveInstitutionId());
      setActiveYear(appStore.getActiveAcademicYear());
      setNotifications(appStore.getNotifications());
    });
    return unsubscribe;
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Filter accessible navigation items based on UserRole
  const role = currentUser.role;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['student', 'staff', 'institution_admin', 'platform_admin'] },
    { id: 'institutions', label: 'Institution Directory', icon: Building, roles: ['staff', 'institution_admin', 'platform_admin'] },
    { id: 'students', label: role === 'student' ? 'My Student Profile' : 'Student Directory', icon: Users, roles: ['student', 'staff', 'institution_admin', 'platform_admin'] },
    { id: 'qr_identity', label: 'Student QR Identity', icon: QrCode, roles: ['student', 'staff', 'institution_admin', 'platform_admin'] },
    { id: 'enrolment', label: 'Academic Enrolment', icon: GraduationCap, roles: ['student', 'staff', 'institution_admin', 'platform_admin'] },
    { id: 'import_wizard', label: 'CSV/XLSX Bulk Import', icon: FileSpreadsheet, roles: ['staff', 'institution_admin', 'platform_admin'] },
    { id: 'import_history', label: 'Import History', icon: History, roles: ['staff', 'institution_admin', 'platform_admin'] },
    { id: 'validation', label: 'Validation Findings', icon: AlertTriangle, roles: ['staff', 'institution_admin', 'platform_admin'] },
    { id: 'duplicates', label: 'Duplicate Review', icon: GitCompare, roles: ['institution_admin', 'platform_admin'] },
    { id: 'programmes', label: 'Programme Management', icon: BookOpen, roles: ['institution_admin', 'platform_admin'] },
    { id: 'intake', label: 'Approved Intake', icon: TrendingUp, roles: ['institution_admin', 'platform_admin'] },
    { id: 'verification', label: 'Verification Center', icon: ShieldCheck, roles: ['student', 'staff', 'institution_admin', 'platform_admin'] },
    { id: 'reports', label: 'Institution Reports', icon: FileText, roles: ['institution_admin', 'platform_admin'] },
    { id: 'exports', label: 'Download & Export Centre', icon: Download, roles: ['student', 'staff', 'institution_admin', 'platform_admin'] },
    { id: 'audit', label: 'Audit Trail', icon: Clock, roles: ['institution_admin', 'platform_admin'] },
    { id: 'settings', label: 'Settings & Integrations', icon: Settings, roles: ['institution_admin', 'platform_admin'] }
  ];

  const visibleNavItems = navItems.filter((item) => item.roles.includes(role));

  const roleLabels: Record<UserRole, { label: string; badgeColor: string }> = {
    institution_admin: { label: 'Institution Admin', badgeColor: 'text-[#C8AA6E] border-[#C8AA6E]/30 bg-[#C8AA6E]/10' },
    staff: { label: 'Institution Staff', badgeColor: 'text-[#B8D8C2] border-[#B8D8C2]/30 bg-[#B8D8C2]/10' },
    student: { label: 'Student Persona', badgeColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
    platform_admin: { label: 'Platform Oversight', badgeColor: 'text-amber-400 border-amber-400/30 bg-amber-400/10' }
  };

  const handleInstChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    appStore.setActiveInstitutionId(newId);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    appStore.setActiveAcademicYear(newYear);
  };

  return (
    <div className="min-h-screen bg-[#07110D] text-[#F2F6F0] flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0B1812] border-b border-[#123D2A] px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-[#9BAAA0] hover:text-[#F2F6F0] rounded-lg hover:bg-[#123D2A]"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo in App Shell */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#123D2A] border border-[#1D6B48] flex items-center justify-center text-[#B8D8C2]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-[#F2F6F0] hidden sm:inline whitespace-nowrap">
              APAAR <span className="text-[#B8D8C2]">SmartVerify</span>
            </span>
          </div>

          <div className="h-4 w-px bg-[#123D2A] hidden sm:block mx-1" />

          {/* Active Institution Selector (Accessible to staff, inst admins & platform admins) */}
          {role !== 'student' && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-[#9BAAA0] whitespace-nowrap">Institution:</span>
              <select
                value={activeInstId}
                onChange={handleInstChange}
                disabled={role === 'staff' || role === 'institution_admin'}
                className="text-xs bg-[#07110D] border border-[#123D2A] rounded-md px-2.5 py-1 text-[#F2F6F0] max-w-[220px] lg:max-w-xs truncate focus:outline-none focus:border-[#1D6B48]"
                title={institutions.find((i) => i.id === activeInstId)?.name}
              >
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Academic Year Selector */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-[#9BAAA0] whitespace-nowrap">AY:</span>
            <select
              value={activeYear}
              onChange={handleYearChange}
              className="text-xs bg-[#07110D] border border-[#123D2A] rounded-md px-2 py-1 text-[#F2F6F0] font-mono focus:outline-none focus:border-[#1D6B48]"
            >
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
          </div>
        </div>

        {/* Right Zone: Role Indicator & User Controls */}
        <div className="flex items-center gap-3">
          {/* Active Role Switcher Button */}
          <button
            onClick={onOpenRoleSwitcher}
            className={`px-2.5 py-1 text-[11px] font-mono border rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${roleLabels[role].badgeColor}`}
            title="Click to switch persona role"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span className="capitalize">{roleLabels[role].label}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {/* Notifications Tray */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-1.5 rounded-lg text-[#9BAAA0] hover:text-[#F2F6F0] hover:bg-[#123D2A] relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-[#07110D] font-bold text-[10px] rounded-full flex items-center justify-center font-mono">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0B1812] border border-[#123D2A] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#123D2A]">
                  <span className="text-xs font-semibold text-[#F2F6F0]">Platform Notifications</span>
                  <span className="text-[11px] font-mono text-[#9BAAA0]">{unreadNotifs.length} unread</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-xs text-[#9BAAA0] py-4 text-center">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          appStore.markNotificationRead(n.id);
                          if (n.linkTab) onTabChange(n.linkTab as ActiveTab);
                          setIsNotifOpen(false);
                        }}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer border transition-all ${
                          n.read
                            ? 'bg-[#07110D]/50 border-transparent text-[#9BAAA0]'
                            : 'bg-[#123D2A]/40 border-[#1D6B48]/50 text-[#F2F6F0]'
                        }`}
                      >
                        <div className="font-semibold text-xs flex items-center justify-between mb-1">
                          <span>{n.title}</span>
                          <span className="text-[10px] font-mono text-[#9BAAA0]">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9BAAA0] leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Mini Badge & Sign Out */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#123D2A]">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-semibold text-[#F2F6F0] leading-none">{currentUser.fullName}</div>
              <div className="text-[10px] text-[#9BAAA0] mt-0.5 truncate max-w-[140px] font-mono">{currentUser.email}</div>
            </div>
            <button
              onClick={onSignOut}
              className="p-1.5 text-[#9BAAA0] hover:text-red-400 hover:bg-[#123D2A] rounded-lg transition-colors cursor-pointer"
              title="Sign Out to Landing Page"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0B1812] border-r border-[#123D2A] flex flex-col pt-14 lg:pt-0 transition-transform lg:static lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-0'
          }`}
        >
          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <div className="px-3 pb-2 text-[11px] font-mono uppercase tracking-wider text-[#9BAAA0]/70">
              Workspace Modules
            </div>

            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id as ActiveTab);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#123D2A] text-[#B8D8C2] font-semibold border border-[#1D6B48]/60 shadow-sm'
                      : 'text-[#9BAAA0] hover:text-[#F2F6F0] hover:bg-[#123D2A]/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#B8D8C2]' : 'text-[#9BAAA0]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Institutional Trust Badge in Sidebar */}
          <div className="p-3 m-3 bg-[#07110D] border border-[#123D2A] rounded-lg text-[11px] text-[#9BAAA0]">
            <div className="flex items-center gap-1.5 text-[#F2F6F0] font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>AICTE Central Portal</span>
            </div>
            <p className="leading-tight text-[10px] text-[#9BAAA0]/80">
              Reference Dataset v2025.2 <br />
              <span className="font-mono text-[#C8AA6E]">AICTE EoA Compliant</span>
            </p>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#07110D] p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
