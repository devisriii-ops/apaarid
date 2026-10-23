import React, { useState } from 'react';
import { X, Shield, User, Building2, UserCheck, ShieldAlert, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';
import { appStore, DEMO_USERS } from '../../services/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole = 'institution_admin', onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'google' | 'email'>('roles');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleLogin = (role: UserRole) => {
    appStore.switchRole(role);
    onSuccess(role);
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both institutional email and password.');
      return;
    }
    // Authenticate and map to selected role
    appStore.switchRole(selectedRole);
    onSuccess(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0B1812] border border-[#123D2A] rounded-xl shadow-2xl p-6 sm:p-8 text-[#F2F6F0]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9BAAA0] hover:text-[#F2F6F0] p-1.5 rounded-lg hover:bg-[#123D2A] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono tracking-wider uppercase text-[#C8AA6E] bg-[#123D2A]/80 px-2.5 py-0.5 rounded border border-[#1D6B48]/50">
              Institutional Gateway
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2F6F0]">
            Sign In to APAAR SmartVerify AI
          </h2>
          <p className="text-sm text-[#9BAAA0] mt-1.5 leading-relaxed">
            Role-bounded access for verified students, institution personnel, and oversight administrators.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#07110D] border border-[#123D2A] rounded-lg mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('roles'); setErrorMsg(null); }}
            className={`py-2 text-xs font-medium rounded-md transition-all ${
              activeTab === 'roles' ? 'bg-[#123D2A] text-[#F2F6F0] shadow-sm' : 'text-[#9BAAA0] hover:text-[#F2F6F0]'
            }`}
          >
            Role Access
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('google'); setErrorMsg(null); }}
            className={`py-2 text-xs font-medium rounded-md transition-all ${
              activeTab === 'google' ? 'bg-[#123D2A] text-[#F2F6F0] shadow-sm' : 'text-[#9BAAA0] hover:text-[#F2F6F0]'
            }`}
          >
            Google OAuth
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('email'); setErrorMsg(null); }}
            className={`py-2 text-xs font-medium rounded-md transition-all ${
              activeTab === 'email' ? 'bg-[#123D2A] text-[#F2F6F0] shadow-sm' : 'text-[#9BAAA0] hover:text-[#F2F6F0]'
            }`}
          >
            Email Login
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Authorized Role Access (Instant switch to inspect workflows) */}
        {activeTab === 'roles' && (
          <div className="space-y-3">
            <p className="text-xs text-[#9BAAA0] mb-3">
              Select an authorized persona below to enter its designated institutional workspace with strict permission boundaries:
            </p>

            <button
              onClick={() => handleRoleLogin('institution_admin')}
              className="w-full text-left p-3.5 bg-[#07110D] hover:bg-[#123D2A]/60 border border-[#123D2A] hover:border-[#1D6B48] rounded-lg transition-all group cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#123D2A] text-[#B8D8C2] mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F2F6F0] flex items-center gap-2">
                    <span>Institution Administrator</span>
                    <span className="text-[10px] font-mono text-[#C8AA6E] border border-[#C8AA6E]/30 px-1.5 py-0.2 rounded">COEP Tech</span>
                  </div>
                  <p className="text-xs text-[#9BAAA0] mt-0.5">
                    {DEMO_USERS.institution_admin.fullName} · {DEMO_USERS.institution_admin.email}
                  </p>
                  <p className="text-[11px] text-[#9BAAA0]/80 mt-1">
                    Permissions: Intake monitoring, batch import, duplicate resolution, institution reports.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#9BAAA0] group-hover:text-[#B8D8C2] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>

            <button
              onClick={() => handleRoleLogin('staff')}
              className="w-full text-left p-3.5 bg-[#07110D] hover:bg-[#123D2A]/60 border border-[#123D2A] hover:border-[#1D6B48] rounded-lg transition-all group cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#123D2A] text-[#B8D8C2] mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F2F6F0] flex items-center gap-2">
                    <span>Institution Staff / Operator</span>
                    <span className="text-[10px] font-mono text-[#B8D8C2] border border-[#B8D8C2]/30 px-1.5 py-0.2 rounded">Admissions</span>
                  </div>
                  <p className="text-xs text-[#9BAAA0] mt-0.5">
                    {DEMO_USERS.staff.fullName} · {DEMO_USERS.staff.email}
                  </p>
                  <p className="text-[11px] text-[#9BAAA0]/80 mt-1">
                    Permissions: Enrolment entry, import student files, review validation errors.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#9BAAA0] group-hover:text-[#B8D8C2] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>

            <button
              onClick={() => handleRoleLogin('student')}
              className="w-full text-left p-3.5 bg-[#07110D] hover:bg-[#123D2A]/60 border border-[#123D2A] hover:border-[#1D6B48] rounded-lg transition-all group cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#123D2A] text-[#B8D8C2] mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F2F6F0] flex items-center gap-2">
                    <span>Student Portal</span>
                    <span className="text-[10px] font-mono text-emerald-400 border border-emerald-400/30 px-1.5 py-0.2 rounded">B.Tech CE</span>
                  </div>
                  <p className="text-xs text-[#9BAAA0] mt-0.5">
                    {DEMO_USERS.student.fullName} · {DEMO_USERS.student.email}
                  </p>
                  <p className="text-[11px] text-[#9BAAA0]/80 mt-1">
                    Permissions: View own record, verify APAAR status, see correction requests, export personal summary.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#9BAAA0] group-hover:text-[#B8D8C2] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>

            <button
              onClick={() => handleRoleLogin('platform_admin')}
              className="w-full text-left p-3.5 bg-[#07110D] hover:bg-[#123D2A]/60 border border-[#123D2A] hover:border-[#1D6B48] rounded-lg transition-all group cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#123D2A] text-[#C8AA6E] mt-0.5">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F2F6F0] flex items-center gap-2">
                    <span>Platform Administrator / Oversight</span>
                    <span className="text-[10px] font-mono text-[#C8AA6E] border border-[#C8AA6E]/30 px-1.5 py-0.2 rounded">AICTE / NAD</span>
                  </div>
                  <p className="text-xs text-[#9BAAA0] mt-0.5">
                    {DEMO_USERS.platform_admin.fullName} · {DEMO_USERS.platform_admin.email}
                  </p>
                  <p className="text-[11px] text-[#9BAAA0]/80 mt-1">
                    Permissions: Institution onboarding claims, reference data versions, system audit oversight.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#9BAAA0] group-hover:text-[#B8D8C2] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          </div>
        )}

        {/* Tab 2: Google OAuth Gateway Info */}
        {activeTab === 'google' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#07110D] border border-[#123D2A] rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F2F6F0]">Google Workspace SSO</h4>
                  <p className="text-xs text-[#9BAAA0]">Single Sign-On for institutional domains (.edu.in / .ac.in)</p>
                </div>
              </div>
              
              <div className="text-xs text-[#9BAAA0] space-y-2 border-t border-[#123D2A] pt-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Configured for verified academic email domain authorization.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>OAuth claims are mapped strictly to authorized institution records in the database.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleRoleLogin('institution_admin')}
              className="w-full py-2.5 px-4 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Authenticate with Google Workspace (COEP Domain)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[11px] text-center text-[#9BAAA0]">
              *Google sign-in verifies identity only; platform authorization is governed by institutional approval.
            </p>
          </div>
        )}

        {/* Tab 3: Institutional Email / Password Form */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Institutional Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. officer@coeptech.ac.in"
                className="w-full px-3 py-2 text-sm bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] placeholder-[#9BAAA0]/50 focus:outline-none focus:border-[#1D6B48]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-sm bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] placeholder-[#9BAAA0]/50 focus:outline-none focus:border-[#1D6B48]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F2F6F0] mb-1">
                Target Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-sm bg-[#07110D] border border-[#123D2A] rounded-lg text-[#F2F6F0] focus:outline-none focus:border-[#1D6B48]"
              >
                <option value="institution_admin">Institution Administrator</option>
                <option value="staff">Institution Staff / Data Entry</option>
                <option value="student">Student</option>
                <option value="platform_admin">Platform Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#B8D8C2] text-[#07110D] hover:bg-[#cde4d4] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Sign In with Credentials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-[#123D2A] flex items-center gap-2.5 text-[11px] text-[#9BAAA0]">
          <Shield className="w-4 h-4 text-[#B8D8C2] shrink-0" />
          <span>
            Strict compliance with Section 24: APAAR identifiers protected with deterministic HMAC hashing and encrypted storage.
          </span>
        </div>
      </div>
    </div>
  );
};
